--- 
layout: default
title: Object cloning using ES5
tags: 
- javascript
---

    function clone(object) {
        var cloned = Object.create(object.prototype || null);
        Object.keys(object).map(function (i) {
            cloned[i] = object[i];
        });
    
        return cloned;
    }
    

