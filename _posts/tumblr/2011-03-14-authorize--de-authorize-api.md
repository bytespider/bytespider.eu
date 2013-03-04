--- 
layout: default
title: Authorize / De-Authorize API
tags: 
---
I've been having some devising a suitable Authorize / De-authorize API. The
problem stems from the complexity of the OAuth dance. See [[http://oauth.googl
ecode.com/svn/spec/core/1.0/diagram.png](http://oauth.googlecode.com/svn/spec/
core/1.0/diagram.png)](http://oauth.googlecode.com/svn/spec/core/1.0/diagram.p
ng).

Ideally jsOAuth would have one entry point:

    
    
    oauth.authorize(function successCallback() {
    },function failureCallback() {
    });
    

With jsOAuth as it currently stands, you would do something similar to this:

    
    
    oauth.get(http://example.com/oauth/request_token,
        // success
        function(data) {
            console.info(data);
            var window = openURL(http://example.com/oauth/authorize?+data.text);
            var requestParams = data.text
            window.onclose = function () {
                var pin = showPinDialog();
                oauth.get(http://example.com/oauth/access_tokenoauth_verifier=
                    +pin+&+requestParams, function(data) {
                        console.info(data);
                        accessParams = parseTokenRequest(data.text);
                        oauth.setAccessToken([
                            accessParams.oauth_token,
                            accessParams.oauth_token_secret
                        ]);
                    },
                    // fail!
                    function(data) { console.error(data) }
                )
             }
         },
         // fail!
         function(data) { console.error(data) }
    );
    

I believe this is a user-space operation as each application may wish to
implement this differently. If you look at the example above, its very
difficult to break up the common parts into reusable code, whilst maintaining
simplicity and allowing the application to implement the UI.

So onto the main reason for this post. **How** would you do it? What
suggestions can you offer to help create a simple yet usable API?

