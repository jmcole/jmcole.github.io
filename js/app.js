/*******************************************
https://discussions.udacity.com/t/for-those-who-do-not-know-where-to-start-project-3/15618
Create Player Class based on the sample Enemy Class provided.
Fill in default player instance location info. (HINT: x? y?)
Create one player instance from Player Class. (You will see the game scenes get initialised)
Create multiple enemy instance from Enemy Class.
Fill in default enemy instance location info.
Fill in update enemy instance moving function.
Create player input handle function.
Create function to detect collision.
http://diveinto.html5doctor.com/canvas.html#c
width 505
height 606
*******************************************/


/**********************************
Using Math.random to set random speeds for Enemy class.
http://stackoverflow.com/questions/12885110/javascript-math-random
https://discussions.udacity.com/t/bugs-speed-in-code/157675
**********************************/

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    "use strict";
    this.sprite = 'images/enemy-bug.png';
    this.x =x;
    this.y =y;
    this.width = 80;
    this.height = 50;
    this.speed = Math.floor(Math.random() *(400 -200 + 1)) + 200;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    "use strict";
    this.x += this.speed * dt;
    //Reset Enemy position https://discussions.udacity.com/t/enemy-not-regenerating-once-it-reaches-the-canvas-width/167915
    if (this.x > 505) {
        this.x = -101;
        this.speed = Math.floor(Math.random() *(500 -200 + 100)) + 200;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    "use strict";
    this.sprite = 'images/char-boy.png';
    this.width = 66;//height and width definition needed for collision dtection
    this.height = 95;
    this.reset();//Sets player intitial position
};
/***************************************
Update module multiplies player movement by dt to keep speed consistent for all computers.
It also implements the collision detection function.
***************************************/
Player.prototype.update = function(dt) {
    "use strict";
    this.x * (dt);
    this.y * (dt);
    this.collision();
};

Player.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/******************************************************
The handleInput module takes the keys input from the listner and moves the player acoss the
screen by increment/decrementing y or x. In addition, coding is in place to prevent player from moving
off the screen and to reset the game if the player wins by reaching the water.
//https://discussions.udacity.com/t/how-do-i-make-the-handleinput-listen-the-keys/162024
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch
******************************************************/
Player.prototype.handleInput = function(allowedKeys){
    "use strict";
    if (allowedKeys == 'up') {
        this.y -= 90;
    }
    if (allowedKeys == 'down') {
        this.y += 90;
    }
    if (allowedKeys == 'left') {
        this.x -= 101;
    }
    if (allowedKeys == 'right') {
        this.x += 101;
    }
    //Prevents player from moving off the left side
    if (this.x < 0) {
        this.x = 0;
    }
    //Prevents player from moving off the right side
    if (this.x > 400) {
        this.x = 400;
    }
    //Prevents player from moving off the bottom
    if (this.y > 400) {
        this.y = 400;
    }
    //Resets player and prints win message if player reaches water
    if (this.y < 0) {
        this.reset();
        console.log("You win!!");
    }

};

/*********************************
Resets player to start position. Used if player reaches the water or if
a collision occurs.
*********************************/
Player.prototype.reset=function(){
        "use strict";
        this.x = 200;
        this.y = 400;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
//Places enemy one on first row
var enemy1 = new Enemy(0, 62);
allEnemies.push(enemy1);
//Places enemy two on second row
var enemy2 = new Enemy(0, 145);
allEnemies.push(enemy2);
//Places enemy three on third row
var enemy3 = new Enemy(0, 225);
allEnemies.push(enemy3);

// Place the player object in a variable called player
var player = new Player();

/*************************************
The collision detection module uses a bounding box to define the player and AllEnemies
as rectangles. This requires the additionalheight and width definitions.When there is no gap
between the two objects, a collision exists and the player is reset.
https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
https://discussions.udacity.com/t/collision-detection-loop/39113/2
**************************************/
Player.prototype.collision=function(){
        "use strict";
        for (var e = 0; e < allEnemies.length; e++) {
            if (allEnemies[e].x < player.x + player.width
                && allEnemies[e].x + allEnemies[e].width > player.x
                && allEnemies[e].y < player.y + player.height
                && allEnemies[e].y + allEnemies[e].height > player.y)
            player.reset();
  }

};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
