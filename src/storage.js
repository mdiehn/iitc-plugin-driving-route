  pr.loadState = function() {
    try {
      var rawSettings = localStorage.getItem(pr.STORAGE_KEYS.settings);
      if (rawSettings) {
        pr.state.settings = pr.normalizeSettings(JSON.parse(rawSettings));
      }

      var rawStops = localStorage.getItem(pr.STORAGE_KEYS.stops);
      if (rawStops) {
        var stops = JSON.parse(rawStops);
        if (Array.isArray(stops)) {
          var seenStopIds = {};
          pr.state.stops = stops.map(function(stop, index) {
            if (!stop) return stop;
            return Object.assign({}, stop, {
              id: pr.stableRoutePartId(stop.id, 'stop', index, seenStopIds),
              type: stop.type || (stop.guid ? 'portal' : 'map'),
              home: (stop.type || (stop.guid ? 'portal' : 'map')) === 'map' && !!stop.home
            });
          });
        }
      }

      var rawPanelOpen = localStorage.getItem(pr.STORAGE_KEYS.panelOpen);
      if (rawPanelOpen !== null) pr.state.panelOpen = rawPanelOpen === 'true';

      var rawPanelPosition = localStorage.getItem(pr.STORAGE_KEYS.panelPosition);
      if (rawPanelPosition) {
        var panelPosition = JSON.parse(rawPanelPosition);
        if (panelPosition &&
            typeof panelPosition.left === 'number' &&
            typeof panelPosition.top === 'number' &&
            (panelPosition.left !== 0 || panelPosition.top !== 0)) {
          pr.state.panelPosition = panelPosition;
        }
      }

      var rawPanelSize = localStorage.getItem(pr.STORAGE_KEYS.panelSize);
      if (rawPanelSize && localStorage.getItem(pr.STORAGE_KEYS.panelSizeUserSet) === 'true') {
        var panelSize = JSON.parse(rawPanelSize);
        if (panelSize &&
            typeof panelSize.width === 'number' &&
            typeof panelSize.height === 'number') {
          pr.state.panelSize = panelSize;
        }
      }

      var rawRoute = localStorage.getItem(pr.STORAGE_KEYS.route);
      if (rawRoute) {
        var route = JSON.parse(rawRoute);
        if (route && Array.isArray(route.legs)) {
          pr.state.route = route;
          if (pr.refreshRouteTravelEstimates) pr.refreshRouteTravelEstimates(pr.state.route);
        }
      }

      var rawRouteStructure = localStorage.getItem(pr.STORAGE_KEYS.routeStructure);
      if (rawRouteStructure) {
        var routeStructure = pr.normalizeRouteStructure(JSON.parse(rawRouteStructure), pr.state.stops);
        pr.state.routeStructure = pr.routeStructureStateFromNormalized(routeStructure);
      }

      var rawRouteDirty = localStorage.getItem(pr.STORAGE_KEYS.routeDirty);
      if (rawRouteDirty !== null) pr.state.routeDirty = rawRouteDirty === 'true';
    } catch (e) {
      console.warn('Portal Route: failed to load saved state', e);
    }
  };

  pr.saveSettings = function() {
    localStorage.setItem(pr.STORAGE_KEYS.settings, JSON.stringify(pr.state.settings));
  };

  pr.saveStops = function() {
    localStorage.setItem(pr.STORAGE_KEYS.stops, JSON.stringify(pr.state.stops));
  };

  pr.savePanelOpen = function() {
    localStorage.setItem(pr.STORAGE_KEYS.panelOpen, String(pr.state.panelOpen));
  };

  pr.savePanelPosition = function() {
    if (pr.state.panelPosition) {
      localStorage.setItem(pr.STORAGE_KEYS.panelPosition, JSON.stringify(pr.state.panelPosition));
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.panelPosition);
    }
  };

  pr.savePanelSize = function() {
    if (pr.state.panelSize) {
      localStorage.setItem(pr.STORAGE_KEYS.panelSize, JSON.stringify(pr.state.panelSize));
      localStorage.setItem(pr.STORAGE_KEYS.panelSizeUserSet, 'true');
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.panelSize);
      localStorage.removeItem(pr.STORAGE_KEYS.panelSizeUserSet);
    }
  };

  pr.saveRoute = function() {
    if (pr.state.route) {
      localStorage.setItem(pr.STORAGE_KEYS.route, JSON.stringify(pr.state.route));
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.route);
    }

    if (pr.currentRouteStructureData && pr.currentRouteStructureData()) {
      localStorage.setItem(pr.STORAGE_KEYS.routeStructure, JSON.stringify(pr.currentRouteStructureData()));
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.routeStructure);
    }

    localStorage.setItem(pr.STORAGE_KEYS.routeDirty, String(!!pr.state.routeDirty));
  };

  pr.clearSavedRoute = function() {
    localStorage.removeItem(pr.STORAGE_KEYS.route);
    localStorage.removeItem(pr.STORAGE_KEYS.routeStructure);
    localStorage.removeItem(pr.STORAGE_KEYS.routeDirty);
  };
