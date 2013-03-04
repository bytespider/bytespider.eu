--- 
layout: default
title: Shortest conditional statement
tags: 
- javascript
- programming
- web
---

    /*
    Short hand conditional
    
    This is similar to Optional constructor arguments
    utilising right hand evaluation if left hand results 
    in boolean true
    */
    
    var foo = 2, bar;
    foo == 2 && (bar = 3);
    
    
    /*
    Can also be used to call functions conditonally
    */
    foo == 2 && baz();
    

