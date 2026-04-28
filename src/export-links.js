  pr.GOOGLE_MAPS_TOTAL_POINT_LIMIT = 11;
  pr.GOOGLE_MAPS_INTERMEDIATE_STOP_LIMIT = 9;

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

  pr.googleMapsOmittedStops = function() {
    var stops = pr.state.stops || [];
    if (stops.length <= pr.GOOGLE_MAPS_TOTAL_POINT_LIMIT) return [];

    // Google Maps appears to honor origin, destination, and the first 9
    // intermediate stops. The stops after that, before the final destination,
    // are the ones most likely to be omitted.
    return stops.slice(
      pr.GOOGLE_MAPS_INTERMEDIATE_STOP_LIMIT + 1,
      stops.length - 1
    );
  };

  pr.googleMapsExportWarning = function() {
    var omitted = pr.googleMapsOmittedStops();
    if (omitted.length === 0) return null;

    var lines = [
      'Google Maps appears to support only 11 total route points:',
      'start, final destination, and 9 intermediate stops.',
      '',
      'This route has ' + pr.state.stops.length + ' points. These stops may be omitted by Google Maps:'
    ];

    omitted.forEach(function(stop, index) {
      var stopNumber = pr.GOOGLE_MAPS_INTERMEDIATE_STOP_LIMIT + 2 + index;
      lines.push(stopNumber + '. ' + stop.title);
    });

    lines.push('');
    lines.push('Open Google Maps anyway?');

    return lines.join('\n');
  };

  pr.openGoogleMaps = function() {
    var url = pr.googleMapsUrl();
    if (!url) {
      pr.showMessage('Add at least two portals first.');
      return;
    }

    var warning = pr.googleMapsExportWarning();
    if (warning && !window.confirm(warning)) {
      pr.showMessage('Google Maps export canceled.');
      return;
    }

    window.open(url, '_blank', 'noopener');
  };
