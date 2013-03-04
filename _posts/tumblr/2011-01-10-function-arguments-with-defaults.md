--- 
layout: default
title: Function arguments with defaults
tags: 
- javascript
- programming
- web
---
bar is required, baz is optional with a default

    
    /*
    Note:
    false or 0 will result in the default value being 
    used. Better to use conditions in this case.
    */
    function foo(bar, baz) {
        baz = baz || 'default value';
    }

