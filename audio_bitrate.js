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
                    `.vk_extensions_audio .audio_duration {
                        display: block;
                        margin-top: -8px;
                    }

                    .vk_extensions_audio .audio_duration + div {
                        font-size: 0.8em;
                        text-align: right;
                    }

                    .vk_extensions_audio:not(.inlined) .audio_hq_label + div {
                        position: relative;
                        top: 2px;
                    }
                    .vk_extensions_audio .audio_hq_label + div {
                        display: inline-block !important;
                    }
                    .vk_extensions_audio:hover .audio_hq_label + div {
                        display: none !important;
                    }
                    .audio_row.audio_deleted .audio_hq_label + div {
                        display: none !important;
                    }`
            }
            document.head.appendChild(css)
        }

        let contentChanged, undo

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
                    let xhr = new XMLHttpRequest()
                    xhr.open('HEAD', audio.url, true)
                    xhr.onreadystatechange = function() {
                        if(this.readyState == this.DONE && this.status == 200) {
                            let audioBlocks = document.querySelectorAll('#audio_' + audio.fullId)
                            for(let i = 0; i < audioBlocks.length; ++i) {
                                if(audioBlocks[i].classList.contains('vk_extensions_audio_processed')) {
                                    audioBlocks[i].classList.add('vk_extensions_audio')
                                    let durationBlock = audioBlocks[i].querySelector('.audio_duration')
                                    if(durationBlock.parentNode.classList.length != 0) {
                                        let bitrate = Math.round(Number(this.getResponseHeader('Content-Length')) * 8 / audio.duration / 1000)
                                        let wrapper = document.createElement('div')
                                        let bitrateBlock = document.createElement('div')
                                        durationBlock.parentNode.insertBefore(wrapper, durationBlock)
                                        durationBlock.remove()
                                        wrapper.appendChild(durationBlock)
                                        bitrateBlock.innerHTML = bitrate
                                        wrapper.appendChild(bitrateBlock)
                                    }
                                }
                            }
                        }
                    }
                    xhr.send()
                }
            })

            contentChanged = function() {
                let blocksNotProcessed = document.querySelectorAll('.audio_row:not(.vk_extensions_audio_processed)')
                if(blocksNotProcessed.length > 0) {
                    let idsNotProcessed = []
                    for(let i = 0; i < blocksNotProcessed.length; ++i) {
                        idsNotProcessed.push(blocksNotProcessed[i].getAttribute('data-full-id'))
                        blocksNotProcessed[i].classList.add('vk_extensions_audio_processed')
                    }
                    getAudioData(idsNotProcessed, 'vkExtensionsAudioBitrate')
                }
            }

            undo = function() {
                let blocksProcessed = document.querySelectorAll('.vk_extensions_audio_processed')
                for(let i = 0; i < blocksProcessed.length; ++i) {
                    blocksProcessed[i].classList.remove('vk_extensions_audio_processed')
                    blocksProcessed[i].classList.remove('vk_extensions_audio')
                    let durationBlock = blocksProcessed[i].querySelector('.audio_duration')
                    let wrapper = durationBlock.parentNode
                    if(wrapper.classList.length == 0) {
                        durationBlock.remove()
                        wrapper.parentNode.insertBefore(durationBlock, wrapper)
                        wrapper.remove()
                    }
                }
            }
        }

        let observer = new globalObserver(contentChanged, 1000)

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
