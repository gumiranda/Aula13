import {all} from 'redux-saga/effects';
import auth from './appModules/auth/sagas';
import user from './appModules/user/sagas';
import chat from './appModules/chat/sagas';
import creditcard from './appModules/creditcard/sagas';

export default function* appSagas() {
  return yield all([auth, user, creditcard, chat]);
}
