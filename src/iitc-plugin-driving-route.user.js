function wrapper(plugin_info) {
  if (typeof window.plugin !== 'function') window.plugin = function() {};
  window.plugin.drivingRoute = window.plugin.drivingRoute || {};

  var dr = window.plugin.drivingRoute;
  dr.ID = 'driving-route';
  dr.NAME = 'Driving Route';
  dr.VERSION = '0.1.0-dev';

  dr.STORAGE_KEYS = {
    stops: 'iitc-driving-route-stops',
    settings: 'iitc-driving-route-settings',
    panelOpen: 'iitc-driving-route-panel-open',
    panelPosition: 'iitc-driving-route-panel-position'
  };

  dr.DEFAULT_SETTINGS = {
    defaultStopMinutes: 5,
    includeReturnToStart: false
  };
  dr.state = {
    stops: [],
    route: null,
    settings: Object.assign({}, dr.DEFAULT_SETTINGS),
    layers: {
      labels: null,
      routeLine: null
    },
    panelOpen: false,
    panelView: 'main',
    miniControl: null
  };

  dr.getEffectiveStopMinutes = function(stop) {
    if (stop && typeof stop.stopMinutes === 'number' && !Number.isNaN(stop.stopMinutes)) {
      return stop.stopMinutes;
    }
    return dr.state.settings.defaultStopMinutes;
  };
  dr.CSS = `
.driving-route-mini-control {
  margin-top: 10px;
}

.driving-route-mini-control button {
  display: block;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid #ccc;
  background: #fff;
  color: #111;
  font: bold 20px/34px Arial, sans-serif;
  text-align: center;
  cursor: pointer;
}

.driving-route-mini-control button:last-child {
  border-bottom: 0;
}

.driving-route-mini-control button:hover,
.driving-route-mini-control button:focus {
  background: #f4f4f4;
}

.driving-route-mini-control .driving-route-mini-add {
  font-size: 26px;
}

.driving-route-mini-control .driving-route-mini-remove {
  color: #c00000;
}

.driving-route-panel {
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 192px;
  width: min(520px, 100vw - 2px);
  max-height: calc(100vh - 230px);
  overflow: auto;
  background: rgba(0, 48, 64, 0.88);
  color: #f5f5f5;
  border: 2px solid #20b8c8;
  border-radius: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
  font-size: 16px;
}

.driving-route-panel * {
  box-sizing: border-box;
}

.driving-route-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-bottom: 1px solid rgba(32, 184, 200, 0.7);
  cursor: move;
}

.driving-route-header strong {
  flex: 1;
  color: #ffd800;
  font-size: 18px;
  line-height: 1.2;
  text-align: center;
}

.driving-route-window-button {
  min-width: 30px;
  min-height: 30px;
  padding: 0 6px;
  border: 2px solid #20b8c8;
  background: rgba(0, 48, 64, 0.7);
  color: #20b8c8;
  font: bold 24px/24px Arial, sans-serif;
}

.driving-route-body {
  padding: 12px 16px 14px;
}

.driving-route-body p {
  margin: 0 0 8px;
}

.driving-route-summary {
  margin-top: 8px;
}

.driving-route-setting {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 12px 0 10px;
}

.driving-route-setting input {
  width: 4.5em;
  min-height: 32px;
  padding: 4px 6px;
  border: 1px solid #aaa;
  border-radius: 3px;
  background: #fff;
  color: #111;
  font: inherit;
}

.driving-route-empty {
  margin: 8px 0 12px;
}

.driving-route-compact-list {
  margin: 8px 0 10px;
}

.driving-route-compact-list div {
  margin: 4px 0;
}

.driving-route-stops {
  list-style: none;
  margin: 0;
  padding: 0;
}

.driving-route-stop {
  margin: 8px 0;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.18);
}

.driving-route-stop-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.driving-route-stop-num,
.driving-route-stop-label span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ffd800;
  color: #111;
  font-weight: bold;
}

.driving-route-leg,
.driving-route-stop-meta {
  margin-top: 5px;
  opacity: 0.9;
}

.driving-route-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.driving-route-actions button,
.driving-route-small-button {
  min-height: 32px;
  padding: 4px 10px;
  border: 2px solid #ffd800;
  border-radius: 0;
  background: rgba(0, 48, 64, 0.75);
  color: #ffd800;
  font: inherit;
}

.driving-route-small-button:disabled {
  opacity: 0.45;
}

.driving-route-stop-actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 8px;
}

.driving-route-footer-actions {
  justify-content: flex-end;
  border-top: 1px solid rgba(32, 184, 200, 0.7);
  margin: 14px -16px -14px;
  padding: 8px 14px;
}

.driving-route-totals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 10px;
}

.driving-route-totals div {
  padding: 8px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.driving-route-totals span,
.driving-route-totals strong {
  display: block;
}

.driving-route-message {
  display: none;
  margin-top: 10px;
  padding: 8px;
  border: 1px solid #ffd800;
  background: rgba(0, 0, 0, 0.22);
}

.driving-route-message-visible {
  display: block;
}

.driving-route-busy {
  opacity: 0.82;
}

.driving-route-stop-label {
  border: 0;
  background: transparent;
}

.driving-route-portal-action {
  margin-top: 8px;
}

.driving-route-portal-action a {
  display: inline-block;
  min-height: 32px;
  padding: 4px 10px;
  border: 2px solid #ffd800;
  color: #ffd800;
}

@media (max-width: 700px) {
  .driving-route-panel {
    left: 0;
    right: auto;
    top: 192px;
    bottom: auto;
    width: calc(100vw - 2px);
    max-height: calc(100vh - 250px);
    font-size: 18px;
  }

  .driving-route-header {
    cursor: default;
  }

  .driving-route-header strong {
    font-size: 20px;
  }

  .driving-route-actions button,
  .driving-route-small-button {
    min-height: 36px;
  }
}

@media (min-width: 701px) {
  .driving-route-panel {
    width: 390px;
    max-height: calc(100vh - 220px);
    resize: both;
  }
}
`;
  dr.loadState = function() {
    try {
      var rawSettings = localStorage.getItem(dr.STORAGE_KEYS.settings);
      if (rawSettings) {
        dr.state.settings = Object.assign({}, dr.DEFAULT_SETTINGS, JSON.parse(rawSettings));
      }

      var rawStops = localStorage.getItem(dr.STORAGE_KEYS.stops);
      if (rawStops) {
        var stops = JSON.parse(rawStops);
        if (Array.isArray(stops)) dr.state.stops = stops;
      }

      var rawPanelOpen = localStorage.getItem(dr.STORAGE_KEYS.panelOpen);
      if (rawPanelOpen !== null) dr.state.panelOpen = rawPanelOpen === 'true';
    } catch (e) {
      console.warn('Driving Route: failed to load saved state', e);
    }
  };

  dr.saveSettings = function() {
    localStorage.setItem(dr.STORAGE_KEYS.settings, JSON.stringify(dr.state.settings));
  };

  dr.saveStops = function() {
    localStorage.setItem(dr.STORAGE_KEYS.stops, JSON.stringify(dr.state.stops));
  };

  dr.savePanelOpen = function() {
    localStorage.setItem(dr.STORAGE_KEYS.panelOpen, String(dr.state.panelOpen));
  };
  dr.formatDuration = function(seconds) {
    seconds = Math.max(0, Math.round(seconds || 0));
    var minutes = Math.round(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var mins = minutes % 60;

    if (hours > 0 && mins > 0) return hours + ' hr ' + mins + ' min';
    if (hours > 0) return hours + ' hr';
    return minutes + ' min';
  };

  dr.formatDistance = function(meters) {
    meters = Math.max(0, Number(meters || 0));
    var miles = meters / 1609.344;
    if (miles >= 10) return miles.toFixed(0) + ' mi';
    return miles.toFixed(1) + ' mi';
  };
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
  dr.googleMapsUrl = function() {
    var stops = dr.state.stops;
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

  dr.openGoogleMaps = function() {
    var url = dr.googleMapsUrl();
    if (!url) {
      dr.showMessage('Add at least two portals first.');
      return;
    }

    if (dr.state.stops.length > 10) {
      dr.showMessage('Google Maps may reject routes with too many stops. Try fewer than 10 stops for now.');
    }

    window.open(url, '_blank', 'noopener');
  };
  dr.getGoogleLatLng = function(stop) {
    return new google.maps.LatLng(stop.lat, stop.lng);
  };

  dr.calculateRoute = function() {
    if (dr.state.stops.length < 2) {
      dr.showMessage('Add at least two portals to calculate a route.');
      return;
    }

    if (!window.google || !google.maps || !google.maps.DirectionsService) {
      dr.showMessage('Google Maps DirectionsService is not available in this IITC session.');
      return;
    }

    var stops = dr.state.stops;
    var origin = stops[0];
    var destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1).map(function(stop) {
      return { location: dr.getGoogleLatLng(stop), stopover: true };
    });

    var service = new google.maps.DirectionsService();
    var request = {
      origin: dr.getGoogleLatLng(origin),
      destination: dr.getGoogleLatLng(destination),
      waypoints: waypoints,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    };

    dr.setBusy(true);
    service.route(request, function(result, status) {
      dr.setBusy(false);

      if (status !== google.maps.DirectionsStatus.OK) {
        dr.showMessage('Route calculation failed: ' + status);
        return;
      }

      var route = result.routes && result.routes[0];
      if (!route) {
        dr.showMessage('Route calculation returned no route.');
        return;
      }

      var legs = route.legs.map(function(leg, index) {
        var fromStop = stops[index];
        var toStop = stops[index + 1];
        return {
          fromIndex: index,
          toIndex: index + 1,
          fromLabel: fromStop ? fromStop.title : 'Stop ' + (index + 1),
          toLabel: toStop ? toStop.title : 'Stop ' + (index + 2),
          distanceMeters: leg.distance ? leg.distance.value : 0,
          durationSeconds: leg.duration ? leg.duration.value : 0,
          distanceText: leg.distance ? leg.distance.text : '',
          durationText: leg.duration ? leg.duration.text : ''
        };
      });

      var path = [];
      if (route.overview_path) {
        path = route.overview_path.map(function(point) {
          return L.latLng(point.lat(), point.lng());
        });
      }

      dr.state.route = {
        legs: legs,
        totals: dr.calculateTotals(legs)
      };

      dr.drawRoutePath(path);
      dr.renderPanel();
    });
  };
  dr.ensureLayers = function() {
    if (!dr.state.layers.labels) {
      dr.state.layers.labels = L.layerGroup().addTo(window.map);
    }
  };

  dr.clearRouteLine = function() {
    if (dr.state.layers.routeLine) {
      window.map.removeLayer(dr.state.layers.routeLine);
      dr.state.layers.routeLine = null;
    }
  };

  dr.redrawLabels = function() {
    if (!window.map || !window.L) return;
    dr.ensureLayers();
    dr.state.layers.labels.clearLayers();

    dr.state.stops.forEach(function(stop, index) {
      var icon = L.divIcon({
        className: 'driving-route-stop-label',
        html: '<span>' + (index + 1) + '</span>',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      var marker = L.marker([stop.lat, stop.lng], { icon: icon, interactive: true });
      marker.bindTooltip((index + 1) + '. ' + stop.title, { direction: 'top' });
      marker.addTo(dr.state.layers.labels);
    });
  };

  dr.drawRoutePath = function(path) {
    dr.clearRouteLine();
    if (!path || path.length < 2) return;

    dr.state.layers.routeLine = L.polyline(path, {
      color: '#ff7f00',
      weight: 5,
      opacity: 0.8
    }).addTo(window.map);

    try {
      window.map.fitBounds(dr.state.layers.routeLine.getBounds(), { padding: [30, 30] });
    } catch (e) {
      console.warn('Driving Route: unable to fit route bounds', e);
    }
  };
  dr.escapeHtml = function(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  dr.renderPanelHeader = function(title) {
    var html = '';
    html += '<div class="driving-route-header">';
    html += '<strong>' + dr.escapeHtml(title) + '</strong>';
    html += '<button class="driving-route-window-button" type="button" title="Close" data-action="close-panel">×</button>';
    html += '</div>';
    return html;
  };

  dr.renderEmptyHelp = function() {
    return '<p class="driving-route-empty">There are no waypoints defined.<br>Select a portal and add it from the Driving Route control.</p>';
  };

  dr.renderStopsList = function(legsByToIndex) {
    var stops = dr.state.stops;
    if (stops.length === 0) return dr.renderEmptyHelp();

    var html = '';
    html += '<ol class="driving-route-stops">';
    stops.forEach(function(stop, index) {
      var leg = legsByToIndex[index];
      html += '<li class="driving-route-stop" data-index="' + index + '" draggable="true">';
      html += '<div class="driving-route-stop-title"><span class="driving-route-stop-num">' + (index + 1) + '</span><span>' + dr.escapeHtml(stop.title) + '</span></div>';
      if (leg) {
        html += '<div class="driving-route-leg">Drive from previous: ' + dr.escapeHtml(leg.durationText || dr.formatDuration(leg.durationSeconds)) + ' · ' + dr.escapeHtml(leg.distanceText || dr.formatDistance(leg.distanceMeters)) + '</div>';
      }
      html += '<div class="driving-route-stop-meta">Stop: ' + dr.getEffectiveStopMinutes(stop) + ' min</div>';

      html += '<div class="driving-route-stop-actions">';
      html += '<button type="button" class="driving-route-small-button" data-action="remove-stop" data-index="' + index + '">Remove</button>';
      html += '<button type="button" class="driving-route-small-button" data-action="move-stop-up" data-index="' + index + '" ' + (index === 0 ? 'disabled' : '') + '>↑</button>';
      html += '<button type="button" class="driving-route-small-button" data-action="move-stop-down" data-index="' + index + '" ' + (index === stops.length - 1 ? 'disabled' : '') + '>↓</button>';
      html += '</div>';

      html += '</li>';
    });
    html += '</ol>';
    return html;
  };

  dr.renderTotals = function(route) {
    if (!route || !route.totals) return '';

    var html = '';
    html += '<div class="driving-route-totals">';
    html += '<div><span>Driving</span><strong>' + dr.formatDuration(route.totals.driveSeconds) + '</strong></div>';
    html += '<div><span>Stops</span><strong>' + dr.formatDuration(route.totals.stopSeconds) + '</strong></div>';
    html += '<div><span>Trip</span><strong>' + dr.formatDuration(route.totals.tripSeconds) + '</strong></div>';
    html += '<div><span>Distance</span><strong>' + dr.formatDistance(route.totals.distanceMeters) + '</strong></div>';
    html += '</div>';
    return html;
  };

  dr.renderMainPanel = function(legsByToIndex) {
    var stops = dr.state.stops;
    var html = '';

    html += dr.renderPanelHeader('Driving Route');
    html += '<div class="driving-route-body">';
    html += '<p>Mark portals as waypoints to prepare a driving route.</p>';
    html += '<p class="driving-route-summary"><b>Waypoints:</b> ' + stops.length + '</p>';

    if (stops.length === 0) {
      html += dr.renderEmptyHelp();
    } else {
      html += '<div class="driving-route-compact-list">';
      stops.forEach(function(stop, index) {
        html += '<div><span class="driving-route-stop-num">' + (index + 1) + '</span> ' + dr.escapeHtml(stop.title) + '</div>';
      });
      html += '</div>';
    }

    html += dr.renderTotals(dr.state.route);

    html += '<label class="driving-route-setting">Stop time <input type="number" min="0" max="120" step="1" value="' + dr.escapeHtml(dr.state.settings.defaultStopMinutes) + '" data-field="default-stop-minutes"> min/portal</label>';

    html += '<div class="driving-route-actions">';
    html += '<button type="button" data-action="calculate-route">Calculate</button>';
    html += '<button type="button" data-action="open-google-maps">Open Maps</button>';
    html += '<button type="button" data-action="open-edit">Edit waypoints</button>';
    html += '<button type="button" data-action="clear-route">Clear</button>';
    html += '</div>';

    html += '<div class="driving-route-message" id="driving-route-message"></div>';
    html += '</div>';
    return html;
  };

  dr.renderEditPanel = function(legsByToIndex) {
    var html = '';
    html += dr.renderPanelHeader('Driving Route - Edit waypoints');
    html += '<div class="driving-route-body">';
    html += '<p>Change order or delete waypoints:</p>';
    html += dr.renderStopsList(legsByToIndex);
    html += '<div class="driving-route-actions driving-route-footer-actions">';
    html += '<button type="button" data-action="open-main">&lt; Main menu</button>';
    html += '<button type="button" data-action="clear-route">Clear all waypoints</button>';
    html += '<button type="button" data-action="close-panel">Close</button>';
    html += '</div>';
    html += '<div class="driving-route-message" id="driving-route-message"></div>';
    html += '</div>';
    return html;
  };

  dr.renderPanel = function() {
    var panel = document.getElementById('driving-route-panel');
    if (!panel) return;

    dr.renderMiniControl();

    if (!dr.state.panelOpen) {
      panel.innerHTML = '';
      panel.style.display = 'none';
      return;
    }

    panel.style.display = '';

    var route = dr.state.route;
    var legsByToIndex = {};
    if (route && route.legs) {
      route.legs.forEach(function(leg) { legsByToIndex[leg.toIndex] = leg; });
    }

    if (dr.state.panelView === 'edit') {
      panel.innerHTML = dr.renderEditPanel(legsByToIndex);
    } else {
      panel.innerHTML = dr.renderMainPanel(legsByToIndex);
    }

    dr.enablePanelDragging(panel);
  };
  dr.portalToStop = function(guid) {
    var portal = guid && window.portals && window.portals[guid];
    if (!portal || !portal.getLatLng) return null;

    var latlng = portal.getLatLng();
    var data = portal.options && portal.options.data ? portal.options.data : {};

    return {
      guid: guid,
      title: data.title || data.name || guid,
      lat: latlng.lat,
      lng: latlng.lng
    };
  };

  dr.addSelectedPortal = function() {
    var guid = window.selectedPortal;
    var stop = dr.portalToStop(guid);
    if (!stop) {
      dr.showMessage('No selected portal found.');
      return;
    }
    dr.addStop(stop);
  };

  dr.injectPortalDetailsAction = function() {
    var container = document.querySelector('#portaldetails .linkdetails') || document.querySelector('#portaldetails');
    if (!container || container.querySelector('.driving-route-add-link')) return;

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'driving-route-add-link';
    link.textContent = 'Add to Driving Route';
    link.addEventListener('click', function(ev) {
      ev.preventDefault();
      dr.addSelectedPortal();
    });

    var wrapper = document.createElement('div');
    wrapper.className = 'driving-route-portal-action';
    wrapper.appendChild(link);
    container.appendChild(wrapper);
  };
  dr.setBusy = function(isBusy) {
    var panel = document.getElementById('driving-route-panel');
    if (panel) panel.classList.toggle('driving-route-busy', !!isBusy);
  };

  dr.showMessage = function(message) {
    var node = document.getElementById('driving-route-message');
    if (node) {
      node.textContent = message;
      node.classList.add('driving-route-message-visible');
      window.setTimeout(function() {
        node.classList.remove('driving-route-message-visible');
      }, 5000);
    } else {
      console.log('Driving Route:', message);
    }
  };

  dr.isDesktopLayout = function() {
    try {
      return typeof window.matchMedia === 'function' &&
        window.matchMedia('(min-width: 701px)').matches;
    } catch (e) {
      return false;
    }
  };

  dr.selectedStopIndex = function() {
    var guid = window.selectedPortal;
    if (!guid) return -1;
    for (var i = 0; i < dr.state.stops.length; i++) {
      if (dr.state.stops[i].guid === guid) return i;
    }
    return -1;
  };

  dr.removeSelectedPortal = function() {
    var index = dr.selectedStopIndex();
    if (index < 0) {
      dr.showMessage('Selected portal is not in the route.');
      return;
    }
    dr.removeStop(index);
  };

  dr.toggleSelectedPortalStop = function() {
    if (dr.selectedStopIndex() >= 0) {
      dr.removeSelectedPortal();
    } else {
      dr.addSelectedPortal();
    }
  };

  dr.enablePanelDragging = function(panel) {
    var header = panel.querySelector('.driving-route-header');
    if (!header) return;
    if (header.dataset.dragEnabled === 'true') return;

    header.dataset.dragEnabled = 'true';

    var dragging = false;
    var startX = 0;
    var startY = 0;
    var startLeft = 0;
    var startTop = 0;

    header.addEventListener('mousedown', function(ev) {
      if (!dr.isDesktopLayout()) return;
      if (ev.target.closest('button, a, input, select, textarea')) return;

      dragging = true;
      startX = ev.clientX;
      startY = ev.clientY;

      var rect = panel.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;

      panel.style.left = startLeft + 'px';
      panel.style.top = startTop + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';

      ev.preventDefault();
    });

    window.addEventListener('mousemove', function(ev) {
      if (!dragging) return;

      var newLeft = startLeft + ev.clientX - startX;
      var newTop = startTop + ev.clientY - startY;

      newLeft = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, newLeft));
      newTop = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, newTop));

      panel.style.left = newLeft + 'px';
      panel.style.top = newTop + 'px';
    });

    window.addEventListener('mouseup', function() {
      if (!dragging) return;
      dragging = false;
      dr.savePanelPosition(panel);
    });
  };

  dr.handleAction = function(action, target) {
    if (action === 'open-main') {
      dr.state.panelView = 'main';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    } else if (action === 'open-edit') {
      dr.state.panelView = 'edit';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    } else if (action === 'close-panel') {
      dr.state.panelOpen = false;
      dr.savePanelOpen();
      dr.renderPanel();
    } else if (action === 'toggle-selected-stop') {
      dr.toggleSelectedPortalStop();
    } else if (action === 'move-stop-up') {
      dr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) - 1);
    } else if (action === 'move-stop-down') {
      dr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) + 1);
    } else if (action === 'remove-stop') {
      dr.removeStop(Number(target.getAttribute('data-index')));
    } else if (action === 'calculate-route') {
      dr.calculateRoute();
    } else if (action === 'open-google-maps') {
      dr.openGoogleMaps();
    } else if (action === 'clear-route') {
      dr.clearStops();
    }
  };

  dr.createMiniControl = function() {
    if (!window.L || !window.map) return;
    if (dr.state.miniControl) return;

    var DrivingRouteControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function() {
        var container = L.DomUtil.create('div', 'leaflet-bar driving-route-mini-control');
        container.id = 'driving-route-mini-control';
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        container.addEventListener('click', function(ev) {
          var button = ev.target.closest('button[data-action]');
          if (!button) return;
          ev.preventDefault();
          dr.handleAction(button.getAttribute('data-action'), button);
        });
        return container;
      }
    });

    dr.state.miniControl = new DrivingRouteControl();
    window.map.addControl(dr.state.miniControl);
  };

  dr.renderMiniControl = function() {
    var container = document.getElementById('driving-route-mini-control');
    if (!container) return;

    var selectedIndex = dr.selectedStopIndex();
    var selectedInRoute = selectedIndex >= 0;
    var addRemoveClass = selectedInRoute ? ' driving-route-mini-remove' : '';
    var addRemoveText = selectedInRoute ? '−' : '+';
    var addRemoveTitle = selectedInRoute ? 'Remove selected portal from route' : 'Add selected portal to route';

    container.innerHTML = '' +
      '<button type="button" title="Open route in Google Maps" data-action="open-google-maps">🗺</button>' +
      '<button type="button" class="driving-route-mini-add' + addRemoveClass + '" title="' + addRemoveTitle + '" data-action="toggle-selected-stop">' + addRemoveText + '</button>' +
      '<button type="button" title="Edit waypoints" data-action="open-edit">' + dr.state.stops.length + '</button>' +
      '<button type="button" title="Driving Route menu" data-action="open-main">☰</button>';
  };

  dr.createPanel = function() {
    if (document.getElementById('driving-route-panel')) return;

    var panel = document.createElement('div');
    panel.id = 'driving-route-panel';
    panel.className = 'driving-route-panel';
    document.body.appendChild(panel);

    if (dr.isDesktopLayout()) {
      dr.restorePanelPosition(panel);
    }
    panel.addEventListener('click', function(ev) {
      var target = ev.target.closest('[data-action]');
      var action = target && target.getAttribute('data-action');
      if (!action) return;
      ev.preventDefault();
      dr.handleAction(action, target);
    });

    panel.addEventListener('dragstart', function(ev) {
      if (!dr.isDesktopLayout()) return;

      var item = ev.target.closest('.driving-route-stop');
      if (!item) return;

      dr.state.dragStopIndex = Number(item.getAttribute('data-index'));
      ev.dataTransfer.effectAllowed = 'move';
      item.classList.add('driving-route-dragging');
    });

    panel.addEventListener('dragend', function(ev) {
      var item = ev.target.closest('.driving-route-stop');
      if (item) item.classList.remove('driving-route-dragging');
      dr.state.dragStopIndex = null;
    });

    panel.addEventListener('dragover', function(ev) {
      if (!dr.isDesktopLayout()) return;

      var item = ev.target.closest('.driving-route-stop');
      if (!item) return;

      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
    });

    panel.addEventListener('drop', function(ev) {
      if (!dr.isDesktopLayout()) return;

      var item = ev.target.closest('.driving-route-stop');
      if (!item) return;

      ev.preventDefault();

      var fromIndex = dr.state.dragStopIndex;
      var toIndex = Number(item.getAttribute('data-index'));
      dr.state.dragStopIndex = null;

      dr.moveStop(fromIndex, toIndex);
    });

    panel.addEventListener('change', function(ev) {
      var target = ev.target;
      if (target && target.getAttribute('data-field') === 'default-stop-minutes') {
        var value = Math.max(0, Number(target.value || 0));
        dr.state.settings.defaultStopMinutes = value;
        dr.saveSettings();
        if (dr.state.route && dr.state.route.legs) {
          dr.state.route.totals = dr.calculateTotals(dr.state.route.legs);
        }
        dr.renderPanel();
      }
    });
  };

  dr.addToolboxLink = function() {
    if (!document.getElementById('toolbox')) return;
    if (document.getElementById('driving-route-toolbox-link')) return;

    var link = document.createElement('a');
    link.id = 'driving-route-toolbox-link';
    link.href = '#';
    link.textContent = 'Driving Route';
    link.addEventListener('click', function(ev) {
      ev.preventDefault();
      dr.state.panelView = 'main';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    });

    var toolbox = document.getElementById('toolbox');
    toolbox.appendChild(link);
  };

  dr.injectCss = function() {
    if (document.getElementById('driving-route-css')) return;
    var style = document.createElement('style');
    style.id = 'driving-route-css';
    style.textContent = dr.CSS;
    document.head.appendChild(style);
  };

  dr.setup = function() {
    try {
      dr.injectCss();
      dr.loadState();
      dr.createPanel();
      dr.createMiniControl();
      dr.addToolboxLink();
      dr.renderPanel();
      dr.renderMiniControl();
      dr.redrawLabels();

      if (typeof window.addHook === 'function' && !dr.portalHookRegistered) {
        window.addHook('portalDetailsUpdated', function() {
          dr.injectPortalDetailsAction();
          dr.renderMiniControl();
        });
        dr.portalHookRegistered = true;
      }

      console.log('Driving Route setup complete');
    } catch (e) {
      console.error('Driving Route setup failed:', e);
    }
  };

  dr.savePanelPosition = function(panel) {
    if (!panel || !dr.isDesktopLayout()) return;

    var rect = panel.getBoundingClientRect();
    localStorage.setItem(dr.STORAGE_KEYS.panelPosition, JSON.stringify({
      left: Math.round(rect.left),
      top: Math.round(rect.top)
    }));
  };

  dr.restorePanelPosition = function(panel) {
    if (!panel || !dr.isDesktopLayout()) return;

    try {
      var raw = localStorage.getItem(dr.STORAGE_KEYS.panelPosition);
      if (!raw) return;

      var pos = JSON.parse(raw);
      if (typeof pos.left !== 'number' || typeof pos.top !== 'number') return;

      panel.style.left = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, pos.left)) + 'px';
      panel.style.top = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, pos.top)) + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    } catch (e) {
      console.warn('Driving Route: failed to restore panel position', e);
    }
  };

  var setup = dr.setup;

  setup.info = plugin_info;
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  if (window.iitcLoaded && typeof setup === 'function') setup();
}

var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
