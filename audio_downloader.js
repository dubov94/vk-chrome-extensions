'use strict';

addFeature(new function() {
    function download(url, node) {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'

        /* deprecated: access this data via data-* attributes */
        let performer = node.childNodes[0].innerText,
            separator = node.childNodes[1].textContent,
            name = node.childNodes[2].innerText

        xhr.onload = function(event) {            
                let blob = new Blob([xhr.response], { type: 'audio/mp3' })
                let blobURL = window.URL.createObjectURL(blob)

                let link = document.createElement('a')
                link.href = blobURL
                let fileName
                if(vkRedesigned()) {
                    fileName = `${performer} ${separator} ${name}`
                } else {
                    fileName = `${performer}${separator}${name}`
                }
                link.download = `${fileName.trim()}.mp3`
                link.click()

                window.URL.revokeObjectURL(blobURL)
        }

        xhr.onprogress = function(event) {
            let progressInfo
            if(event.loaded == event.total) {
                progressInfo = separator
            } else {
                let percentage = Math.round(event.loaded / event.total * 100)
                if(vkRedesigned()) {
                    progressInfo = `${separator} ${percentage}% ${separator}`
                } else {
                    progressInfo = `${separator}${percentage}%${separator}`
                }
            }
            node.childNodes[1].textContent = progressInfo
        }

        xhr.send() 
    }
    
    let contextMenuListener = function(event) {
        let url, node
        if(!vkRedesigned()) {
            if(event.target.classList.contains('play_new')) {
                event.preventDefault()
                let playBtn = event.target.parentNode.parentNode
                url = playBtn.querySelector('input').value
                node = playBtn.nextElementSibling.querySelector('.title_wrap')
                download(url, node)
            }
        } else {
            if(event.target.classList.contains('audio_play')) {
                event.preventDefault()
                let audioBlock = event.target.parentNode.parentNode
                getAudioData([audioBlock.getAttribute('data-full-id')], 'vkExtensionsAudioDownloader')
            }
        }
    }

    window.addEventListener('message', function(event) {
        if(event.data.type === 'vkExtensionsAudioDownloader') {
            let audio = event.data.audio
            let audioBlock = document.querySelector('#audio_' + audio.fullId)
            let node = audioBlock.querySelector('.audio_title_wrap')
            download(audio.url, node)
        }
    })

    this.name = 'audio_downloader'
    
    this.start = function() {
        document.body.addEventListener('contextmenu', contextMenuListener)
    }

    this.stop = function() {
        document.body.removeEventListener('contextmenu', contextMenuListener)
    }
})
