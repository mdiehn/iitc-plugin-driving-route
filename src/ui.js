  dr.setBusy = function(isBusy) {
    var panel = document.getElementById('driving-route-dialog-content');
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
    var content = document.getElementById('driving-route-dialog-content');
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
    if (action === 'open-main') {
      dr.state.panelView = 'main';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    } else if (action === 'open-edit') {
      dr.state.panelView = 'edit';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    } else if (action === 'close-panel') {
      dr.state.panelOpen = false;
      dr.savePanelOpen();
      dr.closeDialog();
    } else if (action === 'toggle-selected-stop') {
      dr.toggleSelectedPortalStop();
    } else if (action === 'move-stop-up') {
      dr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) - 1);
    } else if (action === 'move-stop-down') {
      dr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) + 1);
    } else if (action === 'remove-stop') {
      dr.removeStop(Number(target.getAttribute('data-index')));
    } else if (action === 'calculate-route') {
      dr.calculateRoute();
    } else if (action === 'open-google-maps') {
      dr.openGoogleMaps();
    } else if (action === 'clear-route') {
      dr.clearStops();
    }
  };

  dr.createMiniControl = function() {
    if (!window.L || !window.map) return;
    if (dr.state.miniControl) return;

    var DrivingRouteControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function() {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control driving-route-mini-control');
        container.id = 'driving-route-mini-control';
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
  };

  dr.renderMiniControl = function() {
    var container = document.getElementById('driving-route-mini-control');
    if (!container) return;

    var selectedIndex = dr.selectedStopIndex();
    var selectedInRoute = selectedIndex >= 0;
    var addRemoveClass = selectedInRoute ? ' driving-route-mini-remove' : '';
    var addRemoveText = selectedInRoute ? '-' : '+';
    var addRemoveTitle = selectedInRoute ? 'Remove selected portal from route' : 'Add selected portal to route';

    container.innerHTML = '' +
      '<a href="#" title="Open route in Google Maps" data-action="open-google-maps">M</a>' +
      '<a href="#" class="driving-route-mini-add' + addRemoveClass + '" title="' + addRemoveTitle + '" data-action="toggle-selected-stop">' + addRemoveText + '</a>' +
      '<a href="#" title="Edit waypoints" data-action="open-edit">' + dr.state.stops.length + '</a>' +
      '<a href="#" title="Driving Route menu" data-action="open-main">=</a>';
  };

  dr.setupDialogEventHandlers = function() {
    if (dr.dialogEventsRegistered) return;
    dr.dialogEventsRegistered = true;

    document.addEventListener('click', function(ev) {
      var panel = ev.target.closest('#driving-route-dialog-content');
      if (!panel) return;

      var target = ev.target.closest('[data-action]');
      var action = target && target.getAttribute('data-action');
      if (!action) return;

      ev.preventDefault();
      dr.handleAction(action, target);
    });

    document.addEventListener('dragstart', function(ev) {
      var panel = ev.target.closest('#driving-route-dialog-content');
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
      var panel = ev.target.closest('#driving-route-dialog-content');
      if (!panel) return;

      var item = ev.target.closest('.driving-route-stop');
      if (!item) return;

      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
    });

    document.addEventListener('drop', function(ev) {
      var panel = ev.target.closest('#driving-route-dialog-content');
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
      var panel = ev.target.closest('#driving-route-dialog-content');
      if (!panel) return;

      var target = ev.target;
      if (target && target.getAttribute('data-field') === 'default-stop-minutes') {
        var value = Math.max(0, Number(target.value || 0));
        dr.state.settings.defaultStopMinutes = value;
        dr.saveSettings();
        if (dr.state.route && dr.state.route.legs) {
          dr.state.route.totals = dr.calculateTotals(dr.state.route.legs);
        }
        dr.renderPanel();
      }
    });
  };

  dr.addToolboxLink = function() {
    if (!document.getElementById('toolbox')) return;
    if (document.getElementById('driving-route-toolbox-link')) return;

    var link = document.createElement('a');
    link.id = 'driving-route-toolbox-link';
    link.href = '#';
    link.textContent = 'Driving Route';
    link.addEventListener('click', function(ev) {
      ev.preventDefault();
      dr.state.panelView = 'main';
      dr.state.panelOpen = true;
      dr.savePanelOpen();
      dr.renderPanel();
    });

    var toolbox = document.getElementById('toolbox');
    toolbox.appendChild(link);
  };

  dr.injectCss = function() {
    if (document.getElementById('driving-route-css')) return;
    var style = document.createElement('style');
    style.id = 'driving-route-css';
    style.textContent = dr.CSS;
    document.head.appendChild(style);
  };

  dr.setup = function() {
    try {
      dr.injectCss();
      dr.loadState();
      dr.createMiniControl();
      dr.setupDialogEventHandlers();
      dr.addToolboxLink();
      dr.renderPanel();
      dr.renderMiniControl();
      dr.redrawLabels();

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
