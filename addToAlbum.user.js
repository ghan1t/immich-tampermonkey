// ==UserScript==
// @name         Add to immich album shortcut
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add photos to immich album with shortcut
// @author       https://github.com/ghan1t
// @match        http://immich-url:2283/photos*
// @updateURL    https://github.com/ghan1t/immich-tampermonkey/raw/main/addToAlbum.user.js
// @downloadURL  https://github.com/ghan1t/immich-tampermonkey/raw/main/addToAlbum.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

const shortcut = "I";

const State = {
    IDLE: "IDLE",
    WAITING_FOR_ADD_TO_ALBUM: "WAITING_FOR_ADD_TO_ALBUM",
    WAITING_FOR_ALBUM_POPUP: "WAITING_FOR_ALBUM_POPUP",
    FILTERING_ALBUMS: "FILTERING_ALBUMS"
};

let currentState = State.IDLE;
let currentAlbumIndex = 0;
let albumListParent;
let lastSelectedAlbumName; // Store the last selected album name

// Helper function to update selection
function updateAlbumSelection(index) {
    const albums = albumListParent.find('button').slice(1);
    albums.removeClass('border-2');
    currentAlbumIndex = index;
    const currentAlbum = albums.eq(currentAlbumIndex);
    currentAlbum.addClass('border-2');
    currentAlbum[0].scrollIntoView({ behavior: 'instant', block: 'nearest' });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to find and select an album by name
function selectAlbumByName() {
    if (albumListParent && albumListParent.length) {
        const albums = albumListParent.find('button').slice(1);
        const matchedIndex = albums.index(albums.filter(function () {
            return $(this).find('span span.w-full').text().trim() === lastSelectedAlbumName;
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
                    lastSelectedAlbumName = localStorage.getItem('lastSelectedAlbumName') || '';
                    resetAlbumSelection();
                }
                break;
            case State.FILTERING_ALBUMS:
                if ($('p:contains("ALBUMS")').length === 0) {
                    currentState = State.IDLE;
                    albumListParent = null;
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
        if (currentState === State.IDLE /*&& e.shiftKey*/ && e.key === shortcut) {
            var plusButton = $('button[title="Add to..."], button[title="More"]');
            if (plusButton.length) {
                console.log('Add to album button found, clicking it...');
                currentState = State.WAITING_FOR_ADD_TO_ALBUM;
                console.log("state: " + currentState);
                plusButton.click();
            }
        }
    }, true);

})();
