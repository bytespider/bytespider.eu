--- 
layout: default
title: iOS6 Safari Caching POST Responses
tags: 
- iOS
- nginx
- ajax
---
If you're wondering how to prevent the caching of POST responses in nginx I
think the following works.

    
    
    location / {
        if ( $request_method = POST ) {
            add_header Cache-Control no-cache;
        }
    }
    

Let me know if it works for you too

