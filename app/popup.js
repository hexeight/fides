function setStorage (text) {
  chrome.storage.local.set({ 'value': text }, function () {
    console.log("Stored!");
  });
}

var btn = document.getElementById("save");
btn.addEventListener("click", function (e) {
  setStorage("KJHGJGHJ");
})