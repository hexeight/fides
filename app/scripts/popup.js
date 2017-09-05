function setStorage (text) {
  chrome.storage.local.set({ 'key': text }, function () {
    console.log("Stored!");
  });
}

var btn = document.getElementById("save");
btn.addEventListener("click", function (e) {
  var options = {
      userIds: [{ name:'Jon Smith', email:'jon@example.com' }], // multiple user IDs
      numBits: 4096,                                            // RSA key size
      passphrase: 'super long and hard to guess secret'         // protects the private key
  };

  openpgp.generateKey(options).then(function(key) {
      var privkey = key.privateKeyArmored; // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
      var pubkey = key.publicKeyArmored;   // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
      setStorage(privkey);
  });
})