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
    var cubic='cubic-bezier(0.4,0.5,0,0.9)';
    var opac=0.15;
//    上边距
    var WINDOW_MARGIN=WINDOW_HEIGHT(70);
    window.photojs=photo;
//    初始化中间图片
    var copyimg=function(){
        $(".photolist").height(WINDOW_HEIGHT(100));
        var iw = $(".photolist .on img").width();
        iw=WINDOW_WIDTH(50)-iw/2;
        $(".photolist .on").css({"left":iw,"z-index":1000});
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
                width: "15%",
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
                width: "15%",
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
            if($(this).is(".on")==false) {
                animate.centerimg($(this));
            }
        });
    }
//     滚动条
    var customscroll={
        create:function(){
            var lunum = $(".photolist li").length;
            var sw = parseFloat(100 / lunum);
            var barw=sw;
            if(sw<5){
                barw=5;
            }
            var onew=$(".scroll").width()/100;
            $(".scroll .scrollbar").css({width:barw+"%","margin-left":$(".photolist li.on").prevAll().length*onew});
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
        }
    };
//    动画效果
    var animate={
        centerimg:function($this){
            $(".photolist li").stop(false,true);
            $(".photolist li .imgtran").stop(false,true);
            var w = ($this.width() / 15) * 20;
            var h = ($this.height() / 15) * 20;
            $this.addClass("on");
            $this.css({opacity: 1}).transition({width: w, left: WINDOW_WIDTH(50) - w / 2, top: WINDOW_MARGIN - h / 2}, time, cubic).find(".imgtran").transition({"transform": "rotateY(0deg)"});
            animate.leftimg($this);
            animate.rigthimg($this);
        },
        leftimg:function($this){
            $this.prevAll().each(function(i){
                if(i<10) {
                    $(this).show();
                    var parameter = {
                        left: WINDOW_WIDTH(25) - i * (WINDOW_WIDTH(5)),
                        zi: 999 - i,
                        opc: 1 - i * opac,
                        width: "15%",
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
            $this.nextAll().each(function(i){
                if(i<10) {
                    $(this).show();
                    var parameter = {
                        left: WINDOW_WIDTH(60) + i * (WINDOW_WIDTH(5)),
                        zi: 999 - i,
                        opc: 1 - i * opac,
                        width: "15%",
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
                var height = ($this.height()/20)*15;
                $this.css({opacity:obj.opc,"z-index":obj.zi}).transition({"left":obj.left,"width":obj.width,"top":WINDOW_MARGIN-height/2},time,cubic).find(".imgtran").transition({transform: "perspective("+obj.perspective+") rotateY("+obj.rotateY+")"});
                $this.removeClass("on");
            }
            else
            {
                $this.css({opacity:obj.opc,"z-index":obj.zi}).transition({left:obj.left},time,cubic).find(".imgtran").transition({transform: "perspective("+obj.perspective+") rotateY("+obj.rotateY+")"});
            }

        }
    };
})();