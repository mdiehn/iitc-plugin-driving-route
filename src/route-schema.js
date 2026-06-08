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
