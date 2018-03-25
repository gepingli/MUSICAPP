//用于通过进度条改变其他，通过callback实现（百分比）
function change(obj,callback) {
    var oLi2 = document.getElementsByClassName('line2')[0];
    oLi2.style.width = obj.style.left;
    var percent = obj.offsetLeft/(obj.parentNode.clientWidth - obj.offsetWidth);
    callback && callback(percent);
}
//拖拽
function drag(obj, callback) {
    obj.parentNode.ontouchstart = function (ev) {
        ev = ev || event;
        obj.style.left = ev.touches[0].clientX - this.offsetLeft + 'px';
        change(obj,callback);

        var x = ev.touches[0].clientX - obj.offsetLeft;
        var y = ev.touches[0].clientY - obj.offsetTop;


        document.ontouchmove = function (ev) {
            ev = ev || event;


            var l = ev.touches[0].clientX - x;
            var t = ev.touches[0].clientY - y;
            if(l<0){
                l = 0;
            }
            if(t<0){
                t = 0;
            }
            //单点拖拽
            if(l > obj.parentNode.clientWidth - obj.offsetWidth){
                l = obj.parentNode.clientWidth - obj.offsetWidth;
            }
            if(t > obj.parentNode.clientHeight - obj.offsetHeight){
                t = obj.parentNode.clientHeight - obj.offsetHeight;
            }
            obj.style.left = l + 'px';
            obj.style.top = t + 'px';

            change(obj,callback);
        }
        //释放
        document.ontouchend = function () {
            this.onmousemove = null;
            this.onmouseup = null;
            console.log('stop');
        }
        return false;
    }
}
//自动行进
function autoPlay(time,callback){//time为歌曲的秒数
    var oLi2 = document.getElementsByClassName('line2')[0];
    var oW = document.getElementsByClassName('wai')[0];
    var perTime = parseInt(oW.style.width)/time;
    oLi2.style.width = obj.style.left;
    var timeNum = setInterval(function () { 
        //????
    },100)
}