  dr.escapeHtml = function(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  dr.renderEmptyHelp = function() {
    return '<p class="driving-route-empty">There are no waypoints defined.<br>Select a portal and add it from the Driving Route control.</p>';
  };

  dr.renderStopsList = function(legsByToIndex) {
    var stops = dr.state.stops;
    if (stops.length === 0) return dr.renderEmptyHelp();

    var html = '';
    html += '<ol class="driving-route-stops">';
    stops.forEach(function(stop, index) {
      var leg = legsByToIndex[index];
      html += '<li class="driving-route-stop" data-index="' + index + '" draggable="true">';
      html += '<div class="driving-route-stop-title"><span class="driving-route-stop-num">' + (index + 1) + '</span><span>' + dr.escapeHtml(stop.title) + '</span></div>';
      if (leg) {
        html += '<div class="driving-route-leg">Drive from previous: ' + dr.escapeHtml(leg.durationText || dr.formatDuration(leg.durationSeconds)) + ' · ' + dr.escapeHtml(leg.distanceText || dr.formatDistance(leg.distanceMeters)) + '</div>';
      }
      html += '<div class="driving-route-stop-meta">Stop: ' + dr.getEffectiveStopMinutes(stop) + ' min</div>';

      html += '<div class="driving-route-stop-actions">';
      html += '<button type="button" class="driving-route-small-button" data-action="remove-stop" data-index="' + index + '">Remove</button>';
      html += '<button type="button" class="driving-route-small-button" data-action="move-stop-up" data-index="' + index + '" ' + (index === 0 ? 'disabled' : '') + '>Up</button>';
      html += '<button type="button" class="driving-route-small-button" data-action="move-stop-down" data-index="' + index + '" ' + (index === stops.length - 1 ? 'disabled' : '') + '>Dn</button>';
      html += '</div>';

      html += '</li>';
    });
    html += '</ol>';
    return html;
  };

  dr.renderTotals = function(route) {
    if (!route || !route.totals) return '';

    var html = '';
    html += '<div class="driving-route-totals">';
    html += '<div><span>Driving</span><strong>' + dr.formatDuration(route.totals.driveSeconds) + '</strong></div>';
    html += '<div><span>Stops</span><strong>' + dr.formatDuration(route.totals.stopSeconds) + '</strong></div>';
    html += '<div><span>Trip</span><strong>' + dr.formatDuration(route.totals.tripSeconds) + '</strong></div>';
    html += '<div><span>Distance</span><strong>' + dr.formatDistance(route.totals.distanceMeters) + '</strong></div>';
    html += '</div>';
    return html;
  };

  dr.renderMainPanel = function(legsByToIndex) {
    var stops = dr.state.stops;
    var html = '';

    html += '<div class="driving-route-body">';
    html += '<p>Mark portals as waypoints to prepare a driving route.</p>';
    html += '<p class="driving-route-summary"><b>Waypoints:</b> ' + stops.length + '</p>';

    if (stops.length === 0) {
      html += dr.renderEmptyHelp();
    } else {
      html += '<div class="driving-route-compact-list">';
      stops.forEach(function(stop, index) {
        html += '<div><span class="driving-route-stop-num">' + (index + 1) + '</span> ' + dr.escapeHtml(stop.title) + '</div>';
      });
      html += '</div>';
    }

    html += dr.renderTotals(dr.state.route);

    html += '<label class="driving-route-setting">Stop time <input type="number" min="0" max="120" step="1" value="' + dr.escapeHtml(dr.state.settings.defaultStopMinutes) + '" data-field="default-stop-minutes"> min/portal</label>';

    html += '<div class="driving-route-actions">';
    html += '<button type="button" data-action="calculate-route">Calculate</button>';
    html += '<button type="button" data-action="open-google-maps">Open Maps</button>';
    html += '<button type="button" data-action="open-edit">Edit waypoints</button>';
    html += '<button type="button" data-action="clear-route">Clear</button>';
    html += '</div>';

    html += '<div class="driving-route-message" id="driving-route-message"></div>';
    html += '</div>';
    return html;
  };

  dr.renderEditPanel = function(legsByToIndex) {
    var html = '';
    html += '<div class="driving-route-body">';
    html += '<p>Change order or delete waypoints:</p>';
    html += dr.renderStopsList(legsByToIndex);
    html += '<div class="driving-route-actions driving-route-footer-actions">';
    html += '<button type="button" data-action="open-main">&lt; Main menu</button>';
    html += '<button type="button" data-action="clear-route">Clear all waypoints</button>';
    html += '<button type="button" data-action="close-panel">Close</button>';
    html += '</div>';
    html += '<div class="driving-route-message" id="driving-route-message"></div>';
    html += '</div>';
    return html;
  };

  dr.renderPanel = function() {
    dr.renderMiniControl();

    if (!dr.state.panelOpen) {
      dr.closeDialog();
      return;
    }

    var route = dr.state.route;
    var legsByToIndex = {};
    if (route && route.legs) {
      route.legs.forEach(function(leg) { legsByToIndex[leg.toIndex] = leg; });
    }

    var title = dr.state.panelView === 'edit' ? 'Driving Route - Edit waypoints' : 'Driving Route';
    var bodyHtml = dr.state.panelView === 'edit' ? dr.renderEditPanel(legsByToIndex) : dr.renderMainPanel(legsByToIndex);
    var html = '<div id="driving-route-dialog-content" class="driving-route-dialog-content">' + bodyHtml + '</div>';

    if (typeof window.dialog === 'function') {
      window.dialog({
        id: 'driving-route',
        title: title,
        html: html,
        dialogClass: 'driving-route-dialog',
        width: 'auto'
      });
    } else {
      console.log('Driving Route: IITC dialog API is unavailable.');
    }
  };
