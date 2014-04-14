var VK_EXTENSIONS_FEATURES = {
	"age": "true", 
	"audio_downloader": "true",
	"audio_bitrate": "true",
	"away_gate_remover": "true",
	"mathjax": "false"
};

chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == "update") {
		chrome.storage.sync.get(null, function(items) {
			for(var key in items) {
				if(VK_EXTENSIONS_FEATURES.hasOwnProperty(key)) {
					VK_EXTENSIONS_FEATURES[key] = items[key];
				} else {
					chrome.storage.sync.remove(key);
				}
			}
		});
	}
	if(details.reason == "install" || details.reason == "update") {
		chrome.storage.sync.set(VK_EXTENSIONS_FEATURES);
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