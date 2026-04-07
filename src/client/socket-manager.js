/**
 * Socket.IO event management and communication
 * Handles all WebSocket listeners, emitters, and event coordination
 */

// Socket instance (initialized lazily)
// Import io from global scope (loaded from server or CDN in index.html)
let socket = null;
let socketEventHandlers = {};

// =============================================================================
// Socket Connection
// =============================================================================

/**
 * Initialize socket.io connection
 * Uses io object from global scope (window.io)
 * @returns {Object} Socket instance
 */
export function initializeSocket() {
  // Check if io is available globally (loaded from server or CDN)
  if (typeof window === 'undefined' || !window.io) {
    console.warn('⚠️  Socket.IO not available. Server may not be running.');
    return null;
  }

  if (socket && socket.connected) {
    return socket;
  }

  try {
    socket = window.io();
    registerDefaultListeners();
    return socket;
  } catch (error) {
    console.error('❌ Failed to initialize socket:', error);
    return null;
  }
}

/**
 * Get current socket instance
 * @returns {Object|null} Socket instance or null
 */
export function getSocket() {
  return socket;
}

/**
 * Check if socket is connected
 * @returns {boolean} True if socket is connected
 */
export function isSocketConnected() {
  return socket && socket.connected;
}

/**
 * Disconnect socket and cleanup
 */
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    socketEventHandlers = {};
  }
}

/**
 * Reconnect to socket server
 */
export function reconnectSocket() {
  if (socket && !socket.connected) {
    socket.connect();
  }
}

// =============================================================================
// Event Listeners (Socket Receivers)
// =============================================================================

/**
 * Register default socket event listeners
 * Called automatically on initialization
 */
function registerDefaultListeners() {
  if (!socket) return;

  // Connection events
  socket.on("connect", () => {
    emitEventHandler("socket-connected", { ready: true });
  });

  socket.on("disconnect", () => {
    emitEventHandler("socket-disconnected", { ready: false });
  });

  socket.on("connect_error", (error) => {
    emitEventHandler("socket-error", { error: error.message });
  });

  // Game room events
  socket.on("room-joined", (data) => {
    emitEventHandler("room-joined", data);
  });

  socket.on("room-left", (data) => {
    emitEventHandler("room-left", data);
  });

  socket.on("player-joined", (data) => {
    emitEventHandler("player-joined", data);
  });

  socket.on("player-left", (data) => {
    emitEventHandler("player-left", data);
  });

  socket.on("room-started", (data) => {
    emitEventHandler("room-started", data);
  });

  socket.on("round-started", (data) => {
    emitEventHandler("round-started", data);
  });

  socket.on("round-submitted", (data) => {
    emitEventHandler("round-submitted", data);
  });

  socket.on("round-results", (data) => {
    emitEventHandler("round-results", data);
  });

  socket.on("match-complete", (data) => {
    emitEventHandler("match-complete", data);
  });

  socket.on("player-ready", (data) => {
    emitEventHandler("player-ready", data);
  });

  socket.on("all-players-ready", (data) => {
    emitEventHandler("all-players-ready", data);
  });

  socket.on("error", (error) => {
    emitEventHandler("socket-error", { error });
  });
}

/**
 * Register custom event handler
 * @param {string} eventName - Event name
 * @param {Function} callback - Callback function
 */
export function onSocketEvent(eventName, callback) {
  if (!socketEventHandlers[eventName]) {
    socketEventHandlers[eventName] = [];
  }
  socketEventHandlers[eventName].push(callback);
}

/**
 * Unregister event handler
 * @param {string} eventName - Event name
 * @param {Function} callback - Callback function to remove
 */
export function offSocketEvent(eventName, callback) {
  if (socketEventHandlers[eventName]) {
    socketEventHandlers[eventName] = socketEventHandlers[eventName].filter(
      (cb) => cb !== callback
    );
  }
}

/**
 * Emit local event to handlers
 * @param {string} eventName - Event name
 * @param {Object} data - Event data
 */
function emitEventHandler(eventName, data) {
  if (socketEventHandlers[eventName]) {
    socketEventHandlers[eventName].forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in handler for ${eventName}:`, error);
      }
    });
  }
}

// =============================================================================
// Event Emitters (Socket Senders)
// =============================================================================

/**
 * Join a game room
 * @param {string} roomId - Room identifier
 * @param {Object} playerData - Player information
 */
export function emitJoinRoom(roomId, playerData) {
  if (socket) {
    socket.emit("join-room", { roomId, playerData });
  }
}

/**
 * Leave current room
 * @param {string} roomId - Room identifier
 */
export function emitLeaveRoom(roomId) {
  if (socket) {
    socket.emit("leave-room", { roomId });
  }
}

/**
 * Mark player as ready
 * @param {string} roomId - Room identifier
 * @param {string} userId - User identifier
 */
export function emitPlayerReady(roomId, userId) {
  if (socket) {
    socket.emit("player-ready", { roomId, userId });
  }
}

/**
 * Start game round
 * @param {string} roomId - Room identifier
 */
export function emitStartRound(roomId) {
  if (socket) {
    socket.emit("start-round", { roomId });
  }
}

/**
 * Submit round answer
 * @param {string} roomId - Room identifier
 * @param {Object} submission - Round submission data
 */
export function emitSubmitRound(roomId, submission) {
  if (socket) {
    socket.emit("submit-round", { roomId, submission });
  }
}

/**
 * Send chat message to room
 * @param {string} roomId - Room identifier
 * @param {string} message - Message text
 */
export function emitChatMessage(roomId, message) {
  if (socket) {
    socket.emit("chat-message", { roomId, message });
  }
}

/**
 * Request leaderboard update
 * @param {string} roomId - Room identifier
 */
export function emitRequestLeaderboard(roomId) {
  if (socket) {
    socket.emit("request-leaderboard", { roomId });
  }
}

/**
 * Sync game state
 * @param {string} roomId - Room identifier
 * @param {Object} state - Current state
 */
export function emitSyncState(roomId, state) {
  if (socket) {
    socket.emit("sync-state", { roomId, state });
  }
}

// =============================================================================
// Room Management
// =============================================================================

/**
 * Create new game room
 * @param {Object} options - Room options {name, mode, maxPlayers}
 * @returns {Promise<Object>} Room creation response
 */
export async function createRoom(options) {
  return new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error("Socket not initialized"));
      return;
    }

    socket.emit("create-room", options, (response) => {
      if (response && response.success) {
        resolve(response);
      } else {
        reject(new Error(response?.error || "Failed to create room"));
      }
    });
  });
}

/**
 * Get list of available rooms
 * @returns {Promise<Array>} List of available rooms
 */
export async function getAvailableRooms() {
  return new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error("Socket not initialized"));
      return;
    }

    socket.emit("get-rooms", {}, (response) => {
      if (response && response.rooms) {
        resolve(response.rooms);
      } else {
        reject(new Error("Failed to get rooms"));
      }
    });
  });
}

/**
 * Get room details
 * @param {string} roomId - Room identifier
 * @returns {Promise<Object>} Room details
 */
export async function getRoomDetails(roomId) {
  return new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error("Socket not initialized"));
      return;
    }

    socket.emit("get-room", { roomId }, (response) => {
      if (response && response.room) {
        resolve(response.room);
      } else {
        reject(new Error("Room not found"));
      }
    });
  });
}

// =============================================================================
// Socket Status & Utility
// =============================================================================

/**
 * Get socket connection status
 * @returns {Object} Status object
 */
export function getSocketStatus() {
  const status = {
    connected: isSocketConnected(),
    id: socket?.id || null,
    url: socket?.io?.uri || null,
    eventHandlerCount: Object.keys(socketEventHandlers).length,
  };
  return status;
}

/**
 * Clear all event handlers except default ones
 */
export function clearCustomHandlers() {
  socketEventHandlers = {};
}
