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
