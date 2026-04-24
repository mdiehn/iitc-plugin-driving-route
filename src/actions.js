window.plugin.drivingRoute.setup = function () {
  window.plugin.drivingRoute.loadSettings();
  window.plugin.drivingRoute.setupUi();
};

if (window.bootPlugins) {
  window.bootPlugins.push(window.plugin.drivingRoute.setup);
}

if (window.iitcLoaded) {
  window.plugin.drivingRoute.setup();
}
