// Resouces used jshint.com,http://api.jquery.com/,http://jasmine.github.io/2.1/introduction.html
// and Udacity webcasts and Writing Test Suits videos. Specifc forum posts attributed below.


$(function() {

    describe('RSS Feeds', function() {

        //description - This test makes sure the allFeeds variable has been defined

        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        //description - This test makes sure the allFeeds contains an URL

        it('each feed in allFeeds object contains an URL', function() {
            for (var i = 0; i < allFeeds.length; i++) {
                expect(allFeeds[i].url).toBeDefined();
                expect(allFeeds[i].url).not.toBe('');
            }
        });

        //description - This test makes sure the allFeeds variable has a defined name

        it('each feed has a name defined and is not empty', function() {
            for (var i = 0; i < allFeeds.length; i++) {
                expect(allFeeds[i].name).toBeDefined();
                expect(allFeeds[i].name).not.toBe('');
            }
        });
    });


    //description - A suite of tests for the Menu

    describe('The menu', function() {

        //description - This test makes menu is hidden by default

        it('ensure the menu element is hidden by default', function() {
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });


        //description - This test makes sure the menu changes visibilty when clicked

        // Resources used-https://discussions.udacity.com/t/question-about-simulation-click/35812
        // Resources used- https://discussions.udacity.com/t/having-issues-with-testing-the-visibility-of-the-menu/181639/4

        it('ensure menu changes visibility when menu icon is clicked', function() {
            $('.menu-icon-link').click(); //Simulate a click
            expect($('body').hasClass('menu-hidden')).toBe(false);
            $('.menu-icon-link').click();
            expect($('body').hasClass('menu-hidden')).toBe(true);
        });
    });

    //description - This test suite tests the initial loads

    describe('Initial Entries', function() {
        //description - Tests to ensure that here is one.entry element within the.feed container
        // Resouces used -//https://discussions.udacity.com/t/step-13-help-initial-entries/14839/13

        beforeEach(function(done) {
            setTimeout(function() {
                loadFeed(0, done);
            });
        });

        it('ensure at completion of loadFeed there is one .entry element within the .feed container', function(done) {
            expect($('.feed .entry').length).toBeGreaterThan(0);
            done();
        });
    });

    //description - New test suite for new feeds

    describe('New Feed Selection', function() {
        //description - This test makes sure when a new feed is loaded the content changes
        //Resources used- //https://discussions.udacity.com/t/new-feed-selection-question/16274/14
        var firstFeed;
        var secondFeed;
        beforeEach(function(done) {
            loadFeed(0, function() {
                firstFeed = $('.feed').html();
                done();
            });
        });

        it('ensure at completion of loadFeed there is new content', function(done) {
            loadFeed(1, function() {
                secondFeed = $('.feed').html();
                expect(firstFeed).not.toEqual(secondFeed);
                done();
            });
        });

    });
}());
