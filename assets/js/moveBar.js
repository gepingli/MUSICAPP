//音乐播放
var musicPlay = (function() {
    //变量提升
    var oNum = {};
    var setoNum = function() {
        oNum.oObj = null;
        oNum.oDiv = document.getElementById('box');
        oNum.oMusic = null;
        oNum.state = 0;
        oNum.oState = 1;
        oNum.timeNum = null;
        oNum.oTime = 0;
        oNum.perTime = 0;
        oNum.oDrug = 0;
        oNum.index = 0;
    };
    //设置页面
    var setHTML = function(str) {
        clearInterval(oNum.timeNum);
        document.getElementsByClassName('line2')[0].style.width = '0px';
        document.getElementsByClassName('songTimeEnd')[0].innerHTML = '0:00';
        oNum.oMusic = new Audio(oNum.oObj[str].musicPosition);
        console.log(oNum.oMusic);
        oNum.oMusic.oncanplay = function() {
            oNum.state = 1;
        }
        var iTime = setInterval(function() {
            if (oNum.state == 1) {
                oNum.oTime = parseInt(oNum.oMusic.duration);
                setBeforeTime('songTimeEnd', 'end');
                oNum.perTime = parseFloat(document.getElementsByClassName('wai')[0].clientWidth) / (10 * oNum.oTime);
                oNum.oDiv.autoPlay(oNum.oTime);
                oNum.oMusic.play();
                clearInterval(iTime);
            }
        }, 100);
        document.getElementById('circle').start();
        document.getElementsByClassName('songName')[0].innerHTML = oNum.oObj[str].songName;
        document.getElementsByClassName('singerName')[0].innerHTML = oNum.oObj[str].singer;
        document.getElementById('circle').style.background = 'url(' + oNum.oObj[str].bk + ')';
        document.getElementById('circle').style.backgroundSize = '100% 100%';
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
                obj.style.left = ev.touches[0].clientX - this.offsetLeft - 7.5 + 'px';
                change(obj, callback);

                var x = ev.touches[0].clientX - obj.offsetLeft;
                var y = ev.touches[0].clientY - obj.offsetTop;


                document.getElementsByClassName('wai')[0].ontouchmove = function(ev) {
                        oNum.oDrug = 1;
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
                        console.log(1);
                    }
                    //释放
                document.getElementsByClassName('wai')[0].ontouchend = function() {
                    this.onmousemove = null;
                    this.onmouseup = null;
                    oNum.oDrug = 0;
                    var oLi2 = document.getElementsByClassName('line2')[0];
                    oLi2.style.width = obj.style.left;
                    var percent = obj.offsetLeft / (obj.parentNode.clientWidth - obj.offsetWidth);
                    oNum.oMusic.currentTime = oNum.oTime * percent;
                    if (oNum.oState == 1) {
                        clearInterval(oNum.timeNum);
                        oNum.oDiv.autoPlay(oNum.oTime);
                    }
                }
                return false;
            }
            //自动行进

        obj.autoPlay = function(time) {
            //0
            var oLi2 = document.getElementsByClassName('line2')[0];
            //550
            var oW = document.getElementsByClassName('wai')[0];
            oNum.timeNum = setInterval(function() {
                oLi2.style.width = parseFloat(oLi2.style.width) + oNum.perTime + 'px';
                // console.log(oLi2.style.width + '' + oNum.perTime);
                //console.log(oNum.timeNum);
                oNum.oDiv.style.left = parseFloat(oLi2.style.width) + 'px';
                //console.log(oNum.oDiv.style.left);
                if (oNum.oDrug != 1) {
                    setBeforeTime('songTimeStarted', 'start');
                }
                //  console.log(oNum.oMusic.currentTime + '   ' + oNum.oTime);
                if (parseInt(oNum.oMusic.currentTime) == oNum.oTime) {
                    oNum.oMusic.currentTime = 0;
                    oNum.oDiv.style.left = -7.5 + 'px';
                    oLi2.style.width = 0 + 'px';
                    oNum.oMusic.play();
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
                        var playedTime = parseInt(oNum.oTime * v) % 60;
                        if (playedTime < 10) {
                            playedTime = '0' + playedTime;
                        }
                        document.getElementsByClassName('songTimeStarted')[0].innerHTML = parseInt(oNum.oTime * v / 60) + ':' + playedTime;
                    });
                    circle(document.getElementsByClassName('lnr-3')[0]);
                }
            });
        }
        //旋转
    var rotate = function(obj) {
            obj.timNum = 0;
            obj.rotateState = 0;
            obj.style.transform = "rotate(0deg)";
            obj.start = function() {
                if (obj.rotateState == 0) {
                    obj.timNum = setInterval(function() {
                        obj.angle = parseInt(obj.style.transform.slice(7, -4)) + 1;
                        if (obj.angle == 360) {
                            obj.angle = 0;
                        }
                        obj.style.transform = "rotate(" + obj.angle + "deg)";
                    }, 30)
                    console.log(obj.rotateState);
                    obj.rotateState = 1;

                }
            }
            obj.end = function() {
                clearInterval(obj.timNum);
                console.log('stop');
                obj.rotateState = 0;
            }
        }
        //暂停旋转
    var circle = function(obj) {
        obj.ontouchstart = function(ev) {
            console.log('  ' + oNum.state);
            console.log(this);
            ev.cancelBubble = true;
            ev.stopPropagation();
            if (oNum.oState == 1) {
                oNum.oMusic.pause();
                clearInterval(oNum.timeNum);
                // rotate(document.getElementById('cirle')).end();
                oNum.oState = 0;
                document.getElementById('circle').end();
            } else if (oNum.oState == 0) {
                oNum.oMusic.play();
                oNum.oDiv.autoPlay(oNum.oTime);
                oNum.oState = 1;
                document.getElementById('circle').start();
            }
        }
    }
    var resetMusic = function() {
        clearInterval(oNum.timeNum);
        oNum.oMusic.pause();
        oNum.state = 0;
        oNum.oState = 1;
        oNum.oTime = 0;
        oNum.perTime = 0;
        oNum.oDrug = 0;
    }
    document.getElementsByClassName('lnr-4')[0].ontouchstart = function() {
        resetMusic();
        setHTML('music' + ((oNum.index + 1) % 4 + 1));
        oNum.index++;
        document.getElementById('circle').start();
    }
    document.getElementsByClassName('lnr-2')[0].ontouchstart = function() {
        resetMusic();
        console.log(((oNum.index + 3) % 4 + 1));
        console.log(oNum.index);
        setHTML('music' + ((oNum.index + 3) % 4 + 1));
        oNum.index += 3;
        document.getElementById('circle').start();
    }

    var init = function(str) {
        setoNum();
        originMusic(str);
        rotate(document.getElementById('circle'));
    }
    return init;
})();