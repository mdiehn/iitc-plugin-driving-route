  dr.setBusy = function(isBusy) {
    var panel = document.getElementById(dr.DOM_IDS.dialogContent);
    if (panel) panel.classList.toggle('driving-route-busy', !!isBusy);
  };

  dr.showMessage = function(message) {
    var node = document.getElementById('driving-route-message');
    if (node) {
      node.textContent = message;
      node.classList.add('driving-route-message-visible');
      window.setTimeout(function() {
        node.classList.remove('driving-route-message-visible');
      }, 5000);
    } else {
      console.log('Driving Route:', message);
    }
  };

  dr.selectedStopIndex = function() {
    var guid = window.selectedPortal;
    if (!guid) return -1;
    for (var i = 0; i < dr.state.stops.length; i++) {
      if (dr.state.stops[i].guid === guid) return i;
    }
    return -1;
  };

  dr.removeSelectedPortal = function() {
    var index = dr.selectedStopIndex();
    if (index < 0) {
      dr.showMessage('Selected portal is not in the route.');
      return;
    }
    dr.removeStop(index);
  };

  dr.toggleSelectedPortalStop = function() {
    if (dr.selectedStopIndex() >= 0) {
      dr.removeSelectedPortal();
    } else {
      dr.addSelectedPortal();
    }
  };

  dr.closeDialog = function() {
    var content = document.getElementById(dr.DOM_IDS.dialogContent);
    if (content && window.jQuery) {
      try {
        window.jQuery(content).closest('.ui-dialog-content').dialog('close');
        return;
      } catch (e) {
        // Fall through to hiding the content if the IITC dialog wrapper is unavailable.
      }
    }
    if (content) content.style.display = 'none';
  };

  dr.handleAction = function(action, target) {
    if (dr.isLayerEnabled && !dr.isLayerEnabled()) {
      dr.syncLayerUi();
      return;
    }

    if (action === 'open-main') {
      dr.state.panelView = 'main';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    } else if (action === 'open-edit') {
      dr.state.panelView = 'main';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    } else if (action === 'close-panel') {
      dr.state.panelOpen = false;
      dr.savePanelOpen();
      dr.closeDialog();
    } else if (action === 'toggle-selected-stop') {
      dr.toggleSelectedPortalStop();
    } else if (action === 'add-selected-stop') {
      dr.addSelectedPortal();
    } else if (action === 'move-stop-up') {
      dr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) - 1);
    } else if (action === 'move-stop-down') {
      dr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) + 1);
    } else if (action === 'remove-stop') {
      dr.removeStop(Number(target.getAttribute('data-index')));
    } else if (action === 'select-stop') {
      dr.selectStopPortal(Number(target.getAttribute('data-index')), false);
    } else if (action === 'select-stop-center') {
      dr.selectStopPortal(Number(target.getAttribute('data-index')), true);
    } else if (action === 'calculate-route') {
      dr.calculateRoute();
    } else if (action === 'open-google-maps') {
      dr.openGoogleMaps();
    } else if (action === 'clear-route') {
      dr.clearStops();
    }
  };

  dr.isLayerEnabled = function() {
    if (!window.map || !dr.layerGroup) return true;
    return window.map.hasLayer(dr.layerGroup);
  };

  dr.createMiniControl = function() {
    if (!window.L || !window.map) return;
    if (dr.state.miniControl || document.getElementById(dr.DOM_IDS.miniControl)) return;

    var DrivingRouteControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function() {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control driving-route-mini-control iitc-plugin-driving-route-control');
        container.id = dr.DOM_IDS.miniControl;
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        container.addEventListener('click', function(ev) {
          var button = ev.target.closest('[data-action]');
          if (!button) return;
          ev.preventDefault();
          dr.handleAction(button.getAttribute('data-action'), button);
        });
        return container;
      }
    });

    dr.state.miniControl = new DrivingRouteControl();
    window.map.addControl(dr.state.miniControl);
    dr.setMiniControlVisible(dr.isLayerEnabled());
  };

  dr.setMiniControlVisible = function(isVisible) {
    var container = document.getElementById(dr.DOM_IDS.miniControl);
    if (container) container.style.display = isVisible ? '' : 'none';
  };

  dr.removeMiniControl = function() {
    if (dr.state.miniControl && window.map) {
      try {
        window.map.removeControl(dr.state.miniControl);
      } catch (e) {
        console.warn('Driving Route: unable to remove mini control', e);
      }
    }

    dr.state.miniControl = null;

    var container = document.getElementById(dr.DOM_IDS.miniControl);
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  dr.renderMiniControl = function() {
    var container = document.getElementById(dr.DOM_IDS.miniControl);
    if (!container) return;

    if (!dr.isLayerEnabled()) {
      dr.setMiniControlVisible(false);
      return;
    }

    dr.setMiniControlVisible(true);

    var selectedIndex = dr.selectedStopIndex();
    var selectedInRoute = selectedIndex >= 0;
    var addRemoveClass = selectedInRoute ? ' driving-route-mini-remove' : '';
    var addRemoveText = selectedInRoute ? '-' : '+';
    var addRemoveTitle = selectedInRoute ? 'Remove selected portal from route' : 'Add selected portal to route';
    var plotTitle = dr.state.routeDirty ? 'Replot route on map' : 'Plot route on map';

    container.innerHTML = '' +
      '<a href="#" title="Open route in Google Maps" data-action="open-google-maps">M</a>' +
      '<a href="#" title="' + plotTitle + '" data-action="calculate-route">P</a>' +
      '<a href="#" class="driving-route-mini-add' + addRemoveClass + '" title="' + addRemoveTitle + '" data-action="toggle-selected-stop">' + addRemoveText + '</a>' +
      '<a href="#" title="Open Driving Route menu" data-action="open-main">' + dr.state.stops.length + '</a>' +
      '<a href="#" title="Driving Route menu" data-action="open-main">=</a>';
  };

  dr.setupDialogEventHandlers = function() {
    if (dr.dialogEventsRegistered) return;
    dr.dialogEventsRegistered = true;

    document.addEventListener('click', function(ev) {
      var panel = ev.target.closest('#' + dr.DOM_IDS.dialogContent);
      if (!panel) return;

      var target = ev.target.closest('[data-action]');
      var action = target && target.getAttribute('data-action');
      if (!action) return;

      ev.preventDefault();
      dr.handleAction(action, target);
    });

    document.addEventListener('dragstart', function(ev) {
      var panel = ev.target.closest('#' + dr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.driving-route-stop');
      if (!item) return;

      dr.state.dragStopIndex = Number(item.getAttribute('data-index'));
      ev.dataTransfer.effectAllowed = 'move';
      item.classList.add('driving-route-dragging');
    });

    document.addEventListener('dragend', function(ev) {
      var item = ev.target.closest('.driving-route-stop');
      if (item) item.classList.remove('driving-route-dragging');
      dr.state.dragStopIndex = null;
    });

    document.addEventListener('dragover', function(ev) {
      var panel = ev.target.closest('#' + dr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.driving-route-stop');
      if (!item) return;

      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
    });

    document.addEventListener('drop', function(ev) {
      var panel = ev.target.closest('#' + dr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.driving-route-stop');
      if (!item) return;

      ev.preventDefault();

      var fromIndex = dr.state.dragStopIndex;
      var toIndex = Number(item.getAttribute('data-index'));
      dr.state.dragStopIndex = null;

      dr.moveStop(fromIndex, toIndex);
    });

    document.addEventListener('change', function(ev) {
      var panel = ev.target.closest('#' + dr.DOM_IDS.dialogContent);
      if (!panel) return;

      var target = ev.target;
      if (target && target.getAttribute('data-field') === 'show-segment-times-on-map') {
        dr.state.settings.showSegmentTimesOnMap = !!target.checked;
        dr.saveSettings();
        dr.redrawSegmentTimeLabels();
        return;
      }

      if (target && target.getAttribute('data-field') === 'default-stop-minutes') {
        var value = dr.parseDurationMinutes(target.value);
        if (value === null) {
          dr.showMessage('Invalid duration. Use values like 15m, 1.5h, or 2d.');
          target.value = dr.formatDurationInput(dr.state.settings.defaultStopMinutes);
          return;
        }

        dr.state.settings.defaultStopMinutes = value;
        dr.saveSettings();
        dr.markRouteStale();
        dr.renderPanel();
      } else if (target && target.getAttribute('data-field') === 'stop-minutes') {
        var stopIndex = Number(target.getAttribute('data-index'));
        var stopValue = dr.parseDurationMinutes(target.value);
        if (stopValue === null) {
          dr.showMessage('Invalid duration. Use values like 15m, 1.5h, or 2d.');
          target.value = dr.formatDurationInput(dr.getEffectiveStopMinutes(dr.state.stops[stopIndex]));
          return;
        }

        dr.setStopMinutes(stopIndex, stopValue);
      }
    });
  };

  dr.addToolboxLink = function() {
    if (!document.getElementById('toolbox')) return;
    if (document.getElementById(dr.DOM_IDS.toolboxLink)) return;

    var link = document.createElement('a');
    link.id = dr.DOM_IDS.toolboxLink;
    link.href = '#';
    link.textContent = 'Driving Route';
    link.addEventListener('click', function(ev) {
      ev.preventDefault();
      if (!dr.isLayerEnabled()) return;
      dr.state.panelView = 'main';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    });

    var toolbox = document.getElementById('toolbox');
    toolbox.appendChild(link);
  };

  dr.removeToolboxLink = function() {
    var link = document.getElementById(dr.DOM_IDS.toolboxLink);
    if (link && link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  dr.injectCss = function() {
    if (document.getElementById(dr.DOM_IDS.css)) return;
    var style = document.createElement('style');
    style.id = dr.DOM_IDS.css;
    style.textContent = dr.CSS;
    document.head.appendChild(style);
  };


  dr.setupLayerControl = function() {
    if (dr.layerGroup) return;

    dr.layerGroup = L.FeatureGroup ? new L.FeatureGroup() : L.layerGroup();

    if (typeof window.addLayerGroup === 'function') {
      window.addLayerGroup('Driving Route', dr.layerGroup, true);
    } else if (window.layerChooser && typeof window.layerChooser.addOverlay === 'function') {
      window.layerChooser.addOverlay(dr.layerGroup, 'Driving Route');
      dr.layerGroup.addTo(window.map);
    }
  };

  dr.syncLayerUi = function() {
    if (dr.isLayerEnabled()) {
      dr.addToolboxLink();
      dr.createMiniControl();
      dr.setMiniControlVisible(true);
      dr.renderMiniControl();
      return;
    }

    dr.state.panelOpen = false;
    dr.savePanelOpen();
    dr.closeDialog();
    dr.setMiniControlVisible(false);
    dr.removeToolboxLink();
  };

  dr.enable = function() {
    dr.addToolboxLink();
    dr.createMiniControl();
    dr.setMiniControlVisible(true);
    dr.renderMiniControl();
    dr.redrawLabels();
  };

  dr.disable = function() {
    dr.state.panelOpen = false;
    dr.savePanelOpen();
    dr.closeDialog();
    dr.setMiniControlVisible(false);
    dr.removeToolboxLink();
  };

  dr.setupLayerEvents = function() {
    if (dr.layerEventsRegistered) return;
    if (!window.map || !dr.layerGroup) return;

    window.map.on('layeradd', function(e) {
      if (e.layer !== dr.layerGroup) return;
      dr.enable();
    });

    window.map.on('layerremove', function(e) {
      if (e.layer !== dr.layerGroup) return;
      dr.disable();
    });

    dr.layerEventsRegistered = true;
  };

  dr.setup = function() {
    try {
      if (plugin_info && plugin_info.script && plugin_info.script.version) {
        dr.VERSION = plugin_info.script.version;
      }

      dr.injectCss();
      dr.loadState();
      dr.setupLayerControl();
      dr.setupLayerEvents();
      dr.createMiniControl();
      dr.setupDialogEventHandlers();
      dr.addToolboxLink();
      dr.syncLayerUi();
      dr.renderPanel();
      dr.renderMiniControl();
      dr.redrawLabels();
      dr.redrawRouteLine();

      if (typeof window.addHook === 'function' && !dr.portalHookRegistered) {
        window.addHook('portalDetailsUpdated', function() {
          dr.injectPortalDetailsAction();
          dr.renderMiniControl();
        });
        dr.portalHookRegistered = true;
      }

      console.log('Driving Route setup complete');
    } catch (e) {
      console.error('Driving Route setup failed:', e);
    }
  };
