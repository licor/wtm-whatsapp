(function () {

    document.addEventListener('DOMContentLoaded', function () {
        console.log('DOM Loaded');
        var jq = document.createElement('script'); jq.type = 'text/script';
        jq.src = "js/lib/jquery.min.js";
        var b = document.getElementsByTagName('head')[0]; b.appendChild(jq);
        console.log('jquery loaded');


        // var target = document.querySelector('.message-list');

        // // cria uma nova instância de observador
        // var observer = new MutationObserver(function(mutations) {
        //     mutations.forEach(function(mutation) {
        //         console.log(mutation.type);
        //     });    
        // });    

        // // configuração do observador:
        // var config = { attributes: true, childList: true, characterData: true };
 
        // // passar o nó alvo, bem como as opções de observação
        // observer.observe(target, config);        


        // Notification spec: https://developer.mozilla.org/en/docs/Web/API/notification

        // Save native notification
        var _Notification = window.Notification;

        var debug = true;

        // Create proxy notification
        var ProxyNotification = function (title, options)
        {
            // Proxy constructor
            var _notification = new _Notification(title, options);

            // Proxy instance properties
            this.title = _notification.title;
            this.dir = _notification.dir;
            this.lang = _notification.lang;
            this.body = _notification.body;
            this.tag = _notification.tag;
            this.icon = _notification.icon;

            // Proxy event handlers
            var that = this;
            _notification.onclick = function (event)
            {
                if (that.onclick != undefined) that.onclick(event);

                if (isBackgroundScript)
                {
                    var srcChatTitle = undefined;
                    if (event != undefined && event.srcElement != undefined && typeof event.srcElement.title == "string" && event.srcElement.title.length > 0)
                    {
                        srcChatTitle = event.srcElement.title;
                        
                        if (debug) console.info("WAT: Background notification click intercepted with srcChatTitle " + srcChatTitle);
                    };
                    window.postMessage({ name: "backgroundNotificationClicked", srcChatTitle: srcChatTitle }, "*");
                }
                else
                {
                    if (debug) console.info("WAT: Foreground notification click intercepted");

                    window.postMessage({ name: "foregroundNotificationClicked" }, "*");
                };
            };
            _notification.onshow = function (event)
            {
                if (that.onshow != undefined) that.onshow(event);

                if (!isBackgroundScript)
                {
                    if (debug) console.info("WAT: Foreground notification show intercepted");

                    window.postMessage({ name: "foregroundNotificationShown" }, "*");
                };
            };
            _notification.onerror = function (event)
            {
                if (that.onerror != undefined) that.onerror(event);
            };
            _notification.onclose = function (event)
            {
                if (that.onclose != undefined) that.onclose(event);
            };

            // Proxy instance methods
            this.close = function ()
            {
                _notification.close();
            };
            this.addEventListener = function (type, listener, useCapture)
            {
                _notification.addEventListener(type, listener, useCapture);
            };
            this.removeEventListener = function (type, listener, useCapture)
            {
                _notification.removeEventListener(type, listener, useCapture);
            };
            this.dispatchEvent = function (event)
            {
                _notification.dispatchEvent(event);
            };
        };

        // Proxy static properties
        ProxyNotification.permission = _Notification.permission;

        // Proxy static methods
        ProxyNotification.requestPermission = _Notification.requestPermission;

        // Replace native notification with proxy notification
        window.Notification = ProxyNotification;

    });

})();
