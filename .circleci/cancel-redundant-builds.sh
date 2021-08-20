#!/bin/bash
# Taken from: https://discuss.circleci.com/t/auto-cancel-redundant-builds-on-the-default-branch/39468

# Get the name of the workflow.
WF_NAME=$(curl --header "Circle-Token: $PERSONAL_CIRCLE_TOKEN" --request GET "https://circleci.com/api/v2/workflow/${CIRCLE_WORKFLOW_ID}"|jq -r .name)

# Get the IDs of pipelines on the same branch.
PIPE_IDS=$(curl --header "Circle-Token: $PERSONAL_CIRCLE_TOKEN" --request GET "https://circleci.com/api/v2/project/gh/$CIRCLE_PROJECT_USERNAME/$CIRCLE_PROJECT_REPONAME/pipeline?branch=$CIRCLE_BRANCH"|jq -r '.items[]|select(.state == "created").id')

# Get the IDs of currently running/on_hold workflows with the same name except the current workflow ID.
if [ ! -z "$PIPE_IDS" ]; then
  for PIPE_ID in $PIPE_IDS
  do
    curl --header "Circle-Token: $PERSONAL_CIRCLE_TOKEN" --request GET "https://circleci.com/api/v2/pipeline/${PIPE_ID}/workflow"|jq -r --arg CIRCLE_WORKFLOW_ID "$CIRCLE_WORKFLOW_ID" --arg WF_NAME "${WF_NAME}" '.items[]|select(.status == "on_hold" or .status == "running")|select(.name == $WF_NAME)|select(.id != $CIRCLE_WORKFLOW_ID)|.id' >> WF_to_cancel.txt
  done
fi

# Cancel any currently running/on_hold workflow with the same name.
if [ -s WF_to_cancel.txt ]; then
  echo "Cancelling the following workflow(s):"
  cat WF_to_cancel.txt
  while read WF_ID;
    do
      curl --header "Circle-Token: $PERSONAL_CIRCLE_TOKEN" --request POST https://circleci.com/api/v2/workflow/$WF_ID/cancel
    done < WF_to_cancel.txt
  # Allow some time to complete the cancellation.
  sleep 2
else
    echo "Nothing to cancel"
fi
