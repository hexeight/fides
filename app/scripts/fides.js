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
            var payload = "host:" + window.location.host + "\n" +
                "nonce:" + (new Date()).getTime() + "\n" + data;
            return emitter("sign", payload);
        },
        verify: function (key, data, signature) {
            var payload = {
                _host: window.location.host,
                data: {
                    publicKey: key,
                    data: data,
                    signature: signature
                }
            };
            return emitter("verify", payload);
        }
    };

    global.XMLHttpRequestSigned = function (data) {
        var http = new XMLHttpRequest();
        http.sendSigned = function () {
            // Add signing headers

            if (!data)
                XMLHttpRequest.send();
            else
                XMLHttpRequest.send(data);
        }

        return http;
    }

    function initSignature () {
        document.querySelectorAll("form input[type='signature']").forEach(function (ele) {
            ele.readOnly = true;
            ele.required = true;
            ele.placeholder = "Click to sign";
            ele.onclick = function (evt) {
                // calculate signature
                var formString = "";
                var formData = new FormData(ele.parentElement);
                for(var pair of formData.entries()) {
                    formString += pair[0] + "=" + pair[1] + "\n";
                }
                console.log(formString);
                global.FidesKeystore.sign(formString).then(function (val) {
                    console.log("Sign", val);
                    ele.value = val;
                });
                ele.value = "";
            }
        });
    }

    initSignature();
    document.onreadystatechange = function (a,b,c) {
        console.log(a,b,c);
        initSignature();
    }

}).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
console.log("Fides loaded", window.FidesKeystore);