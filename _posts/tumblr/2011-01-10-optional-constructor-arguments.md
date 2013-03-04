--- 
layout: default
title: Optional constructor arguments
tags: 
- javascript
- programming
- web
---

    /*
    Setting object parameters 
    optionally in the constructor
    
    bar is required, baz is optional
    
    
    Note:
    false or 0 will result in no value being 
    used. Better to use conditions in this case.
    */
    
    function foo(bar, baz) {
        this.bar = bar;
        baz && (this.baz = baz);
    }
    
    foo.prototype = {
        bar: "",
        baz: ""
    };
    

