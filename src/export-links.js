  pr.googleMapsUrl = function() {
    var stops = pr.state.stops;
    if (stops.length < 2) return null;

    var origin = stops[0];
    var destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1);

    var params = new URLSearchParams();
    params.set('api', '1');
    params.set('travelmode', 'driving');
    params.set('origin', origin.lat + ',' + origin.lng);
    params.set('destination', destination.lat + ',' + destination.lng);

    if (waypoints.length > 0) {
      params.set('waypoints', waypoints.map(function(stop) {
        return stop.lat + ',' + stop.lng;
      }).join('|'));
    }

    return 'https://www.google.com/maps/dir/?' + params.toString();
  };

  pr.openGoogleMaps = function() {
    var url = pr.googleMapsUrl();
    if (!url) {
      pr.showMessage('Add at least two portals first.');
      return;
    }

    if (pr.state.stops.length > 10) {
      pr.showMessage('Google Maps may reject routes with too many stops. Try fewer than 10 stops for now.');
    }

    window.open(url, '_blank', 'noopener');
  };
