

var toggleBounce;
var selectLocation;
var infowindow;
var marker=[];
var markers = [];
var searchString;



//Model

// Layout of code based on Udacity Forum advice by Sarah https://discussions.udacity.com/t/any-guidance-on-coding-p5/3757/7


// This is an array of locations and position parameters that will be passed to google maps and wikipedia API
var model = [
        {
          title: 'Daniel Boone Homestead',
          position: { lat: 40.2971703, lng: -75.7978535 },
          map: map

        },{
          title: "Cumberland Gap",
          position: { lat: 36.6148102, lng: -83.6717293 },
          map: map
        },{
          title: "Boone's Cave Park",
          position: { lat: 35.7984723, lng: -80.4695107 },
          map: map
        },{
          title: "Fort Boonesborough State Park",
          position:{lat: 37.8940053, lng: -84.2751551},
          map: map
        },{
          title: "Daniel Boone Home",
          position:{lat: 38.6511983, lng: -90.856381},
          map: map
        },{
          title: "Battle of Blue Licks",
          position:{lat: 38.429235, lng: -83.9941716},
          map:map
        },{
          title: "Chalahgawtha",
          position:{lat: 39.7303531,lng: -83.9464847},
          map: map
        },{
          title: "Frankfort Cemetery",
          position:{lat:38.1941827,lng: -84.8672227},
          map:map
        }
      ];


//ViewModel


var viewModel = function(){
var self = this;
self.allLocations = [];


//Create location objects
model.forEach(function(location) {
	self.allLocations.push(new Location(location));
});


// Create Markers and options
self.allLocations.forEach(function(location) {
	var markerOptions = {
	title:location.title,
	map: map,
	position: location.position,
	animation: google.maps.Animation.DROP
	};
	location.marker = new google.maps.Marker(markerOptions);
	location.marker.addListener('click', function() {
		toggleBounce(this);
    });
});

//This function it untilized when a user clicks on the button on the view.
//Based on advice given by Udayan on Udacity forum https://discussions.udacity.com/t/wrong-info-window-opens-on-list/189223/3

self.selectLocation = function(location) {
		console.log(location.marker)
		marker = location.marker
		toggleBounce(marker)
};

//Search Filter

//Search filter implementation based on https://discussions.udacity.com/t/linking-the-ko-filter-to-the-markers-le-sigh/35771/2 and //http://codepen.io/prather-mcs/pen/KpjbNN?editors=1111

//The search filter uses the "visible" knockout binding to hide the locations and markers based on userInput
self.visibleLocations = ko.observableArray();

//Creates the visibleLocations. All locations visible until user input
self.allLocations.forEach(function(location) {
	self.visibleLocations.push(location);
});

self.userInput = ko.observable('');//Knockout tracks user input

//Compare userinput to location names
self.filterMarkers = function() {
	var searchInput = self.userInput().toLowerCase();
	self.visibleLocations.removeAll();
    self.allLocations.forEach(function(location) {
      location.marker.setVisible(false);
		    if (location.title.toLowerCase().indexOf(searchInput) !== -1) {
			self.visibleLocations.push(location);
		}
});

//Sets locations to visible

self.visibleLocations().forEach(function(location) {
      location.marker.setVisible(true);
    });
  };

// saves a reference to the marker
function Location(dataObj) {
	this.title = dataObj.title;
    this.position = dataObj.position;
    this.marker = null;
  };


  // wikipedia API call
  //Wiki API call based on Udacity AJAX NYT minicourse as part of FEND coursework

  var apiCall = function(marker){
	var url = 'http://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit=1&search='+marker.title+'&callback=?'
  $.ajax({
    type: "GET",
    url: url,
    contentType: "application/json; charset=utf-8",
    async: false,
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      contentMaker(data,marker)
    },

    error: function (errorMessage) {
      "Wikipedia not available at this time. Please try again Later."
    }

  });

}
	//This function recives the API call data and formats it for the infowindow
    function contentMaker(data,marker){
      var infowindow = new google.maps.InfoWindow({
      content: '<h6><a href ='+data[3]+'>'+data[1]+'</a></h6><p>'+data[2]+'</p>'
      });
      infowindow.open(map, marker);
    }

  //toggleBounce causes the marker to bounce when the user clicks on the lst button or the marker.
	var toggleBounce=function(marker) {//https://developers.google.com/maps/documentation/javascript/markers
      apiCall(marker);
      if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
      } else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function() {
		marker.setAnimation(null);
		}, 1000); //https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Timers
      }
      };

  };

//initMap creates the map and starts knockout
var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 38.3401967, lng: -81.6032057}
    });

    ko.applyBindings(new viewModel());
};
