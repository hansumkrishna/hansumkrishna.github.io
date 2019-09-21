(function exampleCode() {
	"use strict";

	brfv4Example.initCurrentExample = function(brfManager, resolution) {
		brfManager.init(resolution, resolution, brfv4Example.appId);
	};

	brfv4Example.updateCurrentExample = function(brfManager, imageData, draw) {

		brfManager.update(imageData);

		draw.clear();

		// Face detection results: a rough rectangle used to start the face tracking.

		draw.drawRects(brfManager.getAllDetectedFaces(),	false, 1.0, 0x00a1ff, 0.5);
		draw.drawRects(brfManager.getMergedDetectedFaces(),	false, 2.0, 0xffd200, 1.0);

		var faces = brfManager.getFaces(); // default: one face, only one element in that array.
		

		
		for(var i = 0; i < faces.length; i++) {

			var face = faces[i];

			if(face.state === brfv4.BRFState.FACE_TRACKING) {

				// simple blink detection

				// A simple approach with quite a lot false positives. Fast movement can't be
				// handled properly. This code is quite good when it comes to
				// staring contest apps though.

				// It basically compares the old positions of the eye points to the current ones.
				// If rapid movement of the current points was detected it's considered a blink.

				var v = face.vertices;

				if(_oldFaceShapeVertices.length === 0) storeFaceShapeVertices(v);

				var k, l, yLE, yRE;

				// Left eye movement (y)

				for(k = 36, l = 41, yLE = 0; k <= l; k++) {
					yLE += v[k * 2 + 1] - _oldFaceShapeVertices[k * 2 + 1];
				}
				yLE /= 6;

				// Right eye movement (y)

				for(k = 42, l = 47, yRE = 0; k <= l; k++) {
					yRE += v[k * 2 + 1] - _oldFaceShapeVertices[k * 2 + 1];
				}

				yRE /= 6;

				var yN = 0;

				// Compare to overall movement (nose y)

				yN += v[27 * 2 + 1] - _oldFaceShapeVertices[27 * 2 + 1];
				yN += v[28 * 2 + 1] - _oldFaceShapeVertices[28 * 2 + 1];
				yN += v[29 * 2 + 1] - _oldFaceShapeVertices[29 * 2 + 1];
				yN += v[30 * 2 + 1] - _oldFaceShapeVertices[30 * 2 + 1];
				yN /= 4;

				var blinkRatio = Math.abs((yLE + yRE) / yN);
				var eye_mov=0.5;
				
				
				if(blinkRatio > 10 ) {
					
					if(yLE < eye_mov && yRE > eye_mov){
						console.log("right blink " + blinkRatio.toFixed(2) + " " + yLE.toFixed(2) + " " +
							yRE.toFixed(2) + " " + yN.toFixed(2));

						blink("R");
						
						
					} else if(yRE < eye_mov && yLE > eye_mov){
						console.log("left blink " + blinkRatio.toFixed(2) + " " + yLE.toFixed(2) + " " +
							yRE.toFixed(2) + " " + yN.toFixed(2));

						blink("L");
						
						
					} else if(yLE > eye_mov || yRE > eye_mov){
						console.log("both blink " + blinkRatio.toFixed(2) + " " + yLE.toFixed(2) + " " +
							yRE.toFixed(2) + " " + yN.toFixed(2));

						blink("B");
						
						
						
					}
				}

				// Let the color of the shape show whether you blinked.

				var color = 0x00a0ff;
				
				
				

				
				
				if(_blinked && timeout_blink(0)>700) {
					
					timeout_blink(1);
					
					if(blinked_eye=="L"){
						
						recalibrate(v[33 * 2],v[33 * 2 + 1],v[27 * 2],v[27 * 2 + 1]);
						color = 0xffd200;
						
					}else if(blinked_eye=="B"){

						console.log(xxx, yyy);
						click_element(xxx,yyy);

					}else if(blinked_eye=="R"){
						
					// if(pointer_move==1){ 
					// pointer_move=0;
					// }else if(pointer_move==0){
						// pointer_move=1;
						// }
						
					}
					
					
					resetBlink();
				}
				
				
				getPosition(v[33 * 2],v[33 * 2 + 1],pointer_move);
			
				// Face Tracking results: 68 facial feature points.

				draw.drawTriangles(	face.vertices, face.triangles, false, 1.0, color, 0.4);
				draw.drawVertices(	face.vertices, 2.0, false, color, 0.4);
				

				brfv4Example.dom.updateHeadline("Detects blink: " + (_blinked ? "Yes" : "No") + "\nX : " + v[33 * 2] + " Y : " + v[33 * 2 + 1] + "\nPoint X : " + xxx + " Point Y : " +  yyy);
				
				storeFaceShapeVertices(v);
				
				if(sh!=window.outerHeight || sw!=window.outerWidth || document.getElementById("innerView")!=prevhtml){
					var sh=window.outerHeight;
					var sw=window.outerWidth;
					
					recallhtml();
					//recalibrate(v[33 * 2],v[33 * 2 + 1],v[27 * 2],v[27 * 2 + 1]);
				}
				
				if(timeout_blink(0)>3200){
					document.activeElement.blur();
				}
				
				
			}
		}
	};
	
	var point_color="#ff2626";
	var pointSize = 7;
    var cxa=200;
	var cxb=250;
	var cya=280;
	var cyb=380;
	var sh=1080;
	var sw=1920;
	var thresx=50;
	var thresy=50;
	var thresp=8;
	var xxx=0;
	var yyy=0;
	var blinked_eye=null;
	var prevhtml=document.getElementById("innerView");
	var elementsView=document.getElementById("innerView").querySelectorAll(".clickable");
	var currentTime = new Date().getTime();
	var click_error=0;
	var flicker_correct=8;
	var nose_length_a=40;
	var nose_length_b=100;
	var nose_factor_a=4;
	var nose_factor_b=9;
	var pointer_move=1;
	
	function timeout_blink(val){

		if (val == 1){
			
			currentTime = new Date().getTime();
			
		} else if(val ==0){
			
			var cur = new Date().getTime()
			return (cur - currentTime);
			
		}
		
	}
	
	function recallhtml(){
		elementsView = document.getElementById("innerView").querySelectorAll(".clickable");
		prevhtml=document.innerHTML;
	}
	
	function click_element(x,y){
		recallhtml();
		var arrayLength = elementsView.length;
		
		var h_ratio=document.getElementById("innerView").offsetHeight/sh;
		var w_ratio=document.getElementById("innerView").offsetWidth/sw;
		
		for (var i = 0; i < arrayLength; i++) {
			var rect = elementsView[i].getBoundingClientRect();
			
			//var btm=rect.top+(elementsView[i].offsetHeight/h_ratio);
			//var rgt=rect.left+(elementsView[i].offsetWidth/w_ratio);
			
			//console.log(rect.left, rect.top, btm, rgt);
			
			if((rect.top/h_ratio)+click_error<y && (rect.bottom/h_ratio)-click_error>y && (rect.left/w_ratio)+click_error<x && (rect.right/w_ratio)-click_error>x){
				console.log(elementsView[i]);
				elementsView[i].click();
				elementsView[i].focus();
				break;
			}
			
		}
		
		
	}
	
	function print_elements(){
		recallhtml();
		var arrayLength = elementsView.length;
		
		for (var i = 0; i < arrayLength; i++) {
			var rect = elementsView[i].getBoundingClientRect();
			
			console.log(rect.top,rect.bottom,rect.left,rect.right);
				console.log(elementsView[i]);
			
		}
		
		
	}
	
	function getPosition(px,py,motion){
	
	 if(motion==1){
     var rect = canvas.getBoundingClientRect();
	 
	 var x = px - rect.left;
     var y = py - rect.top;
	
	 var xx = scale(x,cxa,cxb,0,sw);
	 var yy = scale(y,cya,cyb,0,sh);
	 }
	 
	 if(Math.abs(distance(xx,yy,xxx,yyy)) > flicker_correct){
	 xxx = xx;
	 yyy = yy;
        
     drawCoordinates(xx,yy);
	 }
}

	function screen_cal(){
		
			
		document.getElementById('canvas').height = window.outerHeight;
		document.getElementById('canvas').width = window.outerWidth;
		
		sw=window.outerWidth;
		sh=window.outerHeight;
		
	}
		
	function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

	function pointer_cal(px,py){
		
		cxa=px-(thresx/2);
		cxb=px+(thresx/2);
		cya=py-(thresy/2);
		cyb=py+(thresy/2);
		
	}
	
	function sensitivity_cal(){
		
		thresx=(window.outerWidth*thresp)/100;
		thresy=(window.outerHeight*thresp)/100;
	
	}
	
	function distance_from_screen_cal(px,py,bx,by){
		
		var dist = distance(px,py,bx,by);
		thresp = scale(dist,nose_length_a,nose_length_b,nose_factor_a,nose_factor_b);
		
	}
		
	function recalibrate(px,py,bx,by){
	
		screen_cal();
		pointer_cal(px,py);
		distance_from_screen_cal(px,py,bx,by)
		sensitivity_cal();
		
	}

	function drawCoordinates(x,y){	
  	var ctx = document.getElementById("canvas").getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	point_color="#ff2626";
  	ctx.fillStyle = point_color; // Red color

    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
	}

	const scale = (num, in_min, in_max, out_min, out_max) => {
		return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}
	
	function distance(x1,y1,x2,y2){
		
		var aa = x1 - x2;
		var bb = y1 - y2;

		var cc = Math.sqrt( aa*aa + bb*bb );
		
		return cc;
	}

	function blink(eye) {
		_blinked = true;
		blinked_eye=eye;
		// if(_timeOut > -1) { clearTimeout(_timeOut); }

		// _timeOut = setTimeout(resetBlink, 150);
	}
	

	function resetBlink() {
		_blinked = false;
	}

	function storeFaceShapeVertices(vertices) {
		for(var i = 0, l = vertices.length; i < l; i++) {
			_oldFaceShapeVertices[i] = vertices[i];
		}
	}
	
	function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}

var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}



	var _oldFaceShapeVertices = [];
	var _blinked		= false;
	var _timeOut		= -1;

	brfv4Example.dom.updateHeadline("BRFv4 - advanced - face tracking - simple blink detection.\n" +
		"Detects a blink of the eyes: ");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();