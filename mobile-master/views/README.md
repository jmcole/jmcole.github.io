Before Optimization

Time to generate pizzas on load: 35.79499999999999ms
Average scripting time to generate last 10 frames: 50.385000000008155ms main.js:493
Average scripting time to generate last 10 frames: 34.830499999999304ms main.js:493
Average scripting time to generate last 10 frames: 33.43699999999662ms main.js:465
Time to resize pizzas: 168.32499999998254ms main.js:465
Time to resize pizzas: 169.9100000000035ms main.js:465
Time to resize pizzas: 144.64999999999418ms main.js:465
Time to resize pizzas: 146.7850000000035ms main.js:465
Time to resize pizzas: 166.3850000000093ms main.js:465

1. Optimize to improve Resize Pizzas

function changePizzaSlices - removed all variables that do not change outside of For loop
Changed getElementsbClassName instead of querySelectorAll

After Changes
Time to generate pizzas on load: 32.214999999999975ms
Time to resize pizzas: 1.949999999999818ms
Time to resize pizzas: 1.5700000000001637ms
Time to resize pizzas: 1.8400000000001455ms
Time to resize pizzas: 1.2600000000002183ms
Time to resize pizzas: 1.4049999999997453ms

2. Focus on Improving framerate and removing Jank

The function updatePositions is the main culprit according to Google Dev Tools due to forced reflow.

Changed from document.querySelectorAll
Moved scrollTop calculation outside of loop
Changed to transform. This changed the layout to only one collumn. When viewed in Dev tools this was due to an extremely large px number. Evidently, the + was either concantinating the variables or some other problem was occuring. ound forum post https://discussions.udacity.com/t/style-transform-question-p4/14052 and suggestion was made to use parseint(). I found if I moved to a separate variable that this corrected the problem. Took forum suggestion and placed movingpizzas in its own "row" in pizza.html. These changes significantly reduced jank and scripting time.

Average scripting time to generate last 10 frames: 12.207500000000072ms
Average scripting time to generate last 10 frames: 18.298999999998706ms
Average scripting time to generate last 10 frames: 16.5320000000007ms
Average scripting time to generate last 10 frames: 16.783499999999187ms



3. Serached for For loops to optimize
Moved pizzasDiv outside of For loop
Changed pizza value from 200 to 36

Time to generate pizzas on load: 29.49000000000001ms
Average scripting time to generate last 10 frames: 8.258499999998838ms
Average scripting time to generate last 10 frames: 2.7415000000000873ms
Average scripting time to generate last 10 frames: 2.5340000000007423ms
Average scripting time to generate last 10 frames: 2.560499999999229ms
Average scripting time to generate last 10 frames: 2.8020000000007714ms

4. Optimized images
Reduced pizza.png
Reduced pizzeria.jpg

Found an error in function updatePosistions. I had created a new variable scrollTop and moved it outside the loop, but I did not remove the old document.body.scrollTop from within the For loop.this improved results greatly.

Time to generate pizzas on load: 26.375ms
Average scripting time to generate last 10 frames: 4.223500000000001ms
Average scripting time to generate last 10 frames: 0.4884999999998854ms
Average scripting time to generate last 10 frames: 0.5265000000003056ms
Average scripting time to generate last 10 frames: 0.3219999999999345ms