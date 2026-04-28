  pr.routeOverlayTarget = function() {
    if (pr.layerGroup) return pr.layerGroup;
    return window.map;
  };

  pr.ensureLayers = function() {
    var target = pr.routeOverlayTarget();

    if (!pr.state.layers.labels) {
      pr.state.layers.labels = L.layerGroup().addTo(target);
    }

    if (!pr.state.layers.segmentLabels) {
      pr.state.layers.segmentLabels = L.layerGroup().addTo(target);
    }
  };

  pr.clearLabels = function() {
    if (pr.state.layers.labels) {
      pr.state.layers.labels.clearLayers();
    }
  };

  pr.clearSegmentTimeLabels = function() {
    if (pr.state.layers.segmentLabels) {
      pr.state.layers.segmentLabels.clearLayers();
    }
  };

  pr.clearRouteLine = function() {
    if (pr.state.layers.routeLine) {
      var owner = pr.routeOverlayTarget();
      if (owner && owner.hasLayer && owner.hasLayer(pr.state.layers.routeLine)) {
        owner.removeLayer(pr.state.layers.routeLine);
      } else if (window.map && window.map.hasLayer && window.map.hasLayer(pr.state.layers.routeLine)) {
        window.map.removeLayer(pr.state.layers.routeLine);
      }
      pr.state.layers.routeLine = null;
    }

    pr.clearSegmentTimeLabels();
  };

  pr.redrawLabels = function() {
    if (!window.map || !window.L) return;
    pr.ensureLayers();
    pr.clearLabels();

    pr.state.stops.forEach(function(stop, index) {
      var icon = L.divIcon({
        className: 'portal-route-stop-label',
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
        className: 'portal-route-stop-tooltip'
      });

      marker.addTo(pr.state.layers.labels);
    });
  };

  pr.toLatLng = function(point) {
    if (!point) return null;
    if (point.lat && typeof point.lat === 'function' && point.lng && typeof point.lng === 'function') {
      return L.latLng(point.lat(), point.lng());
    }
    if (typeof point.lat === 'number' && typeof point.lng === 'number') {
      return L.latLng(point.lat, point.lng);
    }
    return null;
  };

  pr.getPathMidpoint = function(path) {
    if (!path || path.length === 0) return null;

    var points = path.map(pr.toLatLng).filter(Boolean);
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

  pr.getLegLabelLatLng = function(leg) {
    var midpoint = pr.getPathMidpoint(leg && leg.path);
    if (midpoint) return midpoint;

    var fromStop = pr.state.stops[leg.fromIndex];
    var toStop = pr.state.stops[leg.toIndex];
    if (!fromStop || !toStop) return null;

    return L.latLng(
      (fromStop.lat + toStop.lat) / 2,
      (fromStop.lng + toStop.lng) / 2
    );
  };

  pr.redrawSegmentTimeLabels = function() {
    if (!window.map || !window.L) return;
    pr.ensureLayers();
    pr.clearSegmentTimeLabels();

    if (!pr.state.settings.showSegmentTimesOnMap) return;
    if (!pr.state.route || !Array.isArray(pr.state.route.legs)) return;

    pr.state.route.legs.forEach(function(leg) {
      var latLng = pr.getLegLabelLatLng(leg);
      if (!latLng) return;

      var text = leg.durationText || pr.formatDuration(leg.durationSeconds);
      var icon = L.divIcon({
        className: 'portal-route-segment-time-label',
        html: '<span>' + pr.escapeHtml(text) + '</span>',
        iconSize: null,
        iconAnchor: [16, 8]
      });

      L.marker(latLng, {
        icon: icon,
        interactive: false,
        keyboard: false,
        bubblingMouseEvents: false
      }).addTo(pr.state.layers.segmentLabels);
    });
  };

  pr.drawRoutePath = function(path, options) {
    options = options || {};
    pr.clearRouteLine();
    if (!path || path.length < 2) return;

    pr.state.layers.routeLine = L.polyline(path, {
      color: '#ff7f00',
      weight: 5,
      opacity: 0.8,
      interactive: false,
      bubblingMouseEvents: false
    }).addTo(pr.routeOverlayTarget());

    pr.redrawSegmentTimeLabels();

    if (options.fitBounds === false) return;

    try {
      window.map.fitBounds(pr.state.layers.routeLine.getBounds(), { padding: [30, 30] });
    } catch (e) {
      console.warn('Portal Route: unable to fit route bounds', e);
    }
  };

  pr.redrawRouteLine = function() {
    if (!window.map || !window.L) return;
    if (!pr.state.route || !Array.isArray(pr.state.route.path)) return;

    var path = pr.state.route.path.map(function(point) {
      return L.latLng(point.lat, point.lng);
    });

    pr.drawRoutePath(path, { fitBounds: false });
  };
