var toggleBounce;

//Model
var locations ={};

//View Model
var ViewModel = function() {

    var self = this;
    var yelp_url = 'https://api.yelp.com/v2/search'
    var auth = {
        consumerKey: "2oVVjw7SKpyObHosFaBK9A",
        consumerSecret: "jvxL364AiB4kAOCNfJGHEiNRYIg",
        accessToken: "FYEcI-AqiGDI1fRNCbMg_tyrbzCiCiy5",
        accessTokenSecret: "f-6AtoVE9ctdO2i2ML_z2oorYl0",
        signatureMethod: "HMAC-SHA1"
                };
    self.myMessage= ko.observableArray();

    function nonce_generate() {
        return (Math.floor(Math.random() * 1e12).toString());
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
        success: googleHandler,
        fail: function(xhr, status, error) {
        console.log("An AJAX error occured: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
        }
      });

    function googleHandler(data){
      var restaurants = data.businesses;
        restaurants.forEach(function(restaurant) {
          var lat = restaurant.location.coordinate.latitude;
          var lng= restaurant.location.coordinate.longitude;
          var locations ={
          name: restaurant.name,
          resImg: restaurant.image_url,
          address: restaurant.location.display_address,
          phone: restaurant.display_phone,
          ratingImg: restaurant.rating_img_url_small,
          rating: restaurant.rating,
          snippet: restaurant.snippet_text,
          marker: new google.maps.Marker({
            position: new google.maps.LatLng(lat,lng),
            title: restaurant.name,
            map: map, //https://discussions.udacity.com/t/make-location-markers-appear/186780/2
            animation: google.maps.Animation.DROP})
        }

          var markers = locations.markers;
          console.log(markers);

          var content = "<h2>" + locations.name + "</h2>" + "<img style='float:left;width:100px;height:100px; margin-right:10px;' src="+locations.resImg+">"+
            "<h4>Phone: " + locations.phone + "<br>Rating: " + locations.rating + " "+"<img src= " + locations.ratingImg+">"
            + "<h6>"+locations.snippet+"</h6";//https://discussions.udacity.com/t/creating-infowindows-with-yelp-data/182773/5

          var infowindow = new google.maps.InfoWindow({
            content: content
          });

          toggleBounce=function() {//https://developers.google.com/maps/documentation/javascript/markers
            if (locations.marker.getAnimation() !== null) {
            locations.marker.setAnimation(null);
            } else {
            locations.marker.setAnimation(google.maps.Animation.BOUNCE);
            infowindow.open(locations.map, locations.marker);
            setTimeout(function() {
            locations.marker.setAnimation(null);
            }, 1000); //https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Timers
            }
          };
            locations.marker.addListener('click',toggleBounce);


          self.myMessage.push([locationList]);
            });
      };
};

//Function to load map and start up app

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 39.9571527568228, lng: -86.014014903435}
    });

    ko.applyBindings(new ViewModel());
};

