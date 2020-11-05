import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import {
  initialize,
  startDiscoveringPeers,
  stopDiscoveringPeers,
  unsubscribeFromPeersUpdates,
  unsubscribeFromThisDeviceChanged,
  unsubscribeFromConnectionInfoUpdates,
  subscribeOnConnectionInfoUpdates,
  subscribeOnThisDeviceChanged,
  subscribeOnPeersUpdates,
  connect,
  cancelConnect,
  createGroup,
  removeGroup,
  getAvailablePeers,
  sendFile,
  receiveFile,
  getConnectionInfo,
  getGroupInfo,
  receiveMessage,
  sendMessage,
} from 'react-native-wifi-p2p';
import { PermissionsAndroid } from 'react-native';

// -----------------------------------------------------------------------
PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                  {
                      'title': 'Access to wi-fi P2P mode',
                      'message': 'ACCESS_COARSE_LOCATION'
                  }
              )
          .then(granted => {
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  console.log("ACCESS_COARSE_LOCATION GRANTED!")
                  
                  PermissionsAndroid.request(
                              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                              {
                                  'title': 'Access to wi-fi P2P mode',
                                  'message': 'ACCESS_FINE_LOCATION'
                              }
                          )
                      .then(granted => {
                          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                              console.log("ACCESS_FINE_LOCATION GRANTED!")
                              
                          } else {
                              console.log("Permission denied: p2p mode will not work")
                          }
                      })

                  
              } else {
                  console.log("Permission denied: p2p mode will not work")
              }
          })
// -----------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22,
   alignItems: 'stretch'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});

const delivery_status = {
  'in_progress': "#"
}

const Stack = createStackNavigator();

// var deliveries = [
//           {name: 'Devin', code: 1234},
//           {name: 'Dan', code: 1234},
//           {name: 'Dominic', code: 1234},
//           {name: 'Samarth', code: 1234},
//         ]

// function createNewDelivery(obj) {
//   deliveries.push({name: "first", code: 9876});
// }

class DeliveryScreen extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      deliveries: [
        ],
      deliveryName: ""
    };
  }

  createNewDelivery = () => {
    this.setState({ 
      deliveries: this.state.deliveries.concat({key: this.state.deliveryName, code: Math.floor(Math.random()*788888)+100000}),
      deliveryName: this.state.deliveryName
    });
  }

  onChangeText = (text) => {
    this.setState({
      deliveries: this.state.deliveries,
      deliveryName: text
    });
  }
  
  render() {
    // const {navigate} = this.props.navigation;
    return (
    <View style={styles.container}>
      <FlatList
        data={this.state.deliveries}
        renderItem={({item}) => <Text style={styles.item}>{item.key} {item.code}</Text>}
      />
      <View>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          value={this.state.deliveryName}
          onChangeText={text => this.onChangeText(text)}
        />
        <Button
          onPress={this.createNewDelivery}
          title="New Delivery"
          color="#841584"
          accessibilityLabel="Start a new delivery"
        />
      </View>
    </View>
  );
  }
}

class ConnectScreen extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      devices: [],
      isConnected: "Not connected"
    };
  }

  discoverDevices = () => {
    console.log("In Discover devices!")
    try {
          initialize();
          subscribeOnPeersUpdates(this.handleNewPeers);
          subscribeOnConnectionInfoUpdates(this.handleNewInfo);
          subscribeOnThisDeviceChanged(this.handleThisDeviceChanged);

          const status = startDiscoveringPeers();
          console.log('startDiscoveringPeers status: ', status);

      } catch (e) {
          console.error(e);
      }
  }

  handleNewInfo = (info) => {
    console.log('OnConnectionInfoUpdated', info);
  };

  handleNewPeers = ({ devices }) => {
    console.log('OnPeersUpdated', devices);
    this.setState({
      devices: devices,
      isConnected: this.state.isConnected
    });

    this.connectToFirstDevice();
  };

  handleThisDeviceChanged = (groupInfo) => {
      console.log('THIS_DEVICE_CHANGED_ACTION', groupInfo);
  };

  connectToFirstDevice = () => {
      console.log('Connect to: ', this.state.devices[0]);
      connect(this.state.devices[0].deviceAddress)
          .then(() => {console.log('Successfully connected'); this.setState({ devices: this.state.devices, isConnected: "Connected to MCU" });})
          .catch(err => console.error('Something gone wrong. Details: ', err));
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{this.state.isConnected}</Text>
        <Button
          title="Go to Deliveries"
          onPress={() => this.props.navigation.navigate('Deliveries')}
        />
        
        <Button
          title="Discover devices"
          onPress={this.discoverDevices}
        />
      </View>
    );
  }
}

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Connect to the Smart Mailbox" component={ConnectScreen} />
        <Stack.Screen name="Deliveries" component={DeliveryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
