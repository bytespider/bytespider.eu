--- 
layout: default
title: "Appcelerator Titanium: Bullet-Proof window drag"
tags: 
- titanium
- javascript
- programming
---
**UPDATED: 2010-01-24**
    
    
    /*
    Bullet Proof window drag
    
    This is the most performant window dragging code
    I could come up with. All the example on
    developer.appcelerator.com we laggy
    
    Version 2: More contained version
    */
    
    var toolbarHandle = document.getElementById(toolbar);
    
    toolbarHandle.addEventListener(mousedown, function (e){
        var isDragging = true;
        var mousePosition = {x:event.clientX, y:event.clientY};
        
        document.addEventListener(mousemove, drag, false);
        document.addEventListener(mouseup, function (e){
            document.removeEventListener(mousemove, drag, false);
            document.removeEventListener(mouseup, arguments.callee, false);
        }, false);
    
    
        function drag(event) {
            var wnd = Titanium.UI.currentWindow;
            var curentPosition = {x:wnd.getX(), y:wnd.getY()};
            
            curentPosition.x += event.clientX - mousePosition.x;
            curentPosition.y += event.clientY - mousePosition.y;
            wnd.moveTo(curentPosition.x, curentPosition.y);
        }
    }, false);
    

You can find the code on [Github](https://gist.github.com/785158)

