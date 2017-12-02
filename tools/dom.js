const $ = function(selector) {
    var o = {}
    o.element = document.querySelectorAll(selector)

    o.getEle = function() {
        return o.element[0]
    }

    o.index = function(ele) {
        var siblings = ele.parentNode.children
        return Array.prototype.indexOf.call(siblings,ele)
    }

    o.uniqueClass = function(index, className) {
        o.element.forEach((obj,ind) => {
            if(ind !== index){
                obj.classList.remove(className)
            }else{
                obj.classList.add(className)
            }
        })
    }

    o.on = function(eventType, func) {
        o.element.forEach((ele, index) => ele.addEventListener(eventType, func))

        return this
    }

    o.setAttr = function(attribute, value) {
        o.element.forEach((ele, index) => ele[attribute] = value)
    }

    o.setStyle = function(style, value) {
        o.element.forEach((ele, index) => ele.style[style] = value)
    }

    o.getStyle = function (style) {
        return window.getComputedStyle(o.element[0])[style]
    }

    return o
}

const jLong = $()

var log = console.log.bind(console)