  pr.ID = 'portal-route';
  pr.NAME = 'Portal Route';
  pr.VERSION = '1.6.0';
  pr.SHOW_VERSION_IN_PANEL = true;
  pr.LINEAR_ROUTE_SCHEMA_VERSION = 1;
  pr.SEGMENTED_ROUTE_SCHEMA_VERSION = 2;
  pr.ROUTE_LIBRARY_SCHEMA_VERSION = pr.SEGMENTED_ROUTE_SCHEMA_VERSION;
  pr.ROUTE_KIND_LINEAR = 'linear';
  pr.ROUTE_KIND_SEGMENTED = 'segmented';

  pr.DOM_IDS = {
    css: 'iitc-plugin-portal-route-css',
    dialog: 'iitc-plugin-portal-route-dialog',
    dialogContent: 'iitc-plugin-portal-route-dialog-content',
    pointsDialog: 'iitc-plugin-portal-route-points-dialog',
    pointsDialogContent: 'iitc-plugin-portal-route-points-dialog-content',
    routeLibrary: 'iitc-plugin-portal-route-library-dialog',
    routeLibraryContent: 'iitc-plugin-portal-route-library-dialog-content',
    bulkSelectDialog: 'iitc-plugin-portal-route-bulk-select-dialog',
    bulkSelectDialogContent: 'iitc-plugin-portal-route-bulk-select-dialog-content',
    miniControl: 'iitc-plugin-portal-route-mini-control',
    toolboxLink: 'iitc-plugin-portal-route-toolbox-link'
  };

  pr.normalizeRouteLineColor = function(color) {
    color = String(color == null ? '' : color).trim();
    if (/^#[0-9a-fA-F]{6}$/.test(color)) return color.toLowerCase();
    return pr.DEFAULT_SETTINGS.routeLineColor;
  };

  pr.normalizeRouteLineWeight = function(weight) {
    weight = Number(weight);
    if (weight === 3 || weight === 5 || weight === 7 || weight === 9) return weight;
    return pr.DEFAULT_SETTINGS.routeLineWeight;
  };

  pr.ROUTE_LINE_STYLES = {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted'
  };

  pr.normalizeRouteLineStyle = function(style) {
    style = String(style == null ? '' : style).trim();
    if (style === pr.ROUTE_LINE_STYLES.solid || style === pr.ROUTE_LINE_STYLES.dashed || style === pr.ROUTE_LINE_STYLES.dotted) return style;
    return pr.DEFAULT_SETTINGS.routeLineStyle;
  };

  pr.getRouteLineDashArray = function(style, weight) {
    style = pr.normalizeRouteLineStyle(style);
    weight = pr.normalizeRouteLineWeight(weight);
    if (style === pr.ROUTE_LINE_STYLES.dashed) return String(weight * 3) + ' ' + String(weight * 2);
    if (style === pr.ROUTE_LINE_STYLES.dotted) return '1 ' + String(weight * 2);
    return '';
  };

  pr.STORAGE_KEYS = {
    stops: 'iitc-portal-route-stops',
    settings: 'iitc-portal-route-settings',
    panelOpen: 'iitc-portal-route-panel-open',
    panelPosition: 'iitc-portal-route-panel-position',
    panelSize: 'iitc-portal-route-panel-size',
    panelSizeUserSet: 'iitc-portal-route-panel-size-user-set',
    route: 'iitc-portal-route-route',
    routeStructure: 'iitc-portal-route-route-structure',
    routeDirty: 'iitc-portal-route-route-dirty',
    routeLibrary: 'iitc-portal-route-library',
    routeLibraryDriveCache: 'iitc-portal-route-drive-library-cache',
    routeLibraryDriveFolderId: 'iitc-portal-route-drive-folder-id',
    routeLibraryDriveFolderName: 'iitc-portal-route-drive-folder-name',
    routeLibraryDriveFileId: 'iitc-portal-route-drive-file-id'
  };

  pr.TRAVEL_MODES = {
    drive: 'drive',
    bike: 'bike',
    walk: 'walk'
  };

  pr.ROUTING_PROVIDERS = {
    google: 'google',
    ors: 'ors'
  };

  pr.DEFAULT_SETTINGS = {
    defaultStopMinutes: 5,
    includeReturnToStart: false,
    startOnCurrentLocation: false,
    routingProvider: pr.ROUTING_PROVIDERS.google,
    defaultTravelMode: pr.TRAVEL_MODES.drive,
    driveSpeedMph: 30,
    bikeSpeedMph: 10,
    walkSpeedMph: 3,
    orsApiKey: '',
    orsBaseUrl: 'https://api.openrouteservice.org',
    routeLineColor: '#ff7f00',
    routeLineWeight: 5,
    routeLineStyle: 'solid',
    homeTitle: 'Home',
    homeLat: '',
    homeLng: '',
    googleDriveOAuthClientId: '',
    showSegmentTimesOnMap: false,
    showMiniControl: true,
    showPortalDetailsControls: true
  };
