let VK_EXTENSIONS_FEATURES = {
    "age": "true", 
    "audio_downloader": "true",
    "audio_bitrate": "true",
    "away_gate_remover": "true",
    "mathjax": "false"
}

chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "update") {
        chrome.storage.sync.get(null, function(items) {
            for(let key in items) {
                if(VK_EXTENSIONS_FEATURES.hasOwnProperty(key)) {
                    VK_EXTENSIONS_FEATURES[key] = items[key]
                } else {
                    chrome.storage.sync.remove(key)
                }
            }
            chrome.storage.sync.set(VK_EXTENSIONS_FEATURES)
        })
    } else if(details.reason == "install") {
        chrome.storage.sync.set(VK_EXTENSIONS_FEATURES)
    }
})

function notify(key, value) {
    let pair = {}
    pair[key] = value.toString() // Chrome is doing this anyway
    chrome.tabs.query({}, function(tabs) {
        for(let i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, pair)
        }
    })
    chrome.storage.sync.set(pair)
}
