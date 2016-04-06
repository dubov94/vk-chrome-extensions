document.addEventListener("DOMContentLoaded", function () {
    let list = document.querySelectorAll(".immutable_link")
    for(let i = 0; i < list.length; ++i) {
        list[i].onclick = (function(address) {
            return function(event) {
                event.stopPropagation()
                chrome.tabs.create({active: true, url: address})
            }
        }
        )(list[i].href)
    }
})

function toggle_control(features_list, button) {
    let features_on = 0
    let all_features = features_list.length

    button.onclick = function() {
        if(features_on == all_features) {
            for(let i = 0; i < all_features; ++i) {
                features_list[i].onclick()
            }
        } else {
            for(let i = 0; i < all_features; ++i) {
                if(!features_list[i].classList.contains("on")) {
                    features_list[i].onclick()
                }
            }
        }
    }

    function check_caption() {
        if(features_on == all_features) {
            button.innerText = "Deselect all"
        } else {
            button.innerText = "Select all"
        }
    }

    this.toggler = function(turned_on) {
        if(turned_on) {
            ++features_on
        } else {
            --features_on
        }
        check_caption()
    }
}

let toggle_button_control

document.addEventListener("DOMContentLoaded", function() {
    let list = document.querySelectorAll(".checkbox")
    toggle_button_control = new toggle_control(list, document.querySelector("#toggle_all"))
    for(let i = 0; i < list.length; ++i) {
        list[i].onclick = (function(obj) {
            return function(event) {
                let flag = !obj.classList.contains("on")
                ;(function(key, value) {
                    chrome.runtime.getBackgroundPage(
                        function(backgroundPage) {
                            backgroundPage.notify(key, value)
                        }
                    )
                })(obj.id, flag)
                obj.classList.toggle("on", flag)
                toggle_button_control.toggler(flag)
            }
        })(list[i])
        ;(function(obj) {
            chrome.storage.sync.get(obj.id, 
                function(items) {
                    if(items[obj.id] == "true") {
                        obj.classList.toggle("on", true)
                        toggle_button_control.toggler(true)
                    }
                }
            )
        })(list[i])
    }
})
