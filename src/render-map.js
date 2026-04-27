  dr.routeOverlayTarget = function() {
    if (dr.layerGroup) return dr.layerGroup;
    return window.map;
  };

  dr.ensureLayers = function() {
    var target = dr.routeOverlayTarget();

    if (!dr.state.layers.labels) {
      dr.state.layers.labels = L.layerGroup().addTo(target);
    }

    if (!dr.state.layers.segmentLabels) {
      dr.state.layers.segmentLabels = L.layerGroup().addTo(target);
    }
  };

  dr.clearLabels = function() {
    if (dr.state.layers.labels) {
      dr.state.layers.labels.clearLayers();
    }
  };

  dr.clearSegmentTimeLabels = function() {
    if (dr.state.layers.segmentLabels) {
      dr.state.layers.segmentLabels.clearLayers();
    }
  };

  dr.clearRouteLine = function() {
    if (dr.state.layers.routeLine) {
      var owner = dr.routeOverlayTarget();
      if (owner && owner.hasLayer && owner.hasLayer(dr.state.layers.routeLine)) {
        owner.removeLayer(dr.state.layers.routeLine);
      } else if (window.map && window.map.hasLayer && window.map.hasLayer(dr.state.layers.routeLine)) {
        window.map.removeLayer(dr.state.layers.routeLine);
      }
      dr.state.layers.routeLine = null;
    }

    dr.clearSegmentTimeLabels();
  };

  dr.redrawLabels = function() {
    if (!window.map || !window.L) return;
    dr.ensureLayers();
    dr.clearLabels();

    dr.state.stops.forEach(function(stop, index) {
      var icon = L.divIcon({
        className: 'driving-route-stop-label',
        html: '<span>' + (index + 1) + '</span>',
        iconSize: [18, 18],
        iconAnchor: [0, 24]
      });

      var marker = L.marker([stop.lat, stop.lng], {
        icon: icon,
        interactive: true,
        keyboard: false,
        bubblingMouseEvents: false
      });

      marker.bindTooltip((index + 1) + '. ' + stop.title, {
        direction: 'right',
        offset: [16, -10],
        opacity: 0.9,
        interactive: false,
        className: 'driving-route-stop-tooltip'
      });

      marker.addTo(dr.state.layers.labels);
    });
  };

  dr.toLatLng = function(point) {
    if (!point) return null;
    if (point.lat && typeof point.lat === 'function' && point.lng && typeof point.lng === 'function') {
      return L.latLng(point.lat(), point.lng());
    }
    if (typeof point.lat === 'number' && typeof point.lng === 'number') {
      return L.latLng(point.lat, point.lng);
    }
    return null;
  };

  dr.getPathMidpoint = function(path) {
    if (!path || path.length === 0) return null;

    var points = path.map(dr.toLatLng).filter(Boolean);
    if (points.length === 0) return null;
    if (points.length === 1) return points[0];

    var total = 0;
    for (var i = 1; i < points.length; i++) {
      total += points[i - 1].distanceTo(points[i]);
    }

    if (!total) return points[Math.floor(points.length / 2)];

    var halfway = total / 2;
    var walked = 0;

    for (var j = 1; j < points.length; j++) {
      var from = points[j - 1];
      var to = points[j];
      var segment = from.distanceTo(to);

      if (walked + segment >= halfway) {
        var ratio = segment ? (halfway - walked) / segment : 0;
        return L.latLng(
          from.lat + (to.lat - from.lat) * ratio,
          from.lng + (to.lng - from.lng) * ratio
        );
      }

      walked += segment;
    }

    return points[Math.floor(points.length / 2)];
  };

  dr.getLegLabelLatLng = function(leg) {
    var midpoint = dr.getPathMidpoint(leg && leg.path);
    if (midpoint) return midpoint;

    var fromStop = dr.state.stops[leg.fromIndex];
    var toStop = dr.state.stops[leg.toIndex];
    if (!fromStop || !toStop) return null;

    return L.latLng(
      (fromStop.lat + toStop.lat) / 2,
      (fromStop.lng + toStop.lng) / 2
    );
  };

  dr.redrawSegmentTimeLabels = function() {
    if (!window.map || !window.L) return;
    dr.ensureLayers();
    dr.clearSegmentTimeLabels();

    if (!dr.state.settings.showSegmentTimesOnMap) return;
    if (!dr.state.route || !Array.isArray(dr.state.route.legs)) return;

    dr.state.route.legs.forEach(function(leg) {
      var latLng = dr.getLegLabelLatLng(leg);
      if (!latLng) return;

      var text = leg.durationText || dr.formatDuration(leg.durationSeconds);
      var icon = L.divIcon({
        className: 'driving-route-segment-time-label',
        html: '<span>' + dr.escapeHtml(text) + '</span>',
        iconSize: null,
        iconAnchor: [16, 8]
      });

      L.marker(latLng, {
        icon: icon,
        interactive: false,
        keyboard: false,
        bubblingMouseEvents: false
      }).addTo(dr.state.layers.segmentLabels);
    });
  };

  dr.drawRoutePath = function(path, options) {
    options = options || {};
    dr.clearRouteLine();
    if (!path || path.length < 2) return;

    dr.state.layers.routeLine = L.polyline(path, {
      color: '#ff7f00',
      weight: 5,
      opacity: 0.8,
      interactive: false,
      bubblingMouseEvents: false
    }).addTo(dr.routeOverlayTarget());

    dr.redrawSegmentTimeLabels();

    if (options.fitBounds === false) return;

    try {
      window.map.fitBounds(dr.state.layers.routeLine.getBounds(), { padding: [30, 30] });
    } catch (e) {
      console.warn('Driving Route: unable to fit route bounds', e);
    }
  };

  dr.redrawRouteLine = function() {
    if (!window.map || !window.L) return;
    if (!dr.state.route || !Array.isArray(dr.state.route.path)) return;

    var path = dr.state.route.path.map(function(point) {
      return L.latLng(point.lat, point.lng);
    });

    dr.drawRoutePath(path, { fitBounds: false });
  };
