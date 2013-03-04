--- 
layout: default
title: Frame animation with HTML5 canvas
tags: 
- javascript
- games
- html5
- animation
---
Recently I’ve been experimenting in HTML5 game development and like my [last
post](http://code.bytespider.eu/2012/04/dirty-rectangles), this post is to
document my findings.

I’ve been playing with animation, more specifically keyframe animation.

> A key frame in animation and filmmaking is a drawing that defines the
starting and ending points of any smooth transition. The drawings are called
"frames" because their position in time is measured in frames on a strip of
film. A sequence of keyframes defines which movement the viewer will see,
whereas the position of the keyframes on the film, video or animation defines
the timing of the movement. Because only two or three keyframes over the span
of a second do not create the illusion of movement, the remaining frames are
filled with inbetweens.

In my case I’m looking for a technique called
[keyframing](https://en.wikipedia.org/wiki/Keyframing#Keyframing), where by we
define every frame of an animation, in much the same way as an aminated gif.

Firstly we must create our keyframes and there are may ways you could do this.
The first is to create seperate files for each frame, however this has the
drawback that the browser has to download each image before you can
realistically start your animation. A better way would be to create one file
with all the frames such as the image below.

![Keyframe animation of a coin](http://f.cl.ly/items/420o1j1F1y3a2y1X0g1h/spin
ning_coin_gold.png)[[http://www.spicypixel.net](http://www.spicypixel.net)](ht
tp://www.spicypixel.net/2008/01/10/gfxlib-fuzed-a-free-developer-graphic-
library/)

This image contains 16x16 keyframes. We could modify the image and reduce the
space between each image and recalculate the position of each frame, however
I'll leave that as an advanced exercise for you.

Most implimentations out there use simple math to work out the frame location:

    
    var coin = {x: 10, y: 10};
    var coin_image = new Image();
    coin_image.src = spinning_coin_gold.png;
    
    var canvas = document.getElementById(canvas);
    var draw_context = canvas.getContext(2d);
    var total_frames = 8;
    var frame = 0;
    
    function loop() {
        // clear the screen
        draw_context.clearRect(0, 0, canvas.width, canvas.height);
    
        // keep the frame number between 0 and total_frames
        frame = frame % total_frames;
    
        // draw the frame from coin_image to the canvas, starting frame * 16 across coin_image for 16 pixels
        draw_context.drawImage(coin_image, frame * 16, 0, 16, 16, coin.x, coin.y, 16, 16);
    
        frame += 1;
        window.webkitRequestAnimationFrame(loop);
    }
    
    loop();
    

The code is fairly simple, we just increase our counter and move that many
lots of pixels across the image. However I feel that are a couple of drawbacks
with this approach.

  1. Our code is inflexible and not reusable
  2. We can’t have our frames on multiple lines of our image (though this could be done with some more math)
  3. We can’t set the speed of our animation independantly of the loop speed (60fps in most browsers)

## Introducing the Animation object

Tackling the points in order, well start by creating an object we can make
instances of to deal with all our animations.

    
    function Animation(frame_count) {
        this.frame = 0;
        this.frameCount = frame_count != undefined ? frame_count : 1;
    }
    Animation.prototype.frame = 0;
    Animation.prototype.frameCount = 0;
    Animation.prototype.paused = false;
    
    Animation.prototype.play = function animationPlay() {
        this.paused = false;
    };
    Animation.prototype.pause = function animationStop() {
        this.paused = true;
    };
    Animation.prototype.stop = function animationStop() {
        this.paused = true;
        this.frame = 0;
    };
    
    Animation.prototype.update = function animationUpdate() {
        if (this.paused) {
            return this.frame;
        }
    
        this.frame += 1;
        this.frame = this.frame % this.frameCount;
    
        return this.frame;
    };
    

Okay, looking good, now we have an Animation object we can reuse in our
original code making our code more reusable and clean:

    
    var coin = {x: 10, y: 10};
    var coin_image = new Image();
    coin_image.src = spinning_coin_gold.png;
    
    var canvas = document.getElementById(canvas);
    var draw_context = canvas.getContext(2d);
    
    var coin_animation = new Animation(8);
    var frame;
    
    function loop() {
        // clear the screen
        draw_context.clearRect(0, 0, canvas.width, canvas.height);
    
        frame = coin_animation.update();
    
        // draw the frame from coin_image to the canvas, starting frame * 16 across coin_image for 16 pixels
        draw_context.drawImage(coin_image, frame * 16, 0, 16, 16, coin.x, coin.y, 16, 16);
    
        window.requestAnimationFrame(loop); // shim? [http://paulirish.com/2011/requestanimationframe-for-smart-animating/](http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
    }
    
    loop();
    

Notice I added 3 convenience methods, `play`, `pause` and `stop`. Now we have
an easy way to start and stop our animation independently of the render loop.

## Sheets full of sprites

By now in HTML5 games, we’ve all learned that sprite sheets are great for
games.

> The advantages of using Sprite Sheets?

>

>   1. Fewer HTTP requests – The Command Center went from 81 requests to a
SINGLE HTTP request

>   2. Better Compression – An advantage of storing the images in a single
file is that the header information doesn’t repeat and the combined file’s
size is much smaller than the sum of the individual files. The command center
went from 496KB in 81 files to only 37KB in a single file. (Less than 8% of
the original size, which is incredible)

>   3. Easier Manipulation – With all the sprites in a single image file, it
became easier to do RGB color manipulations, and I was able to optimize the
drawing code for performance.

>

> From almost a 1,000 requests to 120 requests in one simple code rewrite. And
the total download size went from a few MBs to around 200KB.

>

> [HTML5 Game Development: Using sprite sheets for better performance (and
protecting your server)](http://www.adityaravishankar.com/2012/01/html5-game-
development-using-sprite-sheets-for-better-performance/)

To solve this, our animation object needs to return the exact coordinates of
the image in the sprite sheet. We can achieve this with a simple object
detailing the coordinates of each frame.

    
    {
        x: 0,
        y: 0,
        width: 16,
        height: 16
    }
    

We’ll want to pass multiple to our animation object, so we should update our
`Animation` to accept an array of frames. It will be assumed that the order in
the array is the order the frames are shown in the animation.

    
    function Animation(frames) {
        this.frame = 0;
        this.frames = frames != undefined ? frames : [];
        this.frameCount = this.frames.length;
    }
    Animation.prototype.frame = 0;
    Animation.prototype.frames = null;
    Animation.prototype.frameCount = 0;
    Animation.prototype.paused = false;
    
    Animation.prototype.play = function animationPlay() {
        this.paused = false;
    };
    Animation.prototype.pause = function animationStop() {
        this.paused = true;
    };
    Animation.prototype.stop = function animationStop() {
        this.paused = true;
        this.frame = 0;
    };
    
    Animation.prototype.update = function animationUpdate() {
        if (this.paused) {
            return this.frames[this.frame];
        }
    
        this.frame += 1;
        this.frame = this.frame % this.frameCount;
    
        return this.frames[this.frame];
    };
    

With minimal changes our animation now returns a frame object. But we’ll need
to update out implimentation to understand how to use a frame.

    
    var coin = {x: 10, y: 10};
    var sprite_sheet = new Image();
    sprite_sheet.src = sprite_sheet.png;
    
    var canvas = document.getElementById(canvas);
    var draw_context = canvas.getContext(2d);
    
    var coin_animation = new Animation([
        { x: 0, y: 0, width: 16, height: 16 },
        { x: 16, y: 0, width: 16, height: 16 },
        { x: 32, y: 0, width: 16, height: 16 },
        { x: 48, y: 0, width: 16, height: 16 },
        { x: 64, y: 0, width: 16, height: 16 },
        { x: 80, y: 0, width: 16, height: 16 },
        { x: 96, y: 0, width: 16, height: 16 },
        { x: 112, y: 0, width: 16, height: 16 }
    ]);
    var frame;
    
    function loop() {
        // clear the screen
        draw_context.clearRect(0, 0, canvas.width, canvas.height);
    
        frame = coin_animation.update();
    
        // draw the frame from coin_image to the canvas, starting frame * 16 across coin_image for 16 pixels
        draw_context.drawImage(sprite_sheet, frame.x, frame.y, frame.width, frame.height, coin.x, coin.y);
    
        window.requestAnimationFrame(loop); // shim? [http://paulirish.com/2011/requestanimationframe-for-smart-animating/](http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
    }
    
    loop();
    

Whilst you might think this example is contrived but just think, if there is
very little space in your sprite sheet you can place them anywhere and then
reference the `x` and `y` coordinates.

## Too fast, too slow

Woah, our animation is running at 60FPS! Way too fast. No worries, we can add
a little more code and have and independent FPS for each animation. Let me
explain.

In order to have independent frame rates we increment an internal counter with
a supplied frame duration. Once the required duration has ellapsed, we
increase our internal frame counter as before.

Now for the code.

    
    function Animation(fps, frames) {
        this.frame = 0;
        this.frames = frames != undefined ? frames : [];
        this.frameCount = this.frames.length;
    
        this.duration = 1000 / fps;
        this.elapsedTime = 0;
    }
    Animation.prototype.frame = 0;
    Animation.prototype.frames = null;
    Animation.prototype.frameCount = 0;
    Animation.prototype.duration = 0;
    Animation.prototype.paused = false;
    
    Animation.prototype.play = function animationPlay() {
        this.paused = false;
    };
    Animation.prototype.pause = function animationStop() {
        this.paused = true;
    };
    Animation.prototype.stop = function animationStop() {
        this.paused = true;
        this.frame = 0;
    };
    
    Animation.prototype.update = function animationUpdate(dt) {
        if (this.paused) {
            return this.frames[this.frame];
        }
    
        this.elapsedTime += dt;
        if (this.elapsedTime > this.duration) {
            this.frame += 1;
            this.frame = this.frame % this.frameCount;
    
            this.elapsedTime -= this.duration;
        }
    
        return this.frames[this.frame];
    };
    

Let me explain a one of the quirks of this code, we set `this.elapsedTime -=
this.duration`. If we were to just set `this.elapsedTime = 0`, our animation
would stutter as frames could be faster or slower depending on the the CPU or
other environmental factors. We also need to update the run loop.

    
    var last_frame_update_time = 0;
    function loop(timestamp) {
        // clear the screen
        draw_context.clearRect(0, 0, canvas.width, canvas.height);
    
        var dt = timestamp - last_frame_update_time;
        frame = coin_animation.update(dt);
    
        // draw the frame from coin_image to the canvas, starting frame * 16 across coin_image for 16 pixels
        draw_context.drawImage(sprite_sheet, frame.x, frame.y, frame.width, frame.height, coin.x, coin.y);
    
        last_frame_update_time = timestamp;
        window.requestAnimationFrame(loop); // shim? [http://paulirish.com/2011/requestanimationframe-for-smart-animating/](http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
    }
    

## Wrapping

Hopefully this has been interesting. Hopefully it will be useful. Let me know
what you think on [Twitter](https://twitter.com/share?text=%40bytespider%20)
and you can find a copy of the code on
[Github](https://github.com/bytespider/animation).

