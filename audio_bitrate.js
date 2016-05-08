'use strict';

addFeature(new function() { 
        function insertCSS() {
            let css = document.createElement('style')
            css.type = 'text/css'
            if(!vkRedesigned()) {
                css.innerHTML = 
                    `.vk_extensions_duration { 
                        padding-top: 0px !important; 
                        padding-bottom: 0px !important; 
                        position: absolute; 
                        right: 0px; 
                        bottom: 14px; 
                    }
                    .vk_extensions_bitrate { 
                        clear: right; 
                        font-size: 0.7em !important; 
                        padding-top: 1px !important; 
                        padding-bottom: 0px !important; 
                        position: absolute; 
                        right: 0px; 
                        bottom: 3px; 
                    }`
            } else {
                css.innerHTML =
                    `.vk_extensions_duration { 
                        margin-top: -4px; 
                    }
                    .audio_row_current.inlined .vk_extensions_duration {
                        margin-top: -7px;
                    }

                    .vk_extensions_bitrate { 
                        font-size: 0.7em; 
                        line-height: calc(1em + 1px); 
                        text-align: right; 
                    }
                    .audio_row:hover .vk_extensions_bitrate {
                        display: none;
                    }`
            }
            document.head.appendChild(css)
        }

        let contentChanged, undo;

        if(!vkRedesigned()) {
            let update = function(obj) {
                let bitrate = document.createElement('div')
                bitrate.style = 'display: none'
                obj.parentNode.appendChild(bitrate)
                bitrate.className = 'vk_extensions_bitrate duration fl_r'
                let url = obj.parentNode.parentNode.querySelector('input').value
                let dur = parseInt(url.substring(url.lastIndexOf(',') + 1))
                let xhr = new XMLHttpRequest()
                xhr.open('HEAD', url, true)
                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4 && xhr.status == 200) {
                        bitrate.innerText = Math.round(Number(xhr.getResponseHeader('Content-Length')) * 8 / dur / 1000)
                        obj.classList.add('vk_extensions_duration')
                        bitrate.style = ''
                    }
                }
                xhr.send()
            }

            let isAudioInfoBlock = function(obj, count) {
                return obj.childElementCount == count && obj.children[0].classList.contains('title_wrap')
            }

            contentChanged = function() {
                let blocks = document.querySelectorAll('.info')
                for(let i = 0; i < blocks.length; ++i) {
                    if(isAudioInfoBlock(blocks[i], 3)) {
                        update(blocks[i].children[2])
                    }
                }
            }

            undo = function() {
                let blocks = document.querySelectorAll('.info')
                for(let i = 0; i < blocks.length; ++i) {
                    if(isAudioInfoBlock(blocks[i], 4)) {
                        blocks[i].removeChild(blocks[i].children[3])
                        blocks[i].children[2].classList.remove('vk_extensions_duration')
                    }
                }
            }
        } else {
            window.addEventListener('message', function(event) {
                if(event.data.type === 'vkExtensionsAudioBitrate') {
                    let audio = event.data.audio
                    let audioBlock = document.querySelector('#audio_' + audio.fullId)
                    let durationWrapper = audioBlock.querySelector('.audio_duration_wrap')

                    let xhr = new XMLHttpRequest()
                    xhr.open('HEAD', audio.url, true)
                    xhr.onreadystatechange = function() {
                        if(this.readyState == this.DONE && this.status == 200) {
                            let bitrate = Math.round(Number(this.getResponseHeader('Content-Length')) * 8 / audio.duration / 1000)
                            let bitrateBlock = document.createElement('div')
                            bitrateBlock.classList.add('vk_extensions_bitrate')
                            bitrateBlock.innerText = bitrate
                            durationWrapper.firstElementChild.classList.add('vk_extensions_duration')
                            durationWrapper.appendChild(bitrateBlock)
                        }
                    }
                    xhr.send()
                }
            })

            contentChanged = function() {
                let blocksNotProcessed = document.querySelectorAll('.audio_row:not(.vk_extensions_audio)')
                if(blocksNotProcessed.length > 0) {
                    let idsNotProcessed = []
                    for(let i = 0; i < blocksNotProcessed.length; ++i) {
                        idsNotProcessed.push(blocksNotProcessed[i].getAttribute('data-full-id'))
                        blocksNotProcessed[i].classList.add('vk_extensions_audio')
                    }
                    getAudioData(idsNotProcessed, 'vkExtensionsAudioBitrate')
                }
            }

            undo = function() {
                let blocksProcessed = document.querySelectorAll('.vk_extensions_audio')
                for(let i = 0; i < blocksProcessed.length; ++i) {
                    let audioBlock = blocksProcessed[i]
                    let durationWrapper = audioBlock.querySelector('.audio_duration_wrap')
                    durationWrapper.removeChild(durationWrapper.lastElementChild)
                    durationWrapper.firstElementChild.classList.remove('vk_extensions_duration')
                    audioBlock.classList.remove('vk_extensions_audio')
                }
            }
        }

        let observer = new globalObserver(contentChanged, 100)

        this.name = 'audio_bitrate'
        this.start = function() {
            contentChanged()
            observer.start()
        }

        this.inject = function() {
            insertCSS()
            this.start()
        }

        this.stop = function() {
            observer.stop()
            undo()
        }
})
