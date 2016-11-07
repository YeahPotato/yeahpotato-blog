// JavaScript Document
function getByClass(oParent,sClass){
	var res=[];
	if(oParent.getElementsByClassName){
		res=oParent.getElementsByClassName(sClass);	
	}else{
		var aEle=oParent.getElementsByTagName('*');	
		for(var i=0;i<aEle.length;i++){
			var tmp=aEle[i].className.split(' ');
			for(var j=0;j<tmp.length;j++){
				if(tmp[j]==sClass){
					res.push(aEle[i]);	
				}	
			}	
		}
	}
		return res;
}

function getStyle(obj,attr){
	return (obj.currentStyle||getComputedStyle(obj,false))[attr];
}

function move(obj,json,options){
	//整理可选参数
	options = options || {};
	options.duration = options.duration || 300;
	options.complete = options.complete || null;
	options.easing = options.easing || 'ease-out';
	
	var start={};	
	var dis={};	
	for(var key in json){
		start[key]=parseFloat(getStyle(obj,key));
		
		if(isNaN(start[key])){
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
				case 'top':
					start[key]=0;	
					break;
				//marginLeft/top...	padding
			}	
		}
		
		
		dis[key]=json[key]-start[key];
	}
	var count=Math.round(options.duration/30);
	var n=0;
	
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		n++;
		
		for(var key in json){//办事部分包起来
			switch(options.easing){
				case 'linear':	
					var a=n/count;//	匀速运动
					var cur=start[key]+dis[key]*a;
					break;	
				case 'ease-in':
					var a=n/count;//	加速运动
					var cur=start[key]+dis[key]*(a*a*a);
					break;	
				case 'ease-out':
					var a=1-n/count;//	减速运动
					var cur=start[key]+dis[key]*(1-a*a*a);
					break;	
			}
			if(key=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity='+cur*100+')';
			}else{
				obj.style[key]=cur+'px';
			}	
		}
		
		if(n==count){
			clearInterval(obj.timer);
			options.complete && options.complete();
		}
	},30);
}


window.onload=function (){
	//themList
	var oThem=document.getElementById('themList');
	var aLi=oThem.getElementsByTagName('li');  //所有的li
	var aShowBox=getByClass(document,'show-box');//showbox

	var zIndex=2;
	for(var i=0;i<aLi.length;i++){
		aLi[i].index=i;
		aLi[i].onmouseover=function(){
			for(var i=0;i <aLi.length;i++){
				aShowBox[i].style.display='none';	
			}
			aShowBox[this.index].style.display='block';
			aShowBox[this.index].style.zIndex=zIndex++;
		};	

	}

	oThem.onmouseleave=function(){
		clearTimeout(oThem.timer);
		oThem.timer=setTimeout(function(){
			for(var i=0;i <aLi.length;i++){
				aShowBox[i].style.display='none';	
			}
		},500)
	};

	for(var i=0;i<aShowBox.length;i++){
		aShowBox[i].index=i;
		aShowBox[i].onmouseover=function(){
			clearTimeout(oThem.timer);
			this.style.display='block';
		};
		aShowBox[i].onmouseout=function(){
			_this=this;
			oThem.timer=setTimeout(function(){
				_this.style.display='none';	
			},500)
		};
	}
	//轮播图
	function banner(){
		var oOl=document.getElementById('ol1');
		var aBtn=document.getElementById('head').getElementsByTagName('a');
		var iCount=0;
		var oPre=document.getElementById('pre');
		var oNex=document.getElementById('next');
		var bl=false;
		var tier=null;

		oOl.innerHTML+=oOl.innerHTML;
		//console.log(oOl.children[0].offsetWidth);
		oOl.style.width=oOl.children.length*oOl.children[0].offsetWidth+'px';
		function tab(){
			for (var i = 0; i < aBtn.length; i++) {
				aBtn[i].className='';
			}
			if (iCount==5) {
				aBtn[0].className='on';
			}else{
				aBtn[iCount].className='on';
			}
			//oOl.style.left=-this.index*oOl.children[0].offsetWidth+'px';
			move(oOl,{left:-iCount*oOl.children[0].offsetWidth},{duration:1000,complete:function(){
				bl=false;
				if (iCount==5) {
					oOl.style.left=0;
					iCount=0;
				}
			}});
		}
		for(var i=0;i<aBtn.length;i++){	
			(function(index){
				aBtn[index].onclick=function(){
					iCount=index;
					tab();
				};
			})(i);
		}

		oNex.onclick=function(){
			if(bl)return;
			bl=true;
			iCount++;
			tab();
		};
		oPre.onclick=function(){
			if(bl)return;
			bl=true;
			if (iCount==0) {
				oOl.style.left=-oOl.offsetWidth/2+'px';
				iCount=aBtn.length-1;//4
			}
			iCount--;
			tab();

		};

		timer=setInterval(function(){   //自动播
			iCount++; 
			iCount%=5;
			tab();
		},3000)

		oOl.onmouseover=function(){   //鼠标移入清定时器
			clearInterval(timer);
		};
		oOl.onmouseout=function(){
			timer=setInterval(function(){   	//移出开启定时器
				iCount++; 
				iCount%5;
				tab();
			},3000)
		};
	}
	banner();
	//轮播图2
	function bannerHot(){
		var oHot=document.getElementById('hot-ul');
		var aHotList=getByClass(oHot,'hot-li');
		var oHotPre=document.getElementById('hot_pre');
		var oHotNxt=document.getElementById('hot_nex');
		var oNum=document.getElementById('num');
		var iNow=0;
		var br=false;
		//alert(aHotList.length);
		
		oHot.innerHTML+=oHot.innerHTML;
		oHot.style.width=aHotList.length*aHotList[0].offsetWidth+'px';

		oHotNxt.onclick=function(){
			if (br) return;
			br=true;
			iNow++;
			//oHot.style.left=-iNow*aHotList[0].offsetWidth+'px';
			move(oHot,{left:-iNow*aHotList[0].offsetWidth},{duration:1000,complete:function(){
				if (iNow==5) {
					iNow=0;
					oHot.style.left=0;
				}
			}});
		};
		oHotPre.onclick=function(){
			if (br) return;
			br=true;
			if (iNow==0) {
				iNow=4;
				oHot.style.left=-oHot.offsetWidth/2+'px';
			}else{
				document.title=iNow;
				iNow--;
			}
			move(oHot,{left:-iNow*aHotList[0].offsetWidth},{duration:1000});
		};

		setInterval(function(){
			oNum.innerHTML%=6;
			oNum.innerHTML++;
			iNow++;
			move(oHot,{left:-iNow*aHotList[0].offsetWidth},{duration:1000,complete:function(){
				br=false;
				if (iNow==5) {
					iNow=0;
					oHot.style.left=0;
				}
			}});
		},6000)
	}
	bannerHot();
	//收起二维码
	var oMaClose=document.getElementById('ma_close');
	oMaClose.onclick=function(){
		this.parentNode.style.display='none';
	};
	//search_Box
	var oSearchTitle=document.getElementById('search_Box');
	var aSearchBtn=oSearchTitle.getElementsByTagName('a');

	for (var i = 0; i < aSearchBtn.length; i++) {
		aSearchBtn[i].onclick=function(){
			for (var i = 0; i < aSearchBtn.length; i++) {
				aSearchBtn[i].className='';
			}
			this.className='search-title-active';
		};
	}
	//nav_box
	var oNavBox=document.getElementById('nav_box');
	var aNavBtn=oNavBox.getElementsByTagName('a');

	for (var i = 0; i < aNavBtn.length; i++) {
		aNavBtn[i].onclick=function(){
			for (var i = 0; i < aNavBtn.length; i++) {
				aNavBtn[i].className='';
			}
			this.className='active';
		};
	}

	//jsop url      https://suggest.taobao.com/sug?code=utf-8&q=aaaaaaaaaa&callback=show
	var oIpt=document.getElementById('ipt');
	var oDataBox=document.getElementById('data_box');
	var URL='https://suggest.taobao.com/sug';

	oIpt.onfocus=function(){
		oIpt.timer=setInterval(function(){
			if (!oIpt.value) {
				oDataBox.style.display='none';
			}else{
				oDataBox.style.display='block';
			}
		},30)
	};
	oIpt.onkeyup=function(){
		var json={};
		var res=[];
		json.code='utf-8';
		json.q=encodeURIComponent(oIpt.value);
		json.callback='show';
		console.log(json);
		for(var name in json){
			res.push(name+'='+json[name]);
		}
		var str=res.join('&');
		var oSc=document.createElement('script');  //
		oSc.src=URL+'?'+str;
		document.head.appendChild(oSc);

		window.show=function(json){
			var oSc=document.getElementsByTagName('script')[1];
			document.head.removeChild(oSc);
			//console.log(json.result);
			// console.log(json.result[0][0]);
			oDataBox.innerHTML='';
			for(var i=0;i<json.result.length;i++){
				var oLi=document.createElement('li');
				oLi.innerHTML='<a href="javascript:;">'+json.result[i][0]+'</a>';
				oDataBox.appendChild(oLi);
			}
		}

	};
	oIpt.onblur=function(){
		clearInterval(oIpt.timer);
		oDataBox.style.display='none';
	};
	//jsopOK
	
	//side-notice
	var oNotice=document.getElementById('notice');
	var oNoticeHead=oNotice.getElementsByTagName('ul')[0].getElementsByTagName('li'); //卡头
	var oNoticeCot=oNotice.getElementsByTagName('ol')[0].children;	//卡体

	for (var i = 0; i < oNoticeHead.length; i++) {
		oNoticeHead[i].index=i;
		oNoticeHead[i].onmouseover=function(){
			for (var i = 0; i < oNoticeHead.length; i++) {
				oNoticeHead[i].className='';
				oNoticeCot[i].style.display='none';
			}
			this.className='active';
			oNoticeCot[this.index].style.display='block';
		};
	}
	
	function jump(id1,id2){
		var oAnchor=document.getElementById(id1);
		var oJump=document.getElementById(id2);
		oAnchor.onclick=function(){
			toSide(oAnchor,oJump);
		};
		function toSide(oAnchor,oJump){
			var timer=null;
			var oS=document.documentElement.scrollTop;
			//条件scrollTop=getPos.top;
			//start=getPos(oAnchor).top;
			//end=getPos(oJump).top;
			var start=getPos(oAnchor).top;
			var end=getPos(oJump).top;
			move(start,end,2);
			function move(oD,start,end,duration){
				var dis=end-start;
				var n=0;
				var count=(start-end)/duration;
				timer=setInterval(function(){
					n++;
					var a=n/count;
					var cur=start+dis*a*a*a+'px';
					oS=cur+'px';
					if(n==count){
						clearInterval(obj.timer);
					}
				},30);
			}
			function getPos(obj){
				var l=0;
				var t=0;
				while(obj){
					l=obj.offsetLeft;
					t=obj.offsetTop;
					obj=obj.parentNode;
				}

				return {top:t,left:l};
			}
		}
	}

	var oTop=document.getElementById('to_top');
	oTop.onclick=toTop;
	function toTop(){
		var timer=null;
		move(0,1000);
		var bReady=false;
		addMouseWheel(document,function(down){
			clearInterval(timer);
		});
		function move(iTarget,time){
			var start=document.documentElement.scrollTop||document.body.scrollTop;
			var dis=iTarget-start;
			var count=Math.round(time/30);
			var n=0;
			clearInterval(timer);
			timer=setInterval(function(){
				n++;
				var a=1-n/count;
				var cur=start+dis*(1-a*a*a);
				document.documentElement.scrollTop=cur;
				document.body.scrollTop=cur;
				bReady=false;
				if(n==count){
					clearInterval(timer);
				}
			},30);	
		}
	}


};











