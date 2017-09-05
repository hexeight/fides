(function (global) {

    var count = 0, messageQueue = [];

    window.addEventListener("message", function(event) {
        // We only accept messages from ourselves
        if (event.source != window)
            return;
        if (event.data.target == "fidesboot") {
            console.log("Fides boot received message: ", event.data);
            messageQueue[event.data_id].resolve(event.data.message);
        }
    });

    function emitter (action, message) {
        return new Promise ((resolve, reject) => {
            messageQueue[message._id] = {
                resolve: resolve,
                reject: reject
            };
            var payload = {
                _id : ++count,
                action: action,
                target: "fides",
                message: message
            };
            window.postMessage(payload, "*");
        });
    };

    global.FidesKeystore = {
        sign: function (data) {
            var payload = {
                _host: window.location.host,
                data: data
            };
            return emitter("sign", payload);
        }
    };
}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
console.log("Fides loaded", window.FidesKeystore);