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

  dr.renderRouteSegment = function(leg) {
    if (!leg) return '';

    var duration = leg.durationText || dr.formatDuration(leg.durationSeconds);
    var distance = leg.distanceText || dr.formatDistance(leg.distanceMeters);

    return '<div class="driving-route-leg">' +
      '<span>' + dr.escapeHtml(duration) + '</span>' +
      '<span> / </span>' +
      '<span>' + dr.escapeHtml(distance) + '</span>' +
      '</div>';
  };

  dr.renderStopsList = function(legsByToIndex) {
    var stops = dr.state.stops;
    if (stops.length === 0) return dr.renderEmptyHelp();

    var html = '';
    html += '<div class="driving-route-waypoints-list">';

    stops.forEach(function(stop, index) {
      var waitValue = dr.formatDurationInput(dr.getEffectiveStopMinutes(stop));

      html += '<div class="driving-route-waypoint-row" data-index="' + index + '">';
      html += '<div class="driving-route-waypoint-num"><button type="button" class="driving-route-stop-num driving-route-waypoint-badge" title="Select and center portal" data-action="select-stop-center" data-index="' + index + '">' + (index + 1) + '</button></div>';
      html += '<div class="driving-route-waypoint-name-cell"><button type="button" class="driving-route-waypoint-name" title="Select portal" data-action="select-stop" data-index="' + index + '">' + dr.escapeHtml(stop.title) + '</button></div>';
      html += '<div class="driving-route-wait-cell"><input class="driving-route-wait-input" type="text" inputmode="decimal" value="' + dr.escapeHtml(waitValue) + '" title="Examples: 15m, 1.5h, 2d" data-field="stop-minutes" data-index="' + index + '"></div>';
      html += '<div class="driving-route-row-action"><button type="button" class="driving-route-row-button" title="Move up" data-action="move-stop-up" data-index="' + index + '" ' + (index === 0 ? 'disabled' : '') + '>&uarr;</button></div>';
      html += '<div class="driving-route-row-action"><button type="button" class="driving-route-row-button" title="Move down" data-action="move-stop-down" data-index="' + index + '" ' + (index === stops.length - 1 ? 'disabled' : '') + '>&darr;</button></div>';
      html += '<div class="driving-route-row-action"><button type="button" class="driving-route-row-button driving-route-remove-stop-button" title="Remove waypoint" data-action="remove-stop" data-index="' + index + '">X</button></div>';
      html += '</div>';

      if (index < stops.length - 1) {
        html += dr.renderRouteSegment(legsByToIndex[index + 1]);
      }
    });

    html += '</div>';
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
    html += dr.renderStopsList(legsByToIndex);

    html += '<label class="driving-route-setting">Default stop time <input type="text" inputmode="decimal" value="' + dr.escapeHtml(dr.formatDurationInput(dr.state.settings.defaultStopMinutes)) + '" title="Examples: 15m, 1.5h, 2d" data-field="default-stop-minutes"> per portal</label>';

    html += '<label class="driving-route-setting driving-route-checkbox-setting"><input type="checkbox" data-field="show-segment-times-on-map" ' + (dr.state.settings.showSegmentTimesOnMap ? 'checked ' : '') + '> Show segment times on map</label>';

    var plotLabel = dr.state.routeDirty ? 'Replot' : 'Plot';

    html += '<div class="driving-route-actions">';
    html += '<button type="button" data-action="add-selected-stop">Add</button>';
    html += '<button type="button" data-action="calculate-route">' + plotLabel + '</button>';
    html += '<button type="button" data-action="open-google-maps">Open Maps</button>';
    html += '<button type="button" data-action="clear-route">Clear</button>';
    html += '<button type="button" data-action="close-panel">Close</button>';
    html += '</div>';

    html += '<div class="driving-route-bottom-summary"><b>Waypoints:</b> ' + stops.length + '</div>';
    if (dr.state.routeDirty) {
      html += '<div class="driving-route-stale">Route needs replot.</div>';
    }
    html += dr.renderTotals(dr.state.route);
    if (dr.SHOW_VERSION_IN_PANEL) {
      html += '<div class="driving-route-version">Driving Route ' + dr.escapeHtml(dr.VERSION) + '</div>';
    }

    html += '<div class="driving-route-message" id="driving-route-message"></div>';
    html += '</div>';
    return html;
  };

  dr.renderEditPanel = function(legsByToIndex) {
    return dr.renderMainPanel(legsByToIndex);
  };


  dr.getDialogWidth = function() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 520;

    if (viewportWidth <= 640) {
      return Math.max(320, viewportWidth);
    }

    return Math.min(560, Math.max(460, viewportWidth - 40));
  };

  dr.isDialogOpen = function(content) {
    if (!content || !window.jQuery) return false;

    try {
      var dialogContent = window.jQuery(content).closest('.ui-dialog-content');
      return dialogContent.length > 0 && dialogContent.dialog('isOpen');
    } catch (e) {
      return false;
    }
  };

  dr.renderPanel = function() {
    if (dr.isLayerEnabled && !dr.isLayerEnabled()) {
      dr.closeDialog();
      return;
    }

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

    var contentHtml = dr.renderMainPanel(legsByToIndex);
    var existingContent = document.getElementById(dr.DOM_IDS.dialogContent);

    if (dr.isDialogOpen(existingContent)) {
      existingContent.innerHTML = contentHtml;
      return;
    }

    var html = '<div id="' + dr.DOM_IDS.dialogContent + '" class="driving-route-dialog-content">' + contentHtml + '</div>';

    if (typeof window.dialog === 'function') {
      window.dialog({
        id: dr.DOM_IDS.dialog,
        title: 'Driving Route',
        html: html,
        dialogClass: 'driving-route-dialog',
        width: dr.getDialogWidth()
      });

      var newContent = document.getElementById(dr.DOM_IDS.dialogContent);
      if (newContent && window.jQuery) {
        try {
          window.jQuery(newContent)
            .closest('.ui-dialog-content')
            .off('dialogclose.drivingRoute')
            .on('dialogclose.drivingRoute', function() {
              dr.state.panelOpen = false;
              dr.savePanelOpen();
            });
        } catch (e) {
          console.warn('Driving Route: failed to attach dialog close handler', e);
        }
      }
    } else {
      console.log('Driving Route: IITC dialog API is unavailable.');
    }
  };
