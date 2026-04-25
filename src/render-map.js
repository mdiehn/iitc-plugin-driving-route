  dr.routeOverlayTarget = function() {
    if (dr.layerGroup) return dr.layerGroup;
    return window.map;
  };

  dr.ensureLayers = function() {
    if (!dr.state.layers.labels) {
      dr.state.layers.labels = L.layerGroup().addTo(dr.routeOverlayTarget());
    }
  };

  dr.clearLabels = function() {
    if (dr.state.layers.labels) {
      dr.state.layers.labels.clearLayers();
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

  dr.drawRoutePath = function(path) {
    dr.clearRouteLine();
    if (!path || path.length < 2) return;

    dr.state.layers.routeLine = L.polyline(path, {
      color: '#ff7f00',
      weight: 5,
      opacity: 0.8,
      interactive: false,
      bubblingMouseEvents: false
    }).addTo(dr.routeOverlayTarget());

    try {
      window.map.fitBounds(dr.state.layers.routeLine.getBounds(), { padding: [30, 30] });
    } catch (e) {
      console.warn('Driving Route: unable to fit route bounds', e);
    }
  };
