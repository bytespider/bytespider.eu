--- 
layout: default
title: jsOAuth in the browser, my response to OAuth in web browsers
tags: 
- jsOAuth
- javascript
- browser
- oauth
---
Developer:

    
    We are on a look out for a Javascript OAuth library that works in browsers. 
Rob Griffiths:

    
    There are some things you need to consider when trying to get OAuth working in the browser using Javascript. 
    Firstly, Javascript source is viewable by anyone with the inclination to do so, this means that your OAuth Key and Secret are publicly accessible, meaning that an attacker could use your credentials to sign requests and gain access tokens, in theory at least. In my opinion the attacker would have to fool a user into thinking they were your site, which isnt too hard but users are stupid and can be fooled easily. 
    Secondly, if your site contacts a third party webservice, youll be bound by in build browser security as you are making a cross domain request. The security disables any XHR from talking to a domain other than the one it was created on. 
    Unless you use CORS (cross origin resource sharing), however most web services dont support this, which is a shame as this would make the web a better place allowing sites to interact at the client level creating interesting application mashups. 
    So Id ask this; 
    - Does the webservice youre planning to use support CORS? 
    - Do you have a plan to hide your secret in plain sight? 
    Most people solve these issue by building a server-side script to proxy their XHR.

