/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @next/next/no-sync-scripts */
import React, { useEffect } from "react";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

import PropTypes from "prop-types";
import Head from "next/head";
import { useRouter } from "next/router";
import CssBaseline from "@material-ui/core/CssBaseline";

import { create } from "jss";
import preset from "jss-preset-default";

import { appLayout, useBem } from "@solid/lit-prism-patterns";
import { SessionProvider } from "@inrupt/solid-ui-react";
import {
  createStyles,
  makeStyles,
  StylesProvider,
  ThemeProvider,
} from "@inrupt/prism-react-components";

import theme from "../src/theme";
import { AlertProvider } from "../src/contexts/alertContext";
import { ConfirmationDialogProvider } from "../src/contexts/confirmationDialogContext";
import { FeatureProvider } from "../src/contexts/featureFlagsContext";
import AuthenticationProvider from "../src/authentication/AuthenticationProvider";
import Notification from "../components/notification";
import PodBrowserHeader from "../components/header";

import "./styles.css";

let matomoInstance = null;

if (process.env.NEXT_PUBLIC_MATOMO_URL_BASE) {
  matomoInstance = createInstance({
    urlBase: process.env.NEXT_PUBLIC_MATOMO_URL_BASE,
    siteId: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
    configurations: {
      disableCookies: true,
      setSecureCookie: true,
      setRequestMethod: "POST",
    },
  });
}

const jss = create(preset());

const useStyles = makeStyles(() => createStyles(appLayout.styles(theme)));

export default function App(props) {
  const { Component, pageProps } = props;
  const bem = useBem(useStyles());
  const router = useRouter();
  const { pathname, asPath } = router;

  useEffect(() => {
    // Remove injected serverside JSS
    const jssStyles = document.querySelector("#jss-server-side");

    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  // Fire off a pageview tracker whenever the path changes. Use the pagename
  // (e.g. /resource/[iri]) instead of the full path to scrub sensitive data.
  useEffect(() => {
    matomoInstance?.trackPageView({
      href: pathname,
    });
  }, [pathname, asPath]);

  return (
    <>
      <Head>
        <title>Inrupt PodBrowser</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MatomoProvider value={matomoInstance}>
        <StylesProvider jss={jss}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AlertProvider>
              <SessionProvider sessionId="pod-browser" restorePreviousSession>
                <AuthenticationProvider>
                  <FeatureProvider>
                    <ConfirmationDialogProvider>
                      <div className={bem("app-layout")}>
                        <PodBrowserHeader />

                        <main className={bem("app-layout__main")}>
                          <Component {...pageProps} />
                        </main>
                      </div>
                      <Notification />
                    </ConfirmationDialogProvider>
                  </FeatureProvider>
                </AuthenticationProvider>
              </SessionProvider>
            </AlertProvider>
          </ThemeProvider>
        </StylesProvider>
      </MatomoProvider>
    </>
  );
}

App.defaultProps = {
  pageProps: null,
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
};
