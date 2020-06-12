AFRAME.registerComponent("foo", {
    schema: {
	target: {},
    },
    init: function() {
	this.el.addEventListener('click', (e) => {
	    window.location = this.data.target;
	})
    }
})


      

function checkForClass (divName, classToCheck)
{
    if (document.getElementById(divName) && document.getElementById(divName).className.indexOf(classToCheck) > -1)
	return true;
    else
	return false;
}

function addClassName (divName, classToAdd)
{
    if (document.getElementById(divName) && document.getElementById(divName).className.indexOf(classToAdd) == -1) {
	document.getElementById(divName).className += ' ' + classToAdd;
    }
}

function removeClassName (divName, classToRemove)
{
    if (document.getElementById(divName) && document.getElementById(divName).className.indexOf(classToRemove) > -1) {
	var oldClass = document.getElementById(divName).className;
	document.getElementById(divName).className = oldClass.substring(0, oldClass.indexOf(classToRemove) - 1);
    }
}

// SNAPSHOTS
const maxSnapshot = 6;
const countUsers = 20;
const countSnapshotSeries = 5;
var currentSnapshot = 1;

var timerSnapshot = setTimeout("updateSnapshots()", 2000);

function setSnapshotNum ()
{
    if (currentSnapshot < maxSnapshot)
	currentSnapshot++;
    else
	currentSnapshot = 1
}

function setUserSeries (userNum)
{
    if (userNum <= countSnapshotSeries)
	return userNum;
    else
	return 1 + (userNum % countSnapshotSeries);
}

function updateSnapshots ()
{
    var j = 0;
    var thisUserNum = 0;

    setSnapshotNum();
    for (j=1; j<=countUsers; j++) {
	thisUserSeries = setUserSeries(j);
	var snapshot = document.getElementById("user" + j);
	snapshot.setAttribute("src", "webcamThumbs/user" + thisUserSeries + "_" + currentSnapshot + ".jpg");
    }

    timerSnapshot = setTimeout("updateSnapshots()", 2000);
}

function scrollSnapshots (direction)
{
    console.log("We be scrolling " + direction);
}


// VIDEO PLAYER
var isVideoMuted = false;
function muteVideo ()
{
    muteButtons = document.getElementById("muteButtons");

    if (isVideoMuted == true) {
	isVideoMuted = false;
	muteButtons.setAttribute('src', "#unmuteButton");
    } else {
	isVideoMuted = true;
	muteButtons.setAttribute('src', "#muteButton");
    }

    console.log("isVideoMuted = " + isVideoMuted);

    var video = document.querySelector('#videoFile');
    video.muted = isVideoMuted;
}


// EQUALIZER
const equalizerIcons = new Array("dancing", "clapping", "cheering", "booing", "singing", "lighter", "guitar", "drums");
const equalizerOpacityOff = 0.2;
const equalizerOpacityOn = 1.0;
const equalizerBars = 10;

function getEqualizerRandomLevel ()
{
    return Math.floor(Math.random() * Math.floor(equalizerBars));
}

function generateIconEqualizer ()
{
    var j = 0;
    var i = 0;
    var level = 0;
    var icon = "";

    // generate random equalizer height
    for (j=0; j<equalizerIcons.length; j++) {
	level = getEqualizerRandomLevel();
	icon = equalizerIcons[j];

	for (i=1; i<=level; i++) {
	    document.getElementById(icon + "Equalizer" + i).setAttribute("material", "opacity", equalizerOpacityOn)
	}

	for (i=level+1; i<=equalizerBars; i++) {
	    document.getElementById(icon + "Equalizer" + i).setAttribute("material", "opacity", equalizerOpacityOff)
	}
    }

    var timerIcon = setTimeout("generateIconEqualizer()", 1000);
}

function setIamIcon (icon)
{
    var j = 0;
    var visible = false;

    for (j=0; j<equalizerIcons.length; j++) {
	console.log(equalizerIcons[j] + "Ring = " + document.getElementById(equalizerIcons[j] + "Ring").getAttribute('visible'));
	if (equalizerIcons[j] != icon)
	    visible = false;
	else if (document.getElementById(equalizerIcons[j] + "Ring").getAttribute('visible') == true)
	    visible = false;
	else
	    visible = true;

	document.getElementById(equalizerIcons[j] + "Ring").setAttribute("visible", visible);
    }
}


function openDialog (dialogDivID)
{
    $(function() {$('#' + dialogDivID).dialog('open');});
}

function closeDialog (dialogDivID)
{
    $(function() {$('#' + dialogDivID).dialog('close');});
}

function openDonateForm ()
{
    $(function() {$('#donateFormDiv').dialog('open');});
}

function closeDonateForm ()
{
    $(function() {$('#donateFormDiv').dialog('close');});
}


function enableDialogs() {
    $('#donateFormDiv').dialog({ autoOpen: false, width: 400, closeOnEscape: true});
    $('#iconDialogDiv').dialog({ autoOpen: true, closeOnEscape: false, modal: false, height: 450, width: 280, 
				 position: { my: "right top", at: "right top", of: window },
				 beforeClose: function (event, ui) { return false; },
				 dialogClass: "notitlebar",
				 classes: {"ui-dialog": "dialogNoBorder", "ui-widget-content": "dialogNoBorder"}
			       });
};


let activeCam =0;
let camCount = 0;
const dumps = (x) => {
    return JSON.stringify(x,
			  (k,v) => {
			      if (k=='el') return '*EL*';
			      if (k=='sceneEl') return '*SEL*';
			      if (k=='parentEl') return '*PEL*';
			      return v;
			  }
			 );
};


function prepCams() {
    activeCam=0;
    //bugbug we shoudl either cache this var at outer scope or better, allow for cams and camCount to change
    let cams=document.querySelectorAll(".secCam");
    camCount =cams.length;
}



/*
    let el=getActiveCam()    
    let old = el.getAttribute("rotation");
    if (!old) return;
    let lc=el.components['look-controls'];
    if (!lc.pitchObject) return;

    old.y += 180;
    
    //don't need   old.x *= PI/180.0;
    old.y *= PI/180.0;
    //not supp     old.z *= PI/180.0; 

    //don't need ....lc.pitchObject.rotation.x = old.x;
    lc.yawObject.rotation.y = old.y;     //z not supp.
}
*/

function openCam(n) {
    var el = document.querySelector("#cam"+n);
    var old = el.oldOrientation;  //bugbug is this anywhere else?
    
    el.setAttribute("camera", {'active': true } );
    el.setAttribute("look-controls",{});
    
    if (!el || !el.components['look-controls']) {
	alert("bugbug0814r");
	return;  //bugbug
    }

    let lc=el.components['look-controls'];
    if (!lc.pitchObject) return;
    if (!old) return;
        
    lc.pitchObject.rotation.x = old.x;
    lc.yawObject.rotation.y = old.y;     //0.001 * time;
    //no supported....lc.rollObject.rotation.z = old.z;
        
}


const PI=3.14159265;
function closeCam(n) {
    var el = document.querySelector("#cam"+n);
    var old = el.getAttribute("rotation");
    
    old.x *= PI/180.0;
    old.y *= PI/180.0;
    //not supp old.z *= PI/180.0; 

    /*bugbug rotation to fixed angle  
    old.x=0.45;
    old.y=0.22;
    */

    el.oldOrientation = old;
    el.setAttribute("camera", {'active': false } );
    el.removeAttribute("look-controls");
    //el.removeAttribute("wasd-controls");
}


function cycleCam() {
    var oldCam = activeCam;
    activeCam++;
    activeCam %= camCount;
    closeCam(oldCam);
    openCam(activeCam);
}


let zip=0;
function zipNow(){
    zip=1;
    //bugbug didn't work
}

const vy=0.5;
function rise(f){
    let el=getActiveCam()
    let pos=el.getAttribute("position");
    pos.y+=vy*f;
    el.setAttribute("position",pos);
}


function fall(f){
    let el=getActiveCam()
    let pos=el.getAttribute("position");
    pos.y-=vy*f;
    el.setAttribute("position",pos);
}

const rotInc=3.0; 
function rotLeft(){
    rotate(rotInc);
}

//bugbug did this work

function rotRight(){
    rotate(-rotInc);
}

function flip(){
    rotate(180);
}


const sin=Math.sin;
const cos=Math.cos;
function advance(dx,dz){
    let el=getActiveCam();
    let rot = el.getAttribute("rotation");
    if (!rot) return;
    let pos = el.getAttribute("position");
    let lc=el.components['look-controls'];
    if (!lc.pitchObject) return;
    let phi=rot.y * PI / 180;
    let c= cos(phi); let s= sin(phi);
    pos.x +=(   c*dx + s*dz  );
    pos.z +=(  -s*dx + c*dz  );
}

function rotate(ang) {
    let el=getActiveCam();   
    let old = el.getAttribute("rotation");
    if (!old) return;
    let lc=el.components['look-controls'];
    if (!lc.pitchObject) return;

    old.y += ang;

    //don't need ....lc.pitchObject.rotation.x = old.x;
    lc.yawObject.rotation.y = old.y * PI/180.0;     //z not supp.
}

const panInc=0.30;
function moveLeft(f){
    advance(-panInc*f,0);
}
function moveRight(f){
    advance(panInc*f,0);
}
const speed=0.50; 
function moveForward(f){
    advance(0,-speed*f);
}
function moveBack(f){
    advance(0,speed*2/3*f);
}


function getActiveCam(){
    return  document.querySelector("#cam"+activeCam);
}

function setupKeys(){
    window.addEventListener("keydown", function(e){
	let c = String.fromCharCode(e.keyCode).toLowerCase();
	let shiftGear = (e.shiftKey)?    5 : 1  ;
	switch(c) {
	case 'v': flip(); break;
	case 'q': rotLeft(); break;
	case 'e': rotRight(); break;
	case 'c': cycleCam(); break;
	case 'z': zipNow(); break;  // later = zipToDest(selectedItem)
	case 'r': rise(shiftGear); break;
	case 'f': fall(shiftGear); break;
	case 'a': moveLeft(shiftGear); break;
	case 'd': moveRight(shiftGear); break;
	case 'w': moveForward(shiftGear); break;
	case 's': moveBack(shiftGear); break;

	default: pulse("ERRkey:"+e.keyCode);
	}
    });
    window.focus();
}

function pulse(text){
    //bugbug get active camera, add dynamic text in the HUD, with timer to disappear forever.
    //or alter text to be msg, then back to "" some seconds later
    //alert(text); //bugbug
}

function animateFrames(numFrames,milliseconds,fn) {
    let intervalId = setInterval(
	() => {
	    if (zip==1) numFrames=1;
	    let result=fn(numFrames);
	    if (--numFrames<=0) clearInterval(intervalId);
	}
	,milliseconds
    );    
}




function startUser() {
    let cam0=document.querySelector("#cam0");
    
    setTimeout( (_ev)=>{
	//ENTER user...10 frames, 300ms each, 
	animateFrames( 20, 300, (n) => {
	    cam0.setAttribute( "position" , "-1 1.6 " + (n*7+45) );
	});
    },3000);
}


function addItem(mixin,pos,rot,parent) {
    let kid = document.createElement('a-entity');
    kid.mixin=mixin;
    kid.position=pos;
    kid.rotation=rot;
    parent.appendChild(kid);
}

function buildDynamicWorldBits(){
    //bugbug did this work???  NO.  
    let world = document.querySelector("#cam1");
    //for(let ii=-5000; ii<5000; ii+=1000) {
    let pos=`-0.1 -0.3 -3`;
    let rot="0 0 0";
    addItem('fire',pos,rot,world);  //bugbug you are here where did the fire appear?
    //}
    
}

function startup() {
    //more here soon --ayvex
    window.focus();
    buildDynamicWorldBits();  //bugbug doesn't work yet

    enableDialogs();
    setupKeys();
    prepCams();
    startUser();
}




// ICONS
const iconDivList = new Array('chat', 'tag', 'people', 'settings', 'connect');
const iconColorOn = "lime";
const iconColorOff = "silver";
const chatMessageMaxlength = 255;
var iconHighlighted = "";

function hoverIcon (icon)
{
    document.getElementById(icon + "Icon").setAttribute('src', '/images/' + icon + '_' + iconColorOn + '.png');
}

function unhoverIcon (icon)
{
    if (icon != iconHighlighted)
	document.getElementById(icon + "Icon").setAttribute('src', '/images/' + icon + '_' + iconColorOff + '.png');
}


function showIconDiv (icon)
{
    var j = 0;

    for (j=0; j<iconDivList.length; j++) {
	document.getElementById(iconDivList[j] + "Div").style.display = "none";
	if (document.getElementById(iconDivList[j] + "Icon"))
	    document.getElementById(iconDivList[j] + "Icon").setAttribute('src', '/images/' + iconDivList[j] + '_' + iconColorOff + '.png');
    }

    if (icon != "")
	document.getElementById(icon + "Div").style.display = "block";

    if (document.getElementById(icon + "Icon"))
	document.getElementById(icon + "Icon").setAttribute('src', '/images/' + icon + '_' + iconColorOn + '.png');

    iconHighlighted = icon;
}

function saveSettings ()
{
    doSomething = true;
}

function toggleEmoticons ()
{
    doSomething = true;
}

function updateChatMessageLength ()
{
    chatComment = document.getElementById("chatComment").value;

    document.getElementById("chatMessageLength").innerHTML = chatComment.length;
}

function connectWith (id)
{
    showIconDiv('connect');
    document.getElementById("connectWithName").innerHTML = id;
}

function toggleTag (tagID)
{
    if (checkForClass(tagID, "tagSpanOff")) {
	removeClassName(tagID, "tagSpanOff");
	addClassName(tagID, "tagSpanOn");
    } else {
	removeClassName(tagID, "tagSpanOn");
	addClassName(tagID, "tagSpanOff");
    }
}


// CHAT

/*
  size = 3
  height = 0.15
  0.066 per character
  255 characters = 16.83

  size = 2
  0.04 per character
  height = 0.10

  size = 1 & wrap-count=15
  0.053 per character
*/

const chatMaxCharactersPerLine = 15;
const chatMaxCharsToNextLine = 10;
const chatWidthPerCharacter = 0.04;
const chatHeightPerLine = 0.10;
const chatMaxWidth = 1.0;

const chatBgcolorList = new Array('aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'blanchedalmond', 'blueviolet', 'burlywood',
				  'cadetblue', 'chartreuse', 'chocolate', 'crimson', 'coral', 'cornflowerblue', 'cornsilk', 'cyan',
				  'darkcyan', 'darkgoldenrod', 'darkgray', 'darkkhaki', 'darkorange', 'darkorchid', 'darksalmon', 'darkseagreen', 'darkturquoise', 'darkpink', 'darkviolet', 'deepskyblue', 'dodgerblue', 
				  'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold',  'goldenrod', 'gray', 'green', 'greenyellow',
				  'honeydew', 'hotpink', 'indianred', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue',
				  'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgreen', 'lightgray', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue',
				  'lightslategray', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'mediumauqamarine', 'mediumorchid', 'mediumpurple',
				  'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'medium', 'mediumvioletred', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite',
				  'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 
				  'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'red', 'roseybrown', 'royalblue', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 
				  'silver', 'skyblue', 'slateblue', 'slategray', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 
				  'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen');

const colorListTooDark = new Array('black', 'blue', 'brown', 'darkblue', 'darkgreen', 'darkmagenta', 'darkolivegreen', 'darkred', 'darkslateblue',
				   'darkslategray', 'dimgrey', 'firebrick', 'indigo', 'maroon', 'mediumblue', 'midnightblue', 'navy', 'purple', 'saddlebrown');

function submitChat ()
{
    comment = document.getElementById("chatComment").value;
    if (trim(comment) != "")
	addChatBubble(trim(comment), '', 0);

    document.getElementById("chatComment").value = "";
}

function getTextBgcolor ()
{
    var bgcolorIndex = Math.floor((Math.random() * chatBgcolorList.length));
    return chatBgcolorList[bgcolorIndex];
}

function generateObjectID (userID, type)
{
    var now = new Date();

    return type + '_' + userID.toString() + '_' + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds();
}

function addChatBubble (message, emoji, userID)
{
    var splitMsg = splitChatMessageIntoLines(message, '');
    var j = 0;
    var messageValue = "";

    messageValue = splitMsg[0];
    for (j=1; j<splitMsg.length; j++) {
	messageValue += '\n' + splitMsg[j];
    }

    var msgHeight = splitMsg.length * chatHeightPerLine;
    var msgWidth = chatMaxWidth;
    var planeID = generateObjectID(userID, 'chat');
    var bgcolor = getTextBgcolor();

    // user webcam video position: 0 0.45 -3
    var planePosX = 0;
    var planePosY = 1.0;
    var planePosZ = -3;
    var textPosX = planePosX - parseFloat(msgWidth / 2);
    var textPosY = 1.0; // 0
    var textPosZ = -3; // 0
    var trianglePosX = planePosX;
    var trianglePosY = planePosY - parseFloat(msgHeight / 2);
    var trianglePosZ = planePosZ;

    var newPlane = document.createElement('a-plane');
    newPlane.setAttribute('id', planeID);
    newPlane.setAttribute('height', msgHeight);
    newPlane.setAttribute('width', msgWidth);
    newPlane.setAttribute('color', bgcolor);
    newPlane.setAttribute('material', 'transparent', 'true');
    newPlane.setAttribute('position', planePosX.toString() + ' ' + planePosY.toString() + ' ' + planePosZ.toString());
    newPlane.setAttribute('animation__opacity', 'isRawProperty: true; property: components.material.material.opacity; from: 1.0; to: 0; dur: 3000; delay: 6000;');
    newPlane.setAttribute('animation__visible', 'property: visible; from: false; to: true; delay: 9000;');

    var newText = document.createElement('a-text');
    newText.setAttribute('value', messageValue);
    newText.setAttribute('color', 'black');
    newText.setAttribute('width', 2);
    // newText.setAttribute('transparent', 'true');
    // newText.setAttribute('animation__opacity', 'property: components.opacity; from: 1.0; to: 0; dur: 3000; delay: 6000;');
    // newText.setAttribute('animation__visible', 'property: visible; from: false; to: true; delay: 9000;');
    // newText.setAttribute('wrap-count', 15);
    // newText.setAttribute('position', textPosX.toString() + ' ' + textPosY.toString() + ' ' + textPosZ.toString());

    if (emoji == "")
	newText.setAttribute('align', 'center');
    else
	newText.setAttribute('position', textPosX.toString() + ' ' + textPosY.toString() + ' ' + textPosZ.toString());

    var triangleID = planeID.replace('chat', 'chattriangle');
    var newTriangle = document.createElement('a-triangle');
    newTriangle.setAttribute('id', triangleID);
    newTriangle.setAttribute('color', bgcolor);
    newTriangle.setAttribute('transparent', 'true');
    newTriangle.setAttribute('position', trianglePosX.toString() + ' ' + trianglePosY.toString() + ' ' + trianglePosZ.toString());
    newTriangle.setAttribute('vertex-a', '-0.05 0 0');
    newTriangle.setAttribute('vertex-b', '0 -0.05 0');
    newTriangle.setAttribute('vertex-c', '0.05 0 0');
    newTriangle.setAttribute('animation__opacity', 'property: opacity; from: 1.0; to: 0; dur: 3000; delay: 6000;');
    newTriangle.setAttribute('animation__visible', 'property: visible; from: false; to: true; delay: 9000;');

    var theScene = document.querySelector('a-scene');
    newPlane.appendChild(newText);
    // theScene.appendChild(newText);
    theScene.appendChild(newPlane);
    theScene.appendChild(newTriangle);

    // add to list of objects to fade out
    chatBoxFadeObjects[planeID] = 0;
    chatBoxFadeObjects[triangleID] = 0;
}

function splitChatMessageIntoLines (message, emoji)
{
    var messageLength = message.length;
    var messageByLine = new Array();

    if (messageLength <= chatMaxCharactersPerLine) {
	messageByLine[0] = message;
	return messageByLine;
    }

    /*
      1. Search for next space, hyphen or end of message. Determine next word
      2. If word.length + existing characters in current line <= max per line
      Then add word to line
      3. Else if current line <= 10
      Then split word between current line and next line
      4. Else if word.length > max per line
      Then split word between next line and line after
      5. Else add word to next line
      6. Remove word from message
      7. If no more words, break loop
    */

    var isLoop = true;
    var wordIndex = -1;
    var wordIndexHyphen = -1;
    var wordIndexSpace = -1;
    var word = "";
    var partial = "";

    var messageRemaining = trim(message);
    var lineIndex = 0;
    messageByLine[0] = "";

    while (isLoop == true) {
	wordIndexSpace = messageRemaining.indexOf(" ");
	wordIndexHyphen = messageRemaining.indexOf("-");

	// 1. Search for next space, hyphen or end of message. Determine next word
	if (wordIndexSpace == -1 && wordIndexHyphen == -1) // last word
	    word = messageRemaining;
	else if (wordIndexSpace != -1 && wordIndexHyphen == -1) // space, no hyphen
	    word = left(messageRemaining, wordIndexSpace + 1);
	else if (wordIndexSpace == -1 && wordIndexHyphen != -1) // hyphen, no space
	    word = left(messageRemaining, wordIndexHyphen + 1);
	else if (wordIndexSpace < wordIndexHyphen) // space before hyphen
	    word = left(messageRemaining, wordIndexSpace + 1);
	else // hyphen before space
	    word = left(messageRemaining, wordIndexHyphen + 1);

	// 2. If word.length + existing characters in line <= max per line, Then add word to line
	if (parseInt(word.length + messageByLine[lineIndex].length) <= chatMaxCharactersPerLine) {
	    messageByLine[lineIndex] += word;
	    // 3. Else if current line <= 10, Then split word between current line and next line
	} else if (messageByLine[lineIndex].length <= chatMaxCharsToNextLine) {
	    partial = left(word, chatMaxCharactersPerLine - messageByLine[lineIndex].length - 1);
	    messageByLine[lineIndex] += partial + "-";
	    lineIndex = lineIndex + 1;
	    messageByLine[lineIndex] = word.replace(partial, "");
	    // 4. Else if word.length > max per line, Then split word between next line and line after
	} else if (word.length > chatMaxCharactersPerLine) {
	    lineIndex = lineIndex + 1;
	    messageByLine[lineIndex] = left(word, 14) + "-";
	    lineIndex = lineIndex + 1;
	    messageByLine[lineIndex] = right(word, word.length - chatMaxCharactersPerLine + 1);
	    // 5. Else add word to next line
	} else {
	    lineIndex = lineIndex + 1;
	    messageByLine[lineIndex] = word;
	}

	// 6. Remove word from message
	messageRemaining = trim(messageRemaining.replace(word, ""));

	// 7. If no more words, break loop
	if (messageRemaining == "")
	    isLoop = false;
    } //- loop thru message

    return messageByLine;
} //- splitChatMessageIntoLines

// var chatBoxFadeTimer = setTimeout("chatBoxFadeOut()", 10000);
var chatBoxFadeObjects = new Object();

function chatBoxFadeOut () {
    var j = 0;
    var fadeList = Object.keys(chatBoxFadeObjects);
    var fadeID = "";
    console.log("chatBoxFadeOut: " + fadeList.toString());
    // display object for 2 cycles before beginning fade
    for (j=0; j<fadeList.length; j++) {
	fadeID = fadeList[j];
	console.log(fadeID + " = " + chatBoxFadeObjects[fadeID]);
	if (chatBoxFadeObjects[fadeID] == 0) {
	    chatBoxFadeObjects[fadeID] = 1;
	    console.log("1");
	} else if (chatBoxFadeObjects[fadeID] == 0) {
	    chatBoxFadeObjects[fadeID] = 2;
	    console.log("2");
	} else {
	    chatBoxFadeObjects[fadeID] = 3;

	    var chatBox = document.getElementById(fadeID);
	    var opacity = chatBox.getAttribute('material', 'opacity');
	    console.log("fading from " + opacity.toString());

	    if (opacity >= 0) {
		opacity -= 0.10;
		chatBox.setAttribute('material', 'opacity', opacity);
		console.log(" to " + opacity);
	    }

	    if (opacity <= 0) {
		delete chatBoxFadeObjects[fadeID];
		chatBox.setAttribute('visible', false);
	    }
	}
    }

    chatBoxFadeTimer = setTimeout("chatBoxFadeOut()", 1000); 
}

/*
  function chatBoxFadeOut ()
  {
  var chatBoxID = "chatBox666";

  var chatBox = document.getElementById(chatBoxID);
  console.log("chatBoxID = " + chatBox.style.opacity);
  var opacity = chatBox.style.opacity;

  if (opacity >= 0) {
  opacity -= 0.01;
  chatBox.style.opacity = opacity;
  chatBoxFadeTimer = setTimeout("chatBoxFadeOut()", 100); 
  console.log("opacity = " + opacity);
  }
  }

  AFRAME.registerComponent('chatBoxFadeOut', {
  init: function()
  {
  this.opacity = 1;
  },
  
  tick: function (time, timeDelta) 
  {
  if (this.num >= 0) {
  this.num -= 0.01;
  this.el.setAttribute("material", "opacity", this.opacity)
  } else {
  break;
  }
  }
  });
*/




$( startup ) ;
