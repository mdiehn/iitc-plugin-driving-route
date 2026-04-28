  pr.portalToStop = function(guid) {
    var portal = guid && window.portals && window.portals[guid];
    if (!portal || !portal.getLatLng) return null;

    var latlng = portal.getLatLng();
    var data = portal.options && portal.options.data ? portal.options.data : {};

    return {
      guid: guid,
      title: data.title || data.name || guid,
      lat: latlng.lat,
      lng: latlng.lng
    };
  };

  pr.addSelectedPortal = function() {
    var guid = window.selectedPortal;
    var stop = pr.portalToStop(guid);
    if (!stop) {
      pr.showMessage('No selected portal found.');
      return;
    }
    pr.addStop(stop);
  };

  pr.injectPortalDetailsAction = function() {
    var container = document.querySelector('#portaldetails .linkdetails') || document.querySelector('#portaldetails');
    if (!container || container.querySelector('.portal-route-add-link')) return;

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'portal-route-add-link';
    link.textContent = 'Add to Portal Route';
    link.addEventListener('click', function(ev) {
      ev.preventDefault();
      pr.addSelectedPortal();
    });

    var wrapper = document.createElement('div');
    wrapper.className = 'portal-route-portal-action';
    wrapper.appendChild(link);
    container.appendChild(wrapper);
  };
