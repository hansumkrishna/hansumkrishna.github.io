(



function exampleCode() {
	"use strict";

var cla=[0,0];
var clb=[0,0];
var clc=[0,0];
var cld=[0,0];
var cali=0;

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
				
				var tva=v[33 * 2];
				var tvb=v[33 * 2+1];
				
				var blinkRatio = Math.abs((yLE + yRE) / yN);

				if((blinkRatio > 12 && (yLE > 0.4 || yRE > 0.4))) {
					console.log("blink " + blinkRatio.toFixed(2) + " " + yLE.toFixed(2) + " " +
						yRE.toFixed(2) + " " + yN.toFixed(2));

					blink();
				}

				// Let the color of the shape show whether you blinked.

				var color = 0x00a0ff;

				if(_blinked) {
					
					//if (!cali) {
						
						calibrate(tva,tvb,v);
						
					//} else {
						color = 0xffd200;
						getPosition(v[33 * 2], v[33 * 2 + 1]); 
					}

					
					
					
				}

				// Face Tracking results: 68 facial feature points.

				draw.drawTriangles(	face.vertices, face.triangles, false, 1.0, color, 0.4);
				draw.drawVertices(	face.vertices, 2.0, false, color, 0.4);

				brfv4Example.dom.updateHeadline("BRFv4 - advanced - face tracking - simple blink" +
					"detection.\nDetects an eye  blink: X - " + v[33 * 2] + " Y - " + v[33 * 2 + 1] + "  " + (_blinked ? "Yes" : "No"));
                
				storeFaceShapeVertices(v);
				
			}
		}
	};



	
	
	function blink() {
		_blinked = true;

		if(_timeOut > -1) { clearTimeout(_timeOut); }

		_timeOut = setTimeout(resetBlink, 150);
	}

	function resetBlink() {
		_blinked = false;
	}

	function storeFaceShapeVertices(vertices) {
		for(var i = 0, l = vertices.length; i < l; i++) {
			_oldFaceShapeVertices[i] = vertices[i];
		}
	}

function calibrate(tva,tvb,v){
		if(tva && tvb && nottooclose(tva,tvb,v)){
		if(cla[0]==0 || clb[0]==0 || clc[0]==0 || cld[0]==0){
			switch(0){
				case cla[0]:
				cla[0]=v[33 * 2];
				cla[1]=v[33 * 2 + 1];
				alert(cla);
				break;
				case clb[0]:
				clb[0]=v[33 * 2];
				clb[1]=v[33 * 2 + 1];
				alert(clb);
				break;
				case clc[0]:
				clc[0]=v[33 * 2];
				clc[1]=v[33 * 2 + 1];
				alert(clc);
				break;
				case cld[0]:
				cld[0]=v[33 * 2];
				cld[1]=v[33 * 2 + 1];
				alert(cld);
				break;
				default:
			}
		} else {
			alert("Calibration done!");
			cali=1;
		}
		}
		
		
	}

function nottooclose(tva,tvb,v){
	var thres = 50;
	var a=Math.abs(tva-v[33 * 2]);
	var b=Math.abs(tvb-v[33 * 2 + 1]);
	if((a<thres && a=>0) && (b<thres && b=>0)){
		return 0;
	} else {
		return 1;
	}
	
}

var pointSize = 6;

function getPosition(clientX,clientY){
     var rect = canvas.getBoundingClientRect();
     var x = clientX - rect.left;
     var y = clientY - rect.top;
        
     drawCoordinates(x,y);
}

function drawCoordinates(x,y){	
  	var ctx = document.getElementById("canvas").getContext("2d");


  	ctx.fillStyle = "#ff2626"; // Red color

    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
}

	var _oldFaceShapeVertices = [];
	var _blinked		= false;
	var _timeOut		= -1;

	brfv4Example.dom.updateHeadline("BRFv4 - advanced - face tracking - simple blink detection.\n" +
		"Detects a blink of the eyes: ");

	brfv4Example.dom.updateCodeSnippet(exampleCode + "");
})();

