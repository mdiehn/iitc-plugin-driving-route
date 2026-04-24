  dr.setBusy = function(isBusy) {
    var panel = document.getElementById('driving-route-panel');
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

  dr.createPanel = function() {
    if (document.getElementById('driving-route-panel')) return;

    var panel = document.createElement('div');
    panel.id = 'driving-route-panel';
    panel.className = 'driving-route-panel';
    document.body.appendChild(panel);

    panel.addEventListener('click', function(ev) {
      var target = ev.target;
      var action = target && target.getAttribute('data-action');
      if (!action) return;

      if (action === 'toggle-panel') {
        dr.state.panelOpen = !dr.state.panelOpen;
        dr.savePanelOpen();
        dr.renderPanel();
      } else if (action === 'remove-stop') {
        dr.removeStop(Number(target.getAttribute('data-index')));
      } else if (action === 'calculate-route') {
        dr.calculateRoute();
      } else if (action === 'open-google-maps') {
        dr.openGoogleMaps();
      } else if (action === 'clear-route') {
        dr.clearStops();
      }
    });

    panel.addEventListener('change', function(ev) {
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
      console.log('Driving Route setup starting');

      dr.injectCss();
      console.log('Driving Route: css ok');

      dr.loadState();
      console.log('Driving Route: state ok');

      dr.createPanel();
      console.log('Driving Route: panel ok');

      dr.addToolboxLink();
      console.log('Driving Route: toolbox ok');

      dr.renderPanel();
      console.log('Driving Route: render ok');

      // dr.redrawLabels();
      // console.log('Driving Route: labels ok');

      // if (typeof window.addHook === 'function') {
      //   window.addHook('portalDetailsUpdated', dr.injectPortalDetailsAction);
      //   console.log('Driving Route: portal hook ok');
      // }

      console.log('Driving Route setup complete');
    } catch (e) {
      console.error('Driving Route setup failed:', e);
    }
  };