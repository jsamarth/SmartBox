import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { Component, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Button, TextInput } from 'react-native';
// import WifiDirect from 'react-native-wifi-direct';
// import { PermissionsAndroid } from 'react-native';

// =========== WIFI permissions ===========
// const permission = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
// const options = {
//   'title': 'Wifi networks',
//   'message': 'We need your permission in order to find wifi networks'
// }

// PermissionsAndroid.request(permission, options).then((granted) => {
//   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//     console.log("Permission granted!");
//   } else {
//     console.log("You will not able to retrieve wifi available networks list")
//   }
// }).catch((error) => {
//   console.warn(error)
// })
// ========================================

// 
// WifiDirect.discoverPeers().then((success) => {
//   if (success) {
//     console.log("Peer discovery has initiated successfully.")
//   } else {
//     console.log("Peer discover failed to initiate.  Is your Wi-Fi on?")
//   }
// })


// WifiDirect.addListener('PEERS_UPDATED', peersUpdated)
 
// // Don't forget to remove the listener to prevent a memory leak
// componentWillUnmount () {
//   WifiDirect.removeListener('PEERS_UPDATED', this.peersUpdated)
// }
 
// const peersUpdated = (event) => {
//   console.log("Devices found!", event.devices)
// }
// 

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
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>ConnectScreen</Text>
        <Button
          title="Go to Deliveries"
          onPress={() => this.props.navigation.navigate('Deliveries')}
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
