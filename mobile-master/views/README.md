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

Found an error in function updatePosistions. I had created a new variable scrollTop and moved it outside the loop, but I did not remove the old document.body.scrollTop from within the For loop.This improved results greatly.

- Time to generate pizzas on load: 26.375ms
- Average scripting time to generate last 10 frames: 4.223500000000001ms
- Average scripting time to generate last 10 frames: 0.4884999999998854ms
- Average scripting time to generate last 10 frames: 0.5265000000003056ms
- Average scripting time to generate last 10 frames: 0.3219999999999345ms

5.

Time to generate pizzas on load: 19.42999999999998ms
Average scripting time to generate last 10 frames: 0.7000000000004235ms
Average scripting time to generate last 10 frames: 0.269999999999709ms
Average scripting time to generate last 10 frames: 0.32150000000037837ms
Average scripting time to generate last 10 frames: 0.4450000000000728ms
Average scripting time to generate last 10 frames: 0.41749999999992726ms

Time to resize pizzas: 1.0899999999965075ms
Time to resize pizzas: 0.8500000000058208ms
Time to resize pizzas: 0.9700000000011642ms
Time to resize pizzas: 0.9799999999959255ms

6. Grunt

JS
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

CSS

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    critical: {
        test: {
            options: {
                base: './',
                css: [
                    'css/style.min.css',
                    'css/bootstrap-grid.css'
                ],
                width: 320,
                height: 70
            },
            src: 'test/fixture/index.html',
            dest: 'test/generated/critical.css'
        }
    }


});

grunt.loadNpmTasks('grunt-critical');

grunt.registerTask('default', ['cssmin']);

}
```