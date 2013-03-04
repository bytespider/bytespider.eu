--- 
layout: default
title: Custom Array-like objects
tags: 
- javascript
- programming
- WEB
---

    function Collection() {
    	var i = 0, len = arguments.length;
    	if (len == 1 && typeof arguments[0] == number) {
    		for (i; i < arguments[0]; ++i) {
    			this[i];
    		}
    	} else {
    		for (i; i < len; ++i) {
    			this[i] = arguments[i];
    		}
    	}
    	
    	this.length = i;
    }
    
    Collection.prototype = new Array();
    Collection.prototype.constructor = Collection;
    Collection.prototype.toString = function () {return this.join()};
    
    var arr = new Array(6);
    var dc = new Collection(6);
    
    arr.push(test);
    dc.push(test);
    
    console.debug(arr, Array);
    console.debug(dc, Collection);
    

So far this is working in Chrome 9, Safari 5 and Firefox 3.6. I'll update this
as I test each new browser, biut it's safe to say it wont work in IE6

