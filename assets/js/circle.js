var rotate = function(obj) {
    obj.timNum = 0;
    obj.style.transform = "rotate(0deg)";
    obj.start = function() {
        obj.timNum = setInterval(function() {
            obj.angle = parseInt(obj.style.transform.slice(7, -4)) + 1;
            if (obj.angle == 360) {
                obj.angle = 0;
            }
            obj.style.transform = "rotate(" + obj.angle + "deg)";
        }, 50)
    }
    obj.end = function() {
        clearInterval(obj.timNum);
    }
}