import React, { Component } from 'react';
import {  Button, Platform, StyleSheet, Text, View } from 'react-native';

export default class App extends Component<{}> {
  render() {
    return (
      <View> 
        <View style={styles.toolbar}>
          <Text style={styles.toolbarButton}>Add</Text>
          <Text style={styles.toolbarTitle}>ReactiveConf 2017</Text>
          <Text style={styles.toolbarButton}>Like</Text>
        </View>             
        <Text style={styles.content}>
          Kielbasa pork loin turducken shank venison. Shoulder meatloaf porchetta short ribs tongue, ribeye ball tip. Cupim pork loin t-bone doner pork belly tongue ball tip kielbasa pancetta shankle filet mignon jowl landjaeger strip steak. Chicken ham hock turducken, venison spare ribs turkey ribeye boudin pastrami ball tip flank.
        </Text>
        <Text style={styles.content}>
          Pig short loin burgdoggen bresaola ham ground round. Turkey ball tip prosciutto ground round swine, salami shoulder leberkas. Turkey burgdoggen rump pork. Ham hock flank shankle, jowl andouille burgdoggen leberkas alcatra meatball frankfurter pork belly beef. Pastrami cow picanha tenderloin salami turducken short loin pork chop.
        </Text>
        <Text style={styles.content}>
          Content generated using the Bacom Ipsum Generator at https://baconipsum.com/.
        </Text>      
        <Button onPress={this.onButtonPress}
          title="Press me"
          color="#841584"
          accessibilityLabel="Purple button"
        />
      </View>
    )
  }

  onButtonPress(event){
    console.log('Button pressed!');
  }
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#F5FCFF',
  // },

  toolbar:{
    backgroundColor:'blue',
    paddingTop:30,
    paddingBottom:10,
    flexDirection:'row'    
},
toolbarButton:{
    width: 50,
    color:'#fff',
    textAlign:'center'
},
toolbarTitle:{
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    flex:1 
},

  content: {
    textAlign: 'left',
    color: 'black',
    // marginTop: 10,
    // marginBottom: 10,
    padding: 10
  },
});
