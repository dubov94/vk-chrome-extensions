'use strict';

function globalObserver(F, timeout) {
    function smartTimeout(fn, interval) {
        let running = false
        let timerID
        this.reRun = function() {
            if(running) {
                clearTimeout(timerID)
            } else {
                running = true
            }
            timerID = setTimeout(function() { running = false; fn() }, interval)
        }
        this.stop = function() {
            if(running) {
                clearTimeout(timerID)
                running = false
            }
        }
    }

    let timer = new smartTimeout(F, timeout)
    let observer = new MutationObserver(function(mutations) {
        timer.reRun()
    })

    this.start = function() {
        observer.observe(document.body, {childList: true, subtree: true})
    }
    this.stop = function() {
        observer.disconnect()
        timer.stop()
    }
}

function vkRedesigned() {
    let style =  document.querySelector(`link[href^='/css/al/common.css']`)
    let version = parseInt(style.href.split('?')[1])
    return version > 1024
}

function executePageContextFunction(fn, argumentsList) {
    let script = document.createElement('script')
    let code = '(' + fn + ').apply(null, ' + JSON.stringify(argumentsList) + ');'
    script.textContent = code
    script.onload = function() {
        this.parentNode.removeChild(this)
    }
    document.head.appendChild(script)
}

let getAudioDataInPageContext = function(ids, messageType) {
    const step = 10
    for(let i = 0; i < ids.length; i += step) {
        ajax.post('al_audio.php', {
            act: 'reload_audio',
            ids: ids.slice(i, i + step).join(',')
        }, {
            onDone: function(data) {
                if(data) {
                    data.forEach(function(datum) {
                        window.postMessage({
                            type: messageType,
                            audio: AudioUtils.asObject(datum)
                        }, '*')
                    })
                } else {
                    topMsg('<b>VK Extensions</b>: unable to retrieve audio data because of <br>too many requests. Please, try again in a minute.')
                }
            }
        })
    }
}

let getAudioData = function(ids, messageType) {
    /* todo: caching */
    executePageContextFunction(getAudioDataInPageContext, [ids, messageType])
}

function addFeature(feature) { /* name, start, stop, inject */
    let launchingFunction
    if(feature.hasOwnProperty('inject')) {
        let injected = false
        launchingFunction = function() {
            if(injected) {
                feature.start()
            } else {
                feature.inject()
                injected = true
            }
        }
    } else {
        launchingFunction = feature.start
    }
    chrome.storage.sync.get(feature.name, function(items) {
        if(items[feature.name] === true) {
            launchingFunction()
        }

        if(feature.hasOwnProperty('stop')) {
            chrome.runtime.onMessage.addListener(
                function(request, sender, sendResponse) {
                    /* check if request contains feature */
                    if(feature.name in request) {
                        if(request[feature.name] === true) {
                            launchingFunction()
                        } else {
                            feature.stop()
                        }
                    }
                }
            )
        }
    })
}
