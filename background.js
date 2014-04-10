chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == "install") {
		chrome.storage.sync.set({
			"age": "true", 
			"audio_downloader": "true",
			"away_gate_remover": "true",
			"mathjax": "false"
		});
		chrome.tabs.query({url: "*://vk.com/*"},
			function(tabs) {
				for(var i = 0; i < tabs.length; ++i) {
					if(tabs[i].url.match("^http.*://vk.com/away.*$") === null) {
						chrome.tabs.executeScript(tabs[i].id, {file: "age.js", runAt: "document_end"});
						chrome.tabs.executeScript(tabs[i].id, {file: "audio_downloader.js", runAt: "document_end"});
					}
				}
			}
		);
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