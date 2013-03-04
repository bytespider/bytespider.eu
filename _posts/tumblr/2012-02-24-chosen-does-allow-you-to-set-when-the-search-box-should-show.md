--- 
layout: default
title: Chosen does allow you to set when the search box should show
tags: 
- javascript
- jquery
---
I started using chosen in a few projects but it frustrated me that the search
box would always show regardless of how many options I had.

I read through the website and discover theres no mention of a setting, so
being a good little community developer I decide to implement the
functionality.

After getting my head round the coffeescript source, which in my opinion is
far worse to read and grok than javascript, I add the code. Then i think I'll
be really good and make it configurable before I submit a pull-request.

Thats when I discover `disable_search_threshold`, and wondering what it was I
try it. Turns out that it's exactly the functionality I had just written and
wasted time on.

So next time you're using chosen and you need to hide search for the first,
lets say, 10 items do this:

    
    
    $(".chzn-select").chosen({
        disable_search_threshold: 10
    });
    

