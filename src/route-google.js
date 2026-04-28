  pr.getGoogleLatLng = function(stop) {
    return new google.maps.LatLng(stop.lat, stop.lng);
  };

  pr.calculateRoute = function() {
    if (pr.state.stops.length < 2) {
      pr.showMessage('Add at least two portals to calculate a route.');
      return;
    }

    if (!window.google || !google.maps || !google.maps.DirectionsService) {
      pr.showMessage('Google Maps DirectionsService is not available in this IITC session.');
      return;
    }

    var stops = pr.state.stops;
    var origin = stops[0];
    var destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1).map(function(stop) {
      return { location: pr.getGoogleLatLng(stop), stopover: true };
    });

    var service = new google.maps.DirectionsService();
    var request = {
      origin: pr.getGoogleLatLng(origin),
      destination: pr.getGoogleLatLng(destination),
      waypoints: waypoints,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    };

    pr.setBusy(true);
    service.route(request, function(result, status) {
      pr.setBusy(false);

      if (status !== google.maps.DirectionsStatus.OK) {
        pr.showMessage('Route calculation failed: ' + status);
        return;
      }

      var route = result.routes && result.routes[0];
      if (!route) {
        pr.showMessage('Route calculation returned no route.');
        return;
      }

      var legs = route.legs.map(function(leg, index) {
        var fromStop = stops[index];
        var toStop = stops[index + 1];
        var legPath = [];

        if (leg.steps) {
          leg.steps.forEach(function(step) {
            if (step.path) {
              step.path.forEach(function(point) {
                legPath.push({ lat: point.lat(), lng: point.lng() });
              });
            }
          });
        }

        return {
          fromIndex: index,
          toIndex: index + 1,
          fromLabel: fromStop ? fromStop.title : 'Stop ' + (index + 1),
          toLabel: toStop ? toStop.title : 'Stop ' + (index + 2),
          distanceMeters: leg.distance ? leg.distance.value : 0,
          durationSeconds: leg.duration ? leg.duration.value : 0,
          distanceText: leg.distance ? leg.distance.text : '',
          durationText: leg.duration ? leg.duration.text : '',
          path: legPath
        };
      });

      var path = [];
      if (route.overview_path) {
        path = route.overview_path.map(function(point) {
          return L.latLng(point.lat(), point.lng());
        });
      }

      pr.state.route = {
        legs: legs,
        totals: pr.calculateTotals(legs),
        path: path.map(function(point) {
          return { lat: point.lat, lng: point.lng };
        })
      };
      pr.markRouteCurrent();

      pr.drawRoutePath(path);
      pr.renderPanel();
    });
  };
