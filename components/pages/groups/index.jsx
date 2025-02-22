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
import { Container, PageHeader } from "@inrupt/prism-react-components";
import { makeStyles } from "@material-ui/styles";
import { createStyles } from "@material-ui/core";
import { useBem } from "@solid/lit-prism-patterns";
import { useRouter } from "next/router";
import styles from "./styles";
import GroupList from "../../groupList";
import GroupView from "../../groupView";
import { GroupAllProvider } from "../../../src/contexts/groupAllContext";
import { AddressBookProvider } from "../../../src/contexts/addressBookContext";
import { GroupProvider } from "../../../src/contexts/groupContext";

const useStyles = makeStyles((theme) => createStyles(styles(theme)));

export default function GroupsPage() {
  const bem = useBem(useStyles());
  const router = useRouter();
  const groupIsSelected = !!router.query.iri;

  return (
    <AddressBookProvider>
      <GroupAllProvider>
        <GroupProvider>
          <PageHeader title="Groups" />
          <Container className={bem("groups-container")}>
            <div
              className={bem("groups-container__content", "list", {
                focus: !groupIsSelected,
              })}
            >
              <GroupList />
            </div>
            <div
              className={bem("groups-container__content", "main", {
                focus: groupIsSelected,
              })}
            >
              <GroupView />
            </div>
          </Container>
        </GroupProvider>
      </GroupAllProvider>
    </AddressBookProvider>
  );
}
