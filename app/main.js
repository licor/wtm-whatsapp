(function(scope) {
    "use strict";

    var app = require('electron').app;
    var AppMenu = require('electron').Menu;
    var MenuItem = require('electron').MenuItem;
    var AppTray = require('electron').Tray;
    var fileSystem = require('fs');
    var NativeImage = require('electron').NativeImage;
    var BrowserWindow = require('electron').BrowserWindow;

    var join = require('path').join;

    global.whatsApp = {
        init() {
            whatsApp.createMenu();
            whatsApp.createTray();

            whatsApp.clearCache();
            whatsApp.openWindow();
        },

        createMenu() {
            whatsApp.menu =
                AppMenu.buildFromTemplate(require('./menu'));
                AppMenu.setApplicationMenu(whatsApp.menu);
        },

        createTray() {
            whatsApp.tray = new AppTray(__dirname + '/assets/img/trayTemplate.png');

            whatsApp.tray.on('clicked', () => {
                whatsApp.window.show();
            });

            whatsApp.tray.setToolTip('WTM for WhatsApp');
        },

        clearCache() {
            try {
                fileSystem.unlinkSync(app.getPath('appData') + '/Application Cache/Index');
            } catch(e) {}
        },

        openWindow() {
            whatsApp.window = new BrowserWindow({
                // "y": config.get("posY"),
                // "x": config.get("posX"),
                // "width": config.get("width"),
                // "height": config.get("height"),
                "minWidth": 600,
                "minHeight": 600,
                //"type": "toolbar",
                "title": "WhatsApp",
                "webPreferences": {
                  "nodeIntegration": false,
                  "preload": join(__dirname, 'js', 'injected.js')
                }
            });

            whatsApp.window.loadURL('https://web.whatsapp.com', {
                userAgent: 'Mozilla/5.0 (WTM 0.0.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36'
            });

            whatsApp.window.show();

            whatsApp.window.webContents.on("new-window", (e, url) => {
                require('electron').shell.openExternal(url);
                e.preventDefault();
            });

        }
    };

    global.settings = {
        init() {
            // if there is already one instance of the window created show that one
            if (settings.window){
                settings.window.show();
            } else {
                settings.openWindow();
                settings.createMenu();
            }
        },

        createMenu() {
            settings.menu = new AppMenu();
            settings.menu.append(new MenuItem(
                {
                    label: "close",
                    visible: false,
                    accelerator: "esc",
                    click() {settings.window.close();}
                })
            );
            settings.menu.append(new MenuItem(
                {
                    label: 'Toggle DevTools',
                    accelerator: 'Alt+CmdOrCtrl+O',
                    visible: false,
                    click() {  settings.window.toggleDevTools(); }
                })
            );
            settings.menu.append(new MenuItem(
                {
                    label: 'Reload settings view',
                    accelerator: 'CmdOrCtrl+r',
                    visible: false,
                    click() { settings.window.reload();}
                })
            );
            settings.window.setMenu(settings.menu);
            settings.window.setMenuBarVisibility(false);
        },

        openWindow() {
            settings.window = new BrowserWindow(
                {
                    "width": 500,
                    "height": 500,
                    "resizable": true,
                    "center": true,
                    "frame": true,
                    "webPreferences": {
                      "nodeIntegration": true,
                    }
                }
            );

            settings.window.loadURL("file://" + __dirname + "/html/settings.html");
            settings.window.show();

            settings.window.on("close", () => {
                settings.window = null;
            });
        }
    };

    app.on('ready', () => {
        whatsApp.init();
    });
})(this);
