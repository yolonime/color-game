/**
 * Authentication and session management utilities
 * Handles login, logout, session refresh, and account data
 */

// =============================================================================
// Authentication Requests
// =============================================================================

/**
 * Send login request to server
 * @param {string} name - Player name
 * @param {string} password - Player password
 * @returns {Promise<Object>} Response {success, user, error}
 */
export async function loginRequest(name, password) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
        user: null,
      };
    }

    return {
      success: true,
      user: data.user,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Erreur de connexion",
      user: null,
    };
  }
}

/**
 * Send registration request to server
 * @param {string} name - Desired player name
 * @param {string} password - Account password
 * @returns {Promise<Object>} Response {success, user, error}
 */
export async function registerRequest(name, password) {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
        user: null,
      };
    }

    return {
      success: true,
      user: data.user,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Erreur d'inscription",
      user: null,
    };
  }
}

/**
 * Request session refresh/verification
 * @returns {Promise<Object>} Response {success, user, error}
 */
export async function refreshAuthSession() {
  try {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error,
        user: null,
      };
    }

    return {
      success: true,
      user: data.user,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Erreur de session",
      user: null,
    };
  }
}

/**
 * Logout user and clear session
 * @returns {Promise<Object>} Response {success, error}
 */
export async function logoutRequest() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: data.error || "Erreur logout",
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Erreur logout",
    };
  }
}

// =============================================================================
// Session State Management
// =============================================================================

/**
 * Update authenticated user in local state
 * @param {Object|null} user - User object or null if logged out
 * @param {Function} stateUpdater - Callback to update application state
 */
export function setAuthenticatedUser(user, stateUpdater) {
  if (typeof stateUpdater === "function") {
    stateUpdater("authenticatedUser", user);
  }
}

/**
 * Get display name for current user
 * Falls back to generic name if not logged in
 * @param {Object|null} authenticatedUser - Current authenticated user
 * @returns {string} Display name
 */
export function getPlayerName(authenticatedUser) {
  if (authenticatedUser && authenticatedUser.name) {
    return authenticatedUser.name;
  }
  return "Joueur anonyme";
}

/**
 * Check if user is authenticated
 * @param {Object|null} authenticatedUser - Current authenticated user
 * @returns {boolean} True if logged in
 */
export function isAuthenticated(authenticatedUser) {
  return !!authenticatedUser && !!authenticatedUser.name;
}

/**
 * Get user profile data
 * @param {Object|null} authenticatedUser - Current authenticated user
 * @returns {Object} User profile or defaults
 */
export function getUserProfile(authenticatedUser) {
  if (!authenticatedUser) {
    return {
      name: "Anonyme",
      roundsPlayed: 0,
      bestScore: 0,
      averageScore: 0,
    };
  }

  return {
    name: authenticatedUser.name,
    roundsPlayed: authenticatedUser.roundsPlayed || 0,
    bestScore: authenticatedUser.bestScore || 0,
    averageScore: authenticatedUser.averageScore || 0,
  };
}

// =============================================================================
// Session Validation
// =============================================================================

/**
 * Validate authentication response
 * @param {Object} response - Response from auth endpoint
 * @returns {boolean} True if response is valid auth
 */
export function isValidAuthResponse(response) {
  if (!response || typeof response !== "object") {
    return false;
  }

  return !!(response.user && response.user.name);
}

/**
 * Format authentication error for display
 * @param {string|null} error - Error message
 * @returns {string} User-friendly error message
 */
export function formatAuthError(error) {
  if (!error) {
    return "";
  }

  const errorMap = {
    "User not found": "Utilisateur non trouvé",
    "Invalid password": "Mot de passe incorrect",
    "User already exists": "Cet utilisateur existe déjà",
    "Invalid email": "Email invalide",
    "Password too short": "Mot de passe trop court (min 6 caractères)",
  };

  return errorMap[error] || error;
}
