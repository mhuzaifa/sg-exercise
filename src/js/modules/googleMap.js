
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 13,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(51.512489, -0.127120),
        // N12 Upper St. Martin’s Lane WC2H 9FB, London

        // How you would like to style the map.
        // This is where you would paste any style found on Snazzy Maps.
        styles:
        [
          {
              "featureType": "all",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "lightness": "-100"
                  },
                  {
                      "color": "#ffdac9"
                  }
              ]
          },
          {
              "featureType": "poi",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "visibility": "on"
                  },
                  {
                      "color": "#ffcab1"
                  }
              ]
          },
          {
              "featureType": "poi",
              "elementType": "labels",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.park",
              "elementType": "geometry.fill",
              "stylers": [
                  {
                      "color": "#ffcab1"
                  }
              ]
          },
          {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                  {
                      "lightness": 100
                  },
                  {
                      "visibility": "simplified"
                  }
              ]
          },
          {
              "featureType": "road",
              "elementType": "labels",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [
                  {
                      "visibility": "on"
                  },
                  {
                      "lightness": 700
                  }
              ]
          },
          {
              "featureType": "water",
              "elementType": "all",
              "stylers": [
                  {
                      "color": "#92e1dd"
                  }
              ]
          }
      ]
    };

    // Get the HTML DOM element that will contain your map
    // We are using a div with id="map" seen below in the <body>
    var mapElement = document.getElementById('map');

    // Create the Google Map using our element and options defined above
    var map = new google.maps.Map(mapElement, mapOptions);
    var iconBase = 'https://huzaifa.me/sg-test/assets/images/';

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(51.512489, -0.127120),
        map: map,
        icon: iconBase + 'location-icon.svg',
        title: '12 Upper St. Martin’s Lane WC2H 9FB, London'
    });
}