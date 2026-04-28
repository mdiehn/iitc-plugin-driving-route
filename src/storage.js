  pr.loadState = function() {
    try {
      var rawSettings = localStorage.getItem(pr.STORAGE_KEYS.settings);
      if (rawSettings) {
        pr.state.settings = Object.assign({}, pr.DEFAULT_SETTINGS, JSON.parse(rawSettings));
      }

      var rawStops = localStorage.getItem(pr.STORAGE_KEYS.stops);
      if (rawStops) {
        var stops = JSON.parse(rawStops);
        if (Array.isArray(stops)) pr.state.stops = stops;
      }

      var rawPanelOpen = localStorage.getItem(pr.STORAGE_KEYS.panelOpen);
      if (rawPanelOpen !== null) pr.state.panelOpen = rawPanelOpen === 'true';

      var rawRoute = localStorage.getItem(pr.STORAGE_KEYS.route);
      if (rawRoute) {
        var route = JSON.parse(rawRoute);
        if (route && Array.isArray(route.legs)) pr.state.route = route;
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


  pr.saveRoute = function() {
    if (pr.state.route) {
      localStorage.setItem(pr.STORAGE_KEYS.route, JSON.stringify(pr.state.route));
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.route);
    }
    localStorage.setItem(pr.STORAGE_KEYS.routeDirty, String(!!pr.state.routeDirty));
  };

  pr.clearSavedRoute = function() {
    localStorage.removeItem(pr.STORAGE_KEYS.route);
    localStorage.removeItem(pr.STORAGE_KEYS.routeDirty);
  };
