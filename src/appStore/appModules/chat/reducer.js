import produce from 'immer';

const INITIAL_STATE = {
  chatsLoading: false,
  chatsList: [],
  chatsPage: 1,
  chatsTotal: 0,
  messagesLoading: false,
  messagesList: [],
  messagesPage: 1,
  messagesTotal: 0,
  messagesId: 0,
};

export default function chat(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@chat/LIST_SUCCESS': {
        draft.chatsLoading = false;
        draft.chatsTotal = action.payload.chatsTotal;
        draft.chatsList = action.payload.chatsList;
        break;
      }
      case '@chat/LIST_REQUEST': {
        draft.chatsLoading = true;
        draft.chatsTotal = 0;
        draft.chatsPage = action.payload.page;
        break;
      }
      case '@chat/LIST_FAILURE': {
        draft.chatsLoading = false;
        break;
      }
      case '@chat/RESET': {
        draft.chatsLoading = false;
        draft.chatsList = [];
        draft.chatsPage = 1;
        draft.chatsTotal = 0;
        break;
      }
      case '@chat/RESET_DETAILS': {
        draft.messagesLoading = false;
        draft.messagesList = [];
        draft.messagesPage = 1;
        draft.messagesId = 0;
        draft.messagesTotal = 0;
        break;
      }
      case '@chat/DETAILS_SUCCESS': {
        draft.messagesLoading = false;
        draft.messagesTotal = action.payload.messagesTotal;
        draft.messagesList = action.payload.messagesList;
        break;
      }
      case '@chat/DETAILS_REQUEST': {
        draft.messagesLoading = true;
        draft.messagesTotal = 0;
        draft.messagesPage = action.payload.page;
        draft.messagesId = action.payload.id;
        break;
      }

      case '@chat/DETAILS_FAILURE': {
        draft.messagesLoading = false;
        break;
      }
      case '@auth/SIGN_OUT': {
        draft.chatsLoading = false;
        draft.chatsList = [];
        draft.chatsPage = 1;
        draft.chatsTotal = 0;
        draft.messagesLoading = false;
        draft.messagesList = [];
        draft.messagesPage = 1;
        draft.messagesId = 0;
        draft.messagesTotal = 0;
        break;
      }
      default:
    }
  });
}
