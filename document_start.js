const s = document.createElement("script");
s.src = chrome.runtime.getURL("inject.js");
const alertSound = new Audio(chrome.runtime.getURL("error.wav"));
alertSound.id = "zabbix-error-sound";
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
document.documentElement.appendChild(alertSound);
