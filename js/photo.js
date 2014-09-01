/**
 * Created by Ren on 14-8-28.
 */

(function(){
var photo={
//    程序主入口
    init:function(){
        copyimg();
        leftimglist();
        rigthimglist();
        martop();
        Events();
        customscroll.create();
    }
}
//    屏幕宽度百分比
    var WINDOW_WIDTH=function(num){
       return (document.documentElement.clientWidth/100)*num;
    }
//    屏幕高度百分比
    var WINDOW_HEIGHT=function(num){
        return (document.documentElement.clientHeight/100)*num;
    }
    var time=800;
    var cubic='cubic-bezier(0.2,0.3,0,0.7)';
    var opac=0.15;
//    上边距
    var WINDOW_MARGIN=WINDOW_HEIGHT(70);
    window.photojs=photo;
//    初始化中间图片
    var copyimg=function(){
        $(".photolist").height(WINDOW_HEIGHT(100));
        var iw = $(".photolist .on img").width();
        iw=WINDOW_WIDTH(50)-iw/2;
        $(".photolist .on").css({left:iw,"z-index":1000,width:WINDOW_WIDTH(20)});
        $(".photolist .on").find(".imgbox img").after("<img class=\"mirror\" src=\""+$(".photolist .on img").attr("src")+"\" />");
    }
//    初始化右侧图片
    var rigthimglist=function(){
        $(".photolist .on").nextAll().each(function(i){
            $(this).show();
            var parameter = {
                left: WINDOW_WIDTH(60) + i * (WINDOW_WIDTH(5)),
                zi: 999 - i,
                opc: 1 - i * opac,
                src: $(this).find(".imgbox img").attr("src"),
                width: WINDOW_WIDTH(15),
                rotateY: "-40deg",
                perspective: "1000px"
            };
            createimg($(this), parameter);
        });
    }
//    初始化左侧图片
    var leftimglist=function(){
        $(".photolist .on").prevAll().each(function(i){
            $(this).show();
            var parameter = {
                left: WINDOW_WIDTH(25) - i * (WINDOW_WIDTH(5)),
                zi: 999 - i,
                opc: 1 - i * opac,
                src: $(this).find(".imgbox img").attr("src"),
                width: WINDOW_WIDTH(15),
                rotateY: "40deg",
                perspective: "1000px"
            };
            createimg($(this), parameter);
        });
    }
//    初始化位置、倒影
    var createimg=function($this,obj){
        $this.css({"left":obj.left,"z-index":obj.zi,"opacity":obj.opc,"width":obj.width});
        $this.find(".imgbox img").after("<img class=\"mirror\" src=\""+obj.src+"\" />");
        $this.find(".imgtran").css({"transform": "perspective("+obj.perspective+") rotateY("+obj.rotateY+")"});
    }
//    初始化margin-top
    var martop=function(){
        $(".photolist li").each(function(){
           $(this).css({"top":WINDOW_MARGIN-$(this).height()/2});
        });
    }
//    事件集合
    var Events=function(){
        $(".photolist li").click(function(){
            animate.centerimg($(this));
            customscroll.update();
        });
    }
//     滚动条
    var customscroll={

        create:function(){
            var lunum = $(".photolist li").length;
            var sw = parseFloat(100 / lunum);
            var onew=$(".scroll").width()/100;
            var barw=sw;
            if(sw<5){
                barw=5;
            }

//            初始化滚动条位置
            $(".scroll .scrollbar").css({width:barw+"%","margin-left":$(".photolist li.on").prevAll().length*onew*sw});
//            鼠标滚轮滚动事件
            $(".photolist").bind('mousewheel', function(event, delta) {
                var left=$(".scroll .scrollbar").css("margin-left");
                left=parseInt(left.replace("px",""));
                if(delta>0){
                    left=parseInt(left+sw*onew);
                    var scrollw=$(".scroll").width()-barw*($(".scroll").width()/100)-6;
                    if(left>=scrollw) {
                        left=scrollw;
                    }
                    $(".scroll .scrollbar").css({"margin-left":left+"px"});
                    animate.centerimg($(".photolist li.on").next());
                }
                else{
                    left=parseInt(left-sw*onew);
                    if(left<=0) {
                        left=4;
                    }
                    $(".scroll .scrollbar").css({"margin-left": left + "px"});
                    animate.centerimg($(".photolist li.on").prev());
                }
            });
//            鼠标拖动事件
            var down=false;
            var startX;
            var sindex;
            $(".scroll .scrollbar").mousedown(function(e){
                down=true;
                startX = e.clientX - this.offsetLeft;

                this.setCapture && this.setCapture();
                return false;
            });
            document.onmousemove = function(e){
                if(down == true){
                    var e = e || window.event;
                    var oX = (e.clientX - startX);
                    var left=$(".scroll .scrollbar").css("margin-left");
                    left=parseInt(left.replace("px",""));
                    if(oX<4) {
                        oX=4
                    }
                    if(oX>$(".scroll").width()-$(".scroll .scrollbar").width()-6){
                        oX=$(".scroll").width()-$(".scroll .scrollbar").width()-6;
                    }
                    $(".scroll .scrollbar").css({"margin-left": oX});
                    if(sindex!=parseInt(oX/(onew*sw))) {
                        sindex = parseInt(oX / (onew * sw))+1;
                        animate.centerimg($(".photolist li:eq("+sindex+")").prev());
                    }
                    return false;
                }
            };
            $(document).mouseup(function(e){
                down=false;
                $(".scroll .scrollbar")[0].releaseCapture();
                e.cancelBubble = true;
            });
        },
        update:function(){
            var lunum = $(".photolist li").length;
            var sw = parseFloat(100 / lunum);
            var onew=$(".scroll").width()/100;
            $(".scroll .scrollbar").transition({"margin-left":$(".photolist li.on").prevAll().length*onew*sw});
        }
    };
//    动画效果
    var animate={
        centerimg:function($this){
            if($this.is(".on")==false) {
                $(".photolist li").stop(true);
                $(".imgtran").stop(true);
                $this.attr({"data-top": $this.css("top"), "data-width": $this.css("width")});
                var w = ($this.width() / 15) * 20;
                var h = ($this.height() / 15) * 20;
                $this.addClass("on");
                $this.css({opacity: 1}).transition({width: w, left: WINDOW_WIDTH(50) - w / 2, top: WINDOW_MARGIN - h / 2}, time, cubic).find(".imgtran").css({"transform": "rotateY(0deg)"});
                animate.leftimg($this);
                animate.rigthimg($this);
            }
        },
        leftimg:function($this){
            $this.prevAll().each(function(i){
                if(i<7) {
                    $(this).show();
                    var parameter = {
                        left: WINDOW_WIDTH(25) - i * WINDOW_WIDTH(5),
                        zi: 999 - i,
                        opc: 1 - i * opac,
                        rotateY: "40deg",
                        perspective: "1000px"
                    };
                    animate.animateimg($(this), parameter);
                }
                else{
                    $(this).hide();
                }
            });
        },
        rigthimg:function($this){
//            $this.nextAll().transition({});
            $this.nextAll().each(function(i){
                if(i<7) {
                    $(this).show();
                    var parameter = {
                        left: WINDOW_WIDTH(60) + i * (WINDOW_WIDTH(5)),
                        zi: 999 - i,
                        opc: 1 - i * opac,
                        rotateY: "-40deg",
                        perspective: "1000px"
                    };
                    animate.animateimg($(this), parameter);
                }
                else{
                   $(this).hide();
                }
            });
        },
        animateimg:function($this,obj){
            if($this.is(".on"))
            {
                $this.css({opacity:obj.opc,"z-index":obj.zi}).transition({"left":obj.left,"width":$this.attr("data-width"),"top":$this.attr("data-top")},time,cubic).find(".imgtran").css({transform: "perspective("+obj.perspective+") rotateY("+obj.rotateY+")"});
                $this.removeClass("on");
            }
            else
            {
                $this.css({opacity:obj.opc,"z-index":obj.zi}).transition({left:obj.left},time,cubic).find(".imgtran").css({transform: "perspective("+obj.perspective+") rotateY("+obj.rotateY+")"});
            }
        }
    };
})();