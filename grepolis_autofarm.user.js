// ==UserScript==
// @grant        none
// @downloadURL  https://iximeq.github.io/grepolis-autofarm-install/grepolis_autofarm.user.js
// @updateURL    https://iximeq.github.io/grepolis-autofarm-install/grepolis_autofarm.user.js
// @name         Grepolis AutoFarm Premium + Konsola w menu
// @namespace    https://pl135.grepolis.com/
// @version      3.7
// @description  Automatic farming using the premium window with menu integration and console commands in Grepolis style
// @author       Chyzyn
// @match        https://pl135.grepolis.com/game/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let farming = false;
    const farmInterval = 305 * 1000;
    let farmTimer = null;
    let consoleBox = null;

    function log(msg) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('pl-PL', { hour12: false });
        const fullMsg = `[${timeStr}] ${msg}`;
        console.log(fullMsg);
        if (consoleBox) {
            const entry = document.createElement('div');
            entry.textContent = fullMsg;
            consoleBox.appendChild(entry);
            consoleBox.scrollTop = consoleBox.scrollHeight;
        }
    }

    function farm() {
        log("🔄 Próba farmienia (Premium)...");

        const selectAll = document.querySelector(".checkbox.select_all");
        const claimBtn = document.querySelector("#fto_claim_button");

        if (selectAll && !selectAll.classList.contains("checked")) {
            selectAll.click();
            log("✅ Zaznaczono wszystkie miasta.");

            // Poczekaj 500 ms zanim klikniesz "Odbierz"
            setTimeout(() => {
                if (claimBtn && !claimBtn.classList.contains("disabled")) {
                    claimBtn.click();
                    log("✅ Kliknięto Odbierz.");
                } else {
                    log("⚠️ Odbierz nieaktywny lub brak dostępnych wiosek.");
                }
            }, 500);

        } else {
            // Jeśli "zaznacz wszystkie" już jest zaznaczone, kliknij od razu odbierz
            if (claimBtn && !claimBtn.classList.contains("disabled")) {
                claimBtn.click();
                log("✅ Kliknięto Odbierz.");
            } else {
                log("⚠️ Odbierz nieaktywny lub brak dostępnych wiosek.");
            }
        }
    }

    function createGrepoWindow() {
        if (document.getElementById("autofarm_window")) return;

        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
        <div id="autofarm_window" tabindex="-1" role="dialog" class="ui-dialog ui-corner-all ui-widget ui-widget-content ui-front ui-draggable js-window-main-container" aria-describedby="ui-id-1" aria-labelledby="ui-id-2" style="height: auto; width: 800px; top: 151.5px; left: 406px; z-index: 10001;">
          <div class="ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle">
            <span id="ui-id-2" class="ui-dialog-title">AutoFarm & Konsola</span>
            <button type="button" class="icon_right icon_type_speed ui-dialog-titlebar-close" id="autofarm-close">
              <div class="left"></div>
              <div class="right"></div>
              <div class="caption js-caption"> <span></span><div class="icon"></div><div class="effect js-effect"></div></div>
            </button>
            <a href="#" class="ui-dialog-titlebar-minimize ui-corner-all" id="autofarm-minimize"></a>
          </div>
          <div class="gpwindow_frame ui-dialog-content ui-widget-content" id="ui-id-1" style="width: auto; min-height: 0px; max-height: none; height: 570px;">
            <div class="gpwindow_left"></div>
            <div class="gpwindow_right"></div>
            <div class="gpwindow_bottom">
              <div class="gpwindow_left corner"></div>
              <div class="gpwindow_right corner"></div>
            </div>
            <div class="gpwindow_top">
              <div class="gpwindow_left corner"></div>
              <div class="gpwindow_right corner"></div>
            </div>
            <div id="gpwnd_1000" class="gpwindow_content">
              <div class="game_inner_box">
                <div class="game_border">
                  <div class="game_border_top"></div>
                  <div class="game_border_bottom"></div>
                  <div class="game_border_left"></div>
                  <div class="game_border_right"></div>
                  <div class="game_border_corner corner1"></div>
                  <div class="game_border_corner corner2"></div>
                  <div class="game_border_corner corner3"></div>
                  <div class="game_border corner4"></div>
                  <div class="game_header bold" style="height:18px;">
                    <div style="float:left; padding-right:10px;">AutoFarm & Konsola</div>
                  </div>
                  <div style="padding: 10px; color: white;">
                    <button id="autofarm-btn" style="margin-bottom: 10px;">AutoFarm: OFF</button>
                    <a href="#" id="clear-console" style="margin-left: 10px; color: #fff; text-decoration: underline;">Wyczyść konsolę</a>
                    <div id="console" style="background-color: grey; height: 390px; overflow-y: auto; padding: 10px; margin-top: 10px;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
        document.body.appendChild(wrapper.firstElementChild);

        const windowElement = document.getElementById("autofarm_window");
        consoleBox = document.getElementById("console");

        document.getElementById("autofarm-btn").addEventListener("click", () => {
            farming = !farming;
            document.getElementById("autofarm-btn").innerText = `AutoFarm: ${farming ? "ON" : "OFF"}`;
            if (farming) {
                log("✅ AutoFarm włączony.");
                farm();
                farmTimer = setInterval(() => { if (farming) farm(); }, farmInterval);
            } else {
                log("🛑 AutoFarm wyłączony.");
                clearInterval(farmTimer);
            }
        });

        document.getElementById("clear-console").addEventListener("click", (e) => {
            e.preventDefault();
            consoleBox.textContent = "";
        });

        document.getElementById("autofarm-close").addEventListener("click", () => {
            windowElement.remove();
        });

        document.getElementById("autofarm-minimize").addEventListener("click", () => {
            windowElement.style.display = "none";
            createMinimizedBox();
        });

        function createMinimizedBox() {
            const windowsBar = document.querySelector(".windows");
            if (!windowsBar || windowsBar.querySelector(".box[cid='9999']")) return;

            const box = document.createElement("div");
            box.className = "box";
            box.setAttribute("cid", "9999");
            box.innerHTML = `
                <div class="box-left"></div>
                <div class="box-right"></div>
                <div class="box-middle">
                    <div class="caption">AutoFarm</div>
                    <div class="btn_wnd close" cid="9999"></div>
                    <div class="btn_wnd maximize" cid="9999"></div>
                </div>`;
            box.querySelector(".btn_wnd.close").addEventListener("click", () => box.remove());
            box.querySelector(".btn_wnd.maximize").addEventListener("click", () => {
                windowElement.style.display = "block";
                box.remove();
            });
            windowsBar.appendChild(box);
        }

        $(".js-window-main-container").draggable({ handle: ".ui-dialog-titlebar" });
    }

    function addMenuItem() {
        const menu = document.querySelector(".middle .content ul");
        if (!menu) return;
        const li = document.createElement("li");
        li.className = "main_menu_item";
        li.style.marginTop = "2px";
        li.innerHTML = `
        <span class="content_wrapper">
            <span class="button_wrapper">
                <span class="button">
                    <span class="icon" style="background: url(https://gpack.innogamescdn.com/images/game/buildings/senate.png) no-repeat center;"></span>
                    <div class="ui_highlight" data-type="main_menu" data-subtype="autofarm"></div>
                    <span class="indicator" data-indicator-id="autofarm"></span>
                </span>
            </span>
            <span class="name_wrapper">
                <span class="name">AutoFarm</span>
            </span>
        </span>`;
        li.addEventListener("click", () => {
            const window = document.querySelector(".js-window-main-container");
            if (window) {
                window.style.display = window.style.display === "none" ? "block" : "none";
            } else createGrepoWindow();
        });
        menu.appendChild(li);
    }

    window.addEventListener("load", () => {
        setTimeout(() => {
            addMenuItem();
            createGrepoWindow();
            log("🔘 AutoFarm UI dodany do menu.");
        }, 3000);
    });
})();
