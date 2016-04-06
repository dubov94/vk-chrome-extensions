launcher(new function() { 
        function insertCSS() {
            let css = document.createElement("style")
            css.type = "text/css"
            if(!VK_REDESIGNED()) {
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

        let content_changed, undo;

        if(!VK_REDESIGNED()) {
            let update = function(obj) {
                let bitrate = document.createElement("div")
                bitrate.style = "display: none"
                obj.parentNode.appendChild(bitrate)
                bitrate.className = "vk_extensions_bitrate duration fl_r"
                let url = obj.parentNode.parentNode.querySelector("input").value
                let dur = parseInt(url.substring(url.lastIndexOf(",") + 1))
                let xhr = new XMLHttpRequest()
                xhr.open("HEAD", url, true)
                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4 && xhr.status == 200) {
                        bitrate.innerText = Math.round(parseInt(xhr.getResponseHeader("Content-Length")) * 8 / dur / 1000)
                        obj.classList.add("vk_extensions_duration")
                        bitrate.style = ""
                    }
                }
                xhr.send()
            }

            let is_audio_info_block = function(obj, count) {
                return obj.childElementCount == count && obj.children[0].classList.contains("title_wrap")
            }

            content_changed = function() {
                let blocks = document.querySelectorAll(".info")
                for(let i = 0; i < blocks.length; ++i) {
                    if(is_audio_info_block(blocks[i], 3)) {
                        update(blocks[i].children[2])
                    }
                }
            }

            undo = function() {
                let blocks = document.querySelectorAll(".info")
                for(let i = 0; i < blocks.length; ++i) {
                    if(is_audio_info_block(blocks[i], 4)) {
                        blocks[i].removeChild(blocks[i].children[3])
                        blocks[i].children[2].classList.remove("vk_extensions_duration")
                    }
                }
            }
        } else {
            let add_bitrate = function(wrap) {
                let bitrate = document.createElement("div")
                bitrate.style = "display: none"
                wrap.appendChild(bitrate)
                bitrate.className = "vk_extensions_bitrate"
                let audio = wrap.parentNode.parentNode
                let url = audio.getAttribute("data-url")
                let dur = parseInt(audio.getAttribute("data-duration"))
                let xhr = new XMLHttpRequest()
                xhr.open("HEAD", url, true)
                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4 && xhr.status == 200) {
                        bitrate.innerText = Math.round(parseInt(xhr.getResponseHeader("Content-Length")) * 8 / dur / 1000)
                        wrap.firstElementChild.classList.add("vk_extensions_duration")
                        bitrate.style = ""
                    }
                }
                xhr.send()
            }

            content_changed = function() {
                let blocks = document.querySelectorAll(".audio_duration_wrap")
                for(let i = 0; i < blocks.length; ++i) {
                    /* check whether audio block is not processed yet */
                    if(blocks[i].childElementCount == 2) {
                        add_bitrate(blocks[i])
                    }
                }
            }

            undo = function() {
                let blocks = document.querySelectorAll(".audio_duration_wrap")
                for(let i = 0; i < blocks.length; ++i) {
                    if(blocks[i].childElementCount == 3) {
                        blocks[i].removeChild(blocks[i].lastElementChild)
                        blocks[i].firstElementChild.classList.remove("vk_extensions_duration")
                    }
                }
            }
        }

        let observer = new globalObserver(content_changed, 100)

        this.name = "audio_bitrate"
        this.launch = function() {
            content_changed()
            observer.start()
        }

        this.inject = function() {
            insertCSS()
            this.launch()
        }

        this.finish = function () {
            observer.stop()
            undo()
        }
})
