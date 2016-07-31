# **Website Optimization**

This project is part of the [Udacity](http://udacity.com/) Front End Devloper (FEND) course. The provided website [Cam's Pizzeria](http://http://jmcole.github.io/mobile-master/org/views/pizza.html) has some serious performance issues.

## Before Optimization

Using Chrome Dev Tools, along with test scripts, the following tests provided an initial baseline for the start of this optimization project.

- Time to generate pizzas on load: 50.420000000000016ms
- Average scripting time to generate last 10 frames: 65.17799999999922ms
- Average scripting time to generate last 10 frames: 36.927500000000876ms
- Time to resize pizzas: 166.43499999999767ms
- Time to resize pizzas: 168.31999999999243ms
- Time to resize pizzas: 143.48000000001048ms
- Total load time 3.35 S

Google Dev tools also revealed substantial jank due to long frames.

##1. Optimize to improve Resize Pizzas

Project specification require that the time to resize pizzas be less than 5ms. Before optimization, the time to resize pizzas was approximately 160ms.

To resize pizzas the program primarily uses the `function changePizzaSlices`. This function iterates through the list of pizzas and changes their sizes.

```
  function changePizzaSizes(size) {
    for (var i = 0; i < document.querySelectorAll(".randomPizzaContainer").length; i++) {
      var dx = determineDx(document.querySelectorAll(".randomPizzaContainer")[i], size);
      var newwidth = (document.querySelectorAll(".randomPizzaContainer")[i].offsetWidth + dx) + 'px';
      document.querySelectorAll(".randomPizzaContainer")[i].style.width = newwidth;
    }
  }

```
There are a number of activities in this code that can be pulled outside of the loop so that the computer is not constantly wasting time calculating them. Here is the optimized code.

```
 function changePizzaSizes(size) {
    var pizzaCon = document.getElementsByClassName("randomPizzaContainer");
    var dx = determineDx(pizzaCon[0], size);
    var newwidth = (pizzaCon[0].offsetWidth + dx) + 'px';
    var length = pizzaCon.length;
    for (var i = 0; i < length; i++) {
      document.getElementsByClassName("randomPizzaContainer")[i].style.width = newwidth;
    }
  }

```

In addition to removing all variables that do not change outside of For loop, getElementsbClassName was used instead of querySelectorAll as it boosts performance.

After Changes
- Time to generate pizzas on load: 32.214999999999975ms
- Time to resize pizzas: 1.949999999999818ms
- Time to resize pizzas: 1.5700000000001637ms
- Time to resize pizzas: 1.8400000000001455ms
- Time to resize pizzas: 1.2600000000002183ms
- Time to resize pizzas: 1.4049999999997453ms

Resize pizzas now meets specifications.

## 2. Focus on Improving framerate and removing Jank

The function updatePositions is the main culprit according to Google Dev Tools due to forced reflow.

```
function updatePositions() {
  frame++;
  window.performance.mark("mark_start_frame");

  var items = document.querySelectorAll('.mover');
  for (var i = 0; i < items.length; i++) {
    var phase = Math.sin((document.body.scrollTop / 1250) + (i % 5));
    items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
  }

```

Optimization began by replacing `document.querySelectorAll` with the faster `getElementsbClassName`.The scrollTop calculation was moved outside of loop. Changed to transform. This changed the layout to only one collumn. When viewed in Dev tools this was due to an extremely large px number. Evidently, the + was either concantinating the variables or some other problem was occuring. ound forum post https://discussions.udacity.com/t/style-transform-question-p4/14052 and suggestion was made to use parseint(). I found if I moved to a separate variable that this corrected the problem. Took forum suggestion and placed movingpizzas in its own "row" in pizza.html. These changes significantly reduced jank and scripting time.

```
function updatePositions() {
  frame++;
  window.performance.mark("mark_start_frame");
  var scrollTop = document.body.scrollTop;
  var items = document.getElementsByClassName('mover');
  for (var i = 0; i < items.length; i++) {
    var phase = Math.sin((scrollTop) + (i % 5));
    var pizzas = items[i].basicLeft + 100 * phase + 'px';
    items[i].style.transform = 'translateX(' + pizzas + ')';
  }

```

This function could still be improved by moving the phase calculation outside of the loop, however these change significantly improved performance.


- Average scripting time to generate last 10 frames: 12.207500000000072ms
- Average scripting time to generate last 10 frames: 18.298999999998706ms
- Average scripting time to generate last 10 frames: 16.5320000000007ms
- Average scripting time to generate last 10 frames: 16.783499999999187ms



## 3. Searched for For loops to optimize

Moved pizzasDiv outside of For loop.

```
var pizzasDiv = document.getElementById("randomPizzas");

for (var i = 2; i < 100; i++) {
  pizzasDiv.appendChild(pizzaElementGenerator(i));
}

```
Changed pizza value from 200 to 20

- Time to generate pizzas on load: 29.49000000000001ms
- Average scripting time to generate last 10 frames: 8.258499999998838ms
- Average scripting time to generate last 10 frames: 2.7415000000000873ms
- Average scripting time to generate last 10 frames: 2.5340000000007423ms
- Average scripting time to generate last 10 frames: 2.560499999999229ms
- Average scripting time to generate last 10 frames: 2.8020000000007714ms

## 4. Optimized images
Reduced pizza.png and reduced pizzeria.jpg by determing the maximun display value using GoogleDev Tools. I then resized and reduced the size of the images with the online [Kraken](https://kraken.io/) tool.

Found an error in function updatePosistions. I had created a new variable scrollTop and moved it outside the loop, but I did not remove the old document.body.scrollTop from within the For loop.This improved results greatly. The website is now hitting 60fps.

- Time to generate pizzas on load: 26.375ms
- Average scripting time to generate last 10 frames: 4.223500000000001ms
- Average scripting time to generate last 10 frames: 0.4884999999998854ms
- Average scripting time to generate last 10 frames: 0.5265000000003056ms
- Average scripting time to generate last 10 frames: 0.3219999999999345ms



## 5. PageSpeed

The website is now meeting specification on ressize pizzas and frame rate. However, it also needs to score above 90 using [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights) for both mobile and desktop. Initial scores revealed that there was much work to do. Mobile scored 66/100 for Speed and 72/100 for User Experience. Desktop scored 30/100.

Both scores increased after the above optimizations were made, desktop actually met expectations after images were optimized. Mobile was still too far away. Suggestions from PageSpeed were to:

- Eliminate Render Blocking Javascript and CSS above the fold
- Minify JavaScript
- Prioritize visible content

I decided to use Grunt to perform these tasks.

## 6. Grunt

I used the [Grunt Setup](http://gruntjs.com/getting-started) guide to get Grunt setup. First you must install [Node.js](https://docs.npmjs.com/getting-started/installing-node) and then update NPM using `npm install npm -g' from the Command Line.

Next install the [Grunt CLI](http://gruntjs.com/getting-started) `npm install -g grunt-cli`.

Now you create a gruntfile.js (manually) and a package.json (using `npm init`) in your project folder.

Next you download the [Plugin](http://gruntjs.com/plugins) you want to use. The Grunt Plugin performs the "work" after you configure your gruntfile.js.

First I wanted to minify my Javascript. To do this I downloaded the [Uglify](https://www.npmjs.com/package/grunt-contrib-uglify) plugin.

This was done using the `npm install grunt-contrib-uglify --save-dev` from hte command line the following gruntfile configuration.

```
module.exports = function(grunt) {


grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
        build: {
            src: 'js/main.js',
            dest: 'js/main.min.js',
        }
    }

});

grunt.loadNpmTasks('grunt-contrib-uglify');

grunt.registerTask('default', ['uglify']);

}
```

Next I wanted to identify the critical code needed for above the fold content.I used [critical](https://www.npmjs.com/package/grunt-critical) to perform this task. I used the following configuration file. This created a newfile "Pizza2.html" with all of the necessary css code inlined within the html file.

```
module.exports = function(grunt) {


grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    critical: {
        test: {
            options: {
                base: './',
                css: [
                    'css/style.min.css',
                    'css/bootstrap-grid.min.css'
                ],
                width: 320,
                height: 70
            },
            src: 'pizza.html',
            dest: 'pizza2.html'
        }
    }


});

grunt.loadNpmTasks('grunt-critical');

grunt.registerTask('default', ['critical']);

}

```

# CSS-Minification

After optimizing the CSS for above the fold content, I also wanted to minify the CSS. To do this, I used [cssmin](https://www.npmjs.com/package/grunt-contrib-cssmin)

```
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    cssmin: {
  target: {
    files: [{
      expand: true,
      cwd: 'css/',
      src: ['*.css', '!*.min.css'],
      dest: 'css/',
      ext: '.min.css'
    }]
  }
}




});

grunt.loadNpmTasks('grunt-cssmin');

grunt.registerTask('default', ['cssmin']);

}
```

# HTML Minification

I minified the HMTL using [hmtlmin](https://www.npmjs.com/package/grunt-contrib-htmlmin) with the following configuration file.

```
module.exports = function(grunt) {


grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

     htmlmin: {
       dist: {
         options: {
           removeComments: true,
           collapseWhitespace: true
         },
         files: {
           'dist/pizza.html': 'pizza.html'
         }
       }
     },
});

grunt.loadNpmTasks('grunt-contrib-htmlmin');

grunt.registerTask('default', ['htmlmin']);

}
```

In addition, I also inlined some of the Javscript in order to improve the website above the fold download time.

# Final Results

After using Grunt to minify my HTML, CSS, JS, and identify/inline critical CSS my page scores are now. 95/100 for mobile and 97 out of 100 for desktop.

Updated based on [Udacity Review](https://review.udacity.com/#!/reviews/197611)

- Used `document.getElementById()`throughout main.js.
- Rewrote UpdatePositions to better emulate original website.

'''
for (var i = 0, len = items.length, phase; i < len; i++) {
    phase = Math.sin((scrollTop) + (i % 5));
    items[i].style.transform = 'translateX(' + 100 * phase + 'px)';
}
```
- Rewrote Sliding Pizza Generator- Number of pizzas is now determined by the screen height rather than a set number.

```
var cols = 8;
  var s = 256;
  var p =(screen.height/s)*cols//automatically determine number of rows depending on screen height
  var movingPizzas = document.getElementById("movingPizzas1");//changed to document.getElementById()moved outside of loop
  for (var i = 0, elem; i < p; i++) {//changed value from 200 do not need that many pizzas
    //var elem = document.createElement('img');
    elem = document.createElement('img');//Added
    elem.className = 'mover';
    elem.src = "images/pizza.png";
    elem.style.height = "100px";
    elem.style.width = "73.333px";
    elem.style.left = i % cols * s + 'px';//Changed by reviewer suggestion
    elem.style.top = (Math.floor(i / cols) * s) + 'px';
    movingPizzas.appendChild(elem);
  }
  updatePositions();
```

Also corrected index.html so that correct image and links display.