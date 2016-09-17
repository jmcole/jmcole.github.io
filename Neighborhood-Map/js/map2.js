//https://discussions.udacity.com/t/having-trouble-on-markers-array/181801/2

var map;
var locations = [];

// MODEL
function nonce_generate() {
    return (Math.floor(Math.random() * 1e12).toString());
  }


  var yelp_url = 'https://api.yelp.com/v2/search'
  var auth = {
    consumerKey: "2oVVjw7SKpyObHosFaBK9A",
    consumerSecret: "jvxL364AiB4kAOCNfJGHEiNRYIg",
    accessToken: "FYEcI-AqiGDI1fRNCbMg_tyrbzCiCiy5",
    accessTokenSecret: "f-6AtoVE9ctdO2i2ML_z2oorYl0",
    signatureMethod: "HMAC-SHA1"

            };

  var parameters = {
    oauth_consumer_key: auth.consumerKey,
    oauth_nonce: nonce_generate(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now()/1000),
    oauth_token: auth.accessToken,
    oauth_version : '1.0',
    callback: 'cb',           // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    location: 'Fishers,IN',
    limit: '5',
    radius_filter: '500'
  };

  var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, auth.consumerSecret, auth.accessTokenSecret);
  parameters.oauth_signature = encodedSignature;


  $.ajax({
    url: yelp_url,
    data: parameters,
    cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
    dataType: 'jsonp',
    success: function(yelpResults) {

    var restaurants = yelpResults.businesses
    restaurants.forEach(function(restaurant) {
      var name =restaurant.name;
      var lat = restaurant.location.coordinate.latitude;
      var lng = restaurant.location.coordinate.longitude;
      var myLatlng = new google.maps.LatLng(lat, lng);














var Model = [
  // Array containing location data
];

//VIEW MODEL
var ViewModel = function ViewModel() {

      // functions to add markers, show data, filter locations, update infowindow content etc.
      //Run API calls to get data

  var self = this;

  // create an observable array using data array
  self.locations = ko.observableArray( dataArray );

  self.locations().forEach(function (location) {

    // define the marker
    var marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(location.lat, location.lng),\
      title: location.name,
      icon:  'images/mycustomicon.png',
      animation: google.maps.Animation.DROP
    });

    // add the marker as a property of the location
    location.marker = marker;
  }

  // more View Model below
};

//Function to load map and start up app
var initMap = function() {
  // Load  Google Map:   map = new google.maps.Map(document.getElementById('map') etc.
  // Instantiate ViewModel:   ko.applyBindings(new ViewModel());
};