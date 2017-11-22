# Visual Studio App Center: Delivering A/B Testing for React Native Apps
This repository countains the project source code for my ReactiveConf 2017 session.  My session, *Creative Hacking: Using Code Push for React Native A/B Testing*, demonstrated how to use several Visual Studio App Center (VSAC) features (Analytics, CodePush, and Push) to implement A/B testing in a React Native application.

## Publishing Multiple App Revisions to CodePush

Start by deploying the base/core version of the React Native app to CodePush; use the following command:

	code-push release-react <app-name> <target-platform>
	
Replace `<app-name>` with the encoded name for your VSAC app. By encoded name, the app name as it appears in any VSAC URLs. Essentially, this means replacing any spaces with the dash (`-` character. Replace `<target-platform>` with the target platform for the app (Android, iOS, Windows, etc). In my example case, I used the following command:

	code-push release-react MyApp android

Next, use the CodePush CLI to create new CodePush deployments for your app. By default, App Center creates Production and Staging deployments for your app. The **Production** deployment hosts the default version of the app, the one that everyone gets when they download the app from an app store or when a beta version is deployed using App Center. The **Staging** deployment is the home the test versions of your app. For our purposes, you'll need one or more additional deployments (for the "A" & "B" variants of your app). 

For my demo, I created RevisionA and RevisionB deployments to use for the A and b versions of my app. To do this, use the CodePush CLI `code-push deployment add` command, passing in the name of the app, plus the name of the deployment you'd like to create. For example, if my project is called MyApp, to create a RevisionA deployment, I'd use: 

	code-push deployment add MyApp RevisionA
	code-push deployment add MyApp RevisionB

When the CLI finishes creating the Deployment, it will display some content in the terminal window:

	Successfully added the "RevisionA" deployment with key "THiS-APPS-DEPLOYMENT-KEY" to the "MyApp" app.

**Note:** You're going to need the deployment key displayed in that output later in this process, so take a moment and record the key for each new deployment before continuing. I'll show you later how to find this value using the CLI, but you'll save some work recording the values now.

When you're done, the deployments list in App Center will list the additional deployments.

![Visual Studio App Center: Deployments List](images/figure-01.png)
 
Figure 1 - Visual Studio App Center CodePush Deployments

Now, create the different revisions of the app using whatever source control mechanism that works for you. Usually you'll just put them into different branches in your code repository. With those in place, plublish each revision to its own CodePush Deployment in VSAC. For my example app, I published the RevisionA variant of the app to CodePush using the following command:

	code-push release-react MyApp android --d RevisionA

## Using Analytics & Crash to Understand User Behavior

As you build the A/B variants of your app, you'll need some way to determine how or how well the app is used by the app users. 

Once you've deployed your "A" and "B" to your user segments, App Center's Crash and Analytics capabilities make it easy to see how your app versions behave in the wild, and how your users engage with each version. 
"	Crash gives you detailed, immediate insight into when and why your crashes, as well as how many users are affected.
"	Analytics helps you track users' activity in app versions, with all information visualized in App Center Analytics dashboard to make it easy to see trends or identify gaps.
With the App Center Analytics SDK, you define custom events (depending on your app, this can range from identifying which menu choices are made to tracing a user's path through the app) in your app to understand how users use different features, where they're successful, and where they get stuck, so you make informed decisions about which version works better, based on your app's goals.

Pushing deployments
With your A and B versions completed and ready to deploy, you're ready to use App Center's Push service to trigger app deployments and get your "experimental" apps into your users' hands. 
"	To do this,  send a push notification that contains a custom data object referencing the revision version's Deployment ID and deploy to your defined user segments. 
"	To obtain the deployment ID, you'll use the CodePush CLI: code-push deployment ls APP_NAME -k, for example: code-push deployment ls MyApp -k

Push notification processing information lives in your app.js file; when your app receives the notification, it retrieves the deployment ID and automatically pulls the correct revision from CodePush. 

Visual Studio App Center Push includes an ￼Audience feature￼ , allowing you to send notifications to a subset of your users, using Figure 1one or more app or device properties.   
Figure 2 - Defining a Push Audience
When you're done A/B testing and want to reset your app to its default content, simply push the Deployment ID for the Production deployment to the same audience. You can also switch all users to the winning app version  by pushing the Deployment ID for the winning version to all users.
