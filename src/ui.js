  pr.setBusy = function(isBusy) {
    var panel = document.getElementById(pr.DOM_IDS.dialogContent);
    if (panel) panel.classList.toggle('portal-route-busy', !!isBusy);
  };

  pr.showMessage = function(message) {
    var node = document.getElementById('portal-route-message');
    if (node) {
      node.textContent = message;
      node.classList.add('portal-route-message-visible');
      window.setTimeout(function() {
        node.classList.remove('portal-route-message-visible');
      }, 5000);
    } else {
      console.log('Portal Route:', message);
    }
  };

  pr.selectedStopIndex = function() {
    var guid = window.selectedPortal;
    if (!guid) return -1;
    for (var i = 0; i < pr.state.stops.length; i++) {
      if (pr.state.stops[i].guid === guid) return i;
    }
    return -1;
  };

  pr.removeSelectedPortal = function() {
    var index = pr.selectedStopIndex();
    if (index < 0) {
      pr.showMessage('Selected portal is not in the route.');
      return;
    }
    pr.removeStop(index);
  };

  pr.toggleSelectedPortalStop = function() {
    if (pr.selectedStopIndex() >= 0) {
      pr.removeSelectedPortal();
    } else {
      pr.addSelectedPortal();
    }
  };

  pr.closeDialog = function() {
    var content = document.getElementById(pr.DOM_IDS.dialogContent);
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

  pr.handleAction = function(action, target) {
    if (pr.isLayerEnabled && !pr.isLayerEnabled()) {
      pr.syncLayerUi();
      return;
    }

    if (action === 'open-main') {
      pr.state.panelView = 'main';
      pr.state.panelOpen = true;
      pr.savePanelOpen();
      pr.renderPanel();
    } else if (action === 'open-edit') {
      pr.state.panelView = 'main';
      pr.state.panelOpen = true;
      pr.savePanelOpen();
      pr.renderPanel();
    } else if (action === 'close-panel') {
      pr.state.panelOpen = false;
      pr.savePanelOpen();
      pr.closeDialog();
    } else if (action === 'toggle-selected-stop') {
      pr.toggleSelectedPortalStop();
    } else if (action === 'add-selected-stop') {
      pr.addSelectedPortal();
    } else if (action === 'move-stop-up') {
      pr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) - 1);
    } else if (action === 'move-stop-down') {
      pr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) + 1);
    } else if (action === 'remove-stop') {
      pr.removeStop(Number(target.getAttribute('data-index')));
    } else if (action === 'select-stop') {
      pr.selectStopPortal(Number(target.getAttribute('data-index')), false);
    } else if (action === 'select-stop-center') {
      pr.selectStopPortal(Number(target.getAttribute('data-index')), true);
    } else if (action === 'calculate-route') {
      pr.calculateRoute();
    } else if (action === 'open-google-maps') {
      pr.openGoogleMaps();
    } else if (action === 'export-route-json') {
      pr.exportRouteJson();
    } else if (action === 'import-route-json') {
      pr.importRouteJson();
    } else if (action === 'print-route') {
      pr.printRoute();
    } else if (action === 'clear-route') {
      pr.clearStops();
    }
  };

  pr.isLayerEnabled = function() {
    if (!window.map || !pr.layerGroup) return true;
    return window.map.hasLayer(pr.layerGroup);
  };

  pr.createMiniControl = function() {
    if (!window.L || !window.map) return;
    if (pr.state.miniControl || document.getElementById(pr.DOM_IDS.miniControl)) return;

    var PortalRouteControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function() {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control portal-route-mini-control iitc-plugin-portal-route-control');
        container.id = pr.DOM_IDS.miniControl;
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        container.addEventListener('click', function(ev) {
          var button = ev.target.closest('[data-action]');
          if (!button) return;
          ev.preventDefault();
          pr.handleAction(button.getAttribute('data-action'), button);
        });
        return container;
      }
    });

    pr.state.miniControl = new PortalRouteControl();
    window.map.addControl(pr.state.miniControl);
    pr.setMiniControlVisible(pr.isLayerEnabled());
  };

  pr.setMiniControlVisible = function(isVisible) {
    var container = document.getElementById(pr.DOM_IDS.miniControl);
    if (container) container.style.display = isVisible ? '' : 'none';
  };

  pr.removeMiniControl = function() {
    if (pr.state.miniControl && window.map) {
      try {
        window.map.removeControl(pr.state.miniControl);
      } catch (e) {
        console.warn('Portal Route: unable to remove mini control', e);
      }
    }

    pr.state.miniControl = null;

    var container = document.getElementById(pr.DOM_IDS.miniControl);
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  pr.renderMiniControl = function() {
    var container = document.getElementById(pr.DOM_IDS.miniControl);
    if (!container) return;

    if (!pr.isLayerEnabled()) {
      pr.setMiniControlVisible(false);
      return;
    }

    pr.setMiniControlVisible(true);

    var selectedIndex = pr.selectedStopIndex();
    var selectedInRoute = selectedIndex >= 0;
    var addRemoveClass = selectedInRoute ? ' portal-route-mini-remove' : '';
    var addRemoveText = selectedInRoute ? '-' : '+';
    var addRemoveTitle = selectedInRoute ? 'Remove selected portal from route' : 'Add selected portal to route';
    var plotTitle = pr.state.routeDirty ? 'Replot route on map' : 'Plot route on map';

    container.innerHTML = '' +
      '<a href="#" title="Open route in Google Maps" data-action="open-google-maps">M</a>' +
      '<a href="#" title="' + plotTitle + '" data-action="calculate-route">P</a>' +
      '<a href="#" class="portal-route-mini-add' + addRemoveClass + '" title="' + addRemoveTitle + '" data-action="toggle-selected-stop">' + addRemoveText + '</a>' +
      '<a href="#" title="Open Portal Route menu" data-action="open-main">' + pr.state.stops.length + '</a>' +
      '<a href="#" title="Portal Route menu" data-action="open-main">=</a>';
  };

  pr.setupDialogEventHandlers = function() {
    if (pr.dialogEventsRegistered) return;
    pr.dialogEventsRegistered = true;

    document.addEventListener('click', function(ev) {
      var panel = ev.target.closest('#' + pr.DOM_IDS.dialogContent);
      if (!panel) return;

      var target = ev.target.closest('[data-action]');
      var action = target && target.getAttribute('data-action');
      if (!action) return;

      ev.preventDefault();
      pr.handleAction(action, target);
    });

    document.addEventListener('dragstart', function(ev) {
      var panel = ev.target.closest('#' + pr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.portal-route-stop');
      if (!item) return;

      pr.state.dragStopIndex = Number(item.getAttribute('data-index'));
      ev.dataTransfer.effectAllowed = 'move';
      item.classList.add('portal-route-dragging');
    });

    document.addEventListener('dragend', function(ev) {
      var item = ev.target.closest('.portal-route-stop');
      if (item) item.classList.remove('portal-route-dragging');
      pr.state.dragStopIndex = null;
    });

    document.addEventListener('dragover', function(ev) {
      var panel = ev.target.closest('#' + pr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.portal-route-stop');
      if (!item) return;

      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
    });

    document.addEventListener('drop', function(ev) {
      var panel = ev.target.closest('#' + pr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.portal-route-stop');
      if (!item) return;

      ev.preventDefault();

      var fromIndex = pr.state.dragStopIndex;
      var toIndex = Number(item.getAttribute('data-index'));
      pr.state.dragStopIndex = null;

      pr.moveStop(fromIndex, toIndex);
    });

    document.addEventListener('change', function(ev) {
      var panel = ev.target.closest('#' + pr.DOM_IDS.dialogContent);
      if (!panel) return;

      var target = ev.target;
      if (target && target.getAttribute('data-field') === 'show-segment-times-on-map') {
        pr.state.settings.showSegmentTimesOnMap = !!target.checked;
        pr.saveSettings();
        pr.redrawSegmentTimeLabels();
        return;
      }

      if (target && target.getAttribute('data-field') === 'default-stop-minutes') {
        var value = pr.parseDurationMinutes(target.value);
        if (value === null) {
          pr.showMessage('Invalid duration. Use values like 15m, 1.5h, or 2d.');
          target.value = pr.formatDurationInput(pr.state.settings.defaultStopMinutes);
          return;
        }

        pr.state.settings.defaultStopMinutes = value;
        pr.saveSettings();
        pr.markRouteStale();
        pr.renderPanel();
      } else if (target && target.getAttribute('data-field') === 'stop-minutes') {
        var stopIndex = Number(target.getAttribute('data-index'));
        var stopValue = pr.parseDurationMinutes(target.value);
        if (stopValue === null) {
          pr.showMessage('Invalid duration. Use values like 15m, 1.5h, or 2d.');
          target.value = pr.formatDurationInput(pr.getEffectiveStopMinutes(pr.state.stops[stopIndex]));
          return;
        }

        pr.setStopMinutes(stopIndex, stopValue);
      }
    });
  };

  pr.addToolboxLink = function() {
    if (!document.getElementById('toolbox')) return;
    if (document.getElementById(pr.DOM_IDS.toolboxLink)) return;

    var link = document.createElement('a');
    link.id = pr.DOM_IDS.toolboxLink;
    link.href = '#';
    link.textContent = 'Portal Route';
    link.addEventListener('click', function(ev) {
      ev.preventDefault();
      if (!pr.isLayerEnabled()) return;
      pr.state.panelView = 'main';
      pr.state.panelOpen = true;
      pr.savePanelOpen();
      pr.renderPanel();
    });

    var toolbox = document.getElementById('toolbox');
    toolbox.appendChild(link);
  };

  pr.removeToolboxLink = function() {
    var link = document.getElementById(pr.DOM_IDS.toolboxLink);
    if (link && link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  pr.injectCss = function() {
    if (document.getElementById(pr.DOM_IDS.css)) return;
    var style = document.createElement('style');
    style.id = pr.DOM_IDS.css;
    style.textContent = pr.CSS;
    document.head.appendChild(style);
  };


  pr.setupLayerControl = function() {
    if (pr.layerGroup) return;

    pr.layerGroup = L.FeatureGroup ? new L.FeatureGroup() : L.layerGroup();

    if (typeof window.addLayerGroup === 'function') {
      window.addLayerGroup('Portal Route', pr.layerGroup, true);
    } else if (window.layerChooser && typeof window.layerChooser.addOverlay === 'function') {
      window.layerChooser.addOverlay(pr.layerGroup, 'Portal Route');
      pr.layerGroup.addTo(window.map);
    }
  };

  pr.syncLayerUi = function() {
    if (pr.isLayerEnabled()) {
      pr.addToolboxLink();
      pr.createMiniControl();
      pr.setMiniControlVisible(true);
      pr.renderMiniControl();
      return;
    }

    pr.state.panelOpen = false;
    pr.savePanelOpen();
    pr.closeDialog();
    pr.setMiniControlVisible(false);
    pr.removeToolboxLink();
  };

  pr.enable = function() {
    pr.addToolboxLink();
    pr.createMiniControl();
    pr.setMiniControlVisible(true);
    pr.renderMiniControl();
    pr.redrawLabels();
  };

  pr.disable = function() {
    pr.state.panelOpen = false;
    pr.savePanelOpen();
    pr.closeDialog();
    pr.setMiniControlVisible(false);
    pr.removeToolboxLink();
  };

  pr.setupLayerEvents = function() {
    if (pr.layerEventsRegistered) return;
    if (!window.map || !pr.layerGroup) return;

    window.map.on('layeradd', function(e) {
      if (e.layer !== pr.layerGroup) return;
      pr.enable();
    });

    window.map.on('layerremove', function(e) {
      if (e.layer !== pr.layerGroup) return;
      pr.disable();
    });

    pr.layerEventsRegistered = true;
  };

  pr.setup = function() {
    try {
      if (plugin_info && plugin_info.script && plugin_info.script.version) {
        pr.VERSION = plugin_info.script.version;
      }

      pr.injectCss();
      pr.loadState();
      pr.setupLayerControl();
      pr.setupLayerEvents();
      pr.createMiniControl();
      pr.setupDialogEventHandlers();
      pr.addToolboxLink();
      pr.syncLayerUi();
      pr.renderPanel();
      pr.renderMiniControl();
      pr.redrawLabels();
      pr.redrawRouteLine();

      if (typeof window.addHook === 'function' && !pr.portalHookRegistered) {
        window.addHook('portalDetailsUpdated', function() {
          pr.injectPortalDetailsAction();
          pr.renderMiniControl();
        });
        pr.portalHookRegistered = true;
      }

      console.log('Portal Route setup complete');
    } catch (e) {
      console.error('Portal Route setup failed:', e);
    }
  };
