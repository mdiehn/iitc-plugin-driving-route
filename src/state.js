  pr.state = {
    stops: [],
    route: null,
    routeDirty: false,
    settings: Object.assign({}, pr.DEFAULT_SETTINGS),
    layers: {
      labels: null,
      routeLine: null,
      segmentLabels: null
    },
    panelOpen: false,
    panelView: 'main',
    miniControl: null
  };

  pr.getEffectiveStopMinutes = function(stop) {
    if (stop && typeof stop.stopMinutes === 'number' && !Number.isNaN(stop.stopMinutes)) {
      return stop.stopMinutes;
    }
    return pr.state.settings.defaultStopMinutes;
  };
