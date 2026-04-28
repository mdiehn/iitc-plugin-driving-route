function wrapper(plugin_info) {
  if (typeof window.plugin !== 'function') window.plugin = function() {};
  window.plugin.portalRoute = window.plugin.portalRoute || {};

  var pr = window.plugin.portalRoute;
