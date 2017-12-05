function setStorage (prv, pub) {
  chrome.storage.local.set({ 'prv': prv, 'pub': pub }, function () {
    console.log("Stored!");
  });
}

var btn = document.getElementById("save");
btn.addEventListener("click", function (e) {

  var rsaKeypair = KEYUTIL.generateKeypair("RSA", 1024);
  var pubKey = KEYUTIL.getPEM(rsaKeypair.pubKeyObj);
  var prvKey = KEYUTIL.getPEM(rsaKeypair.prvKeyObj, "PKCS8PRV");
  document.getElementById("genkey").innerHTML = pubKey;
  setStorage(prvKey, pubKey);

})


function init() {
  var key = chrome.storage.local.get("pub", function (val) {
    
    if (val !== undefined) {
      console.log(val);
      document.getElementById("genkey").innerHTML = val.pub;
    }
  });
}

init();

/*
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
      console.log("Adding fides headers");
      details.requestHeaders.push({name:"pgp-sign",value:"123"});
      return {requestHeaders: details.requestHeaders};
  },
{urls: ["<all_urls>"]},
["blocking"]);
*/