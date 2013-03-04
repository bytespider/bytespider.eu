--- 
layout: default
title: Object properties to Array
tags: 
- javascript
- programming
- web
---

    /*
    Collecting object properties into
    an Array
    */
    
    var i = 0, arr = [];
    var foo = {bar: "value bar", baz: "value baz"};
    
    for(arr[i++] in foo)
    
    
    /* 
    Result:
    arr == ["bar", "baz"] 
    */
    

