function getLocation() {
    /*
    Attempts to get the user's current location. If successful a geolocation object is retrieved.
    */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeather, showGeoLocError);
    } else {
        alert('Geolocation is not supported.');
    }
    // clear the input box
    $('#weatherLocation').val('');

    // set up loading animations
    $('#weather-icon').removeClass().addClass('fa fa-refresh fa-spin');
    $('#temp-val').css('visibility', 'hidden');
    $('#city-name').css('visibility', 'hidden');
    $('#weather-desc').text('Loading weather...');
}

function getWeather(geoLocObj=null, coordsObj=null) {
    /*
    Attempts to get the weather for a specified location using coordinates.
    Uses's FreeCodeCamp's weather API.
    */

    // grab coords based based on how user location
    var lat = null;
    var lon = null;
    if (geoLocObj) {
        // user's location was determined from browser
        lat = geoLocObj.coords.latitude;
        lon = geoLocObj.coords.longitude;
    } else {
        // user searched for a location
        lat = coordsObj.latitude;
        lon = coordsObj.longitude;
    }
    console.log('Lat: ' + lat + ' Long: ' + lon); 

    // perform API request
    $.getJSON('https://api.openweathermap.org/data/2.5/weather?', {
        lat: lat,
        lon: lon,
        appid: '42326343c1a85d6f6f0a2d0f78675b7c'
    })
    .done(function(data) {
        updatePage(data);
    })
    .fail(function() {
        console.log('Error retrieving weather.');
    });    
}

function updatePage(data) {
    /*
    Updates the page with the new information.
    */
    // set the icon class based off API
    var icon = data.weather[0].icon;
    var wiIcon = null;
    switch(icon) {
        case '01d':
            wiIcon = 'wi-day-sunny';
            break;
        case '01n':
            wiIcon = 'wi-night-clear';
            break;
        case '02d':
            wiIcon = 'wi-day-cloudy';
            break;
        case '02n':
            wiIcon = 'wi-night-cloudy';
            break;
        case '03d':
            wiIcon = 'wi-cloud';
            break;
        case '03n':
            wiIcon = 'wi-cloud';
            break;
        case '04d':
            wiIcon = 'wi-cloudy';
            break;
        case '04n':
            wiIcon = 'wi-cloudy';
            break;
        case '09d':
            wiIcon = 'wi-showers';
            break;
        case '09n':
            wiIcon = 'wi-showers';
            break;
        case '10d':
            wiIcon = 'wi-day-rain';
            break;
        case '10n':
            wiIcon = 'wi-night-rain';
            break;
        case '11d':
            wiIcon = 'wi-thunderstorm';
            break;
        case '11n':
            wiIcon = 'wi-thunderstorm';
            break;
        case '13d':
            wiIcon = 'wi-snow';
            break;
        case '13n':
            wiIcon = 'wi-snow';
            break;
        case '50d':
            wiIcon = 'wi-dust';
            break;
        case '50n':
            wiIcon = 'wi-dust';
            break;
        default:
            wiIcon = 'wi-day-sunny';
    }
    // change the icon by altering the element's class
    $('#weather-icon').removeClass().addClass('wi ' + wiIcon);

    // update temp value (have to convert from Kelvin)
    var temp = Math.round(data.main.temp * (9/5) - 459.67);
    $('#temp-val').html(temp + '&#8457;').css('visibility', 'visible');

    // update weather description
    $('#weather-desc').text(data.weather[0].main);

    // update location
    $('#city-name').text(data.name + ', ' + data.sys.country).css('visibility', 'visible');
}

function showGeoLocError(error) {
    /*
    Outputs errors that occurred during getting location. Doesn't report on user choosing to block.
    */
    switch(error.code) {
        case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
        alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
        alert("An unknown error occurred getting your location.");
            break;
    }
}

function setUpAutocomplete() {
    /*
    Attaches even handlers so that the location search will autocomplete results.
    Uses Google Places API
    */
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('weatherLocation'));

    // event listener for when a place is selected by user
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // place wasn't supported or couldn't be found
            alert("Could not find that location.");
            return;
        }
        coordsObj = {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng()
        };
        // get the weather for that place
        getWeather(null, coordsObj);
    });
}

// document is ready
$(document).ready(function() {
    // set up the autocomplete stuff
    setUpAutocomplete();

    // set up click binding for location button
    $('#getLocation').click(function() {
        getLocation();
    });

    // try to automatically get user's location
    getLocation();
});