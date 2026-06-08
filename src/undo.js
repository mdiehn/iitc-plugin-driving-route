  pr.UNDO_LIMIT = 40;

  pr.cloneForUndo = function(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  };

  pr.routeUndoSettings = function(settings) {
    settings = settings || pr.state.settings || {};
    return {
      defaultStopMinutes: settings.defaultStopMinutes,
      includeReturnToStart: !!settings.includeReturnToStart,
      startOnCurrentLocation: !!settings.startOnCurrentLocation,
      routingProvider: settings.routingProvider || pr.ROUTING_PROVIDERS.google,
      defaultTravelMode: settings.defaultTravelMode || pr.TRAVEL_MODES.drive,
      driveSpeedMph: settings.driveSpeedMph,
      bikeSpeedMph: settings.bikeSpeedMph,
      walkSpeedMph: settings.walkSpeedMph
    };
  };

  pr.currentRouteEditSnapshot = function(label) {
    return {
      label: label || 'route edit',
      stops: pr.cloneForUndo(pr.state.stops || []),
      routeStructure: pr.cloneForUndo(pr.state.routeStructure || null),
      settings: pr.routeUndoSettings(),
      route: pr.cloneForUndo(pr.state.route || null),
      routeDirty: !!pr.state.routeDirty,
      selectedMapPointIndex: typeof pr.state.selectedMapPointIndex === 'number' ? pr.state.selectedMapPointIndex : null,
      selectedPortal: window.selectedPortal || null,
      activeRouteId: pr.state.activeRouteId || null
    };
  };

  pr.routeEditSnapshotKey = function(snapshot) {
    return JSON.stringify({
      stops: snapshot.stops,
      routeStructure: snapshot.routeStructure,
      settings: snapshot.settings,
      route: snapshot.route,
      routeDirty: snapshot.routeDirty,
      selectedMapPointIndex: snapshot.selectedMapPointIndex,
      selectedPortal: snapshot.selectedPortal,
      activeRouteId: snapshot.activeRouteId
    });
  };

  pr.ensureUndoStacks = function() {
    if (!Array.isArray(pr.state.undoStack)) pr.state.undoStack = [];
    if (!Array.isArray(pr.state.redoStack)) pr.state.redoStack = [];
  };

  pr.pushUndoSnapshot = function(label) {
    if (pr.state.restoringRouteEdit) return;
    pr.ensureUndoStacks();

    var snapshot = pr.currentRouteEditSnapshot(label);
    var key = pr.routeEditSnapshotKey(snapshot);
    var last = pr.state.undoStack.length ? pr.state.undoStack[pr.state.undoStack.length - 1] : null;
    if (last && last.key === key) return;

    snapshot.key = key;
    pr.state.undoStack.push(snapshot);
    while (pr.state.undoStack.length > pr.UNDO_LIMIT) pr.state.undoStack.shift();
    pr.state.redoStack = [];
  };

  pr.canUndoRouteEdit = function() {
    pr.ensureUndoStacks();
    return pr.state.undoStack.length > 0;
  };

  pr.canRedoRouteEdit = function() {
    pr.ensureUndoStacks();
    return pr.state.redoStack.length > 0;
  };

  pr.restoreRouteEditSnapshot = function(snapshot) {
    if (!snapshot) return false;

    pr.state.restoringRouteEdit = true;
    try {
      pr.state.stops = pr.cloneForUndo(snapshot.stops || []);
      pr.state.routeStructure = pr.cloneForUndo(snapshot.routeStructure || null);
      pr.state.settings = Object.assign({}, pr.state.settings, pr.routeUndoSettings(snapshot.settings));
      pr.state.route = pr.cloneForUndo(snapshot.route || null);
      pr.state.routeDirty = !!snapshot.routeDirty;
      pr.state.selectedMapPointIndex = typeof snapshot.selectedMapPointIndex === 'number' ? snapshot.selectedMapPointIndex : null;
      pr.state.activeRouteId = snapshot.activeRouteId || null;
      window.selectedPortal = snapshot.selectedPortal || null;

      pr.saveSettings();
      pr.saveStops();
      pr.saveRoute();

      pr.clearRouteLine();
      if (pr.state.route) pr.redrawRouteLine();
      pr.redrawLabels();
      pr.redrawSegmentTimeLabels();
      pr.renderPanel();
      if (pr.state.pointsPanelOpen && pr.renderPointsPanel) pr.renderPointsPanel();
      pr.renderMiniControl();
      if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
      if (pr.state.routeDirty && pr.getRouteStops().length >= 2) pr.queueAutoReplot();
    } finally {
      pr.state.restoringRouteEdit = false;
    }

    return true;
  };

  pr.undoRouteEdit = function() {
    pr.ensureUndoStacks();
    if (!pr.state.undoStack.length) {
      pr.showMessage('Nothing to undo.');
      return false;
    }

    var current = pr.currentRouteEditSnapshot('redo point');
    current.key = pr.routeEditSnapshotKey(current);
    pr.state.redoStack.push(current);

    var snapshot = pr.state.undoStack.pop();
    if (!pr.restoreRouteEditSnapshot(snapshot)) return false;
    pr.showMessage('Undid ' + (snapshot.label || 'route edit') + '.');
    return true;
  };

  pr.redoRouteEdit = function() {
    pr.ensureUndoStacks();
    if (!pr.state.redoStack.length) {
      pr.showMessage('Nothing to redo.');
      return false;
    }

    var current = pr.currentRouteEditSnapshot('undo point');
    current.key = pr.routeEditSnapshotKey(current);
    pr.state.undoStack.push(current);

    var snapshot = pr.state.redoStack.pop();
    if (!pr.restoreRouteEditSnapshot(snapshot)) return false;
    pr.showMessage('Redid route edit.');
    return true;
  };
