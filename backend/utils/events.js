/**
 * FARMS - Server-Sent Events (SSE) Real-Time Broadcaster
 * Handles zero-dependency streaming of campus events (room requests, approvals, occupancy updates)
 */

const clients = new Set();

// Send an SSE heartbeat every 25 seconds to keep connections alive through proxies and browsers
setInterval(() => {
  if (clients.size > 0) {
    for (const client of clients) {
      try {
        client.write(': heartbeat\n\n');
      } catch (err) {
        clients.delete(client);
      }
    }
  }
}, 25000);

/**
 * Handle a new client SSE subscription
 */
function handleSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Flush headers immediately
  if (res.flushHeaders) res.flushHeaders();

  clients.add(res);

  // Send initial connected event
  const initPayload = JSON.stringify({
    type: 'connected',
    clientCount: clients.size,
    timestamp: new Date().toISOString()
  });
  res.write(`event: connected\ndata: ${initPayload}\n\n`);

  req.on('close', () => {
    clients.delete(res);
  });
}

/**
 * Broadcast an event to all active SSE subscribers
 * @param {string} eventType - e.g. 'new_request', 'request_updated', 'faculty_status', 'room_updated'
 * @param {object} payload - JSON payload
 */
function broadcast(eventType, payload) {
  if (clients.size === 0) return;

  const dataString = JSON.stringify({
    type: eventType,
    data: payload,
    timestamp: new Date().toISOString()
  });

  for (const client of clients) {
    try {
      client.write(`event: ${eventType}\ndata: ${dataString}\n\n`);
    } catch (err) {
      clients.delete(client);
    }
  }
}

function getClientCount() {
  return clients.size;
}

module.exports = {
  handleSSE,
  broadcast,
  getClientCount
};
