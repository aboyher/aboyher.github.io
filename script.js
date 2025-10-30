// State management
let currentScreen = 'home-screen';
let currentProfile = 'Profile 1';
let clickCount = 0;
let isProfileOverlayOpen = false;

// Navigation state
let focusedElement = null;
let focusableElements = [];
let currentFocusIndex = 0;

// Screen elements
const screens = {
    home: document.getElementById('home-screen')
};

const profileOverlay = document.getElementById('profile-overlay');
const currentProfileDisplay = document.getElementById('current-profile-name');
const clickCountDisplay = document.getElementById('traditional-clicks');

// Remote buttons
const profileBtn = document.getElementById('profile-btn');
const homeBtn = document.getElementById('home-btn');
const backBtn = document.getElementById('back-btn');
const okBtn = document.getElementById('ok-btn');

// Navigation history for back button
let navigationHistory = ['home-screen'];

// Initialize
function init() {
    showScreen('home-screen');
    updateProfileDisplay();
    updateFocusableElements();
    attachEventListeners();

    // Show initial tasks
    setTimeout(() => {
        showTasksPopup();
    }, 500);
}

// Update focusable elements based on current screen
function updateFocusableElements() {
    const activeScreen = document.querySelector('.screen.active');
    if (!activeScreen) return;

    focusableElements = Array.from(activeScreen.querySelectorAll('.focusable'));
    currentFocusIndex = 0;

    // Clear all focused states
    document.querySelectorAll('.focused').forEach(el => el.classList.remove('focused'));

    // Focus first content item (show) instead of profile badge
    if (focusableElements.length > 0) {
        // Find the first content item
        const firstContentItem = focusableElements.find(el => el.classList.contains('content-item'));
        if (firstContentItem) {
            const index = focusableElements.indexOf(firstContentItem);
            focusElement(index);
        } else {
            // Fallback to first element if no content items
            focusElement(0);
        }
    }
}

// Focus an element by index
function focusElement(index) {
    if (index < 0 || index >= focusableElements.length) return;

    // Remove focus from current element
    if (focusedElement) {
        focusedElement.classList.remove('focused');
    }

    // Set new focus
    currentFocusIndex = index;
    focusedElement = focusableElements[index];
    focusedElement.classList.add('focused');

    // Scroll into view if needed
    focusedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// D-pad navigation
function navigateUp() {
    if (isProfileOverlayOpen) {
        // In overlay, navigate in a 2-column grid
        if (currentFocusIndex >= 2) {
            focusElement(currentFocusIndex - 2);
        }
        return;
    }

    // Check if we're in a menu tab
    if (focusedElement && focusedElement.classList.contains('menu-tab')) {
        // Can't go up from menu
        return;
    }

    // Check if we're in an episode or action button (vertical list)
    const isEpisode = focusedElement && focusedElement.classList.contains('episode-item');
    const isActionBtn = focusedElement && focusedElement.classList.contains('action-btn');

    if (isEpisode || isActionBtn) {
        // Simple up navigation for vertical lists
        if (currentFocusIndex > 0) {
            focusElement(currentFocusIndex - 1);
        }
        return;
    }

    // Check if we're in the first row of content items
    const contentItems = Array.from(document.querySelectorAll('.content-item.focusable'));
    const isInContentItems = contentItems.includes(focusedElement);

    if (isInContentItems) {
        const itemIndex = contentItems.indexOf(focusedElement);
        // If in the first 4 items (first row), navigate to menu
        if (itemIndex < 4) {
            const menuTabs = Array.from(document.querySelectorAll('.menu-tab.focusable'));
            if (menuTabs.length > 0) {
                const menuIndex = focusableElements.indexOf(menuTabs[0]);
                if (menuIndex !== -1) {
                    focusElement(menuIndex);
                    return;
                }
            }
        }
    }

    // Standard grid navigation
    const currentRow = Math.floor(currentFocusIndex / 4);
    const currentCol = currentFocusIndex % 4;
    const newIndex = Math.max(0, (currentRow - 1) * 4 + currentCol);

    if (newIndex < focusableElements.length && newIndex !== currentFocusIndex) {
        focusElement(newIndex);
    }
}

function navigateDown() {
    if (isProfileOverlayOpen) {
        // In overlay, navigate in a 2-column grid
        if (currentFocusIndex + 2 < focusableElements.length) {
            focusElement(currentFocusIndex + 2);
        }
        return;
    }

    // Check if we're in a menu tab
    if (focusedElement && focusedElement.classList.contains('menu-tab')) {
        // Navigate to first content item
        const contentItems = Array.from(document.querySelectorAll('.content-item.focusable'));
        if (contentItems.length > 0) {
            const firstItemIndex = focusableElements.indexOf(contentItems[0]);
            if (firstItemIndex !== -1) {
                focusElement(firstItemIndex);
                return;
            }
        }
    }

    // Check if we're in an episode or action button (vertical list)
    const isEpisode = focusedElement && focusedElement.classList.contains('episode-item');
    const isActionBtn = focusedElement && focusedElement.classList.contains('action-btn');

    if (isEpisode || isActionBtn) {
        // Simple down navigation for vertical lists
        if (currentFocusIndex < focusableElements.length - 1) {
            focusElement(currentFocusIndex + 1);
        }
        return;
    }

    // Standard grid navigation
    const currentRow = Math.floor(currentFocusIndex / 4);
    const currentCol = currentFocusIndex % 4;
    const newIndex = (currentRow + 1) * 4 + currentCol;

    if (newIndex < focusableElements.length) {
        focusElement(newIndex);
    }
}

function navigateLeft() {
    if (isProfileOverlayOpen) {
        // In overlay, navigate left in grid
        if (currentFocusIndex > 0) {
            focusElement(currentFocusIndex - 1);
        }
        return;
    }

    // Check if we're in an episode or action button (don't allow left/right)
    const isEpisode = focusedElement && focusedElement.classList.contains('episode-item');
    const isActionBtn = focusedElement && focusedElement.classList.contains('action-btn');

    if (isEpisode || isActionBtn) {
        // No left/right navigation in vertical lists
        return;
    }

    // Check if we're at the first menu tab
    const menuTabs = Array.from(document.querySelectorAll('.menu-tab.focusable'));
    if (focusedElement && focusedElement === menuTabs[0]) {
        // Navigate to profile badge
        const profileBadge = document.getElementById('profile-badge');
        if (profileBadge) {
            const badgeIndex = focusableElements.indexOf(profileBadge);
            if (badgeIndex !== -1) {
                focusElement(badgeIndex);
                return;
            }
        }
    }

    if (currentFocusIndex > 0) {
        focusElement(currentFocusIndex - 1);
    }
}

function navigateRight() {
    if (isProfileOverlayOpen) {
        // In overlay, navigate right in grid
        if (currentFocusIndex < focusableElements.length - 1) {
            focusElement(currentFocusIndex + 1);
        }
        return;
    }

    // Check if we're in an episode or action button (don't allow left/right)
    const isEpisode = focusedElement && focusedElement.classList.contains('episode-item');
    const isActionBtn = focusedElement && focusedElement.classList.contains('action-btn');

    if (isEpisode || isActionBtn) {
        // No left/right navigation in vertical lists
        return;
    }

    // Check if we're at the profile badge
    const profileBadge = document.getElementById('profile-badge');
    if (focusedElement && focusedElement === profileBadge) {
        // Navigate to first menu tab
        const menuTabs = Array.from(document.querySelectorAll('.menu-tab.focusable'));
        if (menuTabs.length > 0) {
            const firstTabIndex = focusableElements.indexOf(menuTabs[0]);
            if (firstTabIndex !== -1) {
                focusElement(firstTabIndex);
                return;
            }
        }
    }

    if (currentFocusIndex < focusableElements.length - 1) {
        focusElement(currentFocusIndex + 1);
    }
}

// Select focused element
function selectFocusedElement() {
    if (!focusedElement) return;

    // Handle profile card selection in overlay
    if (focusedElement.classList.contains('profile-quick-card')) {
        const profileName = focusedElement.getAttribute('data-profile');
        if (profileName) {
            switchProfile(profileName);
        }
        return;
    }

    // Handle profile badge selection - open profile overlay
    if (focusedElement.id === 'profile-badge') {
        toggleProfileOverlay();
        return;
    }

    // Handle menu tab selection
    if (focusedElement.classList.contains('menu-tab')) {
        const tab = focusedElement.getAttribute('data-tab');
        handleMenuSelection(tab);
        return;
    }

    // Handle show selection - only open detail, don't play
    const showId = focusedElement.getAttribute('data-show');
    if (showId) {
        openShowDetail(showId);
        return; // Exit after opening detail
    }

    // Handle action buttons (only on show detail screen)
    if (focusedElement.classList.contains('action-btn')) {
        const buttonText = focusedElement.textContent.trim();
        if (buttonText.includes('Play')) {
            playContent();
        } else if (buttonText.includes('My List')) {
            showNotification('Added to My List');
        } else if (buttonText.includes('More Info')) {
            showNotification('More info coming soon...');
        }
        return;
    }

    // Handle episode selection (only on show detail screen)
    if (focusedElement.classList.contains('episode-item')) {
        playContent();
        return;
    }

    // Handle player buttons
    if (focusedElement.classList.contains('player-btn')) {
        const buttonText = focusedElement.textContent.trim();
        if (buttonText.includes('Pause')) {
            showNotification('Paused');
        } else if (buttonText.includes('Previous')) {
            showNotification('Previous episode');
        } else if (buttonText.includes('Next')) {
            showNotification('Next episode');
        }
        return;
    }
}

// Handle menu selection
function handleMenuSelection(tab) {
    // Update active tab
    document.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
    const selectedTab = document.querySelector(`.menu-tab[data-tab="${tab}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Handle different menu options
    if (tab === 'home') {
        showNotification('Home');
    } else if (tab === 'browse') {
        showNotification('Browse - Coming soon');
    } else if (tab === 'my-list') {
        showNotification('My List - Coming soon');
    } else if (tab === 'settings') {
        showNotification('Settings - Coming soon');
    }
}

// Play content
function playContent() {
    // Get the current show title if on detail screen
    const showTitle = document.getElementById('show-title')?.textContent || 'Content';
    document.getElementById('playing-title').textContent = `Now Playing: ${showTitle}`;

    showScreen('playing-screen');
    showNotification('Playing...');
}

// Open show detail screen
function openShowDetail(showId) {
    // Extract show number from ID (e.g., "show-1" -> "1")
    const showNumber = showId.replace('show-', '');

    const show = {
        title: `Show ${showNumber}`
    };

    // Update show detail screen
    document.getElementById('show-title').textContent = show.title;

    // Navigate to show detail screen
    showScreen('show-detail-screen');
    updateFocusableElements();
}

// Screen navigation
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show the requested screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        currentScreen = screenId;

        // Add to navigation history
        if (navigationHistory[navigationHistory.length - 1] !== screenId) {
            navigationHistory.push(screenId);
        }

        // Update focusable elements
        updateFocusableElements();
    }
}

// Profile overlay toggle (NEW FEATURE)
function toggleProfileOverlay() {
    isProfileOverlayOpen = !isProfileOverlayOpen;

    if (isProfileOverlayOpen) {
        profileOverlay.classList.add('active');
        // Visual feedback
        profileBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            profileBtn.style.transform = 'scale(1)';
        }, 100);

        // Update focusable elements to include profile cards
        updateFocusableElementsForOverlay();
    } else {
        profileOverlay.classList.remove('active');
        // Restore normal focusable elements
        updateFocusableElements();
    }
}

// Update focusable elements when profile overlay is open
function updateFocusableElementsForOverlay() {
    const profileCards = Array.from(profileOverlay.querySelectorAll('.profile-quick-card.focusable'));

    // Clear all focused states
    document.querySelectorAll('.focused').forEach(el => el.classList.remove('focused'));

    focusableElements = profileCards;

    // Focus the currently active profile
    if (focusableElements.length > 0) {
        // Find the profile card matching the current profile
        const currentProfileIndex = profileCards.findIndex(card =>
            card.getAttribute('data-profile') === currentProfile
        );

        // If found, focus that profile, otherwise focus first
        currentFocusIndex = currentProfileIndex !== -1 ? currentProfileIndex : 0;
        focusElement(currentFocusIndex);
    }
}

// Switch profile
function switchProfile(profileName) {
    currentProfile = profileName;
    updateProfileDisplay();

    // Close overlay if open
    if (isProfileOverlayOpen) {
        toggleProfileOverlay();
    }

    // Reset click counter if we used the old method
    if (currentScreen === 'profile-select-screen') {
        setTimeout(() => {
            clickCount = 0;
            updateClickCount();
        }, 1000);
    }

    // Return to home screen and show tasks
    setTimeout(() => {
        if (navigationHistory[navigationHistory.length - 1] !== 'home-screen') {
            showScreen('home-screen');
            navigationHistory = ['home-screen'];
        }
        // Show tasks popup after profile switch
        showTasksPopup();
    }, 500);
}

// Update profile display
function updateProfileDisplay() {
    currentProfileDisplay.textContent = currentProfile;

    // Hide profile button when Profile 1 is active
    const profileBtn = document.getElementById('profile-btn');

    // Show/hide tasks based on current profile
    const profile1TasksList = document.getElementById('profile1-tasks-list');
    const profile2TasksList = document.getElementById('profile2-tasks-list');

    if (currentProfile === 'Profile 1') {
        profileBtn.style.visibility = 'hidden';
        if (profile1TasksList) profile1TasksList.style.display = 'block';
        if (profile2TasksList) profile2TasksList.style.display = 'none';
    } else {
        profileBtn.style.visibility = 'visible';
        if (profile1TasksList) profile1TasksList.style.display = 'none';
        if (profile2TasksList) profile2TasksList.style.display = 'block';
    }
}

// Show tasks (no longer needed as popup - tasks always visible)
function showTasksPopup() {
    // Tasks are now always visible in the sidebar
    // This function is kept for compatibility but does nothing
    return;
}

// Update click counter
function updateClickCount() {
    clickCountDisplay.textContent = clickCount;
}

// Increment click counter (for traditional method)
function incrementClickCount() {
    // Only count clicks when using the traditional navigation path
    if (!isProfileOverlayOpen && currentScreen !== 'home-screen') {
        clickCount++;
        updateClickCount();
    }
}

// Go home (disabled)
function goHome() {
    // Home button disabled for prototype
    return;
}

// Go back
function goBack() {
    if (navigationHistory.length > 1) {
        navigationHistory.pop();
        const previousScreen = navigationHistory[navigationHistory.length - 1];
        showScreen(previousScreen);
        incrementClickCount();
    } else if (currentScreen === 'home-screen') {
        // On home screen, back button moves focus to menu
        const menuTabs = Array.from(document.querySelectorAll('.menu-tab.focusable'));
        if (menuTabs.length > 0) {
            const firstTabIndex = focusableElements.indexOf(menuTabs[0]);
            if (firstTabIndex !== -1) {
                focusElement(firstTabIndex);
            }
        }
    }
}

// Show notification (disabled)
function showNotification(message) {
    // Notifications disabled for cleaner prototype
    return;
}

// Attach event listeners
function attachEventListeners() {
    // Profile button (NEW FEATURE) - instant access from anywhere
    profileBtn.addEventListener('click', () => {
        toggleProfileOverlay();
    });

    // Profile selection from overlay (NEW FEATURE)
    document.querySelectorAll('.profile-quick-card').forEach(card => {
        card.addEventListener('click', () => {
            const profileName = card.getAttribute('data-profile');
            switchProfile(profileName);
        });
    });

    // Home button
    homeBtn.addEventListener('click', () => {
        goHome();
    });

    // Back button
    backBtn.addEventListener('click', () => {
        goBack();
    });

    // Close overlay when clicking outside
    profileOverlay.addEventListener('click', (e) => {
        if (e.target === profileOverlay) {
            toggleProfileOverlay();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'p':
            case 'P':
                toggleProfileOverlay();
                break;
            case 'h':
            case 'H':
                goHome();
                break;
            case 'Escape':
                if (isProfileOverlayOpen) {
                    toggleProfileOverlay();
                } else {
                    goBack();
                }
                break;
        }
    });

    // D-pad navigation buttons
    document.querySelector('.dpad-up')?.addEventListener('click', navigateUp);
    document.querySelector('.dpad-down')?.addEventListener('click', navigateDown);
    document.querySelector('.dpad-left')?.addEventListener('click', navigateLeft);
    document.querySelector('.dpad-right')?.addEventListener('click', navigateRight);

    // OK button to select focused element
    okBtn?.addEventListener('click', selectFocusedElement);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
