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

import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createStyles, ListItem, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { getResourceName } from "../../../../../../src/solidClientHelpers/resource";
import AccessControlContext from "../../../../../../src/contexts/accessControlContext";
import { PUBLIC_AGENT_PREDICATE } from "../../../../../../src/models/contact/public";
import { AUTHENTICATED_AGENT_PREDICATE } from "../../../../../../src/models/contact/authenticated";
import {
  permission as permissionPropType,
  profile as profilePropType,
} from "../../../../../../constants/propTypes";
import ResourceInfoContext from "../../../../../../src/contexts/resourceInfoContext";
import ConfirmationDialogWithProps from "../../../../../confirmationDialogWithProps";
import styles from "./styles";

export const handleRemovePermissions = ({
  setLoading,
  accessControl,
  setLocalAccess,
  mutateResourceInfo,
}) => {
  return async (agentWebId, policyName) => {
    setLoading(true);
    if (PUBLIC_AGENT_PREDICATE === agentWebId) {
      accessControl.setRulePublic(policyName, false);
    }
    if (AUTHENTICATED_AGENT_PREDICATE === agentWebId) {
      accessControl.setRuleAuthenticated(policyName, false);
    }
    const { response: updatedAcr } = await accessControl.removeAgentFromPolicy(
      agentWebId,
      policyName
    );
    await mutateResourceInfo(updatedAcr, false);
    setLoading(false);
    setLocalAccess(null);
  };
};

const useStyles = makeStyles((theme) => createStyles(styles(theme)));

export const TESTCAFE_ID_REMOVE_BUTTON = "remove-button";
export const DIALOG_ID = "remove-agent";
export const CONFIRMATION_TEXT = "Remove";

export default function RemoveButton({
  resourceIri,
  permission: { webId, alias },
  profile,
  setLoading,
  setLocalAccess,
}) {
  const { accessControl } = useContext(AccessControlContext);
  const { mutate: mutateResourceInfo } = useContext(ResourceInfoContext);
  const resourceName = getResourceName(resourceIri);
  const classes = useStyles();
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const handleRemoveAgent = handleRemovePermissions({
    setLoading,
    accessControl,
    setLocalAccess,
    mutateResourceInfo,
  });

  const handleOpenDialog = () => {
    // eslint-disable-next-line prettier/prettier
    if (
      PUBLIC_AGENT_PREDICATE === webId ||
      AUTHENTICATED_AGENT_PREDICATE === webId
    ) {
      handleRemoveAgent(webId, alias);
      return;
    }
    setOpenConfirmationDialog(true);
  };

  return (
    <ListItem
      data-testid={TESTCAFE_ID_REMOVE_BUTTON}
      button
      onClick={handleOpenDialog}
    >
      <ListItemText
        disableTypography
        classes={{ primary: classes.listItemText }}
      >
        Remove
      </ListItemText>
      <ConfirmationDialogWithProps
        openConfirmationDialog={openConfirmationDialog}
        title={`Remove ${profile?.name || webId}'s access from ${resourceName}`}
        confirmText={CONFIRMATION_TEXT}
        onConfirm={() => handleRemoveAgent(webId, alias)}
        onCancel={() => setOpenConfirmationDialog(false)}
      />
    </ListItem>
  );
}

RemoveButton.propTypes = {
  resourceIri: PropTypes.string.isRequired,
  permission: permissionPropType.isRequired,
  profile: profilePropType,
  setLoading: PropTypes.func,
  setLocalAccess: PropTypes.func,
};

RemoveButton.defaultProps = {
  setLoading: () => {},
  setLocalAccess: () => {},
  profile: null,
};
