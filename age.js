'use strict';

addFeature(new function() {
    function getValueFromParams(string, key) {
        let i = string.indexOf(key + '=')
        if(i == -1) return null
        else {
            let len = key.length + 1
            let end = string.indexOf('&', i +  len)
            if(end == -1) end = string.length
            return string.substr(i + len, end - i - len)
        }
    }

    function calculateAge(year, month, day) {
        let today = new Date()
        let todayYear = today.getFullYear(),
            todayMonth = today.getMonth(),
            todayDay = today.getDate()
        let age = todayYear - year 
        if (todayMonth < month - 1) age--
        if (todayMonth == month - 1 && todayDay < day) age--
        return age
    }

    let observer = new MutationObserver(function (mutations) { contentChanged() })
    let ageBlockId = 'vk_extensions_age'

    function startObserving() {
        observer.observe(document.querySelector('#page_body'), { childList : true, subtree : true})
    }

    function endObserving() {
        observer.disconnect()
    }

    function contentChanged() {
        let dest = document.querySelector(`#${ageBlockId}`)
        if(dest == null) {
            let blockExt = document.querySelector('#profile_short')
            if(blockExt != null) {
                let blockInt
                if(!vkRedesigned()) {
                    blockInt = blockExt.children[0].children[0].children[1]
                } else {
                    blockInt = blockExt.children[0].children[1]
                }
                /* check whether the row actually contains DOB */
                if(blockInt.childElementCount != 2 ||
                    blockInt.children[0].tagName != 'A' || 
                    blockInt.children[1].tagName != 'A') return
                let dateBlock = blockInt.children[0].href,
                    yearBlock = blockInt.children[1].href
                let day = getValueFromParams(dateBlock, 'c[bday]'),
                    month = getValueFromParams(dateBlock, 'c[bmonth]'),
                    year = getValueFromParams(yearBlock, 'c[byear]')
                if(day == null || month == null || year == null) return
                dest = document.createElement('span')
                dest.id = ageBlockId
                dest.className = 'label'
                dest.innerText = ' (' + calculateAge(Number(year), Number(month), Number(day)) + ' years)'
                blockInt.appendChild(dest)
            }
        }
    }

    function undo() {
        let block = document.querySelector(`#${ageBlockId}`)
        if(block != null) {
            block.parentNode.removeChild(block)
        }
    }

    this.name = 'age'
    this.start = function() {
        contentChanged()
        startObserving()
    }

    this.stop = function() {
        endObserving()
        undo()
    }
})
