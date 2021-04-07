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

import React from "react";
import { renderWithTheme } from "../../../__testUtils/withTheme";
import mockSessionContextProvider from "../../../__testUtils/mockSessionContextProvider";
import mockSession from "../../../__testUtils/mockSession";

import ProfilePage from "./index";

jest.mock("../../../src/effects/auth");

describe("Profile page", () => {
  test("Renders the profile page", () => {
    const session = mockSession();
    const SessionProvider = mockSessionContextProvider(session);

    const { asFragment } = renderWithTheme(
      <SessionProvider>
        <ProfilePage />
      </SessionProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  test("returns null if session request is in progress", () => {
    const sessionRequestInProgress = true;
    const session = mockSession();
    const SessionProvider = mockSessionContextProvider(
      session,
      sessionRequestInProgress
    );

    const { asFragment } = renderWithTheme(
      <SessionProvider>
        <ProfilePage />
      </SessionProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
