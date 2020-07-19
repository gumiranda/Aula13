export function getFailureDetails() {
  return {type: '@chat/DETAILS_FAILURE'};
}
export function getRequest({id, page, nextPage = false}) {
  return {type: '@chat/DETAILS_REQUEST', payload: {id, page, nextPage}};
}
export function reset() {
  return {type: '@chat/RESET_DETAILS'};
}
export function getSuccessDetails({messagesList, messagesTotal}) {
  return {
    type: '@chat/DETAILS_SUCCESS',
    payload: {messagesList: messagesList, messagesTotal},
  };
}
