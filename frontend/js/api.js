/**
 * FARMS Client API Service
 * Handles communication with the Express REST API backend
 * Supports seamless offline fallback to localStorage and local mock state
 */

function getFarmsApiBase() {
  if (typeof window === 'undefined') return 'http://localhost:5000/api';
  if (window.FARMS_API_URL) return window.FARMS_API_URL;
  if (window.location.port === '5000') return '/api';
  const hostname = window.location.hostname && window.location.hostname !== '' ? window.location.hostname : 'localhost';
  return `http://${hostname}:5000/api`;
}

const FARMS_API_BASE = getFarmsApiBase();

const farmsApi = {
  baseUrl: FARMS_API_BASE,
  isOnline: false,
  _cache: new Map(),
  _inFlight: new Map(),

  // Invalidate cache by tag or clear all
  invalidateCache(tag = null) {
    if (!tag) {
      this._cache.clear();
      return;
    }
    for (const key of this._cache.keys()) {
      if (key.includes(tag)) {
        this._cache.delete(key);
      }
    }
  },

  // High-performance deduplicated & cached fetch helper (SWR)
  async cachedFetch(url, options = {}, ttlMs = 2000) {
    const isGet = !options.method || options.method === 'GET';
    const cacheKey = `${url}`;

    // Return active cached response if within TTL
    if (isGet && this._cache.has(cacheKey)) {
      const entry = this._cache.get(cacheKey);
      if (Date.now() - entry.time < ttlMs) {
        return entry.data;
      }
    }

    // Deduplicate in-flight requests to prevent duplicate parallel fetches
    if (isGet && this._inFlight.has(cacheKey)) {
      return this._inFlight.get(cacheKey);
    }

    const fetchPromise = (async () => {
      try {
        const res = await fetch(url, { ...options, signal: options.signal || AbortSignal.timeout(3500) });
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();
        this.isOnline = true;
        if (isGet) {
          this._cache.set(cacheKey, { time: Date.now(), data: json });
        }
        return json;
      } finally {
        if (isGet) {
          this._inFlight.delete(cacheKey);
        }
      }
    })();

    if (isGet) {
      this._inFlight.set(cacheKey, fetchPromise);
    }

    return fetchPromise;
  },

  // Check backend server connection
  async checkHealth() {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: 'GET', signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        this.isOnline = true;
        return { online: true, data };
      }
    } catch (e) {
      this.isOnline = false;
    }
    return { online: false };
  },

  // ─────────────────────────────────────────────────────────────
  // ROOM API ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  // Fetch all rooms with optional filtering query
  async getRooms(filters = {}) {
    const query = new URLSearchParams();
    if (filters.building) query.append('building', filters.building);
    if (filters.floor) query.append('floor', filters.floor);
    if (filters.status) query.append('status', filters.status);
    if (filters.search) query.append('search', filters.search);

    const url = `${this.baseUrl}/rooms${query.toString() ? '?' + query.toString() : ''}`;
    try {
      return await this.cachedFetch(url, {}, 2500);
    } catch (err) {
      this.isOnline = false;
      console.warn('[farmsApi] Backend unreachable for rooms, falling back to local cache:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Fetch a single room by ID
  async getRoom(id) {
    try {
      const res = await fetch(`${this.baseUrl}/rooms/${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      return json;
    } catch (err) {
      this.isOnline = false;
      return { success: false, offline: true, error: err.message };
    }
  },

  // Update room properties (Name, Type, Capacity, Equipment Tags)
  async updateRoom(id, roomData) {
    try {
      this.invalidateCache('room');
      const res = await fetch(`${this.baseUrl}/rooms/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      return json;
    } catch (err) {
      this.isOnline = false;
      console.warn('[farmsApi] Update room failed via backend:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Release an occupied room back to vacant
  async releaseRoom(id) {
    try {
      this.invalidateCache('room');
      const res = await fetch(`${this.baseUrl}/rooms/${encodeURIComponent(id)}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      return json;
    } catch (err) {
      this.isOnline = false;
      console.warn('[farmsApi] Release room failed via backend:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Check out a room (releases room, marks request completed, logs checkout)
  async checkoutRoom(id) {
    try {
      this.invalidateCache('room');
      this.invalidateCache('request');
      this.invalidateCache('log');
      const res = await fetch(`${this.baseUrl}/rooms/${encodeURIComponent(id)}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      if (json.data) {
        this.broadcastLocalEvent('room_updated', json.data);
      }
      if (json.completedRequest) {
        this.broadcastLocalEvent('request_status_updated', json.completedRequest);
      }
      return json;
    } catch (err) {
      this.isOnline = false;
      console.warn('[farmsApi] Checkout room failed via backend:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Patch room status (vacant / occupied / maintenance)
  async updateRoomStatus(id, statusData) {
    try {
      this.invalidateCache('room');
      const res = await fetch(`${this.baseUrl}/rooms/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusData),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      return json;
    } catch (err) {
      this.isOnline = false;
      return { success: false, offline: true, error: err.message };
    }
  },

  // ─────────────────────────────────────────────────────────────
  // FACULTY API ENDPOINTS (FULL CRUD & SCHEDULES)
  // ─────────────────────────────────────────────────────────────

  // Fetch faculty directory with optional filters (dept, status, search, room, sortBy, order)
  async getFaculty(filters = {}) {
    const query = new URLSearchParams();
    if (filters.dept) query.append('dept', filters.dept);
    if (filters.status) query.append('status', filters.status);
    if (filters.search) query.append('search', filters.search);
    if (filters.room) query.append('room', filters.room);
    if (filters.sortBy) query.append('sortBy', filters.sortBy);
    if (filters.order) query.append('order', filters.order);

    const url = `${this.baseUrl}/faculty${query.toString() ? '?' + query.toString() : ''}`;
    try {
      return await this.cachedFetch(url, {}, 2500);
    } catch (err) {
      this.isOnline = false;
      console.warn('[farmsApi] Faculty fetch failed via backend:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Fetch single faculty member by internal ID (f-1) or institutional ID (BSU-FAC-...)
  async getFacultyById(id) {
    try {
      return await this.cachedFetch(`${this.baseUrl}/faculty/${encodeURIComponent(id)}`, {}, 3000);
    } catch (err) {
      this.isOnline = false;
      return { success: false, offline: true, error: err.message };
    }
  },

  // Get department list with faculty counts and status breakdown
  async getFacultyDepartments() {
    try {
      return await this.cachedFetch(`${this.baseUrl}/faculty/departments`, {}, 5000);
    } catch (err) {
      this.isOnline = false;
      return { success: false, offline: true, error: err.message };
    }
  },

  // Create a new faculty member
  async createFaculty(facultyData) {
    try {
      this.invalidateCache('faculty');
      const res = await fetch(`${this.baseUrl}/faculty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyData),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      return json;
    } catch (err) {
      this.isOnline = false;
      console.warn('[farmsApi] Create faculty failed via backend:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Update a faculty member profile
  async updateFaculty(id, facultyData) {
    try {
      this.invalidateCache('faculty');
      const res = await fetch(`${this.baseUrl}/faculty/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(facultyData),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      return json;
    } catch (err) {
      this.isOnline = false;
      console.warn('[farmsApi] Update faculty failed via backend:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Patch faculty availability status with automatic room sync
  async patchFacultyStatus(id, statusData) {
    try {
      this.invalidateCache('faculty');
      this.invalidateCache('room');
      const res = await fetch(`${this.baseUrl}/faculty/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(typeof statusData === 'string' ? { status: statusData } : statusData),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      return json;
    } catch (err) {
      this.isOnline = false;
      console.warn('[farmsApi] Patch faculty status failed via backend:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Delete a faculty member
  async deleteFaculty(id) {
    try {
      this.invalidateCache('faculty');
      const res = await fetch(`${this.baseUrl}/faculty/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      return json;
    } catch (err) {
      this.isOnline = false;
      console.warn('[farmsApi] Delete faculty failed via backend:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Get weekly class timetable for a faculty member
  async getFacultySchedule(id) {
    try {
      return await this.cachedFetch(`${this.baseUrl}/faculty/${encodeURIComponent(id)}/schedule`, {}, 5000);
    } catch (err) {
      this.isOnline = false;
      return { success: false, offline: true, error: err.message };
    }
  },

  // Update weekly class timetable for a faculty member
  async updateFacultySchedule(id, schedule) {
    try {
      this.invalidateCache('faculty');
      const res = await fetch(`${this.baseUrl}/faculty/${encodeURIComponent(id)}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Array.isArray(schedule) ? schedule : { schedule }),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      return json;
    } catch (err) {
      this.isOnline = false;
      console.warn('[farmsApi] Update schedule failed via backend:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // ─────────────────────────────────────────────────────────────
  // REQUESTS & LOGS API ENDPOINTS
  // ─────────────────────────────────────────────────────────────

  async getRequests() {
    try {
      return await this.cachedFetch(`${this.baseUrl}/requests`, {}, 2000);
    } catch (err) {
      return { success: false, offline: true, error: err.message };
    }
  },

  async createRequest(requestData) {
    try {
      this.invalidateCache('request');
      const res = await fetch(`${this.baseUrl}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      return { success: false, offline: true, error: err.message };
    }
  },

  async updateRequestStatus(id, status) {
    try {
      this.invalidateCache('request');
      this.invalidateCache('room');
      const res = await fetch(`${this.baseUrl}/requests/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      return { success: false, offline: true, error: err.message };
    }
  },

  async getLogs(type = 'all', limit = 100) {
    try {
      const query = new URLSearchParams();
      if (type && type !== 'all') query.append('type', type);
      if (limit) query.append('limit', limit);
      const url = `${this.baseUrl}/logs${query.toString() ? '?' + query.toString() : ''}`;
      return await this.cachedFetch(url, {}, 2500);
    } catch (err) {
      return { success: false, offline: true, error: err.message };
    }
  },

  async createLog(logData) {
    try {
      this.invalidateCache('log');
      const res = await fetch(`${this.baseUrl}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData),
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      return { success: false, offline: true, error: err.message };
    }
  },

  async clearLogs() {
    try {
      this.invalidateCache('log');
      const res = await fetch(`${this.baseUrl}/logs`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      return { success: false, offline: true, error: err.message };
    }
  },

  async getActivityLogs() {
    return this.getLogs();
  },

  // ─────────────────────────────────────────────────────────────
  // REAL-TIME EVENT STREAM (SSE + CROSS-TAB BROADCAST)
  // ─────────────────────────────────────────────────────────────

  // Connect to backend Server-Sent Events stream
  connectEventStream(onEvent, onError) {
    if (typeof window === 'undefined' || !('EventSource' in window)) {
      console.warn('[farmsApi] EventSource not supported in this browser environment.');
      return null;
    }

    try {
      const es = new EventSource(`${this.baseUrl}/events`);

      es.addEventListener('connected', (e) => {
        this.isOnline = true;
        try {
          if (onEvent) onEvent({ type: 'connected', data: JSON.parse(e.data) });
        } catch (_) {}
      });

      es.addEventListener('new_request', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (onEvent) onEvent({ type: 'new_request', data: payload.data || payload });
        } catch (err) {
          console.error('[farmsApi] Error parsing new_request SSE:', err);
        }
      });

      es.addEventListener('request_status_updated', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (onEvent) onEvent({ type: 'request_status_updated', data: payload.data || payload });
        } catch (err) {
          console.error('[farmsApi] Error parsing request_status_updated SSE:', err);
        }
      });

      es.addEventListener('room_updated', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (onEvent) onEvent({ type: 'room_updated', data: payload.data || payload });
        } catch (err) {
          console.error('[farmsApi] Error parsing room_updated SSE:', err);
        }
      });

      es.addEventListener('new_log', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (onEvent) onEvent({ type: 'new_log', data: payload.data || payload });
        } catch (_) {}
      });

      es.addEventListener('logs_cleared', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (onEvent) onEvent({ type: 'logs_cleared', data: payload.data || payload });
        } catch (_) {}
      });

      es.addEventListener('system_reset', (e) => {
        try {
          const payload = JSON.parse(e.data);
          if (onEvent) onEvent({ type: 'system_reset', data: payload.data || payload });
        } catch (_) {}
      });

      es.onerror = (err) => {
        if (onError) onError(err);
      };

      return es;
    } catch (err) {
      console.warn('[farmsApi] Could not connect to SSE stream:', err.message);
      return null;
    }
  },

  // ─────────────────────────────────────────────────────────────
  // SYSTEM ADMINISTRATION & RESET
  // ─────────────────────────────────────────────────────────────

  // Reset entire campus system (vacates all rooms, resets faculty, clears requests, preserves audit logs)
  async resetSystem(preserveLogs = true) {
    try {
      const res = await fetch(`${this.baseUrl}/system/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preserveLogs }),
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      this.broadcastLocalEvent('system_reset', { preserveLogs });
      return json;
    } catch (err) {
      this.isOnline = false;
      this.broadcastLocalEvent('system_reset', { preserveLogs });
      return { success: false, offline: true, error: err.message };
    }
  },

  // ─────────────────────────────────────────────────────────────
  // CROSS-TAB BROADCAST CHANNEL (0ms LOCAL LATENCY)
  // ─────────────────────────────────────────────────────────────
  _getBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      if (!this._bc) {
        this._bc = new BroadcastChannel('farms_realtime_events');
      }
      return this._bc;
    }
    return null;
  },

  // Broadcast an event across open tabs in the same browser
  broadcastLocalEvent(eventType, payload) {
    try {
      const bc = this._getBroadcastChannel();
      if (bc) {
        bc.postMessage({ type: eventType, data: payload, timestamp: Date.now() });
      }
    } catch (err) {
      console.warn('[farmsApi] BroadcastChannel post failed:', err);
    }
  },

  // Subscribe to local cross-tab BroadcastChannel events
  listenLocalEvents(callback) {
    try {
      const bc = this._getBroadcastChannel();
      if (bc) {
        bc.addEventListener('message', (event) => {
          if (callback && event.data) callback(event.data);
        });
        return bc;
      }
    } catch (err) {
      console.warn('[farmsApi] BroadcastChannel listen failed:', err);
    }
    return null;
  }
};

window.farmsApi = farmsApi;

