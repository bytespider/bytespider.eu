--- 
layout: default
title: Using CommonJS modules for UI View components in Titanium
tags: 
- Appcelerator
- Titanium
- javascript
- CommonJS
- Modules
---
I've been playing with using CommonJS modules in Appcelerator Titanium to
create reusable components and prototypes. I start with a basic object
structure:

    
    
    function Car() {
        this.init.apply(this, arguments);
    }
    
    Car.prototype.init = function (make, model) {
        this.make = make;
        this.model = model;
    };
    
    Car.prototype.make = null;
    Car.prototype.model = null;
    
    Car.createWithMakeAndModel = function (make, model) {
        return new Car(make, model);
    };
    
    module.exports = Car;
    

Whilst you may argue there is some redundancy in the pattern I use, I makes
sections of code easy to override later on if I decide to use it as a
prototype.

You may also frown upon the use of `module.exports = Car;`. However I find
that

    
    
    var Car = require("Car");
    

looks and feels better than

    
    
    var Car = require("Car").Car;
    

You may argue that you should never have access to the constructor and that
you should use factory methods. Whilst your argument is valid, I prefer to be
able to make sure that my object X is an instance of Y using the built in
`instanceof` operator.

## How this applies to views and windows

For views and windows I add `.view` and `.wnd` properties to my object inside
my `init()` method, which is where I call all other parts of my view
construction. Take the following example of a list view.

    
    
    function UIListView()
    {
        this.init.apply(this, arguments);
    }
    
    UIListView.prototype.init = function () {
        this.view = Ti.UI.createTableView();
    };
    
    UIListView.prototype.populate = function (data) {
        var i = 0, len = data.length, row;
        for (; i < len; ++i)
        {   
            row = Ti.UI.createTableViewRow(data[i].asTableViewRow());
            this.view.appendRow(row);
        }
    };
    
    module.exports = UIListView;
    

As you can see I can now call `populate()` at anytime to update my view with
new data.

I'd like to experiment more with patterns like this. I'd love to hear your
opinions and suggestions for other patterns or structures, so tweet me or send
me an email.

