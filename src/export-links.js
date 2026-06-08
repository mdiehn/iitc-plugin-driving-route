  pr.GOOGLE_MAPS_TOTAL_POINT_LIMIT = 11;
  pr.GOOGLE_MAPS_INTERMEDIATE_STOP_LIMIT = 9;
  pr.APPLE_MAPS_TOTAL_POINT_LIMIT = 15;
  pr.ROUTE_EXPORT_FORMAT = 'portal-route.v1';
  pr.GOOGLE_MAPS_TRAVEL_MODES = {
    drive: 'driving',
    bike: 'bicycling',
    walk: 'walking'
  };

  pr.googleMapsTravelMode = function() {
    return pr.GOOGLE_MAPS_TRAVEL_MODES[pr.getTravelMode()] || 'driving';
  };

  pr.googleMapsUrlForStops = function(stops) {
    if (!stops || stops.length < 2) return null;
    var origin = stops[0];
    var destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1);

    var params = new URLSearchParams();
    params.set('api', '1');
    params.set('travelmode', pr.googleMapsTravelMode());
    params.set('origin', origin.lat + ',' + origin.lng);
    params.set('destination', destination.lat + ',' + destination.lng);

    if (waypoints.length > 0) {
      params.set('waypoints', waypoints.map(function(stop) {
        return stop.lat + ',' + stop.lng;
      }).join('|'));
    }

    return 'https://www.google.com/maps/dir/?' + params.toString();
  };

  pr.googleMapsUrl = function() {
    var stops = pr.getRouteStops();
    return pr.googleMapsUrlForStops(stops);
  };

  pr.routeExportProviders = {
    google: {
      id: 'google',
      label: 'Google Maps',
      pointLimit: pr.GOOGLE_MAPS_TOTAL_POINT_LIMIT,
      urlForStops: function(stops) {
        return pr.googleMapsUrlForStops(stops);
      },
      openStagesDialog: function(stages) {
        pr.openGoogleMapsStagesDialog(stages);
      }
    }
  };

  pr.appleMapsUrlForStops = function(stops) {
    if (!stops || stops.length < 2) return null;
    var origin = stops[0];
    var destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1);

    var params = new URLSearchParams();
    params.set('source', origin.lat + ',' + origin.lng);
    params.set('destination', destination.lat + ',' + destination.lng);
    params.set('mode', 'driving');

    waypoints.forEach(function(stop) {
      params.append('waypoint', stop.lat + ',' + stop.lng);
    });

    return 'https://maps.apple.com/directions?' + params.toString();
  };

  pr.appleMapsUrl = function() {
    var stops = pr.getRouteStops();
    return pr.appleMapsUrlForStops(stops);
  };

  pr.mapsStages = function(pointLimit, urlForStops) {
    var stops = pr.getRouteStops();
    if (stops.length < 2) return [];
    if (stops.length <= pointLimit) {
      return [{
        number: 1,
        fromIndex: 0,
        toIndex: stops.length - 1,
        stops: stops,
        url: urlForStops(stops)
      }];
    }

    var stages = [];
    var fromIndex = 0;
    while (fromIndex < stops.length - 1) {
      var toIndex = Math.min(fromIndex + pointLimit - 1, stops.length - 1);
      var stageStops = stops.slice(fromIndex, toIndex + 1);
      stages.push({
        number: stages.length + 1,
        fromIndex: fromIndex,
        toIndex: toIndex,
        stops: stageStops,
        url: urlForStops(stageStops)
      });
      fromIndex = toIndex;
    }
    return stages;
  };

  pr.googleMapsStages = function() {
    return pr.mapsStages(pr.routeExportProviders.google.pointLimit, pr.routeExportProviders.google.urlForStops);
  };

  pr.appleMapsStages = function() {
    return pr.mapsStages(pr.APPLE_MAPS_TOTAL_POINT_LIMIT, pr.appleMapsUrlForStops);
  };

  pr.formatMapsStageNumber = function(number) {
    return number < 10 ? '0' + number : String(number);
  };

  pr.openMapsStagesDialog = function(stages, options) {
    var html = '<div class="portal-route-dialog-content portal-route-maps-stages">';
    html += '<p class="portal-route-empty">' + pr.escapeHtml(options.message) + '</p>';
    html += '<div class="portal-route-control-group-buttons">';
    var longestTextLength = 0;
    stages.forEach(function(stage) {
      var fromStop = stage.stops[0];
      var toStop = stage.stops[stage.stops.length - 1];
      var label = 'Stage ' + stage.number + ': ' + pr.formatMapsStageNumber(stage.fromIndex + 1) + '-' + pr.formatMapsStageNumber(stage.toIndex + 1);
      var title = fromStop.title + ' to ' + toStop.title;
      longestTextLength = Math.max(longestTextLength, label.length, title.length);
      html += '<div class="portal-route-stage-item">';
      html += '<a class="portal-route-stage-link" target="_blank" rel="noopener" href="' + pr.escapeHtml(stage.url) + '" aria-label="' + pr.escapeHtml(label + ' - ' + title) + '" onclick="this.blur()">' + pr.escapeHtml(label) + '</a>';
      html += '<div class="portal-route-stage-summary">' + pr.escapeHtml(title) + '</div>';
      html += '</div>';
    });
    html += '</div></div>';

    if (typeof window.dialog === 'function') {
      var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 520;
      var maxWidth = Math.min(520, Math.max(320, viewportWidth - 40));
      var width = Math.min(maxWidth, Math.max(320, longestTextLength * 6 + 50));
      window.dialog({
        id: options.id,
        title: options.title,
        html: html,
        dialogClass: 'portal-route-dialog',
        width: width
      });
    } else {
      pr.showMessage('Route split into ' + stages.length + ' ' + options.name + ' stages.');
      window.open(stages[0].url, '_blank', 'noopener');
    }
  };

  pr.openGoogleMapsStagesDialog = function(stages) {
    pr.openMapsStagesDialog(stages, {
      id: 'iitc-plugin-portal-route-google-maps-stages',
      title: 'Google Maps stages',
      name: 'Google Maps',
      message: 'Google Maps uses up to 11 route points per link. Open each stage in order.'
    });
  };

  pr.openAppleMapsStagesDialog = function(stages) {
    pr.openMapsStagesDialog(stages, {
      id: 'iitc-plugin-portal-route-apple-maps-stages',
      title: 'Apple Maps stages',
      name: 'Apple Maps',
      message: 'Apple Maps uses up to 15 route points per link. Open each stage in order.'
    });
  };

  pr.openGoogleMaps = function() {
    var provider = pr.routeExportProviders.google;
    var stages = pr.googleMapsStages();
    if (!stages.length) {
      pr.showMessage('Add at least two waypoints first.');
      return;
    }

    if (stages.length > 1) {
      provider.openStagesDialog(stages);
      return;
    }

    window.open(stages[0].url, '_blank', 'noopener');
  };

  pr.openAppleMaps = function() {
    var stages = pr.appleMapsStages();
    if (!stages.length) {
      pr.showMessage('Add at least two waypoints first.');
      return;
    }

    if (stages.length > 1) {
      pr.openAppleMapsStagesDialog(stages);
      return;
    }

    window.open(stages[0].url, '_blank', 'noopener');
  };

  pr.routeExportData = function() {
    var stops = pr.serializeRouteStops(pr.state.stops);
    var routeStructure = pr.currentRouteStructureData ? pr.currentRouteStructureData() : null;
    var data = {
      format: pr.ROUTE_EXPORT_FORMAT,
      plugin: pr.ID,
      pluginName: pr.NAME,
      pluginVersion: pr.VERSION,
      exportedAt: new Date().toISOString(),
      settings: pr.routeLibrarySettings ? pr.routeLibrarySettings() : {
        defaultStopMinutes: pr.state.settings.defaultStopMinutes,
        includeReturnToStart: !!pr.state.settings.includeReturnToStart,
        routingProvider: pr.state.settings.routingProvider || pr.ROUTING_PROVIDERS.google,
        defaultTravelMode: pr.state.settings.defaultTravelMode || pr.TRAVEL_MODES.drive,
        driveSpeedMph: pr.state.settings.driveSpeedMph,
        bikeSpeedMph: pr.state.settings.bikeSpeedMph,
        walkSpeedMph: pr.state.settings.walkSpeedMph
      },
      stops: stops,
      route: pr.state.route || null,
      routeDirty: !!pr.state.routeDirty
    };

    if (routeStructure) {
      data.routeSchemaVersion = pr.SEGMENTED_ROUTE_SCHEMA_VERSION;
      data.routeData = {
        kind: routeStructure.kind,
        stops: stops,
        segments: routeStructure.segments,
        segmentOrder: routeStructure.segmentOrder
      };
    }

    return data;
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

  pr.normalizeStableRoutePartId = function(value, prefix, index, seenIds) {
    return pr.stableRoutePartId(value, prefix, index, seenIds);
  };

  pr.serializeRouteStop = function(stop, index, seenIds) {
    return {
      id: pr.normalizeStableRoutePartId(stop && stop.id, 'stop', index, seenIds),
      guid: stop && stop.guid || null,
      type: stop && (stop.type || (stop.guid ? 'portal' : 'map')) || 'map',
      title: stop && stop.title || ((stop && (stop.type || (stop.guid ? 'portal' : 'map'))) === 'map' ? 'Map point' : 'Unnamed portal'),
      lat: Number(stop && stop.lat),
      lng: Number(stop && stop.lng),
      stopMinutes: stop && typeof stop.stopMinutes === 'number' ? stop.stopMinutes : null,
      startOnMe: !!(stop && stop.startOnMe),
      home: ((stop && (stop.type || (stop.guid ? 'portal' : 'map'))) || 'map') === 'map' && !!(stop && stop.home),
      accuracy: stop && typeof stop.accuracy === 'number' ? stop.accuracy : null,
      updatedAt: stop && stop.updatedAt || null
    };
  };

  pr.serializeRouteStops = function(stops) {
    var seenIds = {};
    return (stops || []).map(function(stop, index) {
      return pr.serializeRouteStop(stop, index, seenIds);
    });
  };

  pr.normalizeImportedStop = function(stop, index, seenIds) {
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

    var guid = pr.stopGuidFromData(stop);
    var type = stop.type || (guid ? 'portal' : 'map');

    return {
      id: pr.normalizeStableRoutePartId(stop.id, 'stop', index, seenIds),
      guid: guid,
      type: type,
      title: pr.hydratedStopTitle(stop, type, index),
      lat: lat,
      lng: lng,
      stopMinutes: stopMinutes,
      startOnMe: !!stop.startOnMe,
      home: type === 'map' && !!stop.home,
      accuracy: typeof stop.accuracy === 'number' ? stop.accuracy : null,
      updatedAt: stop.updatedAt || null
    };
  };

  pr.normalizeRouteSegmentOrder = function(segments, segmentOrder) {
    var remaining = {};
    var ordered = [];

    segments.forEach(function(segment) {
      remaining[segment.id] = segment;
    });

    if (Array.isArray(segmentOrder)) {
      segmentOrder.forEach(function(segmentId) {
        segmentId = typeof segmentId === 'string' ? segmentId.trim() : '';
        if (!segmentId || !remaining[segmentId]) return;
        ordered.push(remaining[segmentId]);
        delete remaining[segmentId];
      });
    }

    segments.forEach(function(segment) {
      if (!remaining[segment.id]) return;
      ordered.push(segment);
      delete remaining[segment.id];
    });

    return ordered;
  };

  pr.normalizeRouteSegment = function(segment, index, seenIds) {
    if (!segment || typeof segment !== 'object') return null;

    var normalized = Object.assign({}, segment);
    normalized.id = pr.normalizeStableRoutePartId(segment.id, 'segment', index, seenIds);

    if (segment.startAnchor && typeof segment.startAnchor === 'object') {
      normalized.startAnchor = Object.assign({}, segment.startAnchor);
    }
    if (segment.endAnchor && typeof segment.endAnchor === 'object') {
      normalized.endAnchor = Object.assign({}, segment.endAnchor);
    }
    if (segment.waypointRange && typeof segment.waypointRange === 'object') {
      normalized.waypointRange = Object.assign({}, segment.waypointRange);
    }

    return normalized;
  };

  pr.normalizeRouteStructure = function(routeData, fallbackStops) {
    routeData = routeData && typeof routeData === 'object' ? routeData : null;

    var rawStops = routeData && Array.isArray(routeData.stops) ? routeData.stops : fallbackStops;
    if (!Array.isArray(rawStops)) return null;

    var seenStopIds = {};
    var stops = rawStops.map(function(stop, index) {
      return pr.normalizeImportedStop(stop, index, seenStopIds);
    }).filter(Boolean);
    if (stops.length !== rawStops.length) return null;

    var hasSegments = !!(routeData && (Array.isArray(routeData.segments) || Array.isArray(routeData.segmentOrder) || typeof routeData.kind === 'string'));
    if (!hasSegments) return {
      schemaVersion: pr.LINEAR_ROUTE_SCHEMA_VERSION,
      kind: pr.ROUTE_KIND_LINEAR,
      stops: stops,
      segments: [],
      segmentOrder: []
    };

    var seenSegmentIds = {};
    var segments = Array.isArray(routeData.segments) ? routeData.segments.map(function(segment, index) {
      return pr.normalizeRouteSegment(segment, index, seenSegmentIds);
    }).filter(Boolean) : [];
    var kind = typeof routeData.kind === 'string' ? routeData.kind.trim() : '';
    if (kind !== pr.ROUTE_KIND_SEGMENTED && kind !== pr.ROUTE_KIND_LINEAR) {
      kind = segments.length || (Array.isArray(routeData.segmentOrder) && routeData.segmentOrder.length) ? pr.ROUTE_KIND_SEGMENTED : pr.ROUTE_KIND_LINEAR;
    }

    segments = pr.normalizeRouteSegmentOrder(segments, routeData.segmentOrder);

    return {
      schemaVersion: pr.SEGMENTED_ROUTE_SCHEMA_VERSION,
      kind: kind,
      stops: stops,
      segments: segments,
      segmentOrder: segments.map(function(segment) { return segment.id; })
    };
  };

  pr.routeStructureStateFromNormalized = function(routeStructure) {
    if (!routeStructure || routeStructure.schemaVersion !== pr.SEGMENTED_ROUTE_SCHEMA_VERSION) return null;
    return {
      kind: routeStructure.kind,
      segments: routeStructure.segments.slice(),
      segmentOrder: routeStructure.segmentOrder.slice()
    };
  };

  pr.currentRouteStructureData = function() {
    if (!pr.state.routeStructure) return null;

    var normalized = pr.normalizeRouteStructure({
      kind: pr.state.routeStructure.kind,
      stops: pr.state.stops,
      segments: pr.state.routeStructure.segments,
      segmentOrder: pr.state.routeStructure.segmentOrder
    });

    if (!normalized || normalized.schemaVersion !== pr.SEGMENTED_ROUTE_SCHEMA_VERSION) return null;

    return {
      kind: normalized.kind,
      segments: normalized.segments,
      segmentOrder: normalized.segmentOrder
    };
  };

  pr.importRouteData = function(data) {
    if (!data || typeof data !== 'object') throw new Error('Import data is not an object.');
    if (!Array.isArray(data.stops) && !(data.routeData && typeof data.routeData === 'object')) {
      throw new Error('Import data does not contain a stops array.');
    }

    var routeStructure = null;
    if (data.routeData && typeof data.routeData === 'object') {
      routeStructure = pr.normalizeRouteStructure(data.routeData, data.stops);
      if (!routeStructure) throw new Error('Import data contains invalid route data.');
    } else {
      routeStructure = pr.normalizeRouteStructure(null, data.stops);
    }

    if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('import route');

    pr.state.stops = routeStructure.stops;
    pr.state.routeStructure = pr.routeStructureStateFromNormalized(routeStructure);
    pr.state.settings = pr.normalizeSettings(Object.assign({}, pr.state.settings, data.settings || {}));
    pr.state.route = data.route && Array.isArray(data.route.legs) ? data.route : null;
    if (pr.state.route && pr.refreshRouteTravelEstimates) pr.refreshRouteTravelEstimates(pr.state.route);
    pr.state.routeDirty = !!pr.state.route || !!data.routeDirty;
    pr.state.activeRouteId = null;

    pr.saveSettings();
    pr.saveStops();
    pr.saveRoute();
    pr.redrawLabels();
    pr.redrawRouteLine();
    pr.redrawSegmentTimeLabels();
    pr.renderPanel();
    pr.queueAutoReplot();
    pr.showMessage('Route imported.');
    pr.hydrateStopTitles();
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
    var stops = pr.getRouteStops();
    if (!stops.length) {
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
    var rows = stops.map(function(stop, index) {
      var wait = stop.generatedLoop ? '0m' : pr.formatDurationInput(pr.getEffectiveStopMinutes(stop));
      var legText = index < stops.length - 1 ? pr.printableLegText(legsByFromIndex[index]) : '';

      return '<tr>' +
        '<td class="num">' + (stop.generatedLoop ? 'L' : (index + 1)) + '</td>' +
        '<td><div class="title">' + pr.escapeHtml(stop.title) + '</div><div class="coords">' + pr.escapeHtml(stop.lat + ', ' + stop.lng) + '</div></td>' +
        '<td>' + pr.escapeHtml(wait) + '</td>' +
        '<td>' + pr.escapeHtml(legText) + '</td>' +
        '</tr>';
    }).join('');

    var totalsHtml = totals ? '<div class="totals">' +
      '<span><b>Travel:</b> ' + pr.escapeHtml(pr.formatDuration(totals.driveSeconds)) + '</span>' +
      '<span><b>Stops:</b> ' + pr.escapeHtml(pr.formatDuration(totals.stopSeconds)) + '</span>' +
      '<span><b>Trip:</b> ' + pr.escapeHtml(pr.formatDuration(totals.tripSeconds)) + '</span>' +
      '<span><b>Distance:</b> ' + pr.escapeHtml(pr.formatDistance(totals.distanceMeters)) + '</span>' +
      '</div>' : '<div class="warning">Route has not been calculated yet.</div>';

    var staleHtml = pr.state.routeDirty ? '<div class="warning">Route is still updating. Totals and leg data may change.</div>' : '';

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
