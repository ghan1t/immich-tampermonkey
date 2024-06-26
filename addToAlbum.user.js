// ==UserScript==
// @name         Add photos to immich album with shortcut       
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add photos to immich album with shortcut
// @author       https://github.com/ghan1t
// @match        http://immich-url:2283/*
// @updateURL    https://github.com/ghan1t/immich-tampermonkey/raw/main/addToAlbum.user.js
// @downloadURL  https://github.com/ghan1t/immich-tampermonkey/raw/main/addToAlbum.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

// HashMap of shortcut characters to album names
const albumShortcuts = {
    'I': null, // Default Shortcut
    'N': 'Album 1',
    'B': 'Album 2'
};

const State = {
    IDLE: "IDLE",
    WAITING_FOR_ADD_TO_ALBUM: "WAITING_FOR_ADD_TO_ALBUM",
    WAITING_FOR_ALBUM_POPUP: "WAITING_FOR_ALBUM_POPUP",
    FILTERING_ALBUMS: "FILTERING_ALBUMS"
};

let currentState = State.IDLE;
let currentAlbumIndex = 0;
let albumListParent;
let lastSelectedAlbumName = localStorage.getItem('lastSelectedAlbumName') || ''; // Store the last selected album name
let directSelectAlbumName = null;

// Helper function to update selection
function updateAlbumSelection(index) {
    const albums = albumListParent.find('button').slice(1);
    albums.removeClass('border-2');
    currentAlbumIndex = index;
    const currentAlbum = albums.eq(currentAlbumIndex);
    currentAlbum.addClass('border-2');
    currentAlbum[0].scrollIntoView({ behavior: 'instant', block: 'nearest' });
    if (directSelectAlbumName != null) {
        console.log('Directly adding to Album: ' + directSelectAlbumName);
        directSelectAlbumName = null;
        currentAlbum.click();
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to find and select an album by name
function selectAlbumByName() {
    if (albumListParent && albumListParent.length) {
        const albums = albumListParent.find('button').slice(1);
        const matchedIndex = albums.index(albums.filter(function () {
            if (directSelectAlbumName != null) {
                return $(this).find('span span.w-full').text().trim() === directSelectAlbumName;
            } else {
            return $(this).find('span span.w-full').text().trim() === lastSelectedAlbumName;
            }
        }));

        if (matchedIndex >= 0) {
            updateAlbumSelection(matchedIndex);
        } else {
            updateAlbumSelection(0); // Default to first if not found
        }
    }
}

async function resetAlbumSelection() {
    await sleep(200);
    selectAlbumByName();
}
(function () {
    'use strict';

    // Mutation observer to watch for various changes based on state
    const observer = new MutationObserver(mutations => {
        switch (currentState) {
            case State.WAITING_FOR_ADD_TO_ALBUM:
                var menuButton = $('button[role="menuitem"]:contains("Add to album")');
                if (menuButton.length) {
                    menuButton.click();
                    currentState = State.WAITING_FOR_ALBUM_POPUP;
                    console.log("state: " + currentState);
                }
                break;
            case State.WAITING_FOR_ALBUM_POPUP:
                if ($('p:contains("ALBUMS")').length) {
                    albumListParent = $('p:contains("ALBUMS")').parent();
                    currentState = State.FILTERING_ALBUMS;
                    console.log("state: " + currentState);
                    resetAlbumSelection();
                }
                break;
            case State.FILTERING_ALBUMS:
                if ($('p:contains("ALBUMS")').length === 0) {
                    currentState = State.IDLE;
                    albumListParent = null;
                    directSelectAlbumName = null;
                    console.log("state: " + currentState);
                }
                break;

        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.addEventListener('keydown', function (e) {
        // Keyboard navigation for album list
        if (currentState === State.FILTERING_ALBUMS) {
            const albums = albumListParent.find('button').slice(1);
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const increment = e.key === 'ArrowDown' ? 1 : -1;
                updateAlbumSelection((currentAlbumIndex + increment + albums.length) % albums.length);
            } else if (e.key === 'Enter' && albums.length > 0) {
                const selectedAlbum = albums.eq(currentAlbumIndex);
                lastSelectedAlbumName = selectedAlbum.find('span span.w-full').text().trim();
                localStorage.setItem('lastSelectedAlbumName', lastSelectedAlbumName); // Save to localStorage
                selectedAlbum.click();
                currentState = State.IDLE; // Reset state after selection
                console.log("state: " + currentState + " saved Album name: " + lastSelectedAlbumName);
            } else {
                resetAlbumSelection();
            }
        }
        // Initial Shortcut
        if (currentState === State.IDLE) {
            // Fetch the album name associated with the pressed key
            const targetAlbumName = albumShortcuts[e.key];
            if (targetAlbumName !== undefined) {
                console.log("pressed shortcut", targetAlbumName);
                if (targetAlbumName !== null) {
                    directSelectAlbumName = targetAlbumName;
                } else {
                    directSelectAlbumName = null;
                }
            var plusButton = $('button[title="Add to..."], button[title="More"]');
            if (plusButton.length) {
                console.log('Add to album button found, clicking it...');
                currentState = State.WAITING_FOR_ADD_TO_ALBUM;
                console.log("state: " + currentState);
                plusButton.click();
                }
            }
        }
    }, true);

})();
