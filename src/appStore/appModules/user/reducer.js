import produce from 'immer';

const INITIAL_STATE = {
  profile: null,
  loading: false,
  usersLoading: false,
  usersList: [],
  usersPage: 1,
  usersTotal: 0,
};

export default function user(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS': {
        draft.loading = false;
        draft.profile = action.payload.user;
        break;
      }
      case '@user/UPDATE_PROFILE_SUCCESS': {
        draft.loading = false;
        draft.profile = action.payload.profile;
        break;
      }
      case '@user/UPDATE_PROFILE_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@user/COMPLETE_PROFILE_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@user/UPDATE_PROFILE_FAILURE': {
        draft.loading = false;
        break;
      }
      case '@user/LIST_SUCCESS': {
        draft.usersLoading = false;
        draft.usersTotal = action.payload.usersTotal;
        draft.usersList = action.payload.usersList;
        break;
      }
      case '@user/LIST_REQUEST': {
        draft.usersLoading = true;
        draft.usersTotal = 0;
        draft.usersPage = action.payload.page;
        break;
      }
      case '@user/LIST_FAILURE': {
        draft.usersLoading = false;
        break;
      }
      case '@user/RESET': {
        draft.usersLoading = false;
        draft.usersList = [];
        draft.usersPage = 1;
        draft.usersTotal = 0;
        break;
      }
      case '@auth/SIGN_OUT': {
        draft.profile = null;
        draft.usersList = [];
        draft.usersPage = 1;
        draft.usersTotal = 0;
        break;
      }
      default:
    }
  });
}
