  pr.ID = 'portal-route';
  pr.NAME = 'Portal Route';
  pr.VERSION = '0.2.0-dev';
  pr.SHOW_VERSION_IN_PANEL = true;

  pr.DOM_IDS = {
    css: 'iitc-plugin-portal-route-css',
    dialog: 'iitc-plugin-portal-route-dialog',
    dialogContent: 'iitc-plugin-portal-route-dialog-content',
    miniControl: 'iitc-plugin-portal-route-mini-control',
    toolboxLink: 'iitc-plugin-portal-route-toolbox-link'
  };

  pr.STORAGE_KEYS = {
    stops: 'iitc-portal-route-stops',
    settings: 'iitc-portal-route-settings',
    panelOpen: 'iitc-portal-route-panel-open',
    panelPosition: 'iitc-portal-route-panel-position',
    route: 'iitc-portal-route-route',
    routeDirty: 'iitc-portal-route-route-dirty'
  };

  pr.DEFAULT_SETTINGS = {
    defaultStopMinutes: 5,
    includeReturnToStart: false,
    showSegmentTimesOnMap: false
  };
