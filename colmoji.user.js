// ==UserScript==
// @name         Colmoji
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Find and insert emojis with a clean, Discord-like autocomplete menu that works everywhere.
// @author       lori (loriwasstolen)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      cdn.jsdelivr.net
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNjQiIGhlaWdodD0iMzY0IiBmaWxsPSJub25lIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTEwLjU1IDExNi4yNWExMCAxMCAwIDAgMC0xOS4zMiA1LjE4bDkuNjYtMi41OXptLTMuMjcgNjUuMDdhMTAgMTAgMCAxIDAgMTkuMzEtNS4xOGwtOS42NSAyLjU5em0xMjMuMDQtOTcuMTZhMTAgMTAgMCAxIDAtMTkuMzEgNS4xOGw5LjY1LTIuNnptLTMuMjcgNjUuMDZhMTAgMTAgMCAxIDAgMTkuMzItNS4xN2wtOS42NiAyLjU4em0xMjAuMTItMTEuNDgtOS42NiAyLjU5YzIzLjAyIDg1Ljg5LTI3Ljk1IDE3NC4xNy0xMTMuODQgMTk3LjE4bDIuNTkgOS42NiAyLjU5IDkuNjZjOTYuNTUtMjUuODcgMTUzLjg1LTEyNS4xMiAxMjcuOTgtMjIxLjY4ek0yMjYuMjYgMzQ3LjE3bC0yLjU5LTkuNjZDMTM3Ljc4IDM2MC41MyA0OS41IDMwOS41NiAyNi40OSAyMjMuNjdsLTkuNjYgMi41OS05LjY2IDIuNTlDMzMuMDQgMzI1LjQgMTMyLjI5IDM4Mi43IDIyOC44NSAzNTYuODN6TTE2LjgzIDIyNi4yNmw5LjY2LTIuNTlDMy40NyAxMzcuNzggNTQuNDQgNDkuNSAxNDAuMzMgMjYuNDlsLTIuNTktOS42Ni0yLjU5LTkuNjZDMzguNiAzMy4wNC0xOC43IDEzMi4yOSA3LjE3IDIyOC44NXpNMTM3Ljc0IDE2LjgzbDIuNTkgOS42NkMyMjYuMjIgMy40NyAzMTQuNSA1NC40NCAzMzcuNTEgMTQwLjMzbDkuNjYtMi41OSA5LjY2LTIuNTlDMzMwLjk2IDM4LjYgMjMxLjcxLTE4LjcgMTM1LjE1IDcuMTd6TTI2NS41NiAxODguNmwtOS42NiAyLjU5YTY5IDY5IDAgMCAxLTYuOSA1Mi4zNmw4LjY2IDUgOC42NiA1YTg5IDg5IDAgMCAwIDguOS02Ny41NHptLTcuOSA1OS45NS04LjY2LTVhNjkgNjkgMCAwIDEtNDEuOSAzMi4xNGwyLjYgOS42NiAyLjU4IDkuNjZhODkgODkgMCAwIDAgNTQuMDQtNDEuNDZ6bS00Ny45NyAzNi44LTIuNTktOS42NmE2OSA2OSAwIDAgMS01Mi4zNS02Ljg5bC01IDguNjYtNSA4LjY2YTg5IDg5IDAgMCAwIDY3LjUzIDguOXptLTU5Ljk0LTcuODkgNS04LjY2YTY5IDY5IDAgMCAxLTMyLjE1LTQxLjlsLTkuNjYgMi42LTkuNjYgMi41OGE4OSA4OSAwIDAgMCA0MS40NyA1NC4wNHptLTQ4Ljg2LTE1OC42Mi05LjY2IDIuNTkgMTYuMDUgNTkuODkgOS42Ni0yLjYgOS42Ni0yLjU4LTE2LjA1LTU5Ljg5em0xMTkuNzctMzIuMS05LjY2IDIuNiAxNi4wNSA1OS44OCA5LjY2LTIuNTkgOS42Ni0yLjU4LTE2LjA1LTU5Ljl6Ii8+PC9zdmc+
// @downloadURL  https://raw.githubusercontent.com/loriwasstolen/Colmoji/main/colmoji.user.js
// @updateURL    https://raw.githubusercontent.com/loriwasstolen/Colmoji/main/colmoji.user.js
// @license      MIT
// ==/UserScript==

/*
The MIT License (MIT)
Copyright (c) 2025 lori (loriwasstolen)
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN an ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const EMOJI_DATA_URL = 'https://cdn.jsdelivr.net/npm/emojilib/emojis.json';
    const CACHE_KEYS = { MAP: 'colmoji_map_cache', TIMESTAMP: 'colmoji_timestamp', RECENTS: 'colmoji_recents_cache' };
    const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;
    const MAX_SUGGESTIONS = 7;
    const MAX_RECENTS = 14;
    const LOGO_ICON_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNjQiIGhlaWdodD0iMzY0IiBmaWxsPSJub25lIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTEwLjU1IDExNi4yNWExMCAxMCAwIDAgMC0xOS4zMiA1LjE4bDkuNjYtMi41OXptLTMuMjcgNjUuMDdhMTAgMTAgMCAxIDAgMTkuMzEtNS4xOGwtOS42NSAyLjU5em0xMjMuMDQtOTcuMTZhMTAgMTAgMCAxIDAtMTkuMzEgNS4xOGw5LjY1LTIuNnptLTMuMjcgNjUuMDZhMTAgMTAgMCAxIDAgMTkuMzItNS4xN2wtOS42NiAyLjU4em0xMjAuMTItMTEuNDgtOS42NiAyLjU5YzIzLjAyIDg1Ljg5LTI3Ljk1IDE3NC4xNy0xMTMuODQgMTk3LjE4bDIuNTkgOS42NiAyLjU5IDkuNjZjOTYuNTUtMjUuODcgMTUzLjg1LTEyNS4xMiAxMjcuOTgtMjIxLjY4ek0yMjYuMjYgMzQ3LjE3bC0yLjU5LTkuNjZDMTM3Ljc4IDM2MC41MyA0OS41IDMwOS41NiAyNi40OSAyMjMuNjdsLTkuNjYgMi41OS05LjY2IDIuNTlDMzMuMDQgMzI1LjQgMTMyLjI5IDM4Mi43IDIyOC44NSAzNTYuODN6TTE2LjgzIDIyNi4yNmw5LjY2LTIuNTlDMy40NyAxMzcuNzggNTQuNDQgNDkuNSAxNDAuMzMgMjYuNDlsLTIuNTktOS42Ni0yLjU5LTkuNjZDMzguNiAzMy4wNC0xOC43IDEzMi4yOSA3LjE3IDIyOC44NXpNMTM3Ljc0IDE2LjgzbDIuNTkgOS42NkMyMjYuMjIgMy40NyAzMTQuNSA1NC40NCAzMzcuNTEgMTQwLjMzbDkuNjYtMi41OSA5LjY2LTIuNTlDMzMwLjk2IDM4LjYgMjMxLjcxLTE4LjcgMTM1LjE1IDcuMTd6TTI2NS41NiAxODguNmwtOS42NiAyLjU5YTY5IDY5IDAgMCAxLTYuOSA1Mi4zNmw4LjY2IDUgOC42NiA1YTg5IDg5IDAgMCAwIDguOS02Ny41NHptLTcuOSA1OS45NS04LjY2LTVhNjkgNjkgMCAwIDEtNDEuOSAzMi4xNGwyLjYgOS42NiAyLjU4IDkuNjZhODkgODkgMCAwIDAgNTQuMDQtNDEuNDZ6bS00Ny45NyAzNi44LTIuNTktOS42NmE2OSA2OSAwIDAgMS01Mi4zNS02Ljg5bC01IDguNjYtNSA4LjY2YTg5IDg5IDAgMCAwIDY3LjUzIDguOXptLTU5Ljk0LTcuODkgNS04LjY2YTY5IDY5IDAgMCAxLTMyLjE1LTQxLjlsLTkuNjYgMi42LTkuNjYgMi41OGE4OSA4OSAwIDAgMCA0MS40NyA1NC4wNHptLTQ4Ljg2LTE1OC42Mi05LjY2IDIuNTkgMTYuMDUgNTkuODkgOS42Ni0yLjYgOS42Ni0yLjU4LTE2LjA1LTU5Ljg5em0xMTkuNzctMzIuMS05LjY2IDIuNiAxNi4wNSA1OS44OCA5LjY2LTIuNTkgOS42Ni0yLjU4LTE2LjA1LTU5Ljl6Ii8+PC9zdmc+';
    const LOGO_WORDMARK_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2ODAiIGhlaWdodD0iMjQ0IiBmaWxsPSJub25lIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNTcuMDYgMTk2cS0xNC42IDAtMjYtNi44LTExLjQtNy0xOC0xOS02LjQtMTItNi40LTI3LjR0Ni40LTI3LjJxNi42LTEyIDE4LTE4Ljh0MjUuOC02LjhxMTIuMiAwIDIxLjggNC42YTQyLjUgNDIuNSAwIDAgMSAxNS44IDEyLjhxNi4yIDguMiA4IDE5LjRoLTE5LjZxLTItOS04LjgtMTQuNC02LjYtNS40LTE2LjgtNS40LTguOCAwLTE1LjQgNC40dC0xMC4yIDEyLjQtMy42IDE5cTAgMTAuOCAzLjYgMTl0MTAuMiAxMi44cTYuNiA0LjQgMTUuNiA0LjQgOS44IDAgMTYuNi01LjIgNy01LjQgOS0xNC40aDE5LjZhNDMgNDMgMCAwIDEtOC40IDE5LjIgNDIuNSA0Mi41IDAgMCAxLTE1LjggMTIuOHEtOS42IDQuNi0yMS40IDQuNm0xODQuNTUtMlY1MGgyMC44djE0NHptNTAgMFY5MmgxOS44djI0aDF2Nzh6bTY4LjggMHYtNjYuNnEwLTEwLjQtNC44LTE1LjJ0LTEzLjgtNC44cS04LjQgMC0xNS4yIDRhMjcgMjcgMCAwIDAtMTAuNCAxMC44cS0zLjggNi44LTMuOCAxNi4ybC0yLjYtMjMuOGE0MC42IDQwLjYgMCAwIDEgMTUtMThxMTAuMi02LjYgMjIuOC02LjYgMTUuMiAwIDI0LjIgOC44IDkuMiA4LjggOS4yIDIzLjJ2NzJ6bTY4LjggMHYtNjYuNnEwLTEwLjQtNS0xNS4yLTQuOC00LjgtMTMuOC00LjhhMjkgMjkgMCAwIDAtMjUuNiAxNC44cS0zLjggNi44LTMuOCAxNi4ybC00LjItMjMuOGE0MSA0MSAwIDAgMSAxNS42LTE4IDQ0IDQ0IDAgMCAxIDIzLjYtNi42cTE1LjQgMCAyNC42IDkgOS4yIDguOCA5LjIgMjMuNlYxOTR6bTkyLjk0IDJxLTE1LjYgMC0yNy40LTYuOC0xMS44LTctMTguNC0xOS02LjYtMTIuMi02LjYtMjcuNiAwLTE1LjYgNi42LTI3LjRhNDkgNDkgMCAwIDEgMTguNC0xOC40cTExLjgtNi44IDI3LjQtNi44IDE1LjggMCAyNy42IDYuOGE0NS42IDQ1LjYgMCAwIDEgMTguMiAxOC40cTYuNiAxMS44IDYuNiAyNy40IDAgMTUuNC02LjYgMjcuNmE0OCA0OCAwIDAgMS0xOC4yIDE5cS0xMS44IDYuOC0yNy42IDYuOG0wLTE3cTkuMzkgMCAxNi4yLTQuNmEzMS40IDMxLjQgMCAwIDAgMTEtMTIuOHE0LTguMiA0LTE5LjIgMC0xNi40LTguOC0yNS44LTguNi05LjYtMjIuNC05LjYtMTMuNiAwLTIyLjQgOS42LTguNiA5LjYtOC42IDI1LjggMCAxMSAzLjggMTkuMmEzMS40IDMxLjQgMCAwIDAgMTEgMTIuOHE3LjIgNC42IDE2LjIgNC42bTYyLjk3IDU4cS0zLjYgMC02LjItLjRhMjEgMjEgMCAwIDEtNC42LTEuMnYtMTZhMzYgMzYgMCAwIDAgOC40IDEuMnE3IDAgOS44LTMuMiAzLTMgMy05LjJWOTJoMjAuOHYxMTYuOHEwIDEzLjQtNy42IDIwLjgtNy40IDcuNC0yMy42IDcuNG05LjQtMTY1VjQ4LjZoMjNWNzJ6bTUwLjAyIDEyMlY5MmgyMC44djEwMnptLTEtMTIyVjQ4LjZoMjNWNzJ6TTE1NSAxMjcuOGE1IDUgMCAxIDAtOS42NiAyLjU4bDQuODMtMS4yOXptLTUuMjYgMTlhNSA1IDAgMSAwIDkuNjYtMi41OWwtNC44MyAxLjN6bTM4LjA5LTI3LjhhNSA1IDAgMSAwLTkuNjYgMi41OWw0LjgzLTEuM3ptLTUuMjYgMTlhNSA1IDAgMCAwIDkuNjYtMi41OWwtNC44MyAxLjN6bTM1LjEtMy43My00LjgzIDEuM2E0MS44NyA0MS44NyAwIDAgMS0yOS42IDUxLjI3bDEuMyA0LjgzIDEuMjkgNC44M2E1MS44NyA1MS44NyAwIDAgMCAzNi42Ny02My41MnptLTMzLjE0IDU3LjQtMS4zLTQuODNhNDEuODcgNDEuODcgMCAwIDEtNTEuMjctMjkuNmwtNC44MyAxLjMtNC44MyAxLjI5YTUxLjg3IDUxLjg3IDAgMCAwIDYzLjUzIDM2LjY3em0tNTcuNC0zMy4xNCA0LjgzLTEuM2E0MS44NyA0MS44NyAwIDAgMSAyOS42LTUxLjI3bC0xLjI5LTQuODMtMS4zLTQuODNhNTEuODcgNTEuODcgMCAwIDAtMzYuNjcgNjMuNTN6bTMzLjE0LTU3LjQgMS4zIDQuODNhNDEuODcgNDEuODcgMCAwIDEgNTEuMjcgMjkuNmw0LjgzLTEuMjkgNC44My0xLjNhNTEuODcgNTEuODcgMCAwIDAtNjMuNTItMzYuNjd6bTM1LjAzIDQ3LjA4LTQuODMgMS4zYTE2LjYgMTYuNiAwIDAgMS0xLjY2IDEyLjYzbDQuMzMgMi41IDQuMzMgMi41YTI2LjcgMjYuNyAwIDAgMCAyLjY2LTIwLjIyem0tMi4xNiAxNi40My00LjMzLTIuNWExNi43IDE2LjcgMCAwIDEtMTAuMTEgNy43NmwxLjMgNC44MyAxLjI5IDQuODNhMjYuNyAyNi43IDAgMCAwIDE2LjE4LTEyLjQyem0tMTMuMTUgMTAuMDktMS4zLTQuODNhMTYuNyAxNi43IDAgMCAxLTEyLjYzLTEuNjZsLTIuNSA0LjMzLTIuNSA0LjMzYTI2LjcgMjYuNyAwIDAgMCAyMC4yMyAyLjY2em0tMTYuNDMtMi4xNiAyLjUtNC4zM2ExNi43IDE2LjcgMCAwIDEtNy43Ni0xMC4xMmwtNC44MyAxLjMtNC44MyAxLjNhMjYuNyAyNi43IDAgMCAwIDEyLjQyIDE2LjE4em0tMTMuMzktNDMuNDgtNC44MyAxLjMgNC40IDE2LjQgNC44My0xLjI4IDQuODMtMS4zLTQuNC0xNi40MXptMzIuODMtOC44LTQuODMgMS4zIDQuNCAxNi40MSA0LjgzLTEuMyA0LjgzLTEuMjgtNC40LTE2LjQyeiIvPjwvc3ZnPg==';

    // --- STATE MANAGEMENT ---
    const state = { emojiMap: null, emojiShortcodes: [], recentEmojis: [], activeInput: null, selectedIndex: 0, hasBeenDragged: false };
    const ui = { suggester: null, headerText: null, list: null };

    // --- SECTION: UI CREATION & STYLING ---

    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            #colmoji-suggester {
                position: absolute; width: 330px; background-color: #202225; color: #dde0e3;
                border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 99999;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
                font-size: 15px; cursor: move; user-select: none; display: flex; flex-direction: column;
                opacity: 0; transform: scale(0.98) translateY(5px); transition: opacity 0.12s ease, transform 0.12s ease;
                pointer-events: none;
            }
            #colmoji-suggester.visible { opacity: 1; transform: scale(1) translateY(0); pointer-events: all; }
            #colmoji-header { padding: 10px 14px; font-weight: 500; color: #f6f7f8; display: flex; align-items: center; border-bottom: 1px solid #313338; }
            #colmoji-header img { height: 20px; width: 20px; margin-right: 10px; }
            #colmoji-list { max-height: 240px; overflow-y: auto; padding: 6px; }
            #colmoji-footer { padding: 8px 14px; border-top: 1px solid #313338; text-align: center; }
            #colmoji-footer img { height: 16px; width: auto; opacity: 0.6; }
            .colmoji-suggestion { padding: 8px 10px; display: flex; align-items: center; cursor: pointer; border-radius: 8px; transition: background-color 0.1s ease; }
            .colmoji-suggestion:hover, .colmoji-suggestion.selected { background-color: #313338; }
            .colmoji-suggestion .char { font-size: 22px; margin-right: 12px; line-height: 1; }
            .colmoji-suggestion .shortcode { color: #f6f7f8; }
            /* Light Theme */
            #colmoji-suggester.light { background-color: #ffffff; color: #333333; border: 1px solid #e8e8e8; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            #colmoji-suggester.light #colmoji-header { color: #111; border-color: #f0f0f0; }
            #colmoji-suggester.light #colmoji-header img, #colmoji-suggester.light #colmoji-footer img { filter: invert(1); }
            #colmoji-suggester.light #colmoji-footer { border-color: #f0f0f0; }
            #colmoji-suggester.light .colmoji-suggestion:hover, .colmoji-suggester.light .colmoji-suggestion.selected { background-color: #f1f1f1; }
            #colmoji-suggester.light .colmoji-suggestion .shortcode { color: #111; }
            /* Scrollbar */
            #colmoji-list::-webkit-scrollbar { width: 8px; }
            #colmoji-list::-webkit-scrollbar-track { background: transparent; }
            #colmoji-list::-webkit-scrollbar-thumb { background-color: #2b2d31; border-radius: 4px; }
            #colmoji-suggester.light #colmoji-list::-webkit-scrollbar-thumb { background-color: #e0e0e0; }
        `;
        document.head.appendChild(style);
    }

    function createSuggesterUI() {
        ui.suggester = document.createElement('div');
        ui.suggester.id = 'colmoji-suggester';
        ui.suggester.innerHTML = `
            <div id="colmoji-header">
                <img src="${LOGO_ICON_URL}" alt="Colmoji Logo">
                <span id="colmoji-header-text"></span>
            </div>
            <div id="colmoji-list"></div>
            <div id="colmoji-footer">
                <img src="${LOGO_WORDMARK_URL}" alt="Colmoji Wordmark">
            </div>
        `;
        document.body.appendChild(ui.suggester);
        ui.headerText = ui.suggester.querySelector('#colmoji-header-text');
        ui.list = ui.suggester.querySelector('#colmoji-list');
        makeSuggesterDraggable(ui.suggester);
    }

    function makeSuggesterDraggable(element) {
        let offsetX, offsetY, isDragging = false;
        const onMouseDown = (e) => {
            if (e.button !== 0 || e.target.closest('.colmoji-suggestion')) return;
            isDragging = true; state.hasBeenDragged = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp, { once: true });
        };
        const onMouseMove = (e) => { if (isDragging) { element.style.left = `${e.clientX - offsetX}px`; element.style.top = `${e.clientY - offsetY}px`; } };
        const onMouseUp = () => { isDragging = false; document.removeEventListener('mousemove', onMouseMove); };
        element.addEventListener('mousedown', onMouseDown);
    }

    // --- SECTION: DATA HANDLING ---

    async function loadData() {
        const cachedTimestamp = parseInt(await GM_getValue(CACHE_KEYS.TIMESTAMP, '0'), 10);
        try { state.recentEmojis = JSON.parse(await GM_getValue(CACHE_KEYS.RECENTS, '[]')); } catch (e) { state.recentEmojis = []; }
        if (Date.now() - cachedTimestamp < CACHE_DURATION_MS) {
            const cachedMap = await GM_getValue(CACHE_KEYS.MAP, null);
            if (cachedMap) {
                try {
                    state.emojiMap = JSON.parse(cachedMap);
                    state.emojiShortcodes = Object.keys(state.emojiMap);
                    console.log(`Colmoji: Loaded ${state.emojiShortcodes.length} emojis from cache.`);
                    return;
                } catch (e) { /* Fall through */ }
            }
        }
        fetchAndCacheEmojis();
    }

    function fetchAndCacheEmojis() {
        GM_xmlhttpRequest({
            method: 'GET', url: EMOJI_DATA_URL,
            onload: (res) => {
                try {
                    state.emojiMap = processRawEmojiData(JSON.parse(res.responseText));
                    state.emojiShortcodes = Object.keys(state.emojiMap);
                    GM_setValue(CACHE_KEYS.MAP, JSON.stringify(state.emojiMap));
                    GM_setValue(CACHE_KEYS.TIMESTAMP, Date.now().toString());
                    console.log(`Colmoji: Cached ${state.emojiShortcodes.length} emojis.`);
                } catch (e) { console.error('Colmoji: Failed to parse emoji data.', e); }
            },
            onerror: (res) => console.error('Colmoji: Failed to fetch emoji list.', res)
        });
    }

    function processRawEmojiData(rawData) {
        const map = {};
        for (const shortcode in rawData) {
            const emojiData = rawData[shortcode];
            if (emojiData.char) {
                map[shortcode] = emojiData.char;
                if (emojiData.keywords) emojiData.keywords.forEach(kw => { if (!map[kw]) map[kw] = emojiData.char; });
            }
        }
        map['+1'] = '👍'; map['-1'] = '👎'; return map;
    }

    async function addEmojiToRecents(shortcode) {
        state.recentEmojis = [shortcode, ...state.recentEmojis.filter(s => s !== shortcode)].slice(0, MAX_RECENTS);
        await GM_setValue(CACHE_KEYS.RECENTS, JSON.stringify(state.recentEmojis));
    }

    // --- SECTION: CORE LOGIC & UI MANAGEMENT ---

    function hideSuggester() {
        ui.suggester.classList.remove('visible');
        state.activeInput = null; state.selectedIndex = 0; state.hasBeenDragged = false;
    }

    function showSuggester(query, target) {
        const isRecentsView = !query;
        const matches = isRecentsView ? state.recentEmojis : state.emojiShortcodes.filter(code => code.includes(query)).slice(0, MAX_SUGGESTIONS);
        if (matches.length === 0) { hideSuggester(); return; }

        const isFirstAppearance = (state.activeInput !== target);
        state.activeInput = target;
        ui.headerText.textContent = isRecentsView ? "Recently Used" : "Matching Emojis";
        populateSuggesterList(matches, query);
        updateTheme(target);
        if (isFirstAppearance || !state.hasBeenDragged) positionSuggester(target);
        ui.suggester.classList.add('visible');
    }

    function populateSuggesterList(matches, query) {
        ui.list.innerHTML = '';
        matches.forEach((shortcode) => {
            const item = document.createElement('div');
            item.className = 'colmoji-suggestion';
            item.innerHTML = `<span class="char">${state.emojiMap[shortcode]}</span> <span class="shortcode">:${shortcode}:</span>`;
            item.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const shortcodeToReplace = query ? `:${query}` : ':';
                insertEmoji(state.activeInput, shortcodeToReplace, state.emojiMap[shortcode], shortcode);
            }, true);
            ui.list.appendChild(item);
        });
        state.selectedIndex = 0;
        if (ui.list.children[0]) ui.list.children[0].classList.add('selected');
    }

    function positionSuggester(target) {
        const rect = target.getBoundingClientRect();
        const menuHeight = ui.suggester.offsetHeight;
        const margin = 8;
        let top = rect.bottom + margin;
        if (top + menuHeight > window.innerHeight && rect.top > menuHeight + margin) {
            top = rect.top - menuHeight - margin;
        }
        ui.suggester.style.top = `${top + window.scrollY}px`;
        ui.suggester.style.left = `${rect.left + window.scrollX}px`;
    }

    /**
     * Inserts the selected emoji into the text field, supporting both standard inputs and contenteditable divs.
     */
    function insertEmoji(target, textToReplace, emoji, shortcode) {
        addEmojiToRecents(shortcode);
        if (target.isContentEditable) {
            insertIntoContentEditable(textToReplace, emoji);
        } else {
            insertIntoInput(target, textToReplace, emoji);
        }
        // Dispatching an input event is crucial for frameworks like React to notice the change.
        target.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        hideSuggester();
    }

    function insertIntoInput(target, textToReplace, emoji) {
        const { value, selectionStart } = target;
        const textBefore = value.substring(0, selectionStart - textToReplace.length);
        const textAfter = value.substring(selectionStart);
        target.value = `${textBefore}${emoji} ${textAfter}`;
        const newPos = textBefore.length + emoji.length + 1;
        target.setSelectionRange(newPos, newPos);
    }

    function insertIntoContentEditable(textToReplace, emoji) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const textNode = range.endContainer;

        // Ensure we're working with a text node
        if (textNode.nodeType === Node.TEXT_NODE) {
            range.setStart(textNode, range.endOffset - textToReplace.length);
            range.deleteContents();

            // Use a non-breaking space to prevent cursor issues in some editors
            const emojiNode = document.createTextNode(emoji + '\u00A0');
            range.insertNode(emojiNode);

            // Move the cursor to after the inserted emoji and space
            range.setStartAfter(emojiNode);
            range.setEndAfter(emojiNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    // --- SECTION: EVENT HANDLERS & UTILITIES ---

    function handleInput(event) {
        if (!state.emojiMap) return;
        const { target } = event;
        // Updated check to include contenteditable elements
        if (!target || (!['input', 'textarea'].includes(target.tagName.toLowerCase()) && !target.isContentEditable)) return;

        const { textBeforeCursor } = getTextBeforeCursor(target);
        if (textBeforeCursor === null) { hideSuggester(); return; }

        const match = textBeforeCursor.match(/:([a-zA-Z0-9_+-]*)$/);
        if (match) { showSuggester(match[1], target); }
        else { hideSuggester(); }
    }
    
    /**
     * Gets the text content before the cursor, supporting both inputs and contenteditable divs.
     */
    function getTextBeforeCursor(element) {
        if (element.isContentEditable) {
            const selection = window.getSelection();
            if (selection.rangeCount === 0) return { textBeforeCursor: null };
            const range = selection.getRangeAt(0).cloneRange();
            range.selectNodeContents(element);
            range.setEnd(selection.focusNode, selection.focusOffset);
            return { textBeforeCursor: range.toString() };
        } else {
            return { textBeforeCursor: element.value.substring(0, element.selectionStart) };
        }
    }

    function handleKeyDown(event) {
        if (!state.activeInput || !ui.suggester.classList.contains('visible')) return;
        const items = ui.list.children;
        if (items.length === 0) return;

        const keyActions = {
            'ArrowDown': () => updateSelectedSuggestion((state.selectedIndex + 1) % items.length),
            'ArrowUp': () => updateSelectedSuggestion((state.selectedIndex - 1 + items.length) % items.length),
            'Enter': () => {
                const selectedItem = items[state.selectedIndex];
                const emoji = selectedItem.querySelector('.char').textContent;
                const shortcode = selectedItem.querySelector('.shortcode').textContent.slice(1, -1);
                const { textBeforeCursor } = getTextBeforeCursor(state.activeInput);
                const match = textBeforeCursor.match(/:([a-zA-Z0-9_+-]*)$/);
                if (match) insertEmoji(state.activeInput, match[0], emoji, shortcode);
            },
            'Tab': () => keyActions['Enter'](),
            'Escape': () => hideSuggester()
        };

        if (keyActions[event.key]) {
            event.preventDefault();
            keyActions[event.key]();
        }
    }

    function updateSelectedSuggestion(newIndex) {
        const items = ui.list.children;
        if (items[state.selectedIndex]) items[state.selectedIndex].classList.remove('selected');
        state.selectedIndex = newIndex;
        if (items[state.selectedIndex]) {
            items[state.selectedIndex].classList.add('selected');
            items[state.selectedIndex].scrollIntoView({ block: 'nearest' });
        }
    }

    function updateTheme(target) {
        const style = window.getComputedStyle(target);
        ui.suggester.classList.toggle('light', !isColorDark(style.backgroundColor));
    }

    function isColorDark(colorStr) {
        if (!colorStr || colorStr === 'transparent') return true;
        const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return true;
        const [r, g, b] = match.slice(1).map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance < 0.5;
    }

    function attachEventListeners() {
        // Use 'input' for real-time typing, and 'keyup' as a fallback for some contenteditable behaviors
        document.addEventListener('input', handleInput, true);
        document.addEventListener('keyup', handleInput, true); 
        document.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('click', (e) => {
            if (state.activeInput && e.target !== state.activeInput && !ui.suggester.contains(e.target)) {
                hideSuggester();
            }
        });
    }

    // --- SCRIPT EXECUTION ---
    function initialize() {
        injectCSS();
        createSuggesterUI();
        attachEventListeners();
        loadData();
    }

    initialize();
})();
