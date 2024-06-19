# Tampermonkey Scripts for Immich

This repository contains [Tampermonkey](https://www.tampermonkey.net/) scripts for [immich](https://github.com/immich-app).

## Install Tampermonkey

1. Add Tampermonkey to your browser by following instructions here: <https://www.tampermonkey.net/>
2. In your browser enable developer mode (go to Extensions in [Brave](brave://extensions/) or [Chrome](chrome://extensions/))

## Add Photos to Album with a Shortcut

### Installation

1. Open this url <https://github.com/ghan1t/immich-tampermonkey/raw/main/addToAlbum.user.js> and then select install.
2. Open Tampermonkey extension and on the tab "Installed Userscripts" click on "Add photos to immich album with shortcut".
3. Modify "@match" to reflect the URL of your immich instance.
4. Optional: modify the shortcut letter (capital letters mean shift+letter)

### Usage

* Select one or multiple photos or open one photo.
* Press your shortcut.
* Enter the name of your album.
* Use arrow up/down to select the correct album.
* Press enter to add the photo(s) to the album.
* The next time you add to an album, the previous album will be pre-selected and you can just press enter.

### Updating

* Tampermonkey checks daily for updates and shows a popup if an update is available.
* Because you changed the url of immich, the update is manual and it will overwrite the url.
* After the update you need to modify "@match" again to match your immich instance.