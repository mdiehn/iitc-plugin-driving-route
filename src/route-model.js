  dr.addStop = function(stop) {
    if (!stop || typeof stop.lat !== 'number' || typeof stop.lng !== 'number') return;

    if (stop.guid && dr.state.stops.some(function(existing) { return existing.guid === stop.guid; })) {
      dr.showMessage('Already in route: ' + stop.title);
      return;
    }

    dr.state.stops.push({
      guid: stop.guid || null,
      title: stop.title || 'Unnamed portal',
      lat: stop.lat,
      lng: stop.lng,
      stopMinutes: null
    });

    dr.state.route = null;
    dr.saveStops();
    dr.redrawLabels();
    dr.renderPanel();
  };

  dr.removeStop = function(index) {
    if (index < 0 || index >= dr.state.stops.length) return;
    dr.state.stops.splice(index, 1);
    dr.state.route = null;
    dr.saveStops();
    dr.clearRouteLine();
    dr.redrawLabels();
    dr.renderPanel();
  };

  dr.clearStops = function() {
    dr.state.stops = [];
    dr.state.route = null;
    dr.saveStops();
    dr.clearRouteLine();
    dr.redrawLabels();
    dr.renderPanel();
  };

  dr.moveStop = function(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= dr.state.stops.length) return;
    if (toIndex < 0 || toIndex >= dr.state.stops.length) return;
    if (fromIndex === toIndex) return;

    var item = dr.state.stops.splice(fromIndex, 1)[0];
    dr.state.stops.splice(toIndex, 0, item);

    dr.state.route = null;
    dr.saveStops();
    dr.clearRouteLine();
    dr.redrawLabels();
    dr.renderPanel();
  };



  dr.setStopMinutes = function(index, minutes) {
    if (index < 0 || index >= dr.state.stops.length) return;
    if (typeof minutes !== 'number' || !isFinite(minutes) || minutes < 0) return;

    dr.state.stops[index].stopMinutes = Math.round(minutes);

    if (dr.state.route && dr.state.route.legs) {
      dr.state.route.totals = dr.calculateTotals(dr.state.route.legs);
    }

    dr.saveStops();
    dr.renderPanel();
  };

  dr.parseDurationMinutes = function(text) {
    var match = String(text == null ? '' : text).trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([mhd]?)$/);
    if (!match) return null;

    var value = Number(match[1]);
    var unit = match[2] || 'm';

    if (!isFinite(value) || value < 0) return null;

    if (unit === 'm') return Math.round(value);
    if (unit === 'h') return Math.round(value * 60);
    if (unit === 'd') return Math.round(value * 24 * 60);

    return null;
  };

  dr.formatDurationInput = function(minutes) {
    minutes = Math.max(0, Math.round(Number(minutes || 0)));

    if (minutes && minutes % 1440 === 0) return (minutes / 1440) + 'd';
    if (minutes && minutes % 60 === 0) return (minutes / 60) + 'h';
    return minutes + 'm';
  };

  dr.selectStopPortal = function(index, center) {
    var stop = dr.state.stops[index];
    if (!stop || !stop.guid) return;

    var portal = window.portals && window.portals[stop.guid];
    if (center && portal && portal.getLatLng && window.map) {
      window.map.setView(portal.getLatLng(), window.map.getZoom());
    }

    if (typeof window.renderPortalDetails === 'function') {
      window.renderPortalDetails(stop.guid);
    } else {
      window.selectedPortal = stop.guid;
    }

    dr.renderMiniControl();
  };


  dr.calculateTotals = function(legs) {
    var driveSeconds = 0;
    var distanceMeters = 0;

    legs.forEach(function(leg) {
      driveSeconds += leg.durationSeconds || 0;
      distanceMeters += leg.distanceMeters || 0;
    });

    var stopSeconds = dr.state.stops.reduce(function(sum, stop) {
      return sum + dr.getEffectiveStopMinutes(stop) * 60;
    }, 0);

    return {
      driveSeconds: driveSeconds,
      stopSeconds: stopSeconds,
      tripSeconds: driveSeconds + stopSeconds,
      distanceMeters: distanceMeters
    };
  };
