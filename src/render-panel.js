  pr.escapeHtml = function(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  pr.renderEmptyHelp = function() {
    return '<p class="portal-route-empty">There are no waypoints defined.<br>Select a portal and add it from the Portal Route control.</p>';
  };

  pr.renderRouteSegment = function(leg) {
    if (!leg) return '';

    var duration = leg.durationText || pr.formatDuration(leg.durationSeconds);
    var distance = leg.distanceText || pr.formatDistance(leg.distanceMeters);

    return '<div class="portal-route-leg">' +
      '<span>' + pr.escapeHtml(duration) + '</span>' +
      '<span> / </span>' +
      '<span>' + pr.escapeHtml(distance) + '</span>' +
      '</div>';
  };

  pr.renderStopsList = function(legsByToIndex) {
    var stops = pr.state.stops;
    if (stops.length === 0) return pr.renderEmptyHelp();

    var html = '';
    html += '<div class="portal-route-waypoints-list">';

    stops.forEach(function(stop, index) {
      var waitValue = pr.formatDurationInput(pr.getEffectiveStopMinutes(stop));

      html += '<div class="portal-route-waypoint-row" data-index="' + index + '">';
      html += '<div class="portal-route-waypoint-num"><button type="button" class="portal-route-stop-num portal-route-waypoint-badge" title="Select and center portal" data-action="select-stop-center" data-index="' + index + '">' + (index + 1) + '</button></div>';
      html += '<div class="portal-route-waypoint-name-cell"><button type="button" class="portal-route-waypoint-name" title="Select portal" data-action="select-stop" data-index="' + index + '">' + pr.escapeHtml(stop.title) + '</button></div>';
      html += '<div class="portal-route-wait-cell"><input class="portal-route-wait-input" type="text" inputmode="decimal" value="' + pr.escapeHtml(waitValue) + '" title="Examples: 15m, 1.5h, 2d" data-field="stop-minutes" data-index="' + index + '"></div>';
      html += '<div class="portal-route-row-action"><button type="button" class="portal-route-row-button" title="Move up" data-action="move-stop-up" data-index="' + index + '" ' + (index === 0 ? 'disabled' : '') + '>&uarr;</button></div>';
      html += '<div class="portal-route-row-action"><button type="button" class="portal-route-row-button" title="Move down" data-action="move-stop-down" data-index="' + index + '" ' + (index === stops.length - 1 ? 'disabled' : '') + '>&darr;</button></div>';
      html += '<div class="portal-route-row-action"><button type="button" class="portal-route-row-button portal-route-remove-stop-button" title="Remove waypoint" data-action="remove-stop" data-index="' + index + '">X</button></div>';
      html += '</div>';

      if (index < stops.length - 1) {
        html += pr.renderRouteSegment(legsByToIndex[index + 1]);
      }
    });

    html += '</div>';
    return html;
  };

  pr.renderTotals = function(route) {
    if (!route || !route.totals) return '';

    var html = '';
    html += '<div class="portal-route-totals">';
    html += '<div><span>Driving</span><strong>' + pr.formatDuration(route.totals.driveSeconds) + '</strong></div>';
    html += '<div><span>Stops</span><strong>' + pr.formatDuration(route.totals.stopSeconds) + '</strong></div>';
    html += '<div><span>Trip</span><strong>' + pr.formatDuration(route.totals.tripSeconds) + '</strong></div>';
    html += '<div><span>Distance</span><strong>' + pr.formatDistance(route.totals.distanceMeters) + '</strong></div>';
    html += '</div>';
    return html;
  };

  pr.renderMainPanel = function(legsByToIndex) {
    var stops = pr.state.stops;
    var html = '';

    html += '<div class="portal-route-body">';
    html += pr.renderStopsList(legsByToIndex);

    html += '<label class="portal-route-setting">Default stop time <input type="text" inputmode="decimal" value="' + pr.escapeHtml(pr.formatDurationInput(pr.state.settings.defaultStopMinutes)) + '" title="Examples: 15m, 1.5h, 2d" data-field="default-stop-minutes"> per portal</label>';

    html += '<label class="portal-route-setting portal-route-checkbox-setting"><input type="checkbox" data-field="show-segment-times-on-map" ' + (pr.state.settings.showSegmentTimesOnMap ? 'checked ' : '') + '> Show segment times on map</label>';

    var plotLabel = pr.state.routeDirty ? 'Replot' : 'Plot';

    html += '<div class="portal-route-actions">';
    html += '<button type="button" data-action="add-selected-stop">Add</button>';
    html += '<button type="button" data-action="calculate-route">' + plotLabel + '</button>';
    html += '<button type="button" data-action="open-google-maps">Open Maps</button>';
    html += '<button type="button" data-action="clear-route">Clear</button>';
    html += '<button type="button" data-action="close-panel">Close</button>';
    html += '</div>';

    html += '<div class="portal-route-bottom-summary"><b>Waypoints:</b> ' + stops.length + '</div>';
    if (pr.state.routeDirty) {
      html += '<div class="portal-route-stale">Route needs replot.</div>';
    }
    html += pr.renderTotals(pr.state.route);
    if (pr.SHOW_VERSION_IN_PANEL) {
      html += '<div class="portal-route-version">Portal Route ' + pr.escapeHtml(pr.VERSION) + '</div>';
    }

    html += '<div class="portal-route-message" id="portal-route-message"></div>';
    html += '</div>';
    return html;
  };

  pr.renderEditPanel = function(legsByToIndex) {
    return pr.renderMainPanel(legsByToIndex);
  };


  pr.getDialogWidth = function() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 520;

    if (viewportWidth <= 640) {
      return Math.max(320, viewportWidth);
    }

    return Math.min(560, Math.max(460, viewportWidth - 40));
  };

  pr.isDialogOpen = function(content) {
    if (!content || !window.jQuery) return false;

    try {
      var dialogContent = window.jQuery(content).closest('.ui-dialog-content');
      return dialogContent.length > 0 && dialogContent.dialog('isOpen');
    } catch (e) {
      return false;
    }
  };

  pr.renderPanel = function() {
    if (pr.isLayerEnabled && !pr.isLayerEnabled()) {
      pr.closeDialog();
      return;
    }

    pr.renderMiniControl();

    if (!pr.state.panelOpen) {
      pr.closeDialog();
      return;
    }

    var route = pr.state.route;
    var legsByToIndex = {};
    if (route && route.legs) {
      route.legs.forEach(function(leg) { legsByToIndex[leg.toIndex] = leg; });
    }

    var contentHtml = pr.renderMainPanel(legsByToIndex);
    var existingContent = document.getElementById(pr.DOM_IDS.dialogContent);

    if (pr.isDialogOpen(existingContent)) {
      existingContent.innerHTML = contentHtml;
      return;
    }

    var html = '<div id="' + pr.DOM_IDS.dialogContent + '" class="portal-route-dialog-content">' + contentHtml + '</div>';

    if (typeof window.dialog === 'function') {
      window.dialog({
        id: pr.DOM_IDS.dialog,
        title: 'Portal Route',
        html: html,
        dialogClass: 'portal-route-dialog',
        width: pr.getDialogWidth()
      });

      var newContent = document.getElementById(pr.DOM_IDS.dialogContent);
      if (newContent && window.jQuery) {
        try {
          window.jQuery(newContent)
            .closest('.ui-dialog-content')
            .off('dialogclose.portalRoute')
            .on('dialogclose.portalRoute', function() {
              pr.state.panelOpen = false;
              pr.savePanelOpen();
            });
        } catch (e) {
          console.warn('Portal Route: failed to attach dialog close handler', e);
        }
      }
    } else {
      console.log('Portal Route: IITC dialog API is unavailable.');
    }
  };
