# Extension Architecture

This document outlines the architecture of the Asset Search Bar extension for Cocos Creator, aiming to make it easier for contributors to understand the codebase.

## Overview

The extension follows a standard Electron/Cocos Creator pattern, separating logic into a **main process** (for background tasks and core logic) and a **renderer process** (for the user interface).

## Directory Structure

```
extensions/Quick Finder/
├── src/
│   ├── main/       # Main process logic
│   ├── renderer/   # Renderer process logic (UI)
│   ├── common/     # Code shared between main and renderer
│   └── eazax/      # Utility modules
├── package.json    # Extension manifest, dependencies, contributions
├── config.json     # Default extension configuration
├── README.md
└── ARCHITECTURE.md # This file
```

## Core Components

1.  **Main Process (`src/main`)**
    *   **`index.js` (Entry Point):**
        *   Manages the extension's lifecycle (`load`, `unload`).
        *   Initializes other main process modules.
        *   Registers IPC event listeners for communication from the renderer process.
        *   Exports methods callable by Cocos Creator (e.g., `openSearchBar`, `openSettingsPanel`).
    *   **`finder.js`:**
        *   Handles the core file searching functionality.
        *   Collects file information within the project (`collectFiles`).
        *   Matches files based on keywords (`getMatchedFiles`).
        *   Manages internal caches for performance.
    *   **`opener.js`:**
        *   Handles actions related to files found by the finder.
        *   Opens files in the appropriate editor (`tryOpen`).
        *   Focuses on files within the Cocos Creator Assets panel (`focusOnFile`).
    *   **`panel-manager.js`:**
        *   Manages the UI panels associated with the extension.
        *   Handles opening and closing the search bar panel (`openSearchBar`, `closeSearchBar`).
        *   Manages the settings panel (`openSettingsPanel`).

2.  **Renderer Process (`src/renderer`)**
    *   Handles the user interface panels displayed within Cocos Creator.
    *   Built using standard web technologies (HTML, CSS, JavaScript).
    *   Communicates with the Main Process via IPC.

    *   **Search Bar Panel (`src/renderer/search`)**
        *   `index.html`: Defines the structure (layout) of the search input field and the results list.
        *   `index.css`: Provides the visual styling for the search bar and results.
        *   `index.js`: Contains the panel's logic:
            *   Captures user input from the search field.
            *   Sends the keyword to the Main Process via an IPC `match` message.
            *   Listens for `match-reply` IPC messages from the Main Process and displays the received results.
            *   Handles user interaction with the results list (e.g., clicks, keyboard navigation).
            *   Sends `open` or `focus` IPC messages to the Main Process when a user selects a file result.
            *   Listens for `data-update` IPC messages to know when file data might have changed.

    *   **Settings Panel (`src/renderer/settings`)**
        *   `index.html`: Defines the structure (layout) for configuration options (e.g., checkboxes, input fields).
        *   `index.css`: Provides the visual styling for the settings options.
        *   `index.js`: Contains the panel's logic:
            *   Loads the current extension settings (by calling `ConfigManager.get()` directly).
            *   Displays the current settings in the UI elements.
            *   Listens for user changes to the settings.
            *   Saves updated settings (by calling `ConfigManager.set()` directly) and then sends an IPC `reload` message to the Main Process to apply changes.

3.  **Common Code (`src/common`)**
    *   Contains modules used by both the main and renderer processes.
    *   Example: `ConfigManager` handles loading and accessing extension settings.

4.  **Utilities (`src/eazax`)**
    *   Provides reusable helper modules:
        *   `main-event`: Facilitates Inter-Process Communication (IPC).
        *   `editor-main-kit`, `editor-main-util`: Utilities for interacting with the Cocos Creator editor environment.
        *   `updater`: Handles checking for extension updates.
        *   `package-util`: Package-related helper functions.

## Communication

*   Communication between the main and renderer processes relies on **Inter-Process Communication (IPC)**, primarily managed by the `src/eazax/main-event` utility.
*   The renderer process sends commands/requests to the main process.
*   The main process performs the requested actions (like searching or file operations) and sends results or status updates back to the renderer process for display.

## Configuration & Entry

*   **`package.json`:** The manifest file. It defines:
    *   Extension metadata (name, version, description).
    *   Dependencies.
    *   The entry point for the main process (`main`).
    *   Definitions for UI panels (e.g., the search bar).
    *   Contributions to the Cocos Creator editor (e.g., menu items).
*   **`config.json`:** Stores default configuration values, likely managed by `src/common/config-manager.js`.
