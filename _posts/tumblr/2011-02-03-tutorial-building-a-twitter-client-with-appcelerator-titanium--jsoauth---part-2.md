--- 
layout: default
title: "Tutorial: Building a Twitter client with Appcelerator Titanium & jsOAuth - Part 2"
tags: 
- Titanium
- javascript
- programming
- jsOAuth
---
Back in [Part1](http://code.bytespider.eu/2011/01/tutorial-building-a-twitter-
client-with-appcelerator-titanium--jsoauth---part-1) we started to build a
alert based twitter client using jsOAuth, a Javascript OAuth library and
Appcelerator Titanium, a platform for making applications using web
technologies.

In this part, we'll add better notifications, using Growl, libNotify or Snarl
and add a timer to fetch new tweets every 1 minute.

### Titanium Notifications

Using the Titanium Notification module we get better looking notifications
that come from the system. On OSx Growl is used, On linux libNotify and on
Windows Snarl. All will fall back to a basic built in notification system if
you don’t have any of those notification systems installed.

To create a notification we need to call
`Titanium.Notification.createNotification()` and then set each of the
notification properties. With this we can update our code as follows.

    
    
    timeline.forEach(function  (element){
      var notice = Titanium.Notification.createNotification();
      notice.setTitle(element.user.name);
      notice.setMessage(element.text);
      notice.setTimeout(1000);
      notice.show();
    });
    

The code is fairly straight forward, we set the title to the name of the
person who made the tweet, the message body to the tweet status and then set
the notification to display for 1 second (1000 milliseconds).

If you run this code now, your screen will be filled with 20 tweets which
clear after a second. This looks much better but a one off hit of statuses
isn't exactly useful.

### Timers and tidbits

Next we should implement a timer to check for statuses every 60 seconds. This
is done using the `setTimeout()` function.

Firstly, we need to wrap the body of our API call in a function, that we can
call from the setTimeout function.

    
    
    function updateTimeline() {
        oauth.get(http://api.twitter.com/1/statuses/home_timeline.json, success, failure);
    }
    

At the top of our `success()` function, we add our timeout.

    
    
    function success(data) {
        setTimeout(updateTimeline, 60000);
        
        /* ... */
    }
    

Why do we do this? `setTimeout` executes a function after the specified delay
meaning we could wrap the call in a conditional to prevent the next update.
setInterval is a little harder to control because it calls the function every
specified interval until we clearInterval.

If you ran this code, nothing would happen. That’s because we didnrsquo;t call
`updateTimeline()` yet. Add the line after the updateTimeline decalration and
then launch the app.

    
    
    function updateTimeline() { /* ... */ }
    
    updateTimeline();
    

I think you’ll agree, the app has just become far more uselful, but there is
one think left. Every minute we get notifications of tweets we've already
seen, which after a few minutes gets a little annoying. To solve this we can
use the `since_id` parameter.

However, jsOAuth’s get method is a little limited in this version. Instead
we’ll switch to the request method, which is far more flexible but more
complicated to use.

    
    
    /**
     * Makes an authenticated http request
     *
     * @param options {object}
     *      method {string} [GET, POST, PUT, ...]
     *      url {string} A valid http(s) url
     *      data {object} A key value paired object of data
     *                      example: {q:foobar}
     *                      for GET this will append a query string
     *      headers {object} A key value paired object of additional headers
     *      success {function} callback for a successful request
     *      failure {function} callback for a failed request
     */
    

As you can see, instead of passing separate parameters, we pass an object of
key value pairs to set up the request. All the key names however reflect the
naming convention of the `get` and `post` methods.

    
    
    var sinceId = ;
    function updateTimeline() {
    	var params = {};
    	if (sinceId != ) {
    		params.since_id = sinceId;
    	}
    
        oauth.request({
        	"method": "GET",
        	"url": "http://api.twitter.com/1/statuses/home_timeline.json", 
        	"data": params,
        	"success": success, 
        	"failure": failure
        });
    }
    
    updateTimeline();
    

The first 4 lines of the `updateTimeline` function check if we have a
`sinceId`, and add it to the `params` object. This way we don’t get an invalid
signature error from the Twitter API when it looks for the value.

However, at the moment we haven’t set the `sinceId`, we need to do this in the
`success()` function. The Twitter API returns tweets with the latest at the
top, by default. Using this knowledge, we can gleam off the first id and store
it in the `sinceId` variable.

    
    
    function success(data){
        setTimeout(updateTimeline, 3000);
                  
        var timeline = JSON.parse(data.text);
        
        if (timeline.length > 0) {
        	if (sinceId == timeline[0].id) {
        		return;
        	}
            sinceId = timeline[0].id;
        }
        timeline.forEach(function (element){ /* ... */ });
    }
    

[![Code completed](http://bytespider.eu/images/tutorial/t_code_complete.png)](
http://bytespider.eu/images/tutorial/code_complete.png)

Launch the Titanium Developer tool and run your app. You’ll see the latest
batch of 20 tweets but from then on you'll only see new tweets until the next
time you launch the app.

![Growl
notification](http://bytespider.eu/images/tutorial/tweet_notification.png)

That’s all there is to it. In only a handful of extra lines of code, we've
made the app more user friendly and useful.

To extend this app you could add a callback to the notification to allow
replies or a menu item to allow posting of new statuses. The possibilities are
great and Appcelerator Titanium makes it really easy to build applications
quickly using technologies that most people are familiar with.

If you have any questions, comments or ideas on further expansion to this
tutorial, please feel free to email or tweet me

