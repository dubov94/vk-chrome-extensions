'use strict';

let vkExtensionsFeatures = {
    'age': true, 
    'audio_downloader': true,
    'audio_bitrate': true,
    'away_gate_remover': true,
    'mathjax': false
}

chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == 'update') {
        chrome.storage.sync.get(null, function(items) {
            for(let key in items) {
                if(vkExtensionsFeatures.hasOwnProperty(key)) {
                    vkExtensionsFeatures[key] = Boolean(items[key])
                } else {
                    chrome.storage.sync.remove(key)
                }
            }
            chrome.storage.sync.set(vkExtensionsFeatures)
        })
    } else if(details.reason == 'install') {
        chrome.storage.sync.set(vkExtensionsFeatures)
    }
})

function notifyFeature(key, value) {
    let pair = {}
    pair[key] = value
    chrome.tabs.query({}, function(tabs) {
        for(let i = 0; i < tabs.length; ++i) {
            chrome.tabs.sendMessage(tabs[i].id, pair)
        }
    })
    chrome.storage.sync.set(pair)
}
