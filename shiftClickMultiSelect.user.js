// ==UserScript==
// @name         Shift click multi select photos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shift click on a second photo to select all photos in between
// @author       https://github.com/ghan1t
// @match        http://url:2283/*
// @match        https://demo.immich.app/*
// @updateURL    https://github.com/ghan1t/immich-tampermonkey/raw/main/shiftClickMultiSelect.user.js
// @downloadURL  https://github.com/ghan1t/immich-tampermonkey/raw/main/shiftClickMultiSelect.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==


(function () {
    'use strict';

    // Function to handle the click event
    function handleClick(event) {
        // Check if the shift key was pressed when the click event occurred
        if (event.shiftKey) {

            let checkedPhotos = $('button[aria-checked="true"]');
            console.log(checkedPhotos);
            if (checkedPhotos.length == 1) {

                let firstChecked = checkedPhotos.first().parents('a');
                // Get the element that was clicked
                let clickedElement = event.target;
                let lastChecked = $(clickedElement).parents('a');
                //console.log("first", firstChecked, "last", lastChecked);

                let allAHrefWithPhotos = $('a.group');
                let indexFirst = allAHrefWithPhotos.index(firstChecked);
                let indexLast = allAHrefWithPhotos.index(lastChecked);

                if (indexFirst >= 0 && indexLast >= 0) {

                    //console.log("start= " + indexFirst + " end= "+ indexLast);

                    // Determine the lower and upper bounds for the loop
                    let startIndex = Math.min(indexFirst, indexLast) + 1;
                    let endIndex = Math.max(indexFirst, indexLast);
                    //console.log("start= " + startIndex + " end= "+ endIndex);

                    // Iterate over the range, excluding the elements at indexFirst and indexLast
                    for (let i = startIndex; i < endIndex; i++) {
                        // Access each element by index and perform actions
                        allAHrefWithPhotos.eq(i)[0].click();
                    }
                } else {
                    console.log("wrong indexes: start= " + indexFirst + " end= "+ indexLast);
                }
            } else {
                console.log("doing nothing, already more than one selected");
            }


        }
    }

    document.addEventListener('click', handleClick, true);

})();
