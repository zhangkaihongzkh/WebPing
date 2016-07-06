var $ = function(v){return document.getElementById(v)}; //类似jq的选择器
var arrDelays = []; 						//用于存放延迟时间
var intSent; 								//用于存放发送的包个数
var bolIsRunning = false; 					//ping的运行状态
var bolIsTimeout; 							//是否超时
var strURL; 								//输入的URL字符串
var intTimeout; 							//请求超时
var intTimerID; 							//超时计时
var objBtn = $("btnSwitch"); 				//获取到开始停止按钮
var objContent = $("divContent"); 			//输出框内容
var objTxtURL = $("txtURL"); 				//输入的URL
objTxtURL.value = window.location.host; 	//获取到服务器(计算机)域名系统 (DNS) 主机名或 IP 地址
	
var intStartTime; 							//ping开始的时间
var objIMG = new Image(); 					//new Image来达到发送请求
objIMG.onload = objIMG.onerror = function() { 
	/* 
	* 有回应,取消超时计时 
	*/ 
	clearTimeout(intTimerID); 
	if(!bolIsRunning || bolIsTimeout) 
		return; 
	var delay = new Date() - intStartTime; 	//发送
	println("来自 " + strURL + " 时间" + ((delay<1)?("<1"):("="+delay)) + "ms"); 
	arrDelays.push(delay); 
	/* 
	* 每次请求间隔限制在1秒以上 
	*/ 
	setTimeout(ping, delay<1000?(1000-delay):1000); 
} 
function ping() { 
	/* 
	* 发送请求 
	*/ 
	intStartTime = new Date(); 
	intSent++; 
	objIMG.src = strURL + "/" + intStartTime; 
	bolIsTimeout = false; 
	/* 
	* 超时计时 
	*/ 
	intTimerID = setTimeout(timeout, intTimeout); 
} 
function timeout() { 
	if(!bolIsRunning) 
		return; 
	bolIsTimeout = true; 
	objIMG.src = "X:\\"; 
	println("请求超时."); 
	ping(); 
} 


function handleBtnClick() { 
	if(bolIsRunning) { 
		/* 
		* 停止 
		*/ 
		var intRecv = arrDelays.length; 
		var intLost = intSent-intRecv; 
		var sum = 0; 
		for(var i=0; i<intRecv; i++) 
		sum += arrDelays[i]; 
	/*	objBtn.value = "Start"; */
		bolIsRunning = false; 
		/* 
		* 统计结果 
		*/ 
		println("　"); 
		println("正在Ping " + strURL + ":"); 
		println("　　数据包: 已发送 = " + 
		intSent + ", 已接收 = " + intRecv + ", 丢失 = " + intLost + " (" + Math.floor(intLost / intSent * 100) + "% 丢失),"); 
		if(intRecv == 0) 
			return; 
		println("往返行程的估计时间(以毫秒为单位):"); 
		println("　　最短 = " + Math.min.apply(this, arrDelays) + "ms, 最长 = " + 
		Math.max.apply(this, arrDelays) + "ms, 平均 = " + Math.floor(sum/intRecv) + "ms"); //分别获取数组存放时间中的最大值和最小值
	} else { 
		/* 
		* 开始 
		*/ 
		strURL = objTxtURL.value; 
		if(strURL.length == 0) 
			return; 
		if(strURL.substring(0,7).toLowerCase() != "http://") 
			strURL = "http://" + strURL; 
		intTimeout = parseInt($("txtTimeout").value, 10); 
		if(isNaN(intTimeout)) 
			intTimeout = 2000; 
		if(intTimeout < 1000) 
			intTimeout = 1000; 
/*		objBtn.value = "Stop "; */
		bolIsRunning = true; 
		arrDelays = []; 					//重置延迟时间
		intSent = 0; 						//重置发送包个数
		cls(); 								//将输出内容区域清空
		println("Pinging " + strURL + ":"); 
		println("　"); 
		ping(); 
	} 
} 

//将ping 的结果输出来
function println(str) { 
	var objDIV = document.createElement("div"); 
	if(objDIV.innerText != null) 
		objDIV.innerText = str; 
	else 
		objDIV.textContent = str; 
	objContent.appendChild(objDIV); 
	objContent.scrollTop = objContent.scrollHeight; 
} 

//清空输出区域函数
function cls() { 
	objContent.innerHTML = ""; 
} 