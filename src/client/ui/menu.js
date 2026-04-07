/**
 * Menu and drawer UI management
 * Handles opening/closing menus, rendering lists, updating button states
 */

import { pulseButton } from './helpers.js';
import { formatScore } from '../score/system.js';

// =============================================================================
// Menu Drawer Control
// =============================================================================

/**
 * Toggle main menu drawer visibility
 * @param {Object} domCache - DOM element cache
 * @param {Function} onToggle - Optional callback after toggle
 */
export function toggleMenu(domCache, onToggle) {
  if (!domCache.menuDrawer || !domCache.menuBackdrop || !domCache.burgerBtn) {
    return;
  }

  const shouldOpen = domCache.menuDrawer.classList.contains("hidden");
  
  domCache.menuDrawer.classList.toggle("hidden", !shouldOpen);
  domCache.menuBackdrop.classList.toggle("hidden", !shouldOpen);
  domCache.burgerBtn.classList.toggle("open", shouldOpen);
  domCache.burgerBtn.setAttribute("aria-expanded", String(shouldOpen));
  
  pulseButton(domCache.burgerBtn);
  
  if (typeof onToggle === "function") {
    onToggle(shouldOpen);
  }
}

/**
 * Close menu drawer
 * @param {Object} domCache - DOM element cache
 */
export function closeMenu(domCache) {
  if (!domCache.menuDrawer || !domCache.menuBackdrop || !domCache.burgerBtn) {
    return;
  }

  domCache.menuDrawer.classList.add("hidden");
  domCache.menuBackdrop.classList.add("hidden");
  domCache.burgerBtn.classList.remove("open");
  domCache.burgerBtn.setAttribute("aria-expanded", "false");
}

// =============================================================================
// Score Drawer Control
// =============================================================================

/**
 * Close score drawer
 * @param {Object} domCache - DOM element cache
 */
export function closeScoreDrawer(domCache) {
  if (!domCache.scoreDrawer || !domCache.scoreBackdrop || !domCache.trophyBtn) {
    return;
  }

  domCache.scoreDrawer.classList.add("hidden");
  domCache.scoreBackdrop.classList.add("hidden");
  domCache.trophyBtn.classList.remove("open");
  domCache.trophyBtn.setAttribute("aria-expanded", "false");
}

/**
 * Toggle score drawer visibility
 * @param {Object} domCache - DOM element cache
 * @param {Object} options - Configuration
 * @param {Function} options.onOpen - Callback when opening (for rendering pages)
 * @param {Function} options.onToggle - Callback after toggle
 */
export function toggleScoreDrawer(domCache, options = {}) {
  if (!domCache.scoreDrawer || !domCache.scoreBackdrop || !domCache.trophyBtn) {
    return;
  }

  const { onOpen = null, onToggle = null } = options;
  const shouldOpen = domCache.scoreDrawer.classList.contains("hidden");

  if (shouldOpen) {
    closeMenu(domCache);
    if (typeof onOpen === "function") {
      onOpen();
    }
  }

  domCache.scoreDrawer.classList.toggle("hidden", !shouldOpen);
  domCache.scoreBackdrop.classList.toggle("hidden", !shouldOpen);
  domCache.trophyBtn.classList.toggle("open", shouldOpen);
  domCache.trophyBtn.setAttribute("aria-expanded", String(shouldOpen));

  pulseButton(domCache.trophyBtn);

  if (typeof onToggle === "function") {
    onToggle(shouldOpen);
  }
}

// =============================================================================
// Score Page Management
// =============================================================================

/**
 * Switch active score page (personal, friends, or global)
 * @param {Object} domCache - DOM element cache
 * @param {string} nextPage - Page to show (perso, friends, or global)
 */
export function setScorePage(domCache, nextPage) {
  if (!domCache.scorePagePerso || !domCache.scorePageFriends || !domCache.scorePageGlobal) {
    return;
  }

  const tabButtons = [
    { btn: domCache.scoreTabPersoBtn, page: "perso" },
    { btn: domCache.scoreTabFriendsBtn, page: "friends" },
    { btn: domCache.scoreTabGlobalBtn, page: "global" },
  ];

  for (const { btn, page } of tabButtons) {
    if (btn) {
      btn.classList.toggle("active", page === nextPage);
    }
  }

  domCache.scorePagePerso.classList.toggle("hidden", nextPage !== "perso");
  domCache.scorePageFriends.classList.toggle("hidden", nextPage !== "friends");
  domCache.scorePageGlobal.classList.toggle("hidden", nextPage !== "global");

  return nextPage;
}

// =============================================================================
// Player & Leaderboard Rendering
// =============================================================================

/**
 * Render list of online players
 * @param {HTMLElement} container - Container to render into
 * @param {Array} players - Array of player objects {name, isHost, submitted}
 */
export function renderPlayers(container, players) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  for (const player of players) {
    const item = document.createElement("li");
    const hostLabel = player.isHost ? " (host)" : "";
    const readyLabel = player.submitted ? " - pret" : "";
    item.textContent = `${player.name}${hostLabel}${readyLabel}`;
    container.appendChild(item);
  }
}

/**
 * Render leaderboard entries
 * @param {HTMLElement} container - Container to render into
 * @param {Array} entries - Array of leaderboard entries {name, score}
 */
export function renderLeaderboard(container, entries) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  for (const entry of entries) {
    const item = document.createElement("li");
    item.textContent = `${entry.name}: ${formatScore(entry.score)}/100`;
    container.appendChild(item);
  }
}

// =============================================================================
// Menu Button State
// =============================================================================

/**
 * Update menu button states based on game state
 * @param {Object} domCache - DOM element cache
 * @param {Object} gameState - Current game state
 */
export function updateMenuButtons(domCache, gameState) {
  if (!domCache.menuStartOnlineMatchBtn || !domCache.quickStartBtn) {
    return;
  }

  const {
    gameMode = "solo",
    isOnlineMatchRunning = false,
    isHost = false,
    currentRoomCode = "",
    onlineRoundNumber = 0,
    onlineTotalRounds = 5,
    isSoloMatchRunning = false,
    onlinePlayersCount = 0,
  } = gameState;

  if (gameMode === "online") {
    if (!isOnlineMatchRunning) {
      domCache.menuStartOnlineMatchBtn.textContent = `Lancer la partie online (${onlineTotalRounds} manches)`;
      domCache.menuStartOnlineMatchBtn.disabled = !(currentRoomCode && isHost && onlinePlayersCount > 0);
    } else if (onlineRoundNumber < onlineTotalRounds) {
      domCache.menuStartOnlineMatchBtn.textContent = "Partie online en cours...";
      domCache.menuStartOnlineMatchBtn.disabled = true;
    } else {
      domCache.menuStartOnlineMatchBtn.textContent = "Partie terminee";
      domCache.menuStartOnlineMatchBtn.disabled = true;
    }
  }

  const hideInSolo = gameMode === "solo" && isSoloMatchRunning;
  const hideInOnline = gameMode === "online" && isOnlineMatchRunning;
  domCache.quickStartBtn.classList.toggle("hidden", hideInSolo || hideInOnline);
}

/**
 * Update mode button active states
 * @param {Object} domCache - DOM element cache
 * @param {string} gameMode - Current game mode
 * @param {string} localMode - Current local mode (if solo)
 */
export function updateSelectedModeButtons(domCache, gameMode, localMode = "memory") {
  if (!domCache.soloModeBtn || !domCache.nameModeBtn || !domCache.codeModeBtn || !domCache.onlineModeBtn) {
    return;
  }

  domCache.soloModeBtn.classList.toggle("active", gameMode === "solo" && localMode === "memory");
  domCache.nameModeBtn.classList.toggle("active", gameMode === "solo" && localMode === "name");
  domCache.codeModeBtn.classList.toggle("active", gameMode === "solo" && localMode === "code");
  domCache.onlineModeBtn.classList.toggle("active", gameMode === "online");
}
