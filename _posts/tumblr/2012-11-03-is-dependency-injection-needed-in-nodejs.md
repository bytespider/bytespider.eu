--- 
layout: default
title: Is dependency injection needed in Node.js?
tags: 
- javascript
- nodejs
- patterns
---
Recently I felt the need to write a DI manager.

As I completed my implementation I started to wonder the simple nature of it.
If you adhere to the one module per file mindset, I’d wager you don’t need it.
Take the following for example.

    
    
    var Pen = require(Pen);
    var Notepad = require(Notepad);
    
    function Reporter() {
        this.pen = new Pen();
        this.notepad = new Notepad();
    }
    
    Reporter.prototype.pen = null;
    Reporter.prototype.notepad = null;
    
    Reporter.prototype.write = function (note) {
        this.pen.write(note, this.notepad);
    }
    
    var reporter = new Reporter();
    

A reporter needs a pen and notepad to write, here we manually setup the
dependencies.

We could do this with dependency injection:

    
    
    var di = new DependencyManager();
    di.register(Pen);
    di.register(Notepad);
    di.register(Reporter, {
        pen: Pen,
        notepad: Notepad
    });
    
    var reporter = di.create(Reporter);
    

**My question is, is there a need for DI in Node?**

The benefit I can see is that with DI we can override the instances of pen and
notepad at run time more easily.

