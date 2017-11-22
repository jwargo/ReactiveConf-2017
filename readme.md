# Visual Studio App Center: Delivering A/B Testing for React Native Apps
This repository countains the project source code for my ReactiveConf 2017 session.  My session, *Creative Hacking: Using Code Push for React Native A/B Testing*, demonstrated how to use several Visual Studio App Center (VSAC) features (Analytics, CodePush, and Push) to implement A/B testing in a React Native application.

## Using Analytics & Crash to Understand User Behavior

As you build the A/B variants of your app, you'll need some way to determine how or how well the app is used by the app users.

Start by implementing VSAC Crashs to your application. With this in place, you'll know whenever the app crashes and gather additional information you'll need to troubleshoot and fix the application. Since we're experimenting with new versions of the app, there's no guarantee all the bugs are gone, so this extra level of protection is important. Refer to the [Visual Studio App Center Crashes Documentation](https://docs.microsoft.com/en-us/appcenter/crashes/) for details on how to add Crashes support to your application.

Next, VSAC Analytics capabilities to track users' activity in your app, with all information visualized in VSAC Analytics dashboard to make it easy to see trends or identify gaps. This provides you with invaluable information about your user's experience with the app.

Using the App Center Analytics SDK, you define custom events (depending on your app, this can range from identifying which menu choices are made to tracing a user's path through the app) in your app to understand how users use different features, where they're successful, and where they get stuck, so you make informed decisions about which version works better. Refer to the [Visual Studio App Center Analytics Documentation](https://docs.microsoft.com/en-us/appcenter/analytics/) for details on how to add Crashes support to your application and report custom events in your app's code.

## Publishing Multiple App Revisions to CodePush

After adding VSAC Crashes and Analytics support to your application, deploy the base version of the React Native app to CodePush using the following command:

	code-push release-react <app-name> <target-platform>
	
Replace `<app-name>` with the encoded name for your VSAC app. By encoded name, the app name as it appears in any VSAC URLs. Essentially, this means replacing any spaces with the dash (`-` character. Replace `<target-platform>` with the target platform for the app (Android, iOS, Windows, etc). In my example case, I used the following command:

	code-push release-react MyApp android

Next, use the CodePush CLI to create new CodePush deployments for your app. By default, App Center creates Production and Staging deployments for your app. The **Production** deployment hosts the default version of the app, the one that everyone gets when they download the app from an app store or when a beta version is deployed using App Center. The **Staging** deployment is the home the test versions of your app. For our purposes, you'll need one or more additional deployments (for the "A" & "B" variants of your app). 

For my demo, I created RevisionA and RevisionB deployments to use for the A and b versions of my app. To do this, use the CodePush CLI `code-push deployment add` command, passing in the name of the app, plus the name of the deployment you'd like to create. For example, if my project is called MyApp, to create a RevisionA deployment, I'd use: 

	code-push deployment add MyApp RevisionA
	code-push deployment add MyApp RevisionB

When the CLI finishes creating the Deployment, it will display some content in the terminal window:

	Successfully added the "RevisionA" deployment with key "THIS-APP'S-DEPLOYMENT-KEY" to the "MyApp" app.

You're going to need the deployment key displayed in that output later in this process, so take a moment and record the key for each new deployment before continuing. I'll show you later how to find this value using the CLI, but you'll save some work recording the values now.

When you're done, the deployments list in App Center will list the additional deployments.

![Visual Studio App Center: Deployments List](images/figure-01.png)
 
Now, create the different revisions of the app using whatever source control mechanism that works for you. Usually you'll just put them into different branches in your code repository. With those in place, plublish each revision to its own CodePush Deployment in VSAC. For my example app, I published the RevisionA variant of the app to CodePush using the following command:

	code-push release-react MyApp android --d RevisionA

## Triggering A/B Testing Using Push

### Push Processing Code


	constructor(props){
	    super(props);

	    AsyncStorage.getItem('deploymentKey').then((value) => {
	      if (value !== null){
	        console.log("Deployment key:", value);
	        CodePush.sync({"deploymentKey": value});        
	      } else {
	        console.log("Using default deployment key");
	        CodePush.sync(DEFAULT_KEY);
	      }
	    }).catch((err)=>{
	      console.error("Error reading Async Storage:", err.message);
	      console.log("Using default deployment key");
	      CodePush.sync(DEFAULT_KEY);  
	    });    
	  
	    // Now tell everyone we're initialized
	    Analytics.trackEvent("App initiated", { version: "CORE" });
	    // Analytics.trackEvent("App initiated", { version: "A" });
	    // Analytics.trackEvent("App initiated", { version: "B" });    
	}

and then there's this...


	Push.setEventListener({
	  pushNotificationReceived(pushNotification) {
	    let {message, title} = pushNotification; // Use these to display a message to the user if required
	    console.log(`Notification received: ${title} - ${message}`);
	  
	    let deploymentKey; 
	    if (pushNotification.customProperties && Object.keys(pushNotification.customProperties).length > 0) {
	      deploymentKey = pushNotification.customProperties.deploymentKey;
	      if (deploymentKey) {
	        console.log(`Deployment key: ${deploymentKey}`);
	        // Store the deployment key in Async Storage. Use this in the codepush.sync call if you use CodePush when the app starts up. 
	        AsyncStorage.setItem('deploymentKey', deploymentKey);        
	        // You may also want to removeItem from asyncStorage to clear the A/B test and revert to original version of the app. 
	        if (AppState.currentState === 'active') {
	          CodePush.sync({deploymentKey});
	        } else {
	          // Sometimes the push callback is received shortly before the app is fully active in the foreground.
	          // Since we store the deployment key in AsyncStorage, codepush sync will be called when the app starts 
	          // again, and the A/B test will run.
	        }
	      }          
	    }
	  }
	});

### Sending the Trigger Push Notification

With your A and B versions completed and ready to deploy, you're ready to use App Center's Push service to trigger app deployments and get your "experimental" apps into your users' hands. 

"	To do this,  send a push notification that contains a custom data object referencing the revision version's Deployment ID and deploy to your defined user segments. 
"	To obtain the deployment ID, you'll use the CodePush CLI: code-push deployment ls APP_NAME -k, for example: code-push deployment ls MyApp -k

Push notification processing information lives in your app.js file; when your app receives the notification, it retrieves the deployment ID and automatically pulls the correct revision from CodePush. 

Visual Studio App Center Push includes an ￼Audience feature￼ , allowing you to send notifications to a subset of your users, using Figure 1one or more app or device properties.   

![Visual Studio App Center: Composing a Push Notification](images/figure-02.png)


When you're done A/B testing and want to reset your app to its default content, simply push the Deployment ID for the Production deployment to the same audience. You can also switch all users to the winning app version  by pushing the Deployment ID for the winning version to all users.
