var map;
var infowindow;
var model;
//Model

var model = {
    restaurants:[{
        title:"Five Guys Burgers and Fries",
        url:"https://api.yelp.com/v2/business/five-guys-burgers-and-fries-fishers",
        location: {
            lat: 39.958817,
            lng: -86.012401
        },
    },{
        title:"Puccini's Smiling Teeth Pizza & Pasta",
        url:"https://api.yelp.com/v2/business/puccinis-smiling-teeth-pizza-and-pasta-fishers-3",
        location:{
            lat: 39.9567047506571,
            lng: -86.0106144100428
        },
    }]
};
console.log(model)

//ViewModel

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

var yelp_url = model.restaurants.url


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





//Function to load map and start up app

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {lat: 39.9571527568228, lng: -86.014014903435}
    });

    ko.applyBindings(new ViewModel());
};
