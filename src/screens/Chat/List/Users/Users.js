/* eslint-disable no-restricted-syntax */
import React, {useEffect, useState} from 'react';
import {Alert, ActivityIndicator, View, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Background from '../../../../components/Background/Background';
import {Container, Left, Avatar, Info, Name, CardUser, List} from '../styles';
import api from '../../../../services/api';
import {getRequest, reset} from '../../../../appStore/appModules/user/list';
import {appColors} from '../../../../utils/appColors';
import appMetrics from '../../../../utils/appMetrics';
import {NeuView} from 'react-native-neu-element';

export default function Users({navigation}) {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const {usersList, usersLoading, usersPage, usersTotal} = useSelector(
    state => state.user,
  );
  useEffect(() => {
    async function getUsers() {
      dispatch(getRequest({page: 1}));
    }
    getUsers();
  }, []);
  useEffect(() => {
    if (!usersLoading) {
      setLoading(false);
      setFirstLoading(false);
    }
  }, [usersLoading]);
  const onEndReached = () => {
    if (
      !firstLoading &&
      !usersLoading &&
      !loading &&
      usersPage * 10 < usersTotal
    ) {
      setLoading(true);
      dispatch(getRequest({page: usersPage + 1, nextPage: true}));
    }
    return true;
  };
  async function refresh() {
    dispatch(reset());
    dispatch(getRequest({page: 1}));
  }
  async function chamaNoChat(item) {
    try {
      const response = await api.post(`chat`, {
        userDest: item._id,
      });
      if (response.data) {
        const {_id: chatId} = response.data;
        navigation.push('ChatDetails', {
          chatId,
          destinatario: item,
        });
      }
    } catch (e) {
      Alert.alert('', 'Erro na criação do chat');
    } finally {
      refresh();
    }
  }
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: appColors.primary,
      }}>
      <NeuView
        inset
        color={appColors.primary}
        height={appMetrics.DEVICE_HEIGHT - 100}
        width={appMetrics.DEVICE_WIDTH - 80}
        borderRadius={16}>
        {!firstLoading && (
          <Container>
            <List
              data={usersList || []}
              onEndReached={onEndReached}
              onEndReachedThreshold={0.1}
              refreshing={refreshing}
              onRefresh={() => refresh()}
              keyExtractor={item => String(item._id)}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => chamaNoChat(item)}>
                  <CardUser>
                    <Left>
                      <Avatar
                        source={{
                          uri:
                            'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR8ZHCtIBN_exnJIBqPw5JJHpIgtf4nVFFCdw&usqp=CAU', //item.photo_url,
                        }}
                      />
                      <Info>
                        <Name>{item.nome}</Name>
                      </Info>
                    </Left>
                  </CardUser>
                </TouchableOpacity>
              )}
            />
          </Container>
        )}
        {(usersLoading || loading) && (
          <ActivityIndicator size="large" color={appColors.white} />
        )}
      </NeuView>
    </View>
  );
}
