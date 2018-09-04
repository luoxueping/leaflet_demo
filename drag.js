 var dragBox = function (drag, wrap) {

       function getCss(ele, prop) {
            return parseInt(window.getComputedStyle(ele)[prop]);
       }
        var browserWidth = document.documentElement.clientWidth,
		    browserHeight = document.documentElement.clientHeight,
		    boxWidth=wrap.offsetWidth,
		    boxHeight=wrap.offsetHeight;


       var initX,
           initY,
           dragable = false,
           wrapLeft = getCss(wrap, "left"),
           wrapRight = getCss(wrap, "top");

       drag.addEventListener("mousedown", function (e) {
            dragable = true;
            initX = e.clientX;
            initY = e.clientY;
       }, false); 
       document.addEventListener("mousemove", function (e) {
            if (dragable === true ) {
                var nowX = e.clientX,
                    nowY = e.clientY,
                    disX = nowX - initX,
                    disY = nowY - initY;
                    if((wrapLeft + disX )<0){
                    	 wrap.style.left=0;
                    }else if((wrapLeft + disX )>(browserWidth-boxWidth)){
                    	 
                    	 wrap.style.left =browserWidth-boxWidth+"px";
                    }else{
                    	 wrap.style.left = wrapLeft + disX + "px";
                    }
                    if((wrapRight+disY)<0){
                    	 wrap.style.top = 0;
                    }else if((wrapRight+disY)>(browserHeight-boxHeight)){
                    	 wrap.style.top = browserHeight-boxHeight+"px";
                    }else{
                		wrap.style.top = wrapRight + disY + "px";

                    }	   
                
            }
       });
       document.addEventListener("mouseup", function (e) {
            dragable = false;
            wrapLeft = getCss(wrap, "left");
            wrapRight = getCss(wrap, "top");
       }, false); 

    };
    