var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('fides.js');
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
        chrome.storage.local.get("value", function (val) {
            responder(event.data._id, { signature: val });
        });
    }
});