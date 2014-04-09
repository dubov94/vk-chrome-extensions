chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == "install") {
		chrome.storage.sync.set({
			"age": "true", 
			"audio_downloader": "true",
			"away_gate_remover": "true",
			"mathjax": "true"
		});
	}
});


function notify(key, value) {
	var pair = {};
	pair[key] = value.toString(); // Chrome is doing this anyway
	chrome.tabs.query({url: "*://vk.com/*"},
		function(tabs) {
			for(var i = 0; i < tabs.length; ++i) {
				chrome.tabs.sendMessage(tabs[i].id, pair);
			}
		}
	);
	chrome.storage.sync.set(pair);
};