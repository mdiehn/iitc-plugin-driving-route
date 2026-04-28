  pr.GOOGLE_MAPS_TOTAL_POINT_LIMIT = 11;
  pr.GOOGLE_MAPS_INTERMEDIATE_STOP_LIMIT = 9;
  pr.ROUTE_EXPORT_FORMAT = 'portal-route.v1';

  pr.googleMapsUrl = function() {
    var stops = pr.state.stops;
    if (stops.length < 2) return null;

    var origin = stops[0];
    var destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1);

    var params = new URLSearchParams();
    params.set('api', '1');
    params.set('travelmode', 'driving');
    params.set('origin', origin.lat + ',' + origin.lng);
    params.set('destination', destination.lat + ',' + destination.lng);

    if (waypoints.length > 0) {
      params.set('waypoints', waypoints.map(function(stop) {
        return stop.lat + ',' + stop.lng;
      }).join('|'));
    }

    return 'https://www.google.com/maps/dir/?' + params.toString();
  };

  pr.googleMapsOmittedStops = function() {
    var stops = pr.state.stops || [];
    if (stops.length <= pr.GOOGLE_MAPS_TOTAL_POINT_LIMIT) return [];

    // Google Maps appears to honor origin, destination, and the first 9
    // intermediate stops. The stops after that, before the final destination,
    // are the ones most likely to be omitted.
    return stops.slice(
      pr.GOOGLE_MAPS_INTERMEDIATE_STOP_LIMIT + 1,
      stops.length - 1
    );
  };

  pr.googleMapsExportWarning = function() {
    var omitted = pr.googleMapsOmittedStops();
    if (omitted.length === 0) return null;

    var lines = [
      'Google Maps appears to support only 11 total route points:',
      'start, final destination, and 9 intermediate stops.',
      '',
      'This route has ' + pr.state.stops.length + ' points. These stops may be omitted by Google Maps:'
    ];

    omitted.forEach(function(stop, index) {
      var stopNumber = pr.GOOGLE_MAPS_INTERMEDIATE_STOP_LIMIT + 2 + index;
      lines.push(stopNumber + '. ' + stop.title);
    });

    lines.push('');
    lines.push('Open Google Maps anyway?');

    return lines.join('\n');
  };

  pr.openGoogleMaps = function() {
    var url = pr.googleMapsUrl();
    if (!url) {
      pr.showMessage('Add at least two portals first.');
      return;
    }

    var warning = pr.googleMapsExportWarning();
    if (warning && !window.confirm(warning)) {
      pr.showMessage('Google Maps export canceled.');
      return;
    }

    window.open(url, '_blank', 'noopener');
  };

  pr.routeExportData = function() {
    return {
      format: pr.ROUTE_EXPORT_FORMAT,
      plugin: pr.ID,
      pluginName: pr.NAME,
      pluginVersion: pr.VERSION,
      exportedAt: new Date().toISOString(),
      settings: Object.assign({}, pr.state.settings),
      stops: pr.state.stops.map(function(stop) {
        return {
          guid: stop.guid || null,
          title: stop.title || 'Unnamed portal',
          lat: Number(stop.lat),
          lng: Number(stop.lng),
          stopMinutes: typeof stop.stopMinutes === 'number' ? stop.stopMinutes : null
        };
      }),
      route: pr.state.route || null,
      routeDirty: !!pr.state.routeDirty
    };
  };

  pr.routeExportFilename = function() {
    var stamp = new Date().toISOString().replace(/[:.]/g, '-');
    return 'portal-route-' + stamp + '.json';
  };

  pr.downloadTextFile = function(filename, text, mimeType) {
    var blob = new Blob([text], { type: mimeType || 'text/plain' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
  };

  pr.exportRouteJson = function() {
    if (!pr.state.stops.length) {
      pr.showMessage('No route to export.');
      return;
    }

    var json = JSON.stringify(pr.routeExportData(), null, 2);
    pr.downloadTextFile(pr.routeExportFilename(), json, 'application/json');
    pr.showMessage('Route JSON exported.');
  };

  pr.normalizeImportedStop = function(stop) {
    if (!stop || typeof stop !== 'object') return null;

    var lat = Number(stop.lat);
    var lng = Number(stop.lng);
    if (!isFinite(lat) || !isFinite(lng)) return null;

    var stopMinutes = null;
    if (stop.stopMinutes !== null && stop.stopMinutes !== undefined && stop.stopMinutes !== '') {
      stopMinutes = Number(stop.stopMinutes);
      if (!isFinite(stopMinutes) || stopMinutes < 0) stopMinutes = null;
      if (stopMinutes !== null) stopMinutes = Math.round(stopMinutes);
    }

    return {
      guid: stop.guid || null,
      title: stop.title || 'Unnamed portal',
      lat: lat,
      lng: lng,
      stopMinutes: stopMinutes
    };
  };

  pr.importRouteData = function(data) {
    if (!data || typeof data !== 'object') throw new Error('Import data is not an object.');
    if (!Array.isArray(data.stops)) throw new Error('Import data does not contain a stops array.');

    var stops = data.stops.map(pr.normalizeImportedStop).filter(Boolean);
    if (stops.length !== data.stops.length) throw new Error('One or more stops are missing valid coordinates.');

    pr.state.stops = stops;
    pr.state.settings = Object.assign({}, pr.DEFAULT_SETTINGS, data.settings || {});
    pr.state.route = data.route && Array.isArray(data.route.legs) ? data.route : null;
    pr.state.routeDirty = !!pr.state.route || !!data.routeDirty;

    pr.saveSettings();
    pr.saveStops();
    pr.saveRoute();
    pr.redrawLabels();
    pr.redrawRouteLine();
    pr.redrawSegmentTimeLabels();
    pr.renderPanel();
    pr.showMessage('Route imported. Replot before using route totals.');
  };

  pr.importRouteJsonText = function(text) {
    var data = JSON.parse(text);
    pr.importRouteData(data);
  };

  pr.importRouteJson = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.style.display = 'none';

    input.addEventListener('change', function() {
      var file = input.files && input.files[0];
      if (!file) {
        if (input.parentNode) input.parentNode.removeChild(input);
        return;
      }

      var reader = new FileReader();
      reader.onload = function() {
        try {
          pr.importRouteJsonText(String(reader.result || ''));
        } catch (e) {
          console.warn('Portal Route: route import failed', e);
          pr.showMessage('Route import failed: ' + e.message);
        }
        if (input.parentNode) input.parentNode.removeChild(input);
      };
      reader.onerror = function() {
        pr.showMessage('Route import failed while reading file.');
        if (input.parentNode) input.parentNode.removeChild(input);
      };
      reader.readAsText(file);
    });

    document.body.appendChild(input);
    input.click();
  };

  pr.printableLegText = function(leg) {
    if (!leg) return '---- / ----';

    var duration = leg.durationText || pr.formatDuration(leg.durationSeconds);
    var distance = leg.distanceText || pr.formatDistance(leg.distanceMeters);
    return duration + ' / ' + distance;
  };

  pr.printRoute = function() {
    if (!pr.state.stops.length) {
      pr.showMessage('No route to print.');
      return;
    }

    var route = pr.state.route;
    var legsByFromIndex = {};
    if (route && Array.isArray(route.legs)) {
      route.legs.forEach(function(leg) { legsByFromIndex[leg.fromIndex] = leg; });
    }

    var totals = route && route.totals ? route.totals : null;
    var generatedAt = new Date().toLocaleString();
    var rows = pr.state.stops.map(function(stop, index) {
      var wait = pr.formatDurationInput(pr.getEffectiveStopMinutes(stop));
      var legText = index < pr.state.stops.length - 1 ? pr.printableLegText(legsByFromIndex[index]) : '';

      return '<tr>' +
        '<td class="num">' + (index + 1) + '</td>' +
        '<td><div class="title">' + pr.escapeHtml(stop.title) + '</div><div class="coords">' + pr.escapeHtml(stop.lat + ', ' + stop.lng) + '</div></td>' +
        '<td>' + pr.escapeHtml(wait) + '</td>' +
        '<td>' + pr.escapeHtml(legText) + '</td>' +
        '</tr>';
    }).join('');

    var totalsHtml = totals ? '<div class="totals">' +
      '<span><b>Drive:</b> ' + pr.escapeHtml(pr.formatDuration(totals.driveSeconds)) + '</span>' +
      '<span><b>Stops:</b> ' + pr.escapeHtml(pr.formatDuration(totals.stopSeconds)) + '</span>' +
      '<span><b>Trip:</b> ' + pr.escapeHtml(pr.formatDuration(totals.tripSeconds)) + '</span>' +
      '<span><b>Distance:</b> ' + pr.escapeHtml(pr.formatDistance(totals.distanceMeters)) + '</span>' +
      '</div>' : '<div class="warning">Route has not been plotted.</div>';

    var staleHtml = pr.state.routeDirty ? '<div class="warning">Route data is stale. Replot before relying on route totals or leg data.</div>' : '';

    var html = '<!doctype html><html><head><meta charset="utf-8">' +
      '<title>Portal Route</title>' +
      '<style>' +
      'body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:24px;color:#111;}' +
      'h1{font-size:22px;margin:0 0 4px 0;}' +
      '.meta{font-size:12px;color:#555;margin-bottom:16px;}' +
      '.totals{display:flex;flex-wrap:wrap;gap:12px;margin:12px 0 16px 0;padding:8px;border:1px solid #ccc;}' +
      '.warning{margin:12px 0;padding:8px;border:1px solid #c90;background:#fff8d0;}' +
      'table{width:100%;border-collapse:collapse;font-size:13px;}' +
      'th,td{border-bottom:1px solid #ddd;padding:6px;text-align:left;vertical-align:top;}' +
      'th{font-size:12px;color:#333;background:#f3f3f3;}' +
      '.num{width:32px;text-align:right;color:#555;}' +
      '.title{font-weight:600;}' +
      '.coords{font-size:11px;color:#666;margin-top:2px;}' +
      '@media print{body{margin:12mm}.no-print{display:none}}' +
      '</style></head><body>' +
      '<h1>Portal Route</h1>' +
      '<div class="meta">Generated ' + pr.escapeHtml(generatedAt) + '</div>' +
      staleHtml + totalsHtml +
      '<table><thead><tr><th>#</th><th>Portal</th><th>Wait</th><th>Next leg</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="no-print"><button onclick="window.print()">Print</button></p>' +
      '</body></html>';

    var printWindow = window.open('', '_blank');
    if (!printWindow) {
      pr.showMessage('Popup blocked while opening printable route.');
      return;
    }

    try {
      printWindow.document.open('text/html', 'replace');
      printWindow.document.write(html);
      printWindow.document.close();
      if (printWindow.focus) printWindow.focus();
    } catch (e) {
      console.warn('Portal Route: failed to render printable route', e);
      pr.showMessage('Unable to render printable route.');
    }
  };
