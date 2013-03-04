--- 
layout: default
title: requestAnimationFrame and HTML5 game loops
tags: 
- javascript
- html5
- games
- programming
---
When looking at writing a HTML5 game, I first went down the usual route of
using `setTimeout(run, 1000/60);`. However due to the nature of javascript,
this isn't always optimal. Javascript is single threaded so you can't always
guarantee that your frame will be rendered when you expected it.

## In walks requestAnimationFrame

##

Thankfully there's a new kid on the block, `requestAnimationFrame`, and the
browser will call your function when it has rendering time free and passing
the time.

But how do we update our game loop to use this? In much the same way as
`setTimeout()` thankfully.

    
    
    function main(time) {
        run();
        window.requestAnimationFrame(main);
    }
    window.requestAnimationFrame(main);
    

## Gotcha

This one stumped me for a while, but in my simple game the CPU was hitting
100%. So I added code to reduce the frame rate.

    
    
    var skipTicks = 1000 / 30, nextTick = new Date().getTime();
    function run(time) {
        while (time > nextTick) {
            update();
            draw();
    
            nextTick += skipTicks;
        }
    };
    

However my CPU usage was still 100%. I had a think and it dawned on me,
`requestAnimationFrame` makes a request for rendering time and the browser
will give the next available spot. But the browser is so fast, we're
practically requesting a frame every millisecond, no wonder my CPU hits 100%.

So I've updated my code, to wait 10ms before requesting the next animation
frame.

    
    
    function main(time) {
        run();
        setTimeout(function () {
            window.requestAnimationFrame(main);
        }, 10);
    }
    window.requestAnimationFrame(main);
    

