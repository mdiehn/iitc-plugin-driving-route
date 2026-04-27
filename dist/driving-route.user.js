// ==UserScript==
// @id             iitc-plugin-driving-route
// @name           IITC plugin: Driving Route
// @category       Navigate
// @version        0.1.1-dev
// @namespace      https://github.com/mdiehn/iitc-plugin-driving-route
// @updateURL      https://localhost:8443/iitc-plugin-driving-route.meta.js
// @downloadURL    https://localhost:8443/iitc-plugin-driving-route.user.js
// @description    Mobile-first route planning through selected portals with segment drive times, stop-time accounting, and Google Maps export.
// @include        https://intel.ingress.com/*
// @include        http://intel.ingress.com/*
// @match          https://intel.ingress.com/*
// @match          http://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
  if (typeof window.plugin !== 'function') window.plugin = function() {};
  window.plugin.drivingRoute = window.plugin.drivingRoute || {};

  var dr = window.plugin.drivingRoute;

  dr.CSS = `
.driving-route-mini-control {
  margin-top: 10px;
}

.driving-route-mini-control a {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
}

.driving-route-dialog-content {
  width: 100%;
  max-width: 100%;
  overflow-x: visible;
  font-size: 11px;
  line-height: 1.25;
}

.driving-route-dialog-content button,
.driving-route-dialog-content input {
  font-size: 11px;
}

.driving-route-mini-control .driving-route-mini-remove {
  color: #c00000;
}

.driving-route-dialog-content * {
  box-sizing: border-box;
}

.driving-route-body p {
  margin: 0 0 6px;
}

.driving-route-summary {
  margin-top: 4px;
}

.driving-route-setting {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 8px 0 8px;
}

.driving-route-setting input {
  width: 4.5em;
}

.driving-route-checkbox-setting {
  align-items: center;
}

.driving-route-checkbox-setting input {
  width: auto;
}

.driving-route-empty {
  margin: 8px 0 10px;
}

.driving-route-waypoints-list {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 6px 0 8px;
  overflow: visible;
}

.driving-route-waypoint-row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) 42px 22px 22px 22px;
  gap: 2px;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
}

.driving-route-waypoint-row + .driving-route-waypoint-row {
  margin-top: 2px;
}

.driving-route-waypoint-num,
.driving-route-waypoint-name-cell,
.driving-route-wait-cell,
.driving-route-row-action {
  min-width: 0;
  border: 0 !important;
  outline: 0 !important;
  background: transparent !important;
}

.driving-route-waypoint-num {
  width: 20px;
  text-align: center;
}

.driving-route-waypoint-name-cell {
  overflow: hidden;
}

.driving-route-wait-cell {
  width: 42px;
  text-align: center;
}

.driving-route-row-action {
  width: 22px;
  text-align: center;
  overflow: visible;
}

.driving-route-waypoint-name {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  color: inherit !important;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.driving-route-waypoint-name:hover,
.driving-route-waypoint-name:focus,
.driving-route-waypoint-name:active {
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  color: inherit !important;
}

.driving-route-wait-input {
  width: 42px;
  padding: 1px 2px;
}

.driving-route-row-button {
  width: 22px !important;
  min-width: 22px !important;
  max-width: 22px !important;
  height: 20px;
  min-height: 20px;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  color: inherit !important;
  text-align: center;
  line-height: 20px;
  font-size: 14px !important;
  font-weight: bold !important;
}

.driving-route-row-button:disabled {
  opacity: 0.35;
}

.driving-route-remove-stop-button {
  color: #ff8080 !important;
}

.driving-route-stop-num,
.driving-route-stop-label span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  min-width: 16px;
  height: 16px;
  min-height: 16px;
  padding: 0;
  border-radius: 50%;
  background: #ffd800;
  color: #111;
  font-weight: bold;
  font-size: 10px;
  line-height: 16px;
}

button.driving-route-stop-num,
button.driving-route-waypoint-badge {
  width: 16px !important;
  min-width: 16px !important;
  height: 16px !important;
  min-height: 16px !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 50% !important;
  background: #ffd800 !important;
  color: #111 !important;
  cursor: pointer;
  line-height: 16px !important;
}

.driving-route-leg {
  margin: 1px 0 3px 23px;
  padding-left: 5px;
  opacity: 0.85;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.driving-route-stale {
  margin-top: 4px;
  opacity: 0.85;
  font-size: 10px;
  font-style: italic;
}

.driving-route-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.driving-route-footer-actions {
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  margin-top: 10px;
  padding-top: 7px;
}

.driving-route-bottom-summary {
  margin-top: 8px;
  opacity: 0.9;
}

.driving-route-version {
  margin-top: 6px;
  opacity: 0.7;
  font-size: 10px;
  text-align: right;
}

.driving-route-totals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
}

.driving-route-totals div {
  padding: 5px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.driving-route-totals span,
.driving-route-totals strong {
  display: block;
}

.driving-route-message {
  display: none;
  margin-top: 8px;
  padding: 7px;
  border: 1px solid #ffd800;
  background: rgba(0, 0, 0, 0.22);
}

.driving-route-message-visible {
  display: block;
}

.driving-route-busy {
  opacity: 0.82;
}

.driving-route-stop-tooltip,
.driving-route-stop-tooltip * {
  pointer-events: none;
}

.driving-route-stop-label {
  border: 0;
  background: transparent;
}

.driving-route-stop-label span {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.65);
}

.driving-route-segment-time-label {
  border: 0;
  background: transparent;
  pointer-events: none;
}

.driving-route-segment-time-label span {
  display: inline-block;
  padding: 2px 5px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.72);
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  line-height: 1.2;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.65);
}

.driving-route-stop-tooltip {
  font-size: 11px;
}

.driving-route-portal-action {
  margin-top: 8px;
}


.ui-dialog.driving-route-dialog {
  max-width: calc(100vw - 20px) !important;
}

.ui-dialog.driving-route-dialog .ui-dialog-content {
  box-sizing: border-box !important;
  overflow-x: visible !important;
}

.driving-route-waypoints-list,
.driving-route-waypoint-row,
.driving-route-waypoint-row > div,
.driving-route-waypoint-name-cell,
.driving-route-waypoint-name-cell * {
  border-color: transparent !important;
}

.driving-route-waypoint-name,
button.driving-route-waypoint-name,
.ui-dialog .driving-route-waypoint-name,
.ui-dialog button.driving-route-waypoint-name {
  border: none !important;
  border-width: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  background-image: none !important;
}

@media (max-width: 640px) {
  .ui-dialog.driving-route-dialog {
    position: fixed !important;
    left: 8px !important;
    right: 8px !important;
    top: 50% !important;
    bottom: auto !important;
    width: auto !important;
    max-width: calc(100vw - 16px) !important;
    max-height: calc(100dvh - 24px) !important;
    transform: translateY(-50%) !important;
  }

  .ui-dialog.driving-route-dialog .ui-dialog-content {
    width: auto !important;
    max-height: calc(100dvh - 90px) !important;
    overflow-y: auto !important;
    overflow-x: visible !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
    padding-bottom: 8px !important;
  }

  .driving-route-waypoint-row {
    grid-template-columns: 18px minmax(0, 1fr) 38px 20px 20px 20px;
    gap: 1px;
  }

  .driving-route-waypoint-num {
    width: 18px;
  }

  .driving-route-wait-cell {
    width: 38px;
  }

  .driving-route-wait-input {
    width: 38px;
  }

  .driving-route-row-action {
    width: 20px;
  }

  .driving-route-row-button {
    width: 20px !important;
    min-width: 20px !important;
    max-width: 20px !important;
  }

  .driving-route-leg {
    margin-left: 20px;
  }
}
`;

  dr.ID = 'driving-route';
  dr.NAME = 'Driving Route';
  dr.VERSION = '0.1.1-dev';
  dr.SHOW_VERSION_IN_PANEL = true;

  dr.DOM_IDS = {
    css: 'iitc-plugin-driving-route-css',
    dialog: 'iitc-plugin-driving-route-dialog',
    dialogContent: 'iitc-plugin-driving-route-dialog-content',
    miniControl: 'iitc-plugin-driving-route-mini-control',
    toolboxLink: 'iitc-plugin-driving-route-toolbox-link'
  };

  dr.STORAGE_KEYS = {
    stops: 'iitc-driving-route-stops',
    settings: 'iitc-driving-route-settings',
    panelOpen: 'iitc-driving-route-panel-open',
    panelPosition: 'iitc-driving-route-panel-position',
    route: 'iitc-driving-route-route',
    routeDirty: 'iitc-driving-route-route-dirty'
  };

  dr.DEFAULT_SETTINGS = {
    defaultStopMinutes: 5,
    includeReturnToStart: false,
    showSegmentTimesOnMap: false
  };

  dr.state = {
    stops: [],
    route: null,
    routeDirty: false,
    settings: Object.assign({}, dr.DEFAULT_SETTINGS),
    layers: {
      labels: null,
      routeLine: null,
      segmentLabels: null
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

      var rawRoute = localStorage.getItem(dr.STORAGE_KEYS.route);
      if (rawRoute) {
        var route = JSON.parse(rawRoute);
        if (route && Array.isArray(route.legs)) dr.state.route = route;
      }

      var rawRouteDirty = localStorage.getItem(dr.STORAGE_KEYS.routeDirty);
      if (rawRouteDirty !== null) dr.state.routeDirty = rawRouteDirty === 'true';
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


  dr.saveRoute = function() {
    if (dr.state.route) {
      localStorage.setItem(dr.STORAGE_KEYS.route, JSON.stringify(dr.state.route));
    } else {
      localStorage.removeItem(dr.STORAGE_KEYS.route);
    }
    localStorage.setItem(dr.STORAGE_KEYS.routeDirty, String(!!dr.state.routeDirty));
  };

  dr.clearSavedRoute = function() {
    localStorage.removeItem(dr.STORAGE_KEYS.route);
    localStorage.removeItem(dr.STORAGE_KEYS.routeDirty);
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

  dr.markRouteStale = function(options) {
    options = options || {};
    var hadRouteState = !!dr.state.route || !!dr.state.routeDirty;
    dr.state.routeDirty = hadRouteState;

    if (options.clearRoute) {
      dr.state.route = null;
      dr.clearRouteLine();
    } else if (dr.state.route && dr.state.route.legs) {
      dr.state.route.totals = dr.calculateTotals(dr.state.route.legs);
    }

    dr.saveRoute();
  };

  dr.markRouteCurrent = function() {
    dr.state.routeDirty = false;
    dr.saveRoute();
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

    dr.markRouteStale({ clearRoute: true });
    dr.saveStops();
    dr.redrawLabels();
    dr.renderPanel();
  };

  dr.removeStop = function(index) {
    if (index < 0 || index >= dr.state.stops.length) return;
    dr.state.stops.splice(index, 1);
    dr.markRouteStale({ clearRoute: true });
    dr.saveStops();
    dr.redrawLabels();
    dr.renderPanel();
  };

  dr.clearStops = function() {
    dr.state.stops = [];
    dr.state.route = null;
    dr.state.routeDirty = false;
    dr.saveStops();
    dr.saveRoute();
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

    dr.markRouteStale({ clearRoute: true });
    dr.saveStops();
    dr.redrawLabels();
    dr.renderPanel();
  };



  dr.setStopMinutes = function(index, minutes) {
    if (index < 0 || index >= dr.state.stops.length) return;
    if (typeof minutes !== 'number' || !isFinite(minutes) || minutes < 0) return;

    dr.state.stops[index].stopMinutes = Math.round(minutes);
    dr.markRouteStale();
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

      dr.state.route = {
        legs: legs,
        totals: dr.calculateTotals(legs),
        path: path.map(function(point) {
          return { lat: point.lat, lng: point.lng };
        })
      };
      dr.markRouteCurrent();

      dr.drawRoutePath(path);
      dr.renderPanel();
    });
  };

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

  dr.escapeHtml = function(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  dr.renderEmptyHelp = function() {
    return '<p class="driving-route-empty">There are no waypoints defined.<br>Select a portal and add it from the Driving Route control.</p>';
  };

  dr.renderRouteSegment = function(leg) {
    if (!leg) return '';

    var duration = leg.durationText || dr.formatDuration(leg.durationSeconds);
    var distance = leg.distanceText || dr.formatDistance(leg.distanceMeters);

    return '<div class="driving-route-leg">' +
      '<span>' + dr.escapeHtml(duration) + '</span>' +
      '<span> / </span>' +
      '<span>' + dr.escapeHtml(distance) + '</span>' +
      '</div>';
  };

  dr.renderStopsList = function(legsByToIndex) {
    var stops = dr.state.stops;
    if (stops.length === 0) return dr.renderEmptyHelp();

    var html = '';
    html += '<div class="driving-route-waypoints-list">';

    stops.forEach(function(stop, index) {
      var waitValue = dr.formatDurationInput(dr.getEffectiveStopMinutes(stop));

      html += '<div class="driving-route-waypoint-row" data-index="' + index + '">';
      html += '<div class="driving-route-waypoint-num"><button type="button" class="driving-route-stop-num driving-route-waypoint-badge" title="Select and center portal" data-action="select-stop-center" data-index="' + index + '">' + (index + 1) + '</button></div>';
      html += '<div class="driving-route-waypoint-name-cell"><button type="button" class="driving-route-waypoint-name" title="Select portal" data-action="select-stop" data-index="' + index + '">' + dr.escapeHtml(stop.title) + '</button></div>';
      html += '<div class="driving-route-wait-cell"><input class="driving-route-wait-input" type="text" inputmode="decimal" value="' + dr.escapeHtml(waitValue) + '" title="Examples: 15m, 1.5h, 2d" data-field="stop-minutes" data-index="' + index + '"></div>';
      html += '<div class="driving-route-row-action"><button type="button" class="driving-route-row-button" title="Move up" data-action="move-stop-up" data-index="' + index + '" ' + (index === 0 ? 'disabled' : '') + '>&uarr;</button></div>';
      html += '<div class="driving-route-row-action"><button type="button" class="driving-route-row-button" title="Move down" data-action="move-stop-down" data-index="' + index + '" ' + (index === stops.length - 1 ? 'disabled' : '') + '>&darr;</button></div>';
      html += '<div class="driving-route-row-action"><button type="button" class="driving-route-row-button driving-route-remove-stop-button" title="Remove waypoint" data-action="remove-stop" data-index="' + index + '">X</button></div>';
      html += '</div>';

      if (index < stops.length - 1) {
        html += dr.renderRouteSegment(legsByToIndex[index + 1]);
      }
    });

    html += '</div>';
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

    html += '<div class="driving-route-body">';
    html += dr.renderStopsList(legsByToIndex);

    html += '<label class="driving-route-setting">Default stop time <input type="text" inputmode="decimal" value="' + dr.escapeHtml(dr.formatDurationInput(dr.state.settings.defaultStopMinutes)) + '" title="Examples: 15m, 1.5h, 2d" data-field="default-stop-minutes"> per portal</label>';

    html += '<label class="driving-route-setting driving-route-checkbox-setting"><input type="checkbox" data-field="show-segment-times-on-map" ' + (dr.state.settings.showSegmentTimesOnMap ? 'checked ' : '') + '> Show segment times on map</label>';

    var plotLabel = dr.state.routeDirty ? 'Replot' : 'Plot';

    html += '<div class="driving-route-actions">';
    html += '<button type="button" data-action="add-selected-stop">Add</button>';
    html += '<button type="button" data-action="calculate-route">' + plotLabel + '</button>';
    html += '<button type="button" data-action="open-google-maps">Open Maps</button>';
    html += '<button type="button" data-action="clear-route">Clear</button>';
    html += '<button type="button" data-action="close-panel">Close</button>';
    html += '</div>';

    html += '<div class="driving-route-bottom-summary"><b>Waypoints:</b> ' + stops.length + '</div>';
    if (dr.state.routeDirty) {
      html += '<div class="driving-route-stale">Route needs replot.</div>';
    }
    html += dr.renderTotals(dr.state.route);
    if (dr.SHOW_VERSION_IN_PANEL) {
      html += '<div class="driving-route-version">Driving Route ' + dr.escapeHtml(dr.VERSION) + '</div>';
    }

    html += '<div class="driving-route-message" id="driving-route-message"></div>';
    html += '</div>';
    return html;
  };

  dr.renderEditPanel = function(legsByToIndex) {
    return dr.renderMainPanel(legsByToIndex);
  };


  dr.getDialogWidth = function() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 520;

    if (viewportWidth <= 640) {
      return Math.max(320, viewportWidth);
    }

    return Math.min(560, Math.max(460, viewportWidth - 40));
  };

  dr.isDialogOpen = function(content) {
    if (!content || !window.jQuery) return false;

    try {
      var dialogContent = window.jQuery(content).closest('.ui-dialog-content');
      return dialogContent.length > 0 && dialogContent.dialog('isOpen');
    } catch (e) {
      return false;
    }
  };

  dr.renderPanel = function() {
    if (dr.isLayerEnabled && !dr.isLayerEnabled()) {
      dr.closeDialog();
      return;
    }

    dr.renderMiniControl();

    if (!dr.state.panelOpen) {
      dr.closeDialog();
      return;
    }

    var route = dr.state.route;
    var legsByToIndex = {};
    if (route && route.legs) {
      route.legs.forEach(function(leg) { legsByToIndex[leg.toIndex] = leg; });
    }

    var contentHtml = dr.renderMainPanel(legsByToIndex);
    var existingContent = document.getElementById(dr.DOM_IDS.dialogContent);

    if (dr.isDialogOpen(existingContent)) {
      existingContent.innerHTML = contentHtml;
      return;
    }

    var html = '<div id="' + dr.DOM_IDS.dialogContent + '" class="driving-route-dialog-content">' + contentHtml + '</div>';

    if (typeof window.dialog === 'function') {
      window.dialog({
        id: dr.DOM_IDS.dialog,
        title: 'Driving Route',
        html: html,
        dialogClass: 'driving-route-dialog',
        width: dr.getDialogWidth()
      });

      var newContent = document.getElementById(dr.DOM_IDS.dialogContent);
      if (newContent && window.jQuery) {
        try {
          window.jQuery(newContent)
            .closest('.ui-dialog-content')
            .off('dialogclose.drivingRoute')
            .on('dialogclose.drivingRoute', function() {
              dr.state.panelOpen = false;
              dr.savePanelOpen();
            });
        } catch (e) {
          console.warn('Driving Route: failed to attach dialog close handler', e);
        }
      }
    } else {
      console.log('Driving Route: IITC dialog API is unavailable.');
    }
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

  dr.setBusy = function(isBusy) {
    var panel = document.getElementById(dr.DOM_IDS.dialogContent);
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

  dr.closeDialog = function() {
    var content = document.getElementById(dr.DOM_IDS.dialogContent);
    if (content && window.jQuery) {
      try {
        window.jQuery(content).closest('.ui-dialog-content').dialog('close');
        return;
      } catch (e) {
        // Fall through to hiding the content if the IITC dialog wrapper is unavailable.
      }
    }
    if (content) content.style.display = 'none';
  };

  dr.handleAction = function(action, target) {
    if (dr.isLayerEnabled && !dr.isLayerEnabled()) {
      dr.syncLayerUi();
      return;
    }

    if (action === 'open-main') {
      dr.state.panelView = 'main';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    } else if (action === 'open-edit') {
      dr.state.panelView = 'main';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    } else if (action === 'close-panel') {
      dr.state.panelOpen = false;
      dr.savePanelOpen();
      dr.closeDialog();
    } else if (action === 'toggle-selected-stop') {
      dr.toggleSelectedPortalStop();
    } else if (action === 'add-selected-stop') {
      dr.addSelectedPortal();
    } else if (action === 'move-stop-up') {
      dr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) - 1);
    } else if (action === 'move-stop-down') {
      dr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) + 1);
    } else if (action === 'remove-stop') {
      dr.removeStop(Number(target.getAttribute('data-index')));
    } else if (action === 'select-stop') {
      dr.selectStopPortal(Number(target.getAttribute('data-index')), false);
    } else if (action === 'select-stop-center') {
      dr.selectStopPortal(Number(target.getAttribute('data-index')), true);
    } else if (action === 'calculate-route') {
      dr.calculateRoute();
    } else if (action === 'open-google-maps') {
      dr.openGoogleMaps();
    } else if (action === 'clear-route') {
      dr.clearStops();
    }
  };

  dr.isLayerEnabled = function() {
    if (!window.map || !dr.layerGroup) return true;
    return window.map.hasLayer(dr.layerGroup);
  };

  dr.createMiniControl = function() {
    if (!window.L || !window.map) return;
    if (dr.state.miniControl || document.getElementById(dr.DOM_IDS.miniControl)) return;

    var DrivingRouteControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function() {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control driving-route-mini-control iitc-plugin-driving-route-control');
        container.id = dr.DOM_IDS.miniControl;
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        container.addEventListener('click', function(ev) {
          var button = ev.target.closest('[data-action]');
          if (!button) return;
          ev.preventDefault();
          dr.handleAction(button.getAttribute('data-action'), button);
        });
        return container;
      }
    });

    dr.state.miniControl = new DrivingRouteControl();
    window.map.addControl(dr.state.miniControl);
    dr.setMiniControlVisible(dr.isLayerEnabled());
  };

  dr.setMiniControlVisible = function(isVisible) {
    var container = document.getElementById(dr.DOM_IDS.miniControl);
    if (container) container.style.display = isVisible ? '' : 'none';
  };

  dr.removeMiniControl = function() {
    if (dr.state.miniControl && window.map) {
      try {
        window.map.removeControl(dr.state.miniControl);
      } catch (e) {
        console.warn('Driving Route: unable to remove mini control', e);
      }
    }

    dr.state.miniControl = null;

    var container = document.getElementById(dr.DOM_IDS.miniControl);
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  dr.renderMiniControl = function() {
    var container = document.getElementById(dr.DOM_IDS.miniControl);
    if (!container) return;

    if (!dr.isLayerEnabled()) {
      dr.setMiniControlVisible(false);
      return;
    }

    dr.setMiniControlVisible(true);

    var selectedIndex = dr.selectedStopIndex();
    var selectedInRoute = selectedIndex >= 0;
    var addRemoveClass = selectedInRoute ? ' driving-route-mini-remove' : '';
    var addRemoveText = selectedInRoute ? '-' : '+';
    var addRemoveTitle = selectedInRoute ? 'Remove selected portal from route' : 'Add selected portal to route';
    var plotTitle = dr.state.routeDirty ? 'Replot route on map' : 'Plot route on map';

    container.innerHTML = '' +
      '<a href="#" title="Open route in Google Maps" data-action="open-google-maps">M</a>' +
      '<a href="#" title="' + plotTitle + '" data-action="calculate-route">P</a>' +
      '<a href="#" class="driving-route-mini-add' + addRemoveClass + '" title="' + addRemoveTitle + '" data-action="toggle-selected-stop">' + addRemoveText + '</a>' +
      '<a href="#" title="Open Driving Route menu" data-action="open-main">' + dr.state.stops.length + '</a>' +
      '<a href="#" title="Driving Route menu" data-action="open-main">=</a>';
  };

  dr.setupDialogEventHandlers = function() {
    if (dr.dialogEventsRegistered) return;
    dr.dialogEventsRegistered = true;

    document.addEventListener('click', function(ev) {
      var panel = ev.target.closest('#' + dr.DOM_IDS.dialogContent);
      if (!panel) return;

      var target = ev.target.closest('[data-action]');
      var action = target && target.getAttribute('data-action');
      if (!action) return;

      ev.preventDefault();
      dr.handleAction(action, target);
    });

    document.addEventListener('dragstart', function(ev) {
      var panel = ev.target.closest('#' + dr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.driving-route-stop');
      if (!item) return;

      dr.state.dragStopIndex = Number(item.getAttribute('data-index'));
      ev.dataTransfer.effectAllowed = 'move';
      item.classList.add('driving-route-dragging');
    });

    document.addEventListener('dragend', function(ev) {
      var item = ev.target.closest('.driving-route-stop');
      if (item) item.classList.remove('driving-route-dragging');
      dr.state.dragStopIndex = null;
    });

    document.addEventListener('dragover', function(ev) {
      var panel = ev.target.closest('#' + dr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.driving-route-stop');
      if (!item) return;

      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
    });

    document.addEventListener('drop', function(ev) {
      var panel = ev.target.closest('#' + dr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.driving-route-stop');
      if (!item) return;

      ev.preventDefault();

      var fromIndex = dr.state.dragStopIndex;
      var toIndex = Number(item.getAttribute('data-index'));
      dr.state.dragStopIndex = null;

      dr.moveStop(fromIndex, toIndex);
    });

    document.addEventListener('change', function(ev) {
      var panel = ev.target.closest('#' + dr.DOM_IDS.dialogContent);
      if (!panel) return;

      var target = ev.target;
      if (target && target.getAttribute('data-field') === 'show-segment-times-on-map') {
        dr.state.settings.showSegmentTimesOnMap = !!target.checked;
        dr.saveSettings();
        dr.redrawSegmentTimeLabels();
        return;
      }

      if (target && target.getAttribute('data-field') === 'default-stop-minutes') {
        var value = dr.parseDurationMinutes(target.value);
        if (value === null) {
          dr.showMessage('Invalid duration. Use values like 15m, 1.5h, or 2d.');
          target.value = dr.formatDurationInput(dr.state.settings.defaultStopMinutes);
          return;
        }

        dr.state.settings.defaultStopMinutes = value;
        dr.saveSettings();
        dr.markRouteStale();
        dr.renderPanel();
      } else if (target && target.getAttribute('data-field') === 'stop-minutes') {
        var stopIndex = Number(target.getAttribute('data-index'));
        var stopValue = dr.parseDurationMinutes(target.value);
        if (stopValue === null) {
          dr.showMessage('Invalid duration. Use values like 15m, 1.5h, or 2d.');
          target.value = dr.formatDurationInput(dr.getEffectiveStopMinutes(dr.state.stops[stopIndex]));
          return;
        }

        dr.setStopMinutes(stopIndex, stopValue);
      }
    });
  };

  dr.addToolboxLink = function() {
    if (!document.getElementById('toolbox')) return;
    if (document.getElementById(dr.DOM_IDS.toolboxLink)) return;

    var link = document.createElement('a');
    link.id = dr.DOM_IDS.toolboxLink;
    link.href = '#';
    link.textContent = 'Driving Route';
    link.addEventListener('click', function(ev) {
      ev.preventDefault();
      if (!dr.isLayerEnabled()) return;
      dr.state.panelView = 'main';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    });

    var toolbox = document.getElementById('toolbox');
    toolbox.appendChild(link);
  };

  dr.removeToolboxLink = function() {
    var link = document.getElementById(dr.DOM_IDS.toolboxLink);
    if (link && link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  dr.injectCss = function() {
    if (document.getElementById(dr.DOM_IDS.css)) return;
    var style = document.createElement('style');
    style.id = dr.DOM_IDS.css;
    style.textContent = dr.CSS;
    document.head.appendChild(style);
  };


  dr.setupLayerControl = function() {
    if (dr.layerGroup) return;

    dr.layerGroup = L.FeatureGroup ? new L.FeatureGroup() : L.layerGroup();

    if (typeof window.addLayerGroup === 'function') {
      window.addLayerGroup('Driving Route', dr.layerGroup, true);
    } else if (window.layerChooser && typeof window.layerChooser.addOverlay === 'function') {
      window.layerChooser.addOverlay(dr.layerGroup, 'Driving Route');
      dr.layerGroup.addTo(window.map);
    }
  };

  dr.syncLayerUi = function() {
    if (dr.isLayerEnabled()) {
      dr.addToolboxLink();
      dr.createMiniControl();
      dr.setMiniControlVisible(true);
      dr.renderMiniControl();
      return;
    }

    dr.state.panelOpen = false;
    dr.savePanelOpen();
    dr.closeDialog();
    dr.setMiniControlVisible(false);
    dr.removeToolboxLink();
  };

  dr.enable = function() {
    dr.addToolboxLink();
    dr.createMiniControl();
    dr.setMiniControlVisible(true);
    dr.renderMiniControl();
    dr.redrawLabels();
  };

  dr.disable = function() {
    dr.state.panelOpen = false;
    dr.savePanelOpen();
    dr.closeDialog();
    dr.setMiniControlVisible(false);
    dr.removeToolboxLink();
  };

  dr.setupLayerEvents = function() {
    if (dr.layerEventsRegistered) return;
    if (!window.map || !dr.layerGroup) return;

    window.map.on('layeradd', function(e) {
      if (e.layer !== dr.layerGroup) return;
      dr.enable();
    });

    window.map.on('layerremove', function(e) {
      if (e.layer !== dr.layerGroup) return;
      dr.disable();
    });

    dr.layerEventsRegistered = true;
  };

  dr.setup = function() {
    try {
      if (plugin_info && plugin_info.script && plugin_info.script.version) {
        dr.VERSION = plugin_info.script.version;
      }

      dr.injectCss();
      dr.loadState();
      dr.setupLayerControl();
      dr.setupLayerEvents();
      dr.createMiniControl();
      dr.setupDialogEventHandlers();
      dr.addToolboxLink();
      dr.syncLayerUi();
      dr.renderPanel();
      dr.renderMiniControl();
      dr.redrawLabels();
      dr.redrawRouteLine();

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
