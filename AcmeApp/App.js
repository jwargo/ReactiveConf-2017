import React, { Component } from 'react';
import { AppState, Button, Platform, StyleSheet, Text, View } from 'react-native';
import Push from 'mobile-center-push';
import CodePush from 'react-native-code-push';

const DEFAULT_KEY = 'SOME DEFAULT KEY';

export default class App extends Component<{}> {
  
  constructor(props) {
    super(props);    
    //The following is just a first pass at some code designed to 
    //make this app a more complete example. I've not tested it, 
    //but I think it does cover the use case.
    try {
      //See if we have a CodePush deployment key in localstorage
      const value = await AsyncStorage.getItem('deploymentKey');      
      if (value !== null){
        console.log('Executing CodePush Sync using local key');
        CodePush.sync({value});
      } else {
        console.log('Executing CodePush Sync using default key');
        CodePush.sync({DEFAULT_KEY});
        //or perhaps should this just be:
        //CodePush.sync();
      }
    } catch (error) {
      console.error('Unable to retrieve value from AsyncStorage');
      console.dir(error);
      console.log('Executing CodePush Sync using default key');
      CodePush.sync({DEFAULT_KEY});      
      //or perhaps should this just be:
      //CodePush.sync();
    }
  }

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
          accessibilityLabel="Purple button" />
      </View>
    )
  }

  onButtonPress(event){
    console.log('Button pressed!');
  }

}

Push.setEventListener({
  pushNotificationReceived(pushNotification) {
    let {message, title} = pushNotification; // Use these to display a message to the user if required
    let deploymentKey; 
    if (pushNotification.customProperties && Object.keys(pushNotification.customProperties).length > 0) {
      deploymentKey = pushNotification.customProperties.codePushDeploymentKey;
      // Store the deployment key in Async Storage. Use this in the codepush.sync call if you use CodePush when the app starts up. 
      AsyncStorage.setItem('deploymentKey', deploymentKey);
      // You may also want to removeItem from asyncStorage to clear the A/B test and revert to original version of the app. 
    }

    if (AppState.currentState === 'active') {
      CodePush.sync({deploymentKey});
    } else {
      // Sometimes the push callback is received shortly before the app is fully active in the foreground.
      // Since we store the deployment key in AsyncStorage, codepush sync will be called when the app starts 
      // again, and the A/B test will run.
    }
  }
});

const styles = StyleSheet.create({
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
    padding: 10
  },
});
