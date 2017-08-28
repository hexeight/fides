window.Fides = (function (window) {

    function emitter (message) {
        window.postMessage(message, "*");
    };

    return {
        sign: function () {
            var payload = {
                _host: window.location,
                data: data
            };
    
            emitter(payload);
        }
    };
})(window);
console.log("Fides loaded", Fides);