
var map;
var markers = [];

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 39.965765, lng: -86.021091}
  });
}


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
    success: googleHandler,
    fail: function(xhr, status, error) {
    console.log("An AJAX error occured: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
    }
  });

function googleHandler(data){
   //console.log(data);
    var restaurants = data.businesses;

    restaurants.forEach(function(restaurant) {
      var name =restaurant.name;
      var lat = restaurant.location.coordinate.latitude;
      var lng = restaurant.location.coordinate.longitude;
      //var myLatlng = new google.maps.LatLng(lat, lng);
      //var myLatlng = {lat: 39.965765, lng: -86.021091};
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        title: name,
        map: map //https://discussions.udacity.com/t/make-location-markers-appear/186780/2
         });

      markers.push(marker)
      console.log(marker)

      function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }
            // Shows any markers currently in the array.
      function showMarkers() {
        setMapOnAll(map);
      }

    });

};







