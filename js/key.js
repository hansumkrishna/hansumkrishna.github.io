var lastUpdate = {
  counter: -1
};
var num_on=0;

$(document).ready(function() {
  var longPress = {};
  var resultArea = $("#result");
  $("#phone").find("button")
    .click(function(event) {
	var button_pressed = $(event.currentTarget).data("value");      
        resultArea.val(t9(resultArea.val(), button_pressed));
    })
	
})

function num_change(){
	if(num_on==0){
		num_on=1;
		document.getElementById("num").innerHTML="ABC/abc";
		document.getElementById("b1").innerHTML="1";
		document.getElementById("b2").innerHTML="2";
		document.getElementById("b3").innerHTML="3";
		document.getElementById("b4").innerHTML="4";
		document.getElementById("b5").innerHTML="5";
		document.getElementById("b6").innerHTML="6";
		document.getElementById("b7").innerHTML="7";
		document.getElementById("b8").innerHTML="8";
		document.getElementById("b9").innerHTML="9";
	} else if(num_on==1){
		num_on=0;
		document.getElementById("num").innerHTML="0-9";
		document.getElementById("b2").innerHTML="a b c";
		document.getElementById("b3").innerHTML="d e f";
		document.getElementById("b4").innerHTML="g h i";
		document.getElementById("b5").innerHTML="j k l";
		document.getElementById("b6").innerHTML="m n o";
		document.getElementById("b7").innerHTML="p q r s";
		document.getElementById("b8").innerHTML="t u v";
		document.getElementById("b9").innerHTML="w x y z";
		document.getElementById("b1").innerHTML=". , !";
	}
}

function t9(text, button_pressed) {
  var toEmbedText = '';
  var currentTime = Date.now();
  var toEmbedText = getEmbedText(button_pressed);
  var shouldChange = function() {
    return lastUpdate.now && currentTime - lastUpdate.now > 250 && currentTime - lastUpdate.now < 3000 && lastUpdate.button_pressed === button_pressed && !isNonAlpha(button_pressed);
  }
  if (shouldChange()) {
    text = text.slice(0, -1);
    if ((lastUpdate.counter && lastUpdate.counter > 3) || !toEmbedText[lastUpdate.counter]) {
      lastUpdate.counter = -1;
    }
    lastUpdate.counter++;
  } else {
    lastUpdate.counter = 0;
	
  }

  lastUpdate.now = currentTime;
  lastUpdate.button_pressed = button_pressed;

  return (text + (toEmbedText[lastUpdate.counter] || toEmbedText[0]));
}

// Sets based on pressed button 
// instead of directly fetching from dom
function getEmbedText(button_pressed) {
  var toEmbedText;
  
  if(num_on==1){
  switch (button_pressed) {
    case 1:
      toEmbedText = '1';
      break;
    case 2:
      toEmbedText = '2';
      break;
    case 3:
      toEmbedText = '3';
      break;
    case 4:
      toEmbedText = '4';
      break;
    case 5:
      toEmbedText = '5';
      break;
    case 6:
      toEmbedText = '6';
      break;
    case 7:
      toEmbedText = '7';
      break;
    case 8:
      toEmbedText = '8';
      break;
    case 9:
      toEmbedText = '9';
      break;
    case '*':
      toEmbedText = '*';
      break;
    case 0:
      toEmbedText = '0';
      break;
    case '#':
      toEmbedText = '#';
      break;
  }
}else{
  switch (button_pressed) {
    case 1:
      toEmbedText = '.,!';
      break;
    case 2:
      toEmbedText = 'abc';
      break;
    case 3:
      toEmbedText = 'def';
      break;
    case 4:
      toEmbedText = 'ghi';
      break;
    case 5:
      toEmbedText = 'jkl';
      break;
    case 6:
      toEmbedText = 'mno';
      break;
    case 7:
      toEmbedText = 'pqrs';
      break;
    case 8:
      toEmbedText = 'tuv';
      break;
    case 9:
      toEmbedText = 'wxyz';
      break;
    case '*':
      toEmbedText = '*';
      break;
    case 0:
      toEmbedText = '0';
      break;
    case '#':
      toEmbedText = '#';
      break;
  }
}
  return toEmbedText;
}

function isNonAlpha(button_pressed) {
  return button_pressed === '*' || button_pressed === 0 || button_pressed === '#';
}
