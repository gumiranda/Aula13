import {all, takeLatest, call, put, select} from 'redux-saga/effects';
import {Alert} from 'react-native';
import api from '../../../services/api';
import {updateProfileSuccess, updateProfileFailure} from './actions';
import {getSuccess, getFailure} from './list';

export function* updateProfile({payload}) {
  try {
    const {
      nome,
      _id,
      email,
      oldPassword,
      senha,
      senhaConfirmacao,
    } = payload.data;
    const profile = {
      nome,
      _id,
      email,
      oldPassword,
      senha,
      senhaConfirmacao,
    };

    const response = yield call(api.put, `user/${profile._id}`, profile);
    if (response.data.message) {
      Alert.alert('Erro', response.data.message);
      yield put(updateProfileFailure());
    } else if (response.data) {
      yield put(updateProfileSuccess(response.data));
    } else {
      Alert.alert('Erro', 'Confira seus dados');
      yield put(updateProfileFailure());
    }
  } catch (err) {
    console.tron.log(err);
    Alert.alert('Erro', 'Confira seus dados');
    yield put(updateProfileFailure());
  }
}
export function* completeProfile({payload}) {
  try {
    const {cpf, phone} = payload.data;
    const profile = {
      cpf,
      phone,
    };
    const response = yield call(api.put, `user/completeRegister`, profile);
    if (response.data.message) {
      Alert.alert('Erro', response.data.message);
      yield put(updateProfileFailure());
    } else if (response.data) {
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
      yield put(updateProfileSuccess(response.data));
    } else {
      Alert.alert('Erro', 'Confira seus dados');
      yield put(updateProfileFailure());
    }
  } catch (err) {
    console.tron.log(err);
    Alert.alert('Erro', 'Confira seus dados');
    yield put(updateProfileFailure());
  }
}
export function* getUsers({payload}) {
  try {
    const {nextPage, page} = payload;
    const response = yield call(api.get, `user/page/${page}`);
    if (response.data) {
      const {usersCount, users} = response.data;
      if (!nextPage) {
        yield put(getSuccess({usersList: users, usersTotal: usersCount}));
      } else {
        const {usersList} = yield select(state => state.user);
        yield put(
          getSuccess({
            usersList: [...usersList, ...users],
            usersTotal: usersCount,
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

export default all([
  takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile),
  takeLatest('@user/LIST_REQUEST', getUsers),
  takeLatest('@user/COMPLETE_PROFILE_REQUEST', completeProfile),
]);
