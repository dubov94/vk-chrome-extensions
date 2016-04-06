launcher(new function() {
    function download(url, node) {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", url, true)
        xhr.responseType = "blob"

        /* deprecated: access this data via data-* attributes */
        let performer = node.childNodes[0].innerText,
            separator = node.childNodes[1].textContent,
            name = node.childNodes[2].innerText

        xhr.onload = function(event) {            
                let blob = new Blob([xhr.response], { type: "audio/mp3" })
                blobUrl = window.URL.createObjectURL(blob)

                let link = document.createElement("a")
                link.href = blobUrl
                let filename
                if(VK_REDESIGNED()) {
                    filename = `${performer} ${separator} ${name}`
                } else {
                    filename = `${performer}${separator}${name}`
                }
                link.download = `${filename.trim()}.mp3`
                link.click()

                window.URL.revokeObjectURL(blobUrl)
        }

        xhr.onprogress = function(event) {
            let progressInfo
            if(event.loaded == event.total) {
                progressInfo = separator
            } else {
                let percentage = Math.round(event.loaded / event.total * 100)
                if(VK_REDESIGNED()) {
                    progressInfo = `${separator} ${percentage}% ${separator}`
                } else {
                    progressInfo = `${separator}${percentage}%${separator}`
                }
            }
            node.childNodes[1].textContent = progressInfo
        }

        xhr.send() 
    }
    
    let listener = function (event) {
        let url, node
        if(!VK_REDESIGNED()) {
            if(event.target.classList.contains("play_new")) {
                event.preventDefault()
                let play_btn = event.target.parentNode.parentNode
                url = play_btn.querySelector("input").value
                node = play_btn.nextElementSibling.querySelector(".title_wrap")
                download(url, node)
            }
        } else {
            if(event.target.classList.contains("audio_play")) {
                event.preventDefault()
                let audio_block = event.target.parentNode.parentNode
                url = audio_block.getAttribute("data-url")
                node = audio_block.querySelector(".audio_title_wrap")
                download(url, node)
            }
        }
    }

    this.name = "audio_downloader"
    
    this.launch = function() {
        document.body.addEventListener("contextmenu", listener)
    }

    this.finish = function() {
        document.body.removeEventListener("contextmenu", listener)
    }
})
