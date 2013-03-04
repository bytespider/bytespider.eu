--- 
layout: default
title: Dirty rectangles
tags: 
- games
- html5
- canvas
- javascript
---
Recently I've been experimenting in HTML5 game development and like my [last
post](http://code.bytespider.eu/2012/04/requestanimationframe-and-html5-game-
loops), this post is to document my findings.

## Dirty Rectangles, what are they?

Imagine canvas animation is similar to cel animation, in that you compose your
animation using serveral layers. Cel animators don't want to have to draw the
entire character for each frame if the only thing that is moving is the
character's mouth. (thanks to
[@speakersfive](https://twiiter.com/speakersfive) for this analogy)

With dirty rectangles, we detect which areas of our game have changed and
therefore need updating.

## How do we detect a dirty rectangle

The simplest way is to keep an array of ractangles, `foreach` over them on the
next draw pass and clear those areas of our canvas.

You might be thinking; "what about my background or HUD?", remember the cel
animation analogy? Well just like cel animation we'd create our game in
layers, leaving our background unaffected by our player's movement.

Whenever we make a change to the player's position, we'd mark the player
sprite as dirty and add its rectangle to the array of dirty rectangles

## How do we code this>

Coding this is fairly straight forward, so lets start with our game object.

    
    
    // Game is our game object and hold all data about our game
    // as well as update and draw methods
    Game.dirtyRectangles = [];
    
    
    
    function Player(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    
    
    /**
     * Move player by x and y increments
     * @param  {Number} x player x increment
     * @param  {[type]} y player y increment
     * @return {void}
     */
    Player.prototype.move = function Player_move(x, y) {
        var original_x = this.x;
        var original_y = this.y;
    
        this.x += x;
        this.y += y;
    
        // if some change to the position was made
        if (original_x != this.x || original_y != y) {
            this.dirty = true;
    
            // add this rectangle to the dirty rectangles array
            // note: its the rectangle before the movement was made
            Game.dirtyRectangles.push({
                x: original_x,
                y: original_y,
                width: this.width,
                height: this.height
            });
        }
    };
    

So let me explain what we are doing here.

This prototype is configured to have an x and y position and a width and
height. These properties control the position of the player and dirty
rectangle size and position.

When we call `move()` to move out player we first store the existing position
and then update it. Next we check if the position changed since the start of
the method, when we stored the position, if it did then we set the `dirty`
property and push an object holding the bounding rectangle of the previous
position into the dirty rectangle array.

Next we move on to our game loop's `draw` method.

    
    
    Game.draw = function Game_draw() {
        var ctx = Game.canvasContext;
    
    
        var i, dirtyRectangleCount = this.dirtyRectangles.length;
        for (i = 0; i < dirtyRectangleCount; i+= 1) {
            var rect = this.dirtyRectangles[i];
    
            // clear this rectangle from the canvas
            ctx.clearRect(rect.x, rect.y. rect.width, rect.height);
        }
    
        // clear the dirty rectangle list
        this.dirtyrectangles = [];
    
        // then redraw any dirty sprites
        var spritesCount = this.sprites.length;
        for(i = 0; i < spritesCount; i += 1) {
            var sprite = this.sprites[i];
    
            // is the sprite dirty?
            if (sprite.dirty) {
                sprite.draw(ctx); // pass canvas context to the sprite
            }
        }
    };
    

Okay, here we iterate of the the dirty rectangles array and clear those parts
of the canvas. then we iterate over the sprites and redraw any sprites that
have been marked as dirty. Simple.

Next we'll need to mark our sprite as clean again. The best place to do this
is probably the sprite's draw method.

    
    
    /**
     * Draw the player
     * @param  {CanvasContext} ctx canvas context
     * @return {void}
     */
    Player.prototype.draw = function Player_draw(ctx) {
        /*
            ...
            our drawing code
            ...
        */
       
       // set our sprite to clean again
       this.dirty = false;
    };
    

And that's it. Only the changed parts of our screen will be updated using
dirty rectangles.

Feel free to give me feedback on twitter
[@bytespider](https://twitter.com/bytespider)

