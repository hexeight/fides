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

        chrome.storage.local.get("key", function (val) {
            var privKeyObj = openpgp.key.readArmored(val.key).keys[0];
            var passphrase = 'super long and hard to guess secret';
            privKeyObj.decrypt(passphrase);
            // Determine action
            switch (event.data.action)
            {
                case "sign":
                    options = {
                        data: JSON.stringify(event.data.message), // input as String (or Uint8Array)
                        privateKeys: privKeyObj // for signing
                    };
                    
                    openpgp.sign(options).then(function(signed) {
                        cleartext = signed.data; // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
                        responder(event.data._id, { data: cleartext });
                    });
                break;

                default:
                    responder(event.data._id, { error: "Invalid action" });
                    return;
                break;
            }
        });
    }
});