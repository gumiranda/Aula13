/* eslint-disable no-restricted-syntax */
import React, {useEffect, useState, useMemo} from 'react';
import {View, ActivityIndicator, Alert} from 'react-native';
import {withNavigationFocus} from 'react-navigation';
import socketio from 'socket.io-client';
import {GiftedChat} from 'react-native-gifted-chat';
import {useDispatch, useSelector} from 'react-redux';
import Background from '../../../components/Background/Background';
import api from '../../../services/api';
import {Title} from './styles';
import {getRequest, reset} from '../../../appStore/appModules/chat/details';
import {appColors} from '../../../utils/appColors';
function ChatDetails({navigation}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(true);
  const [destinatario, setDestinatario] = useState(
    navigation.getParam('destinatario'),
  );
  const {
    messagesList,
    messagesLoading,
    messagesPage,
    messagesTotal,
  } = useSelector(state => state.chat);
  const profile = useSelector(state => state.user.profile);
  const socket = useMemo(() => {
    return socketio('https://devdoido.herokuapp.com', {
      query: {user_id: profile._id},
    });
  }, [profile]);
  useEffect(() => {
    async function getMessages() {
      dispatch(getRequest({page: 1, id: navigation.getParam('chatId')}));
    }
    getMessages();
  }, []);
  useEffect(() => {
    if (!messagesLoading) {
      setLoading(false);
      setFirstLoading(false);
    }
  }, [messagesLoading]);
  const onEndReached = () => {
    if (
      !firstLoading &&
      !messagesLoading &&
      !loading &&
      messagesPage * 20 < messagesTotal
    ) {
      setLoading(true);
      dispatch(
        getRequest({
          page: messagesPage + 1,
          id: navigation.getParam('chatId'),
          nextPage: true,
        }),
      );
    }
    return true;
  };
  const refresh = () => {
    dispatch(reset());
    dispatch(getRequest({page: 1, id: navigation.getParam('chatId')}));
    // GiftedChat.append([], messagesList);
  };

  useEffect(() => {
    socket.on('response', data => {
      dispatch(getRequest({page: 1, id: navigation.getParam('chatId')}));
    });
  }, [socket]);
  async function onSend(messages) {
    try {
      await api.put(`chat/send/${navigation.getParam('chatId')}`, {
        text: messages[0].text,
      });
      dispatch(getRequest({page: 1, id: navigation.getParam('chatId')}));
    } catch (e) {
      Alert.alert('', 'Erro no envio da mensagem');
    }
  }
  return (
    <Background>
      <View style={{flex: 1}}>
        <Title>{destinatario.nome}</Title>
        {loading && <ActivityIndicator size="large" color={appColors.white} />}
        {!firstLoading && (
          <GiftedChat
            renderUsernameOnMessage
            messages={messagesList}
            listViewProps={{
              scrollEventThrottle: 400,
              onScroll: ({nativeEvent}) => {
                const {
                  layoutMeasurement,
                  contentOffset,
                  contentSize,
                } = nativeEvent;
                const paddingToTop = 80;
                const tamanhoDaTela =
                  contentSize.height - layoutMeasurement.height - paddingToTop;
                const ondeEuTo = contentOffset.y;
                if (tamanhoDaTela <= ondeEuTo) {
                  onEndReached();
                }
              },
            }}
            onSend={messages => onSend(messages)}
            user={{_id: profile._id}}
          />
        )}
      </View>
    </Background>
  );
}
// ChatDetails.navigationOptions = {
//   title: 'aaaaa',
// };
export default withNavigationFocus(ChatDetails);
