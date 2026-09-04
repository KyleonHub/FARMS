/**
 * FARMS Client API Service
 * Handles communication with the Express REST API backend
 * Supports seamless offline fallback to localStorage
 */

const FARMS_API_BASE = 'http://localhost:5000/api';

const farmsApi = {
  baseUrl: FARMS_API_BASE,
  isOnline: false,

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

  // Fetch all rooms with optional filtering query
  async getRooms(filters = {}) {
    const query = new URLSearchParams();
    if (filters.building) query.append('building', filters.building);
    if (filters.floor) query.append('floor', filters.floor);
    if (filters.status) query.append('status', filters.status);
    if (filters.search) query.append('search', filters.search);

    const url = `${this.baseUrl}/rooms${query.toString() ? '?' + query.toString() : ''}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();
      this.isOnline = true;
      return json;
    } catch (err) {
      this.isOnline = false;
      console.warn('[farmsApi] Backend unreachable, falling back to local cache:', err.message);
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
      console.warn('[farmsApi] Update failed via backend, fallback to local storage:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Release an occupied room back to vacant
  async releaseRoom(id) {
    try {
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
      console.warn('[farmsApi] Release failed via backend, fallback to local storage:', err.message);
      return { success: false, offline: true, error: err.message };
    }
  },

  // Patch room status (vacant / occupied / maintenance)
  async updateRoomStatus(id, statusData) {
    try {
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
  }
};

window.farmsApi = farmsApi;
