var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('/scripts/fides.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

function responder (id, message) {
    var payload = {
        _id: id,
        target: "fidesboot",
        message: message
    };
    window.postMessage(payload, "*");
};

console.log("Loading...");
window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;
    
    if (event.data.target == "fides") {
        console.log("Content script received message: ", event.data);

        chrome.storage.local.get("prv", function (val) {

            if (val === undefined)
                throw "Certificate not created!";

            var prv = KEYUTIL.getKey(val.prv);
            
            // Determine action
            switch (event.data.action)
            {
                case "sign":
                    var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
                    sig.init(prv);
                    sig.updateString(JSON.stringify(event.data.message));
                    var signed = sig.sign();
                    responder(event.data._id, signed);
                break;

                default:
                    responder(event.data._id, { error: "Invalid action" });
                    return;
                break;
            }
        });
    }
});