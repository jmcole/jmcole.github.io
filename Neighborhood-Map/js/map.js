// Model
var Model = [
  // Array containing location data
];

//View Model
var ViewModel = function() {

    var view = {
        myMessage: ko.observable() // Initially blank
    };
    view.myMessage("Hello, world!"); // Text appears

    var yelp_url = 'https://api.yelp.com/v2/search'
    var auth = {
        consumerKey: "2oVVjw7SKpyObHosFaBK9A",
        consumerSecret: "jvxL364AiB4kAOCNfJGHEiNRYIg",
        accessToken: "FYEcI-AqiGDI1fRNCbMg_tyrbzCiCiy5",
        accessTokenSecret: "f-6AtoVE9ctdO2i2ML_z2oorYl0",
        signatureMethod: "HMAC-SHA1"
                };

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
          var lng = restaurant.location.coordinate.longitude;
          var name = restaurant.name;
          var resImg = restaurant.image_url;
          var address = restaurant.location.display_address;
          var phone = restaurant.display_phone;
          var ratingImg = restaurant.rating_img_url_small;
          var rating = restaurant.rating;
          var snippet = restaurant.snippet_text;
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat,lng),
                title: name,
                map: map, //https://discussions.udacity.com/t/make-location-markers-appear/186780/2
                animation: google.maps.Animation.DROP
            });

            var content = "<h2>" + name + "</h2>" + "<img style='float:left;width:100px;height:100px; margin-right:10px;' src="+resImg+">"+
               "<h4>Phone: " + phone + "<br>Rating: " + rating + " "+"<img src= " + ratingImg+">"
               + "<h6>"+snippet+"</h6";//https://discussions.udacity.com/t/creating-infowindows-with-yelp-data/182773/5

            var infowindow = new google.maps.InfoWindow({
                content: content
              });

            function toggleBounce() {//https://developers.google.com/maps/documentation/javascript/markers
              if (marker.getAnimation() !== null) {
                marker.setAnimation(null);
              } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                infowindow.open(map, marker);
                setTimeout(function() {
                marker.setAnimation(null);
                }, 1000); //https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Timers
              }
            };
            marker.addListener('click',toggleBounce);
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

