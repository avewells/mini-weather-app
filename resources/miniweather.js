function getLocation() {
    /*
    Attempts to get the user's current location. If successful a geolocation object is retrieved.
    */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather, showGeoLocError);
    } else {
        console.log('Geolocation is not supported.');
    }
}

function getWeather(geoLocObj=null, coordsObj=null) {
    /*
    Attempts to get the weather for a specified location using coordinates.
    Uses's FreeCodeCamp's weather API.
    */
    if (geoLocObj) {
        // user's location was determined from browser
        console.log('Lat: ' + geoLocObj.coords.latitude + ' Long: ' + geoLocObj.coords.longitude);
        $.getJSON('https://fcc-weather-api.glitch.me/api/current?', {
            lat: geoLocObj.coords.latitude,
            lon: geoLocObj.coords.longitude
        })
        .done(function(data) {
            console.log(data);
        })
        .fail(function() {
            console.log('Error retrieving weather.');
        });
    } else {
        // user searched for a location
        console.log('Lat: ' + coordsObj.latitude + ' Long: ' + coordsObj.longitude);
    }
    
}

function showGeoLocError(error) {
    /*
    Outputs errors that occurred during getting location. Doesn't report on user choosing to block.
    */
    switch(error.code) {
        case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred getting your location.");
            break;
    }
}

// document is ready
$(document).ready(function() {
    // try to automatically get user's location
    getLocation();
});