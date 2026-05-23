(function () {
    const script = document.currentScript;
    const token = script.getAttribute("data-token");
    const SERVER = (script.getAttribute("data-server") || "https://snaptics.vercel.app").replace(/\/$/, "");

    if (!token) return;

    function getDeviceType() {
        const ua = navigator.userAgent;
        if (/Mobi|Android/i.test(ua)) return "mobile";
        if (/Tablet|iPad/i.test(ua)) return "tablet";
        return "desktop";
    }

    function getBrowser() {
        const ua = navigator.userAgent;
        if (/Edg\//i.test(ua)) return "Edge";
        if (/OPR\//i.test(ua)) return "Opera";
        if (/Chrome\//i.test(ua)) return "Chrome";
        if (/Firefox\//i.test(ua)) return "Firefox";
        if (/Safari\//i.test(ua)) return "Safari";
        return "Other";
    }

    function getSessionId() {
        const key = "sn_sid";
        let sid = sessionStorage.getItem(key);
        if (!sid) {
            sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
            sessionStorage.setItem(key, sid);
        }
        return sid;
    }

    function send(eventName, extra) {
        const payload = Object.assign({
            token,
            eventName,
            url: location.pathname,
            referrer: document.referrer || null,
            sessionId: getSessionId(),
            deviceType: getDeviceType(),
            browser: getBrowser(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }, extra);

        const endpoint = SERVER + "/api/analytics";

        if (navigator.sendBeacon) {
            navigator.sendBeacon(endpoint, JSON.stringify(payload));
        } else {
            fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                keepalive: true,
            });
        }
    }

    send("pageview");

    const startTime = Date.now();
    window.addEventListener("pagehide", function () {
        send("pagehide", { duration: Math.round((Date.now() - startTime) / 1000) });
    });

    window.snaptics = {
        track: function (eventName, props) {
            send(eventName, { props: props || {} });
        },
    };
})();