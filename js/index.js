function addMouseWheel(obj,fn){
	if(window.navigator.userAgent.indexOf('Firefox')!=-1){
		obj.addEventListener('DOMMousewheel',fnWheel,false);
	}else{
		obj.onmousewheel=fnWheel;
	}
	function fnWheel(ev){
		var e=ev||event;
		var down=false;
		if(e.wheelDelta){
			down=e.wheelDelta<0?true:false;
		}else{
			down=e.detail>0?true:false;
		}

		fn(down);
	}
}
function rnd(n,m){
	return parseInt(Math.random()*(m-n)+n);
}
function getsStyle(obj,sStyle){
	return (obj.currentStyle||getComputedStyle(obj,false))[sStyle];
}

function move(obj,json,options){
	options=options||{};
	options.duration=options.duration||300;
	options.complete=options.complete||null;
	options.easing=options.easing||'ease-out';

	var start={};
	var dis={};
	for(var key in json){
		start[key]=parseFloat(getsStyle(obj,key));
		if (isNaN(start[key])) {
			switch(key){
				case 'width':
				start[key]=obj.offsetWidth;
				break;
				case 'height':
				start[key]=obj.offsetHeight;
				break;
				case 'opacity':
				start[key]=1;
				break;
				case 'left':
				start[key]=0;
				break;
			}
		}
		dis[key]=json[key]-start[key];
	}

	var n=0;
	var count=Math.round(options.duration/30);

	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		n++;
		for(var key in json){
			switch(options.easing){
				case 'liner':
					var a=n/count;
					var cur=start[key]+dis[key]*a
					break;
				case 'ease-in':
					var a=n/count;
					var cur=start[key]+dis[key]*a*a*a;
					break;
				case 'ease-out':
					var a=1-n/count;
					var cur=start[key]+dis[key]*(1-a*a*a);
					break;
			}

			if (key=='opacity') {
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity='+cur*100+')';
			}else{
				obj.style[key]=cur+'px';
			}
		}
		if (n==count) {
			clearInterval(obj.timer);
			options.complete && options.complete();
		}		
	},30)
}

function getByClass(oParent,sClass){
	var arr=[];
	if(oParent.getElementsByClassName){
		arr=oParent.getElementsByClassName(sClass);
	}else{
		var aEl=oParent.getElementsByTagName('*');
		for(var i=0; i<aEl.length; i++){
			var arr1=aEl[i].className.split(' ');
			for(var j=0; j<arr1.length; j++){
				if(arr1[j]==sClass){
					arr.push(aEl[i]);
				}
			}
		}
	}
	return arr;
}

function getPos(obj){
	var l=0;
	var t=0;
	while(obj){
		l+=obj.offsetLeft;
		t+=obj.offsetTop;
		obj=obj.offsetParent;
	}
	return {top:t,left:l};
}

function ready(fn){
	if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded',fn,false);
	}else{
		document.attachEvent('onreadystatechange',fn);
			if (document.readyState=='complete') {
				fn();
			}
		}
	}
ready(function(){
	prettyPrint();
	//document.body.className='animated swing';
	var oBallBox=document.getElementById('ballBox');
	var oBallBtn=document.getElementById('ball_btn');
	var oNav=document.getElementsByTagName('nav')[0];
	var oPlay=document.getElementById('cloudBtn');
	

	var bReady=true;

	ex1();
	function ex1(){
		var oEx=document.getElementById('ex1');
		var oUl=oEx.children[0];
		var oPre=oEx.children[1];
		var oNex=oEx.children[2];
		var aLi=oUl.children;
		var arr=[];
		for(var i=0; i<aLi.length;i++){
			arr[i]=aLi[i].className;	
		}	
		function addClass(){
			for(var i=0;i<aLi.length;i++){
				aLi[i].className=arr[i];	
			}
		}
		
		oPre.onclick=function(){
			arr.push(arr.shift());
			addClass();	
		};
		oNex.onclick=function(){
			arr.unshift(arr.pop());
			addClass();	
		};
	}
	//////////////////////////////////////////////////////////////
	//js 案例1
	oBallBtn.ondblclick=function(){
		moveBall(oBallBox);
	};
	function moveBall(oParent){
		for(var i=0;i<30;i++){
			setTimeout(function(){
				var oBall=document.createElement('div');
				oBall.style.backgroundColor='rgb('+rnd(0,256)+','+rnd(0,256)+','+rnd(0,256)+')';	
				oParent.appendChild(oBall);
				move(oBall,oParent,rnd(1,40),rnd(1,40));
			},rnd(1000,4000))	
		}			
		/*function drag(obj){
			var lastX,lastY=0;
			var speedX,speedY=0;
			obj.onmousedown=function(ev){
				clearInterval(obj.timer);
				var e=ev||event;
				lastX=obj.offsetLeft;
				lastY=obj.offsetTop;
				var disX=e.clientX-obj.offsetLeft;
				var disY=e.clientY-obj.offsetTop;	
				document.onmousemove=function(ev){
					//移动记录速度
					var e=ev||event;
					var l=e.clientX-disX;
					var t=e.clientY-disY;
					//限定
					obj.style.left=l+'px';
					obj.style.top=t+'px';	
					
					speedX=obj.offsetLeft-lastX;
					speedY=obj.offsetTop-lastY;
					
					lastX=obj.offsetLeft;
					lastY=obj.offsetTop;
				};
				document.onmouseup=function(){
					document.onmousemove=document.onmouseup=null;
					move(obj,speedX,speedY);
				};
				return false;
			};
		}*/
		function move(obj,oParent,speedX,speedY){
			clearInterval(obj.timer);
			obj.timer=setInterval(function(){
				speedY++;
				var l=obj.offsetLeft+speedX;
				var t=obj.offsetTop+speedY;
				if(l>oParent.offsetWidth-obj.offsetWidth){
					l=oParent.offsetWidth-obj.offseWidth;	
					speedX*=-0.7;
				}else if(l<0){
					l=0;
					speedX*=-0.7;	
				}
				if(t>oParent.offsetHeight-obj.offsetHeight){
					t=oParent.offsetHeight-obj.offsetHeight;
					speedY*=-0.7;	
					speedX*=0.7;
				}else if(t<0){
					t=0;
					speedY*=-0.7;	
				}
				obj.style.left=l+'px';
				obj.style.top=t+'px';
				if(Math.abs(speedX)<1) speedX=0;
				if(Math.abs(speedY)<1) speedY=0;
				if(speedX==0 && speedY==0 && obj.offsetHeight==oParent.offsetHeight-obj.offsetTop){
					clearInterval(obj.timer);	
					obj.parentNode.removeChild(obj);
				}
			},30)	
		}
		function rnd(n,m){
			return parseInt(Math.random()*(m-n)+n);	
		}	
	}
	//////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////
	//锚点跳转
	var timer=null;
	var jumpReady=true;//跳转开关
	function jump(id,id2,space,duration){ //触发事件锚点 目标位置  间隔  运动时间
		if(!jumpReady)return;
		jumpReady=false;
		if (typeof id=='string') {
			var oStart=document.getElementById(id);
		}else{
			var oStart=id;
		}
		if (typeof id=='string') {
			var oEnd=document.getElementById(id2);
		}else{
			var oEnd=id2;
		}
		var space=space||70;
		var start=document.documentElement.scrollTop|| document.body.scrollTop;
		var end=getPos(oEnd).top-space;//1120

		move(start,end,duration);
		function move(start,end,duration){
			var dis=end-start;
			var duration=duration||800;
			var n=0;
			var count=Math.round(duration/30);
			clearInterval(timer);
			timer=setInterval(function(){
				n++;
				var a=1-n/count;
				var cur=start+dis*(1-a*a*a);
				document.documentElement.scrollTop=cur;
				document.body.scrollTop=cur;
				if(n==count){
					clearInterval(timer);
					jumpReady=true;
				}
			},30);
		}
	}

	addMouseWheel(document,function(){  //监测跳转期间  鼠标滚轮
		clearInterval(timer);
		jumpReady=true;
	});

	var oPotato=document.getElementById('potato');
	var oXBtn=document.getElementById('xhtml_btn');
	var oSBtn=document.getElementById('skile_btn');
	var oJBtn=document.getElementById('js_btn');
	var oH5=document.getElementById('html5_btn');
	oPotato.onclick=function(){jump('potato','potato');};
	oXBtn.onclick=function(){jump('xhtml_btn','xhtml');};
	oSBtn.onclick=function(){jump('skile_btn','skile');};
	oJBtn.onclick=function(){jump('js_btn','js');};
	oH5.onclick=function(){jump('html5_btn','h5');};
	//////////////////////////////////////////////////////////////
	//返回顶部
	var oToTop=document.getElementById('to_top');
	oToTop.onclick=toTop;
	function toTop(){
		if (!jumpReady) return;
		jumpReady=false;
		move(0,1000);
		function move(iTarget,time){
			var start=document.documentElement.scrollTop||document.body.scrollTop;
			var dis=iTarget-start;
			var count=Math.round(time/30);
			var n=0;
			clearInterval(timer);
			var timer=setInterval(function(){
				n++;
				var a=1-n/count;
				var cur=start+dis*(1-a*a*a);
				document.documentElement.scrollTop=cur;
				document.body.scrollTop=cur;
				if(n==count){
					jumpReady=true;
					clearInterval(timer);
				}
			},30);	
		}
	}

	var oSBox=document.getElementById('skile');
	// window滚动事件
	window.onscroll=function(){
		var oTop=document.documentElement.scrollTop||document.body.scrollTop;
		oNav.style.background='rgba(238,238,238,.8)';
		if (oTop>=getPos(oSBox).top-100) {
			oToTop.style.display='block';
			oToTop.className='animated rollIn';
		}else{
			oToTop.className='animated rollOut';
		}
	};


	// skile:hover
	var aSkile=getByClass(document,'thumbnail');
	var aCap=getByClass(document,'caption');
	// console.log(aCap);
	skileOver();
	function skileOver(){
		for(var i=0;i<aSkile.length;i++){
			aSkile[i].index=i;
			aSkile[i].onmouseover=function(){
				for(var i=0;i<aSkile.length;i++){
					aCap[i].style.top='140px';
				}
				this.style.boxShadow='0,0,10px,#000';
				aCap[this.index].style.top='4px';
			};
			aSkile[i].onmouseout=function(){
				for(var i=0;i<aSkile.length;i++){
					aSkile[i].style.boxShadow=0;
					aCap[i].style.top='140px';
				}
			};
		}
	}
	//////////////////////////////////////////////////////////////

	//轮播图
	
	function changeImage(){
		var oBox=document.getElementById('img_box');
		var oUl=oBox.getElementsByTagName('ul')[0];
		var oOl=oBox.getElementsByTagName('ol')[0];
		var aHead=oOl.children;
		var oPre=getByClass(oBox,'bfr')[0];
		var oNex=getByClass(oBox,'nex')[0];
		var iCount=0;
		var bReady=true;
		var timer=null;

		oUl.innerHTML+=oUl.innerHTML;
		oUl.style.width=oUl.children.length*oUl.children[0].offsetWidth+'px';

		function tab(){ //点亮自己，干掉所有
			for(var i=0;i<aHead.length;i++){
				aHead[i].className='';
			}
			if (iCount==4) {
				aHead[0].className='active';
			}else{
				aHead[iCount].className='active';
			}
			//oUl.style.left=-iCount*oUl.children[0].offsetWidth+'px';
			move(oUl,{left:-iCount*oUl.children[0].offsetWidth},{duration:1400,complete:function(){
				if (iCount==4) {
					oUl.style.left=0;
					iCount=0;
				}
				bReady=true;
			}});
		}

		for(var i=0;i<aHead.length;i++){
			aHead[i].index=i;
			aHead[i].onclick=function(){
				iCount=this.index;
				tab();
			};
		}

		oPre.onclick=function(){
			clearInterval(timer);
			if (!bReady) return;
			bReady=false;
			if(iCount==0){
				oUl.style.left=-oUl.offsetWidth/2+'PX';
				iCount=aHead.length;
			}
			iCount--;
			tab();
		};
		oNex.onclick=function(){
			clearInterval(timer);
			if (!bReady) return;
			bReady=false;
			iCount++;
			tab();
		};
		oBox.onmouseover=function(){
			clearInterval(timer);
		};

		oBox.onmouseout=function(){
			timer=setInterval(function(){
				iCount++;
				iCount%=5;
				tab();
			},3000)

		};

		timer=setInterval(function(){
			iCount++;
			iCount%=5;
			tab();
		},2400)
	}

	changeImage();

	/*appleMenu*/
	function appleMenu(){
		var oApple=document.getElementById('apple');
		var oBox=oApple.children[0];
		var aImg=oBox.children;

		oApple.onmousemove=function(ev){
			var e=ev||event;
			for(var i=0; i<aImg.length;i++){
				var x=aImg[i].offsetLeft+getPos(oBox).left+aImg[i].offsetWidth/2-e.clientX;
				var y=aImg[i].offsetTop+oBox.offsetTop+aImg[i].offsetHeight/2-e.clientY+150; 
				var z=Math.sqrt(x*x+y*y);
				var scale=1-z/600;
				//console.log(scale)
				if (scale<0.5) scale=0.5;
				aImg[i].style.width=scale*80+'px';
				aImg[i].style.height=scale*80+'px';
			}
		};
	}
	appleMenu();


	function loup(){
		var oMask=document.getElementById('mask');
		var oBox=document.getElementById('pic_box');
		var oLeft=oBox.children[0];
		var oRight=oBox.children[1];
		var oImg=oRight.children[0];
		
		oLeft.onmouseenter=function(){
			oMask.style.display='block';
		};
		oLeft.onmouseleave=function(){
			oMask.style.display='none';
		};
		oLeft.onmousemove=function(ev){
			var e=ev||event;
			var l=e.pageX-oMask.offsetWidth/2-getPos(oBox).left;
			var t=e.pageY-oMask.offsetHeight/2-getPos(oBox).top;
			if(t<0)t=0;
			if(t>oLeft.offsetHeight-oMask.offsetHeight)t=oLeft.offsetHeight-oMask.offsetHeight;
			if(l<0) l=0;
			if(l>oLeft.offsetWidth-oMask.offsetWidth)l=oLeft.offsetWidth-oMask.offsetWidth;
			oMask.style.left=l+'px';
			oMask.style.top=t+'px';
			
			var scaleX=l/(oLeft.offsetWidth-oMask.offsetWidth);
			var scaleY=t/(oLeft.offsetHeight-oMask.offsetHeight);
			oImg.style.left=-(oImg.offsetWidth-oRight.offsetWidth)*scaleX+'px';
			oImg.style.top=-(oImg.offsetHeight-oRight.offsetHeight)*scaleY+'px';
			
		};	

	}
	loup();

	function max(){
		var oList=document.querySelector('.max-list');
		var N=11;
		for(var i=0; i<N;i++){
			var oLi=document.createElement('li');
			oLi.style.background='url(img/3d'+(i+1)+'.jpg)';
			oList.appendChild(oLi);
			oLi.style.transition='0.3s all ease '+(N-i)*100+'ms';
			(function(obj,index){
				setTimeout(function(){
					obj.style.transform='rotateY('+(index*360/N)+'deg) translateZ(350px)';	
				},0);	
			})(oLi,i);
		}
		var aLi=oList.children;
		var y=10;
		var x=0;
		var speedX=0;
		var speedY=0;
		var lastX=0;
		var lastY=0;
		var timer=null;
		document.onmousedown=function(ev){
			var disX=ev.clientX-x;
			var disY=ev.clientY-y;
			document.onmousemove=function(ev){
				x=ev.clientX-disX;
				y=ev.clientY-disY;
				change(x/3,y/3);
				speedX=ev.clientX-lastX;
				speedY=ev.clientY-lastY;
				lastX=ev.clientX;
				lastY=ev.clientY;
			}
			document.onmouseup=function(ev){
				document.onmouseup=null;
				document.onmousemove=null;
				timer=setInterval(function(){
					//y+=speedX*0.95;
					speedX*=0.95;
					x+=speedX;
					change(x,y);
					if(Math.abs(speedX)<1||Math.abs(speedX=1)){
						clearInterval(timer);
					}
				},30);
					
			};	
			return false;
		};
		function change(x,y){
			oList.style.transform='perspective(800px) rotateX('+-y+'deg)';
			for(var i=0; i<aLi.length;i++){
				aLi[i].style.transition='none';
				aLi[i].style.transform='rotateY('+(i*360/N+x)+'deg) translateZ(350px)';
				var scale=Math.abs(Math.abs(i*360/N+x)%360-180)/180;
				aLi[i].style.opacity=scale;
			}	
		}
	}

	// max();


	//baiduMap-API key: 5xpzKDfvFAGaWysMNESonwHzqntxNKMG
	function map(){
		var map = new BMap.Map("map");         
		var point = new BMap.Point(116.331398,39.897445);
		map.centerAndZoom(point,12);                 
		var marker = new BMap.Marker(point);       
		map.addOverlay(marker);                    
		map.enableScrollWheelZoom(true);
		map.enableDragging();	

		map.addControl(new BMap.NavigationControl());    
		map.addControl(new BMap.ScaleControl());    
		map.addControl(new BMap.OverviewMapControl());    
		map.addControl(new BMap.MapTypeControl());    	
		
		function myFun(result){
		var cityName = result.name;
		map.setCenter(cityName);
		}
		var myCity = new BMap.LocalCity();
		myCity.get(myFun);
	};

	//map();

	function lazyLoad(){
		var aImg=document.getElementsByTagName('img'); //33
		var scT=document.documentElement.scrollTop|| document.body.scrollTop;
		var clientH=document.documentElement.clientHeight;
		for (var i = 0; i < aImg.length; i++) {
			var x=getPos(aImg[i]).top;
			if(scT+clientH>x){
				//console.log(x);
				aImg[i].setAttribute('src',aImg[i].getAttribute('_src'));
			}
		}
	}
	 // lazyLoad();
	function can(){
		var oC=document.querySelector('#oc');
		var gd=oC.getContext('2d');
		var aPl=6;
		var LEN=80;
		var w=1;
		var h=1;
		var aPointarr=[]; 	
		var fPoint=[];
		for(var i=0; i<aPl;i++){
			var x=rnd(0,oC.width-w);
			var y=rnd(0,oC.height-h);
			var speedX=rnd(-5,6);
			var speedY=rnd(-5,6);
			aPointarr.push({x:x,y:y,speedx:speedX,speedy:speedY});	
		}
		setInterval(function(){
			gd.clearRect(0,0,oC.width,oC.height);
			var arr=[];
			for(var i=0; i<aPl;i++){
				aPointarr[i].x+=aPointarr[i].speedx;
				aPointarr[i].y-=aPointarr[i].speedy;
				if(aPointarr[i].x<0){
					aPointarr[i].x=0;
					aPointarr[i].speedx*=-1;
				}
				if(aPointarr[i].x>oC.width-w){
					aPointarr[i].x=oC.width-w;
					aPointarr[i].speedx*=-1;
				}
				if(aPointarr[i].y>oC.height-h){
					aPointarr[i].y=oC.height-h
					aPointarr[i].speedy*=-1;
				}
				if(aPointarr[i].y<0){
					aPointarr[i].y=0;
					aPointarr[i].speedy*=-1;
				}
				arr[i]={x:aPointarr[i].x,y:aPointarr[i].y}
				gd.fillRect(aPointarr[i].x,aPointarr[i].y,w,h);
			}	
			gd.beginPath();
			gd.moveTo(aPointarr[0].x,aPointarr[0].y);
			for(var i=1;i<aPointarr.length;i++){
				gd.lineTo(aPointarr[i].x,aPointarr[i].y);
			}
			gd.closePath();
			gd.stroke();
			fPoint.push(arr);
			if(fPoint.length==LEN){
				fPoint.shift();
			}
			for(var i=0; i<fPoint.length;i++){
				gd.strokeStyle='rgba(0,5,255,'+i/fPoint.length+')';
				gd.beginPath();
				gd.moveTo(fPoint[i][0].x,fPoint[i][0].y)
				for(var j=1;j<fPoint[i].length;j++){
					gd.lineTo(fPoint[i][j].x,fPoint[i][j].y);
				}
				gd.closePath();
				gd.stroke();
			}
		},16);
	}
	can();
});





