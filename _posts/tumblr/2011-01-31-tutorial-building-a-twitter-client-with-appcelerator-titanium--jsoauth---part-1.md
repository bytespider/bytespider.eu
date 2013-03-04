--- 
layout: default
title: "Tutorial: Building a Twitter client with Appcelerator Titanium & jsOAuth - Part 1"
tags: 
- Titanium
- javascript
- jsOAuth
- programming
---
This tutorial is intended to explain how to use Appcelerator Titanium with a
javascript OAuth library, called jsOAuth, along with basic use of the Twitter
API

### Getting Started

You’ll need to download and install the Titanium Developer tool. There’s a
great tutorial “[Getting
Started](http://developer.appcelerator.com/doc/desktop/get_started)” on the
Appcelerator Developer site. Feel free to skip this step if you already have
the Developer tool installed and understand how it works.

Once you’ve followed that tutorial, set up a new project called “Growl Tweet
Notifier” and continue this tutorial

### jsOAuth and the Twitter API

jsOAuth was designed to be easy to learn and easy to use, as a result most of
the heavy work is done for you. Hopefully you’ll agree how easy it is to use.

Download the [latest
version](https://github.com/bytespider/jsOAuth/downloads)¹ of jsOAuth and put
it into the `Resources/` directory of your project.

[![downloading from github](http://bytespider.eu/images/tutorial/t_download_gi
thub.png)](http://bytespider.eu/images/tutorial/download_github.png)

You’ll need to reference the library in your project, so go ahead and place
the following in your ``, and update the file reference as appropriate.

    
    
    <script src="jsOAuth-0.7.5.1.min.js" type="text/javascript"></script>  
    

In order to work with the Twitter API you’ll need to set up an app in the
Twitter developer centre. Head on over to
[dev.twitter.com](http://dev.twitter.com/apps/new) to register a new app. The
form is fairly simple, but the crucial field is “Application Type” which need
to be set to client. For the type of client we’re writing a “Default Access
type” of Read-only will suffice.

[![Registering a new Twitter app](http://bytespider.eu/images/tutorial/t_twitt
er_register_new.png)](http://bytespider.eu/images/tutorial/twitter_register_ne
w.png)

You’ll need to collect the consumer key and secret from the settings page
presented after registration of your new app. They are under a heading called
“OAuth 1.0a Settings”.

[![Twitter consumer key and secret](http://bytespider.eu/images/tutorial/t_acc
ess_token_key_secret.png)](http://bytespider.eu/images/tutorial/access_token_k
ey_secret.png)

You’ll also need your personal access token. On the right of the settings page
is a menu, you’ll need the “My Access Token” one. On that page, copy the key
and the secret and you’re ready for some coding.

[![My Access Token](http://bytespider.eu/images/tutorial/t_my_access_token.png
)](http://bytespider.eu/images/tutorial/my_access_token.png) [![Twitter access
token key and secret](http://bytespider.eu/images/tutorial/t_access_token_key_
secret.png)](http://bytespider.eu/images/tutorial/access_token_key_secret.png)

_As a side note, you should keep all tokens private, no one else should have
access to them._

With all the keys and secrets to hand, you can instantiate an OAuth object.

    
    
    var oauth = OAuth({
        consumerKey: "[YOUR-CONSUMER-KEY]",
        consumerSecret: "[YOUR-CONSUMER-SECRET]",
        accessTokenKey: "[YOUR-PERSONAL-TWITTER-ACCESS-TOKEN-KEY]",
        accessTokenSecret:"[YOUR-PERSONAL-TWITTER-ACCESS-TOKEN-SECRET]"
    });
    

We’ll start with a basic call to the Twitter API, with a simple alert. Define
a success function and a failure function to handle the responses from the API
as follows:

    
    
    function success(data){
        var timeline = JSON.parse(data.text);
        timeline.forEach(function (element){
            alert(element.text);
        });
    }
    
    function failure(data) {
        alert("Throw rotten fruit, something failed");
    }
    

As you can see, both functions have a single argument `data`, to which jsOAuth
will pass an object containing the response text, response headers and request
headers.

Reading the Twitter API documentation, we know that a url with the extension
.json will return a JSON response, so we `JSON.parse()` the response text held
in `data.text`. The result is an array of tweet objects we can `forEach` over
and alert out the status for.

Titanium has a build in JSON library, so the JSON helper is always available
to us when we need to `parse()` or `stringify()` JSON data.

Finally we need to call the Twitter API end point, and pass the data to our
callback functions. With jsOAuth a simple get request is as easy as:

    
    
    oauth.get(URL, successCallback, failureCallback);
    

So plugging in our callbacks and home timeline URL we get:

    
    
    oauth.get("http://api.twitter.com/1/statuses/home_timeline.json", success, failure);

[![Complete code preview](http://bytespider.eu/images/tutorial/t_code_alert.pn
g)](http://bytespider.eu/images/tutorial/code_alert.png)

Now, we need to run the code using the Titanum developer tool. Load the tool,
click your project and then click the "Test & Package" tab. Here you find a
button to launch and kill your app.

Go ahead click launch and your app will run, query the Twitter home timeline
API finally alerting each tweet.

[![Titanium developer launch](http://bytespider.eu/images/tutorial/t_titanuim_
developer_launch.png)](http://bytespider.eu/images/tutorial/titanuim_developer
_launch.png)

You’ll probably agree, that alerting out the last 20 tweets each time the
application runs isn’t exactly useful. We could use a timer to call the API
every few minutes. We could possibly use the `since_id` parameter to only get
new tweets. We could also use Titanium’s notification module to get pretty
notifications.

That’s all for this part of the tutorial. Next time, we’ll replace the alert
with notifications, and set up a timer to collect only the latest tweets every
minute.

[Building a Twitter client with Appcelerator Titanium & jsOAuth - Part
2](http://code.bytespider.eu/2011/02/tutorial-building-a-twitter-client-with-
appcelerator-titanium--jsoauth---part-2)

¹ At the time of writing the current version was [0.7.5.2](https://github.com/
downloads/bytespider/jsOAuth/jsOAuth-0.7.5.2.min.js)

