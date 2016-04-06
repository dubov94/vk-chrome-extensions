launcher(new function() {
    function get_value(string, key) {
        let i = string.indexOf(key + "=")
        if(i == -1) return null
        else {
            let len = key.length + 1
            let end = string.indexOf("&", i +  len)
            if(end == -1) end = string.length
            return string.substr(i + len, end - i - len)
        }
    }

    function calculate_age(year, month, day) {
        let today = new Date()
        todayYear = today.getFullYear()
        todayMonth = today.getMonth()
        todayDay = today.getDate()
        age = todayYear - year 
        if (todayMonth < month - 1) age--
        if (todayMonth == month - 1 && todayDay < day) age--
        return age
    }

    let observer = new MutationObserver(function (mutations) { content_changed() })
    let ageBlockId = "vk_extensions_age"

    function start_observing() {
        observer.observe(document.querySelector("#page_body"), { childList : true, subtree : true})
    }

    function end_observing() {
        observer.disconnect()
    }

    function content_changed() {
        let dest = document.querySelector(`#${ageBlockId}`)
        if(dest == null) {
            let block_ext = document.querySelector("#profile_short")
            if(block_ext != null) {
                let block_int
                if(!VK_REDESIGNED()) {
                    block_int = block_ext.children[0].children[0].children[1]
                } else {
                    block_int = block_ext.children[0].children[1]
                }
                /* check whether the row actually contains DOB */
                if(block_int.childElementCount != 2 ||
                    block_int.children[0].tagName != "A" || 
                    block_int.children[1].tagName != "A") return
                let dateBlock = block_int.children[0].href
                let yearBlock = block_int.children[1].href
                let day = get_value(dateBlock, "c[bday]")
                let month = get_value(dateBlock, "c[bmonth]")
                let year = get_value(yearBlock, "c[byear]")
                if(day == null || month == null || year == null) return
                dest = document.createElement("span")
                dest.id = ageBlockId
                dest.className = "label"
                dest.innerText = ` (${calculate_age(parseInt(year), parseInt(month), parseInt(day))} years)`
                block_int.appendChild(dest)
            }
        }
    }

    function undo() {
        let block = document.querySelector(`#${ageBlockId}`)
        if(block != null) {
            block.parentNode.removeChild(block)
        }
    }

    this.name = "age"
    this.launch = function() {
        content_changed()
        start_observing()
    }

    this.finish = function() {
        end_observing()
        undo()
    }
})
