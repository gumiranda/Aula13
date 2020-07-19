import {all, takeLatest, call, put, select} from 'redux-saga/effects';
import {Alert} from 'react-native';
import api from '../../../services/api';
import {getSuccess, getFailure} from './list';
import {getSuccessDetails, getFailureDetails} from './details';

export function* getChats({payload}) {
  try {
    const {nextPage, page} = payload;
    const response = yield call(api.get, `chat/page/${page}`);
    if (response.data) {
      const {chatsCount, chats} = response.data;
      if (!nextPage) {
        yield put(getSuccess({chatsList: chats, chatsTotal: chatsCount}));
      } else {
        const {chatsList} = yield select(state => state.chat);
        yield put(
          getSuccess({
            chatsList: [...chatsList, ...chats],
            chatsTotal: chatsCount,
          }),
        );
      }
    } else {
      yield put(getFailure());
    }
  } catch (err) {
    Alert.alert('Erro', 'Confira seus dados');
    yield put(getFailure());
  }
}
export function* getChatDetails({payload}) {
  try {
    const {nextPage, page, id} = payload;
    const response = yield call(api.get, `chat/${id}/page/${page}`);
    if (response.data) {
      const {countMessages, messages} = response.data;
      if (!nextPage) {
        yield put(
          getSuccessDetails({
            messagesList: messages.reverse(),
            messagesTotal: countMessages,
          }),
        );
      } else {
        const {messagesList} = yield select(state => state.chat);
        const joinArray = [...messagesList, ...messages.reverse()];
        const mapa = new Map();
        for (const x of joinArray) {
          mapa.set(x._id, x);
        }
        const final = [...mapa.values()];
        yield put(
          getSuccessDetails({
            messagesList: final,
            messagesTotal: countMessages,
          }),
        );
      }
    } else {
      yield put(getFailureDetails());
    }
  } catch (err) {
    Alert.alert('Erro', 'Confira seus dados');
    yield put(getFailureDetails());
  }
}
export default all([
  takeLatest('@chat/LIST_REQUEST', getChats),
  takeLatest('@chat/DETAILS_REQUEST', getChatDetails),
]);
