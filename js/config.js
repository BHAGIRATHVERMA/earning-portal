// ==============================================================================
// Google Map Review & Rating Portal - Central Client Configuration
// ==============================================================================
(function () {
  // Live Cloud Backend on Render
  const DEFAULT_REMOTE_BACKEND = 'https://lakshayenterproses.onrender.com';

  const isLocal = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1' || 
                  window.location.hostname.startsWith('192.168.');

  // Set global API base URL
  window.API_BASE_URL = localStorage.getItem('MAP_PORTAL_CUSTOM_BACKEND') || 
                        window.MAP_PORTAL_API_URL || 
                        (isLocal ? '' : DEFAULT_REMOTE_BACKEND);

  // Helper to resolve media and uploads URLs (Screenshots, QR codes)
  window.getMediaUrl = function (path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    if (path.startsWith('/uploads')) {
      const base = (window.API_BASE_URL || '').replace(/\/+$/, '');
      return base ? base + path : path;
    }
    return path;
  };

  // Monkey-patch window.fetch to route all '/api/' requests to API_BASE_URL
  // and automatically inject persistent auth headers (x-user-id, x-admin-auth)
  const originalFetch = window.fetch;
  window.fetch = function (resource, init) {
    init = init || {};
    init.credentials = init.credentials || 'include';

    // Normalize headers
    let headers;
    if (init.headers instanceof Headers) {
      headers = init.headers;
    } else if (Array.isArray(init.headers)) {
      headers = new Headers(init.headers);
    } else {
      headers = new Headers(init.headers || {});
    }

    // Attach persistent user ID header if user is logged in
    try {
      const savedUserStr = localStorage.getItem('mrp_logged_user');
      if (savedUserStr) {
        const u = JSON.parse(savedUserStr);
        if (u && u.id && !headers.has('x-user-id')) {
          headers.set('x-user-id', u.id);
        }
      }
    } catch (e) {}

    // Attach persistent admin auth header if admin is logged in
    try {
      if (localStorage.getItem('mrp_admin_logged') === 'true' && !headers.has('x-admin-auth')) {
        headers.set('x-admin-auth', 'true');
      }
    } catch (e) {}

    init.headers = headers;

    // Route relative /api/ endpoints to window.API_BASE_URL
    if (typeof resource === 'string' && resource.startsWith('/api/')) {
      const base = (window.API_BASE_URL || '').replace(/\/+$/, '');
      if (base && base.startsWith('http')) {
        resource = base + resource;
      }
    }

    return originalFetch(resource, init);
  };

  console.log('[MapReview Portal] API Base URL configured:', window.API_BASE_URL || '(Same Origin)');
})();
