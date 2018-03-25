//音乐播放
var musicPlay = (function() {
    //变量提升
    var oNum = {};
    var setoNum = function() {
        oNum.oObj = null;
        oNum.oDiv = document.getElementById('box');
        oNum.oMusic = null;
        oNum.state = 0;
        oNum.timeNum = null;
        oNum.oTime = 0;
    };
    document.getElementsByClassName('line2')[0].style.width = '0px';
    //设置页面
    var setHTML = function(str) {
        oNum.oMusic = new Audio(oNum.oObj[str].musicPosition);
        oNum.oMusic.play();
        console.log(oNum.oMusic.currentTime);
        oNum.state = 1;
        oNum.oMusic.oncanplay = function() {
            oNum.oTime = parseInt(oNum.oMusic.duration);
            setBeforeTime('songTimeEnd', 'end');
            oNum.oDiv.autoPlay(oNum.oTime);
        }
        document.getElementsByClassName('songName')[0].innerHTML = oNum.oObj[str].songName;
        document.getElementsByClassName('singerName')[0].innerHTML = oNum.oObj[str].singer;
        document.getElementsByClassName('songTimeEnd')[0].innerHTML = oNum.oMusic.duration;
    };


    //用于通过进度条改变其他，通过callback实现（百分比）
    function change(obj, callback) {
        var oLi2 = document.getElementsByClassName('line2')[0];
        oLi2.style.width = obj.style.left;
        var percent = obj.offsetLeft / (obj.parentNode.clientWidth - obj.offsetWidth);
        callback && callback(percent);
    }



    //设置时间的显示
    var setBeforeTime = function(str1, str2) {
        var playedTime = parseInt(oNum.oMusic.currentTime) % 60;
        if (str2 == 'start') {
            if (playedTime < 10) {
                playedTime = '0' + playedTime;
            }
            document.getElementsByClassName(str1)[0].innerHTML = parseInt(oNum.oMusic.currentTime / 60) + ':' + playedTime;
        } else {
            if (oNum.oTime % 60 < 10) {
                document.getElementsByClassName(str1)[0].innerHTML = parseInt(oNum.oTime / 60) + ':' + '0' + oNum.oTime % 60;
            } else {
                document.getElementsByClassName(str1)[0].innerHTML = parseInt(oNum.oTime / 60) + ':' + oNum.oTime % 60;
            }
        }
    }


    //拖拽
    var drag = function(obj, callback) {
        obj.parentNode.ontouchstart = function(ev) {
                ev = ev || event;
                obj.style.left = ev.touches[0].clientX - this.offsetLeft + 'px';
                change(obj, callback);

                var x = ev.touches[0].clientX - obj.offsetLeft;
                var y = ev.touches[0].clientY - obj.offsetTop;


                document.getElementsByClassName('wai')[0].ontouchmove = function(ev) {
                        ev = ev || event;


                        var l = ev.touches[0].clientX - x;
                        var t = ev.touches[0].clientY - y;
                        if (l < 0) {
                            l = 0;
                        }
                        if (t < 0) {
                            t = 0;
                        }
                        //单点拖拽
                        if (l > obj.parentNode.clientWidth - obj.offsetWidth) {
                            l = obj.parentNode.clientWidth - obj.offsetWidth;
                        }
                        if (t > obj.parentNode.clientHeight - obj.offsetHeight) {
                            t = obj.parentNode.clientHeight - obj.offsetHeight;
                        }
                        obj.style.left = l + 'px';
                        obj.style.top = t + 'px';

                        change(obj, callback);
                    }
                    //释放
                document.ontouchend = function() {
                    this.onmousemove = null;
                    this.onmouseup = null;
                    console.log('stop');
                }
                return false;
            }
            //自动行进

        obj.autoPlay = function(time) {
            var oLi2 = document.getElementsByClassName('line2')[0];
            var oW = document.getElementsByClassName('wai')[0];
            var perTime = parseFloat(oW.clientWidth) / time;
            console.log(perTime);
            oNum.timeNum = setInterval(function() {
                oLi2.style.width = parseFloat(oLi2.style.width) + perTime / 10 + 'px';
                oNum.oDiv.style.left = oLi2.style.width;
                setBeforeTime('songTimeStarted', 'start');
                if (parseFloat(oNum.oDiv.style.left) + 7.5 >= parseFloat(oW.clientWidth)) {
                    oNum.oMusic.currentTime = 0;
                    oNum.oDiv.style.left = 0 + 'px';
                    oLi2.style.width = 0 + 'px';

                }
            }, 100);
            callback || callback();
        }
    }



    //获取后台数据

    var originMusic = function(str) {
        $.ajax({
            type: "GET",
            url: "../server/list.json",
            dataType: "json",
            success: function(data) {
                oNum.oObj = data;
                setHTML(str);
                drag(oNum.oDiv, function(v) {
                    console.log(v);
                });
            }
        });
    }

    var init = function(str) {
        setoNum();
        originMusic(str);
    }
    return init;
})();