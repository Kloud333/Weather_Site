function firstToUpperCase(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

var styleArray = [{"featureType": "all","elementType": "all","stylers": [{"invert_lightness": true},{"saturation": 10},{"lightness": 30},{"gamma": 0.5},{"hue": "#435158"}]}];

// Google Map Function
function initMap() {
    var myLatlng = new google.maps.LatLng(49.84, 24.03);
    var mapOptions = {
        zoom: 6,
        center: myLatlng,
        styles: styleArray
    }
    var map = new google.maps.Map($('#map')[0], mapOptions);
    var marker = new google.maps.Marker({});

    createMarker(myLatlng);
    
    // Generate Link
    var url = "http://api.openweathermap.org/data/2.5/weather?q=Lviv&units=metric&APPID=6e8e91d7804cea8ad60bdd79bdcc87ed";
    data(url);

    // Event for Dutton Search
    $('.searchButton').on('click', function () {
        var inputCityName = $('.inputCityName').val();
        var url = "http://api.openweathermap.org/data/2.5/weather?q=" + inputCityName + "&units=metric&APPID=6e8e91d7804cea8ad60bdd79bdcc87ed";
        data(url);
        searchAddress(inputCityName);
    });

    // Load JSON
    function data(url) {
        $.getJSON(url, function (data) {
            $('.cityName').text(data.name + " - " + data.sys.country);
            $('.weather').text(data.weather[0].main);
            $('.temp').text(data.main.temp + "°");
            $('.tempMinMax').text("Min: " + data.main.temp_min + "° / Max: " + data.main.temp_max + "°");
            $(".weatherIcon").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
            $('.description').text(firstToUpperCase(data.weather[0].description));
            $('.wind').text(data.wind.speed + " mph");
            $('.humidity').text(data.main.humidity + " %");
            $('.pressure').text(data.main.pressure + " Pa");
        }).fail(function () {
            alert("Can't load Data.");
        });
    }
    // Search city Location Function
    function searchAddress(addressInput) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: addressInput}, function (results, status) {
            var myResult = results[0].geometry.location;
            createMarker(myResult);
            map.setCenter(myResult);
            map.setZoom(6);
        });
    }
    // Create Marker Function
    function createMarker(latlng) {
        if (marker != undefined && marker != '') {
            marker.setMap(null);
            marker = '';
        }
        marker = new google.maps.Marker({
            map: map,
            position: latlng,
            draggable: true,
            title: "Drag me!"
        });
        // Event for Google Marker
        $('#map').mouseup('marker', function () {
            var lat = marker.getPosition().lat().toFixed(2);
            var lng = marker.getPosition().lng().toFixed(2);
            var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=metric&APPID=6e8e91d7804cea8ad60bdd79bdcc87ed";
            data(url);
        });
    }

}