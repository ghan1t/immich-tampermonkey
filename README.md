# Tampermonkey Scripts for Immich

This repository contains [Tampermonkey](https://www.tampermonkey.net/) scripts for [immich](https://github.com/immich-app).

## Install Tampermonkey

1. Add Tampermonkey to your browser by following instructions here: <https://www.tampermonkey.net/>
2. In your browser enable developer mode (go to Extensions in [Brave](brave://extensions/) or [Chrome](chrome://extensions/))

## Add Photos to Album with a Shortcut

### Configuration

* Set the URL of your immich instance in the @match tag
* Set the shortcuts in the array. Value null opens the "Add to album" popup, an album name directly adds the photo to an album.

```javascript
const albumShortcuts = {
    'I': null, // Default Shortcut
    'N': 'Album 1', // Directly add photo to Album 1
    'B': 'Album 2' // Directly add photo to Album 2
};
```

### Usage

* Select one or multiple photos or open one photo.
* Press your shortcut.
* Enter the name of your album.
* Use arrow up/down to select the correct album.
* Press enter to add the photo(s) to the album.
* The next time you add to an album, the previous album will be pre-selected and you can just
press enter.
* Press the shortcut for an Album to directly add a photo.

## Select Multiple Photos with Shift + Click

* Select the first photo
* Select the last photo while holding Shift
* All photos in between will be selected
* Note: only works if no other photos had been selected

## Script Installation

1. Open this the following urls and then select install.
    1. AddToAlbum: <https://github.com/ghan1t/immich-tampermonkey/raw/main/addToAlbum.user.js>
    2. ShiftClickMultiSelect: <https://github.com/ghan1t/immich-tampermonkey/raw/main/shiftClickMultiSelect.user.js>
2. Open Tampermonkey extension and on the tab "Installed Userscripts" click on the installed script.
3. Modify "@match" to reflect the URL of your immich instance.
4. Optional: modify the shortcut letter (capital letters mean shift+letter)

## Updating Scripts

* Tampermonkey checks daily for updates and shows a popup if an update is available.
* Because you changed the url of immich, the update is manual and it will overwrite the url.
* After the update you need to modify "@match" again to match your immich instance.
