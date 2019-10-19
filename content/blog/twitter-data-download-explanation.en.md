{
    "title": "Explaining Twitter's Data Download Feature.",
    "type": "blog",
    "url": "twitter-data-download-explanation",
    "aliases": [
    	"twitter-data",
    	"gdpr-request"
    ],
    "date": "2019-10-17T16:58:19+02:00",
    "description": "Twitter provides the option to download the user's personal data from their settings . This feature gives easier access to the user. In this, we explain the process to get the data as well as the meaning of the data provided.",
    "featured_image": "/card-icons/Twitter_Logo_Blue.svg",
    "tags": [ "twiiter", "gdpr", "data", "download","export" ],
    "authors": [ "xndr" ],
    "blog_like": true
}

<img class="offset-image offset-image-left" src="/card-icons/Twitter_Logo_Blue.svg" style="height: 200px;">

Twitter is one of the top social media sites of our time. It has a high number of daily users and popular celebrities, sportstars and politicians use it as a method of communication with their fan base. It also serves as the source of daily news and entertainment for a lot of users. Using the insights from the world of hashtags, Twitter along with other brands and influencers have created an entirely new field of marketing. 

Twitter collects the users personal data to create and serve ads to them. For this purpose, it collects relevant user data and stores it to determine user interest and likes. This data can be a treasure trove of information on any frequent user. If the user opts in, the data is also shared with Twiiter also stores a profile on any non logged-in user as well to serve ads based on their browsing habits. This is done on the device only and this data changes once the user logs in. The data stored is used to infer identity and serve ads as well as can be shared with other partners of Twitter.

If you go to [Twitter's settings page](https://twitter.com/settings/your_twitter_data) for user data without any user being logged in, you'll see a page that looks a bit like this.

<img class="offset-image offset-image-left" src="/img/blog/twitter-data-explanation/non-login-twitter-data-1.png" style="height: 500px; margin-top: 50px; margin-bottom: 100px;"> <img class="offset-image offset-image-right" src="/img/blog/twitter-data-explanation/non-login-twitter-data-2.png" style="height: 500px; margin-top: 50px; margin-bottom: 100px;"> 


<a id="twitter-logged-in-procedure">     
## The Procedure to get the Data Download from Twitter(Logged in user)
</a>

1. Go to your Account settings by clicking on the more icon in the navigation bar, and selecting Settings and privacy from the menu.
   Or go to [Twitter's settings page](https://twitter.com/settings/your_twitter_data) for user data after logging in.

2. Under the Account section, click Your Twitter data.

3. Enter your password under Download your Twitter data, then click Confirm.
   {{< img src="/img/blog/twitter-data-explanation/login-twitter-1.png" caption="Enter password to proceed. Ensure that your email address is verified earlier." >}}  
4. Click the Request data button. If your Twitter account is connected to Periscope, the option to Request data from Periscope will show up as well.
   {{< img src="/img/blog/twitter-data-explanation/login-twitter-2.png" caption="Click Request archive on whichever option you want." >}}  
5. When your download is ready, Twitter will send an email to your email account. When you recieve it, from the link or from [settings](https://twitter.com/settings/your_twitter_data), you can go to the same earlier options and find the ready archive.
   {{< img src="/img/blog/twitter-data-explanation/login-twitter-3.png" caption="Click on Download Archive." >}}  
6. Click the Download data.
   {{< img src="/img/blog/twitter-data-explanation/login-twitter-4.png" caption="Click the Request archive button depending on whichever option you want." >}}  
   If you do this process from an iOS or Android device, the options are found in the top menu, where you will either see a navigation menu icon/profile icon. From there go to Settings and privacy, then Account, then under Data and permissions, select Your Twitter data and continue from Step 3 onwards.  




You should now have a .zip file downloaded. Extract and Save it. This file contains all your Twitter user data.



<a id="twitter-data-meaning"></a>
## What does this data mean?

<img class="offset-image offset-image-right" src="/img/humaaans/question-1.svg" style="height: 350px;">
<style>
table, td, th {
    border-collapse: collapse;
    border-spacing: 0;
    border: 2px solid #000000;
    text-align: center;
}
</style>
<table>
 <thead>
  <tr>
   <th>File/Folder name</th>
   <th>Parameter stored</th>
   <th>Meaning of parameter Stored</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td rowspan=7>account.js  </td>
   <td> phoneNumber </td> 
   <td> Phone number registered. </td>
  </tr>
  <tr>
   <td> email </td>
   <td> Email address registered. </td>
  </tr>
  <tr>
   <td>createdVia </td>
   <td> Client application from when the account was created.</td> 
  </tr>
  <tr>
   <td>username</td>
   <td> Current @username.</td>
  </tr>
  <tr>
   <td>accountId</td>
   <td> Unique identifier for the account.</td>
  </tr>
  <tr>
   <td>createdAt</td>
   <td> Date and time when the account was created.</td>
  </tr>
  <tr>
   <td>accountDisplayName</td>
   <td> The name as displayed on the profile.</td>
  </tr>
  <tr>
   <td rowspan=2>account-creation-ip.js</td>
   <td>accountId</td>
   <td> Unique identifier for the account.</td>
  </tr>
  <tr>
   <td>userCreationIp </td>
   <td>IP address at account creation.</td>
  </tr>
  <tr>
   <td rowspan=2>account-suspension.js</td>
   <td>timeStamp</td>
   <td> Date and time of a suspension.</td>
  </tr>
  <tr>
   <td>action</td>
   <td> Action taken regarding suspension. By default, file will be empty unless the account was suspended at some point.</td>
  </tr>
  <tr>
   <td rowspan=2>account-timezone.js</td>
   <td>accountId</td>
   <td> Unique identifier for the account.</td>
  </tr>
  <tr>
   <td>timeZone</td>
   <td> Timezone associated with the account.</td>
  </tr>
  <tr>
   <td rowspan=8>ad-engagements.js</td>
   <td>ad</td>
   <td> Promoted Tweets caused by engagement by user</td>
  </tr>
  <tr>
   <td>deviceInfo</td>
   <td> Information about the device where the engagement occurred.</td>
  </tr>
  <tr>
    <td>displayLocation</td>
    <td> Location where the ad was engaged with on Twitter.</td>
  </tr>
  <tr>
   <td>promotedTweetInfo</td>
   <td> Information about the associated tweet.</td>
  </tr>
  <tr>
   <td>advertiserInfo</td>
   <td> Advertiser name and screen name.</td>
  </tr>
  <tr>
   <td>matchedTargetingCriteria</td>
   <td> Targeting criteria that were used.</td>
  </tr>
  <tr>
   <td>impressionTime</td>
   <td> Date and time when the ad was viewed.</td>
  </tr>
  <tr>
   <td>engagementAttributes</td>
   <td> Type of engagement and date and time.</td>
  </tr>
  <tr>
   <td rowspan=7>ad-impressions.js</td>
   <td>ad</td>
   <td> Promoted Tweets the account has viewed.</td>
  </tr>
  <tr>
   <td>deviceInfo</td>
   <td>Information about the device where the impression was viewed.</td>
  </tr>
  <tr>
   <td>displayLocation</td>
   <td> Location where the ad was viewed on Twitter.</td>
  </tr>
  <tr>
   <td>promotedTweetInfo</td>
   <td> Information about the tweet.</td>
  </tr>
  <tr>
   <td>advertiserInfo</td>
   <td> Advertiser name and screen name.</td>
  </tr>
  <tr>
   <td>matchedTargetingCriteria</td>
   <td> Targeting criteria that were used.</td>
  </tr>
  <tr>
   <td>impressionTime</td>
   <td> Date and time when the ad was viewed.</td>
  </tr>
  <tr>
   <td rowspan=8>ad-mobile-conversions-attributed.js</td>
   <td>ad</td>
   <td>Mobile application events associated with the account in the last 90 days which are attributable to a Promoted Tweet engagement on Twitter.</td>
  </tr>
  <tr>
   <td>attributedConversionType</td>
   <td>Type of activity specifically associated with the event.</td>
  </tr>
  <tr>
   <td>mobilePlatform</td>
   <td> Platform on which the event happened..</td>
  </tr>
  <tr>
   <td>conversionEvent</td>
   <td> Information about the event.</td>
  </tr>
  <tr>
   <td>applicationName</td>
   <td> Name of the application.</td>
  </tr>
  <tr>
   <td>conversionValue</td>
   <td> Value associated with the event.</td>
  </tr>
  <tr>
   <td>conversionTime</td>
   <td> Date and time of the event.</td>
  </tr>
  <tr>
   <td>additionalParameters</td>
   <td> Other parameters.</td>
  </tr>  
  <tr>
   <td rowspan=7>ad-mobile-conversions-unattributed.js</td>
   <td>ad</td>
   <td>Mobile application events associated with the account.</td>
  </tr>
  <tr>
   <td>mobilePlatform</td>
   <td> Platform on which the event happened.</td>
  </tr>
  <tr>
   <td>conversionEvent</td>
   <td> Information about the event.</td>
  </tr>
  <tr>
   <td>applicationName</td>
   <td> Name of the application.</td>
  </tr>
  <tr>
   <td>conversionValue</td>
   <td> Value associated with the event.</td>
  </tr>
  <tr>
   <td>conversionTime</td>
   <td> Date and time of the event.</td> 
  </tr>
  <tr>
   <td>additionalParameters</td>
   <td>Other parameters.</td>
  </tr>
  <tr>
   <td rowspan=8>ad-online-conversions-attributed.js</td>
   <td>ad</td>
   <td> Web events associated with the account.</td>
  </tr>
  <tr>
   <td>attributedConversionType</td>
   <td> Type of activity.</td>
  </tr>
  <tr>
   <td>eventType</td>
   <td> Information about the event.</td>
  </tr>
  <tr>
   <td>conversionPlatform</td>
   <td> Platform on which the event occurred.</td>
  </tr>
  <tr>
   <td>advertiserInfo</td>
   <td> Advertiser name and screen name.</td>
  </tr>
  <tr>
   <td>conversionValue</td>
   <td> Value associated with the event.</td>
  </tr>
  <tr>
   <td>conversionTime</td>
   <td> Date and time of the event.</td>
  </tr>
  <tr>
   <td>additionalParameters</td>
   <td> Other parameters.</td>
  </tr>
  <tr>
   <td rowspan=8>ad-online-conversions-unattributed.js</td>
   <td>ad</td>
   <td> Web events associated with the account.</td>
  </tr>
  <tr>
   <td>eventType</td>
   <td> Information about the event.</td>
  </tr>
  <tr>
   <td>conversionPlatform</td>
   <td> Platform on which the event happened.</td>
  </tr>
  <tr>
   <td>conversionUrl</td>
   <td> URL of the website.</td>
  </tr>
  <tr>
   <td>advertiserInfo</td>
   <td> Advertiser name and screen name.</td>
  </tr>
  <tr>
   <td>conversionValue</td>
   <td> Value associated with the event.</td>
  </tr>
  <tr>
   <td>conversionTime</td>
   <td> Date and time of the event.</td>
  </tr>
  <tr>
   <td>additionalParameters</td>
   <td> Other parameters.</td>
  </tr>
  <tr>
   <td>ageinfo.js</td>
   <td>ageInfo</td>
   <td> Date of birth and age.</td>
  </tr>
  <tr>
   <td rowspan=2>block.js</td>
   <td>accountId</td>
   <td> Unique identifiers of accounts currently blocked by the user.</td>
  </tr>
  <tr>
   <td>userLink</td>
   <td>Link to information about the blocked users’ profiles.</td>
  </tr>
  <tr>
   <td rowspan=5>connected-application.js</td>
   <td>name</td>
   <td> Name of the application.</td>
  </tr>
  <tr>
   <td>description</td>
   <td> Brief description of the application.</td>
  </tr>
  <tr>
   <td>approvedAt</td>
   <td> Date and time of authorization of the application.</td>
  </tr>
  <tr>
   <td>permissions</td>
   <td> List of permissions granted to the connected application.</td>
  </tr> 
  <tr>
   <td>id</td>
   <td> Unique identifier for the application.</td>
  </tr>
  <tr>
   <td rowspan=3>contact.js</td>
   <td>id</td>
   <td> Unique identifiers for contacts.</td>
  </tr>
  <tr>
   <td>emails</td>
   <td> Emails of contacts.</td>
  </tr>
  <tr>
   <td>phoneNumbers</td>
   <td> Phone numbers of contacts.</td>
  </tr>
  <tr>
   <td rowspan=5>device-token.js</td>
   <td>token</td>
   <td> Token associated with a mobile device or web browser that was used to access Twitter.</td>
  </tr>
  <tr>
   <td>lastSeenAt</td>
   <td> Date and time of most recent use.</td>
  </tr>
  <tr>
   <td>clientApplicationId</td>
   <td> Unique identifier of the application.</td>
  </tr>
  <tr>
   <td>clientApplicationName</td>
   <td> Name of the application associated with the token.</td>
  </tr>
  <tr>
   <td>createdAt</td>
   <td> Data and time of the creation of the token.</td>
  </tr>
  <tr>
   <td rowspan=6>direct-message.js</td>
   <td>recipientId</td>
   <td> Unique identifier of the receiver of the Direct Message(DM).</td>
  </tr>
  <tr>
   <td>text</td>
   <td> Text content of the DM.</td>
  </tr>
  <tr>
   <td>mediaUrls</td>
   <td> Links included in the DM.</td>
  </tr>
  <tr>
   <td>senderId</td>
   <td> Unique identifier of sender.</td>
  </tr>
  <tr>
   <td>id</td>
   <td> Unique identifier for a specific DM.</td>
  </tr>
  <tr>
   <td>createdAt</td>
   <td> Date and time the DM was sent.</td>
  </tr>
  <tr>
   <td rowspan=10>direct-message-group.js</td>
   <td>conversationId</td>
   <td> Unique identifier for the Direct Message(DM) group conversation.</td>
  </tr>
  <tr>
   <td>text</td>
   <td> Text content of the DM.</td>
  </tr>
  <tr>
   <td>mediaUrls</td>
   <td> Links included in the DM.</td>
  </tr>
  <tr>
   <td>senderId</td>
   <td> Unique identifier of the sender.</td>
  </tr>
  <tr>
   <td>id</td>
   <td> Unique identifier for a specific DM.</td>
  </tr>
  <tr>
   <td>createdAt</td>
   <td> Day and time of when the DM was sent.</td>
  </tr>
  <tr>
   <td>joinConversation</td>
   <td> Metadata about when the user joined the conversation.</td>
  </tr>
  <tr>
   <td>participantsJoin</td>
   <td> Metadata about when another participant joined the conversation.</td>
  </tr>
  <tr>
   <td>participantsLeave</td>
   <td> Metadata about when another participant left the conversation.</td>
  </tr>
  <tr>
   <td>conversationNameUpdate</td>
   <td> Metadata about when a participant changed the name of the conversation.</td>
  </tr>
  <tr>
   <td rowspan=8>direct-message-group-headers.js</td>
   <td>conversationId</td>
   <td> Unique identifier for the Direct Message(DM) group conversation.</td>
  </tr>
  <tr>
   <td>id</td>
   <td> Unique identifier for a specific DM.</td>
  </tr>
  <tr>
   <td>senderId</td>
   <td> Unique identifier of the sender.</td>
  </tr>
  <tr>
   <td>createdAt</td>
   <td> Date and time the DM was sent.</td>
  </tr>
  <tr>
   <td>joinConversation</td>
   <td> Metadata about when the user joined the conversation.</td>
  </tr>
  <tr>
   <td>participantsJoin</td>
   <td> Metadata about when another participant joined the conversation.</td>
  </tr>
  <tr>
   <td>participantsLeave</td>
   <td> Metadata about when another participant left the conversation.</td>
  </tr>
  <tr>
   <td>conversationNameUpdate</td>
   <td> Metadata about when a participant changed the name of the conversation.</td>
  </tr>
  <tr>
   <td >direct_message_group_media</td>
   <td colspan=2>Folder of images, videos and gifs shared in the group conversations.</td>
  </tr>
  <tr>
   <td rowspan=4>direct-message-headers.js</td>
   <td>id</td>
   <td> Unique identifier for a specific DM.</td>
  </tr>
  <tr>
   <td>senderId</td>
   <td> Unique identifier for the account who sent the Direct Message.</td>
  </tr>
  <tr>
   <td>recipientId</td>
   <td> Unique identifier of the receiver.</td>
  </tr>
  <tr>
   <td>createdAt</td>
   <td> Date and time the DM was sent.</td>
  </tr>
  <tr>
   <td>direct_message_media</td>
   <td colspan=2>Folder of images, videos and gifs shared in conversations.</td>
  </tr>
  <tr> 
   <td rowspan=4>email-address-change.js</td>
   <td>accountId</td>
   <td> Unique identifier for the account.</td>
  </tr>
  <tr>
   <td>changedAt</td>
   <td> Date and time the email address was changed.</td>
  </tr>
  <tr>
   <td>changedFrom</td>
   <td> Email address associated with the account earlier.</td>
  </tr>
  <tr>
   <td>changedTo</td>
   <td> New email address.</td>
  </tr>
  <tr>
   <td rowspan=2>follower.js</td>
   <td>accountId</td>
   <td> Unique identifiers for the other accounts that follow.</td>
  </tr>
  <tr>
   <td>userLink</td>
   <td> Links to information about the users’ profiles.</td>
  </tr>
  <tr>
   <td rowspan=2>following.js</td>
   <td>accountId</td>
   <td> Unique identifiers for the other accounts the user follows.</td>
  </tr>
  <tr>
   <td>userLink</td>
   <td> Links to information about the users’ profiles.</td>
  </tr>
  <tr>
   <td rowspan=3>ip-audit.js</td>
   <td>accountId</td>
   <td> Unique identifier for the account.</td>
  </tr>
  <tr>
   <td>createdAt</td>
   <td> Date and time of a login.</td>
  </tr>
  <tr>
   <td>loginIp</td>
   <td> IP address of the login.</td>
  </tr>
  <tr>
   <td rowspan=3>like.js</td>
   <td>tweetId</td>
   <td> Unique identifiers for the Tweets liked.</td>
  </tr>
  <tr>
   <td>expandedUrl</td>
   <td> Links to the actual tweet on twitter.</td>
  </tr>
  <tr>
   <td>fullText</td>
   <td> Text as visible in the tweet.</td>
  </tr>
  <tr>
   <td>lists-created.js</td>
   <td>urls</td>
   <td> URLs of Lists created.</td>
  </tr>
  <tr>
   <td>lists-member.js</td>
   <td>urls</td>
   <td> URLs of Lists the account has been added to.</td>
  </tr>
  <tr>
   <td>lists-subscribed.js</td>
   <td>urls</td>
   <td> URLs of Lists the account has subscribed to.</td>
  </tr>
  <tr>
   <td rowspan=6>moment.js</td>
   <td>momentId</td>
   <td> Unique identifier for the Moment.</td>
  </tr>
  <tr>
   <td>createdAt</td>
   <td> Date and time the Moment was created.</td>
  </tr>
  <tr>
   <td>createdBy</td>
   <td> Unique identifier for the Moment generated.</td>
  </tr>
  <tr>
   <td>title</td>
   <td> Title attributed to the Moment.</td>
  </tr>
  <tr>
   <td>tweets</td>
   <td> Tweets included in the Moment.</td>
  </tr>
  <tr>
   <td>description</td>
   <td> Description text on the cover page.</td>
  </tr>
  <tr>
   <td>moments_media</td>
   <td colspan=2>Folder of images, videos and gifs uploaded through Twitter’s photo hosting service for Tweets that have been added as Moment cover media.</td>
  </tr>
  <tr>
   <td>moments_tweets_media</td>
   <td colspan=2>Folder of images, videos and gifs uploaded through Twitter’s photo hosting service for Tweets that have been included in a Moment.</td>
  </tr>
  <tr>
   <td rowspan=2>mute.js</td>
   <td>accountId</td>
   <td> Unique identifiers for muted accounts.</td>
  </tr>
  <tr>
   <td>userLink</td>
   <td> Links to information about the users’ profiles.</td>
  </tr>
  <tr>
   <td rowspan=6>ni-devices.js</td>
   <td>deviceType</td>
   <td> Manufacturer for devices that are marked as “pushDevice”. 
For devices marked as “messagingDevice”, the field will indicate “Auth” if the device is only used for two-factor authentication purposes, and “Full” if the device is set to receive notifications from Twitter.</td>
  </tr>
  <tr>
   <td>carrier</td>
   <td> Field indicating the carrier of the device.</td>
  </tr>
  <tr>
   <td>phone_number</td>
   <td> Phone number.</td>
  </tr>
  <tr>
   <td>deviceVersion</td>
   <td> Operating system version of the device.</td>
  </tr>
  <tr>
   <td>createdDate</td>
   <td> Field indicating when the association between the device and the Twitter account was made.</td>
   </tr>
  <tr>
   <td>updatedDate</td>
   <td> Field indicating the last time this association was updated.</td>
  </tr>
  <tr>
   <td rowspan=9>periscope-account-information.js</td>
   <td>id</td>
   <td> Periscope shell account unique identifier automatically created.</td>
  </tr>
  <tr>
   <td>displayName</td>
   <td> Periscope account name ported over from Twitter.</td>
  </tr>
  <tr>
   <td>username</td>
   <td> Periscope account @username ported over from Twitter.</td>
  </tr>
  <tr>
   <td>isBanned</td>
   <td> Indicates whether the account is suspended or not.</td>
  </tr>
  <tr>
   <td>createdAt</td>
   <td> Date and time the "shell account" was created.</td>
  </tr>
  <tr>
   <td>isTwitterUser</td>
   <td> Indicates whether the Periscope account is also a Twitter user. This is always true.</td>
  </tr>
  <tr>
   <td>twitterId</td>
   <td> Unique identifier for Twitter.</td>
  </tr>
  <tr>
   <td>twitterScreenName</td>
   <td> The Twitter account’s current @username.</td>
  </tr>
  <tr>
   <td>isTwitterVerified</td>
   <td> Indicates if the associated Twitter account is verified.</td>
  </tr>
  <tr>
   <td>periscope_broadcast_media
   <td colspan=2>Folder containing the encoded live broadcast video files created by the shell account.</td>
  </tr>
  <tr>
   <td rowspan=8>periscope-broadcast-metadata.js</td>
   <td>id</td>
   <td> Unique id for the broadcast posted by the shell account.</td>
  </tr>
  <tr>
   <td>hasLocation</td>
   <td> Flag to indicate if the broadcast has associated location.</td>
  </tr>
  <tr>
   <td>latitude</td>
   <td> Specific latitude for the broadcast’s location.</td>
  </tr>
  <tr>
   <td>longitude</td>
   <td> Specific longitude for the broadcast’s location.</td>
  </tr>
  <tr>
   <td>city</td>
   <td>(optional) City where the broadcast took place.</td>
  </tr>
  <tr>
   <td>country</td>
   <td> (optional) Country where the broadcast took place.</td>
  </tr>
  <tr>
   <td>createdAt</td>
   <td>Time broadcast was created.</td>
  </tr>
  <tr>
   <td>updatedAt</td>
   <td> Time broadcast was updated or modified.</td>
  </tr>
  <tr>
   <td rowspan=4>periscope-comments-made-by-user.js</td>
   <td>broadcastId</td>
   <td> Unique id for the broadcast posted by the shell account.</td>
  </tr>
  <tr>
   <td>byAccountId</td>
   <td> Account ID of the commenter.</td>
  </tr>
  <tr>
   <td>createdAt</td>
   <td> Time comment was made.</td>
  </tr>
  <tr>
   <td>text</td>
   <td> The comment text.</td>
  </tr>
  <tr>
   <td rowspan=2>periscope-expired-broadcasts.js</td>
   <td>broadcastIds</td>
   <td> A list of the broadcast IDs posted by the shell account that have expired and cannot be encoded.</td>
  </tr>
  <tr>
   <td>reason</td>
   <td> Explanation of why broadcast replay files are unavailable (hard-coded).</td>
  </tr>
  <tr>
   <td>periscope-followers.js</td>
   <td colspan=2>Other accounts that follow this shell account.</td>
  </tr>
  <tr>
   <td rowspan=2>periscope-profile-description.js</td>
   <td>description</td>
   <td> Periscope account description ported over from the Twitter account when the shell account was created.</td>
  </tr>
  <tr>
   <td>profileImageUrls</td>
   <td> URLs of the profile images used with the Twitter account when the shell account was created.</td>
  </tr>
  <tr>
   <td rowspan=8>personalization.js</td>
   <td>languages</td>
   <td> Languages associated with the account. Please note that this information may be inferred.</td>
  </tr>
  <tr>
   <td>genderInfo</td>
   <td> Gender associated with the account. Please note that this information may be inferred.</td>
  </tr>
  <tr>
   <td>interests</td>
   <td> Interests associated with the account. Please note that this information may be inferred.</td>
  </tr>
  <tr>
   <td>partnerInterests</td>
   <td> Interests from partners that are associated with the account.</td>
  </tr>
  <tr>
   <td>numAudiences</td>
   <td> Number of tailored audiences (audiences generated by advertisers) the account is a part of.</td>
  </tr>
  <tr>
   <td>advertisers</td>
   <td> List of screennames for the advertisers that own the tailored audiences the account is a part of.</td>
  </tr>
  <tr>
   <td>inferredAgeInfo</td>
   <td> Date of birth Twitter has inferred about the account and corresponding current age.</td>
  </tr>
  <tr>
   <td>locationHistory</td>
   <td> Location history associated with the account based on activity from the last 60 days.</td>
  </tr>
  <tr>
   <td>phone-number.js</td>
   <td>phoneNumber</td>
   <td> Phone number currently associated with the account if a phone number has been provided.</td>
  </tr>
  <tr>
   <td rowspan=5>profile.js</td>
   <td>bio</td>
   <td> Current account bio as displayed on the profile, if the user has provided one.</td>
  </tr>
  <tr>
   <td>website</td>
   <td> Current account website as displayed on the profile, if the user has provided one.</td>
  </tr>
  <tr>
   <td>location</td>
   <td> Current account location as displayed on the profile, if the user has provided one.</td>
  </tr>
  <tr>
   <td>avatarMediaUrl:</td>
   <td> Link to the current profile avatar image, if the user has provided one.</td>
  </tr>
  <tr>
   <td>headerMediaUrl</td>
   <td>Link to the current profile header image, if the user has provided one.</td>
  </tr>
  <tr>
   <td>profile_media</td>
   <td colspan=2>Folder including current profile avatar image and header/banner image from the account profile, if they have been uploaded.</td>
  </tr>
  <tr>
   <td rowspan=2>protected-history.js</td>
   <td>protectedAt</td>
   <td> Date and time the "Protect your Tweets" setting was used in the last six months.</td>
  </tr>
  <tr>
   <td>action</td>
   <td> Whether the account is protected or unprotected.</td>
  </tr>
  <tr>
   <td rowspan=2>saved-search.js</td>
   <td>savedSearchId</td>
   <td> Unique identifier for a saved search.</td>
  </tr>
  <tr>
   <td>query</td>
   <td> Actual search query entered by the account.</td>
  </tr>
  <tr>
   <td rowspan=4>screen-name-change.js</td>
   <td>accountId</td>
   <td> Unique identifier for the account.</td>
  </tr>
  <tr>
   <td>changedAt</td>
   <td> Date and time the name was changed.</td>
  </tr>
  <tr>
   <td>changedFrom</td>
   <td> Previous screen name associated with the account.</td>
  </tr>
  <tr>
   <td>changedTo</td>
   <td> New screen name associated with the account.</td>
  </tr>
  <tr>
   <td>tweet.js</td>
   <td colspan=2>This JSON file contains all the Tweets posted and not deleted..</td>
  </tr>
  <tr>
   <td>tweet_media</td>
   <td colspan=2>Folder of images, videos, and/or gifs shared in the account’s Tweets.</td>
  </tr>
  <tr>
   <td rowspan=2>verified.js</td>
   <td>accountId</td>
   <td> Unique identifier for the account.</td>
  </tr>
  <tr>
   <td>verified</td>
   <td> Indicates whether the account is verified.</td>
  </tr>
  <tr>
 </tbody>
</table>

A more indepth description can be found in the README.txt of the downloaded file.


## Usage and Analysis of the data

The data received will be quite extensive, especially if the user is quite regular on Twitter. This data can be ported to other sites that accept such types of data or can be used for personal analysis.
It can be used to make a fun graph plotting the number of DM's shared between loved ones or just as a way of getting to know how Twitter collects data. 

Hope you learnt and got something useful from this blog post. Cheers!


TWITTER, TWEET, RETWEET and
the Twitter logo are trademarks of Twitter, Inc.
or its affiliates. 
