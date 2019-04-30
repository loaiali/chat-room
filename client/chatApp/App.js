import React from 'react';
import { Provider } from 'react-redux'
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';
import { PersistGate } from 'redux-persist/integration/react';
import { Root, Text } from 'native-base';
import RoomsListScreen from './features/roomsList';
import ChatRoomScreen from './features/chatRoom';
import AuthScreen from './features/auth';
import store, { persistor } from './store';



const ChatNavigator = createStackNavigator(
  {
    roomsList: RoomsListScreen, // in future this should be something like tab navigator
    chatRoom: ChatRoomScreen,
  },
  {
    initialRouteName: 'roomsList',
    headerMode: 'none',
  }
)

const AppNavigator = createAppContainer(createSwitchNavigator(
  {
    auth: AuthScreen,
    chatMain: ChatNavigator,
  },
  {
    initialRouteName: 'auth',
  }
))

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
            <AppNavigator />
          </Root>
        </PersistGate>
      </Provider>
    )
  }
}
