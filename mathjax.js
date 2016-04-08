'use strict';

launcher(new function() {
    function content_changed() {
        let editables = document.querySelectorAll('[contenteditable="true"]')
        for(let editableIndex = 0; editableIndex < editables.length; ++editableIndex) {
            editables[editableIndex].classList.add("tex2jax_ignore")
        }
        let event = new Event("vk_extensions_mathjax_update")
        document.dispatchEvent(event)
    }

    let observer = new globalObserver(content_changed, 100)

    this.inject = function() {
        let mathjax = document.createElement("script")  
        mathjax.setAttribute("type", "text/javascript")
        mathjax.setAttribute("src", "//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML")
        mathjax.text = 
            `MathJax.Hub.Register.StartupHook("End", function () { 
                document.addEventListener("vk_extensions_mathjax_update", function(event) { 
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub]) 
                }) 
            })`
        document.head.appendChild(mathjax)
        observer.start()
    }

    this.name = "mathjax"

    this.launch = function() {
        content_changed()
        observer.start()
    }

    this.finish = function() {
        observer.stop()
    }
})
