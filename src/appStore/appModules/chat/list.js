export function getFailure() {
  return {type: '@chat/LIST_FAILURE'};
}
export function reset() {
  return {type: '@chat/RESET'};
}
export function getRequest({page, nextPage = false}) {
  return {type: '@chat/LIST_REQUEST', payload: {page, nextPage}};
}
export function getSuccess({chatsList, chatsTotal}) {
  return {type: '@chat/LIST_SUCCESS', payload: {chatsList, chatsTotal}};
}
