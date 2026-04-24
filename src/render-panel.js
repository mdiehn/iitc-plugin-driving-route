  dr.escapeHtml = function(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  dr.renderPanel = function() {
    var panel = document.getElementById('driving-route-panel');
    if (!panel) return;

    panel.classList.toggle('driving-route-panel-collapsed', !dr.state.panelOpen);

    var stops = dr.state.stops;
    var route = dr.state.route;
    var legsByToIndex = {};
    if (route && route.legs) {
      route.legs.forEach(function(leg) { legsByToIndex[leg.toIndex] = leg; });
    }

    var html = '';
    html += '<div class="driving-route-header">';
    html += '<button class="driving-route-toggle" type="button" data-action="toggle-panel">' + (dr.state.panelOpen ? '−' : '+') + '</button>';
    html += '<strong>Driving Route</strong>';
    html += '<span class="driving-route-count">' + stops.length + ' stops</span>';
    html += '</div>';

    html += '<div class="driving-route-body">';
    html += '<label class="driving-route-setting">Stop time <input type="number" min="0" max="120" step="1" value="' + dr.escapeHtml(dr.state.settings.defaultStopMinutes) + '" data-field="default-stop-minutes"> min/portal</label>';

    if (stops.length === 0) {
      html += '<p class="driving-route-empty">Tap a portal, then use <b>Add to Driving Route</b>.</p>';
    } else {
      html += '<ol class="driving-route-stops">';
      stops.forEach(function(stop, index) {
        var leg = legsByToIndex[index];
        html += '<li class="driving-route-stop">';
        html += '<div class="driving-route-stop-title"><span class="driving-route-stop-num">' + (index + 1) + '</span><span>' + dr.escapeHtml(stop.title) + '</span></div>';
        if (leg) {
          html += '<div class="driving-route-leg">Drive from previous: ' + dr.escapeHtml(leg.durationText || dr.formatDuration(leg.durationSeconds)) + ' · ' + dr.escapeHtml(leg.distanceText || dr.formatDistance(leg.distanceMeters)) + '</div>';
        }
        html += '<div class="driving-route-stop-meta">Stop: ' + dr.getEffectiveStopMinutes(stop) + ' min</div>';
        html += '<button type="button" class="driving-route-small-button" data-action="remove-stop" data-index="' + index + '">Remove</button>';
        html += '</li>';
      });
      html += '</ol>';
    }

    if (route && route.totals) {
      html += '<div class="driving-route-totals">';
      html += '<div><span>Driving</span><strong>' + dr.formatDuration(route.totals.driveSeconds) + '</strong></div>';
      html += '<div><span>Stops</span><strong>' + dr.formatDuration(route.totals.stopSeconds) + '</strong></div>';
      html += '<div><span>Trip</span><strong>' + dr.formatDuration(route.totals.tripSeconds) + '</strong></div>';
      html += '<div><span>Distance</span><strong>' + dr.formatDistance(route.totals.distanceMeters) + '</strong></div>';
      html += '</div>';
    }

    html += '<div class="driving-route-actions">';
    html += '<button type="button" data-action="calculate-route">Calculate</button>';
    html += '<button type="button" data-action="open-google-maps">Open Maps</button>';
    html += '<button type="button" data-action="clear-route">Clear</button>';
    html += '</div>';
    html += '<div class="driving-route-message" id="driving-route-message"></div>';
    html += '</div>';

    panel.innerHTML = html;
    dr.enablePanelDragging(panel);
  };
