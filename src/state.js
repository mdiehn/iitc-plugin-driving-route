  pr.normalizeSettings = function(settings) {
    var normalized = Object.assign({}, pr.DEFAULT_SETTINGS);
    if (!settings || typeof settings !== 'object') return normalized;

    Object.keys(pr.DEFAULT_SETTINGS).forEach(function(key) {
      var defaultValue = pr.DEFAULT_SETTINGS[key];
      var value = settings[key];

      if (typeof defaultValue === 'boolean') {
        if (typeof value === 'boolean') normalized[key] = value;
        return;
      }

      if (typeof defaultValue === 'number') {
        value = Number(value);
        if (!isFinite(value) || value < 0) return;
        if (key === 'routeLineWeight') {
          normalized[key] = pr.normalizeRouteLineWeight ? pr.normalizeRouteLineWeight(value) : Math.round(value);
          return;
        }
        if (/SpeedMph$/.test(key)) {
          if (value > 0) normalized[key] = value;
          return;
        }
        normalized[key] = Math.round(value);
        return;
      }

      if (typeof defaultValue === 'string') {
        if (typeof value !== 'string') return;
        value = value.trim();
        if (key === 'defaultTravelMode') {
          if (value === pr.TRAVEL_MODES.drive || value === pr.TRAVEL_MODES.bike || value === pr.TRAVEL_MODES.walk) {
            normalized[key] = value;
          }
          return;
        }
        if (key === 'routingProvider') {
          if (value === pr.ROUTING_PROVIDERS.google || value === pr.ROUTING_PROVIDERS.ors) {
            normalized[key] = value;
          }
          return;
        }
        if (key === 'orsBaseUrl') {
          normalized[key] = value.replace(/\/+$/, '') || pr.DEFAULT_SETTINGS.orsBaseUrl;
          return;
        }
        if (key === 'routeLineColor') {
          normalized[key] = pr.normalizeRouteLineColor ? pr.normalizeRouteLineColor(value) : value;
          return;
        }
        if (key === 'routeLineStyle') {
          normalized[key] = pr.normalizeRouteLineStyle ? pr.normalizeRouteLineStyle(value) : value;
          return;
        }
        if (key === 'homeTitle') {
          normalized[key] = value || pr.DEFAULT_SETTINGS.homeTitle;
          return;
        }
        if (key === 'homeLat' || key === 'homeLng') {
          normalized[key] = value;
          return;
        }
        normalized[key] = value;
      }
    });

    return normalized;
  };

  pr.state = {
    stops: [],
    routeStructure: null,
    route: null,
    routeDirty: false,
    settings: pr.normalizeSettings(),
    layers: {
      labels: null,
      routeLine: null,
      segmentLabels: null
    },
    panelOpen: false,
    panelPosition: null,
    panelSize: null,
    pointsPanelOpen: false,
    addPointMode: false,
    homePickMode: false,
    selectedMapPointIndex: null,
    activeRouteId: null,
    routeLibraryBackendId: 'local',
    selectedLibraryRouteIds: [],
    miniControl: null,
    undoStack: [],
    redoStack: [],
    restoringRouteEdit: false
  };

  pr.stableRoutePartId = function(value, prefix, index, seenIds) {
    value = typeof value === 'string' ? value.trim() : '';
    seenIds = seenIds || {};

    if (value && !seenIds[value]) {
      seenIds[value] = true;
      return value;
    }

    var base = prefix + '-' + ((typeof index === 'number' ? index : 0) + 1);
    var candidate = base;
    var suffix = 2;
    while (seenIds[candidate]) {
      candidate = base + '-' + suffix;
      suffix += 1;
    }

    seenIds[candidate] = true;
    return candidate;
  };

  pr.getEffectiveStopMinutes = function(stop) {
    if (stop && typeof stop.stopMinutes === 'number' && !Number.isNaN(stop.stopMinutes)) {
      return stop.stopMinutes;
    }
    return pr.state.settings.defaultStopMinutes;
  };
