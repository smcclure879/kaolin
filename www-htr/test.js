//position of "self"
let x=0; //moving 'right'
let y=3; //jumping
let z=-60; //away from stage  (band at high Z??)
let speed=4;


let mainCanvas=null;

const dumps = JSON.stringify;

//pronounce this "cubits"  they are probably pixels, but serve as units til we know % or px
const cu = (x) => ''+x+'px';



const anim  =  ()=>{
    document.getElementById("one").style.bottom = "50px";
    alert(dumps(document.getElementById("one").style.bottom));
}


let items = [];  //the items to redraw
const redrawOne = (item)=>{

    if (!item.elem){
	alert(dumps(item));
	return;//like continue
    }
    
    let dz=(item.z-z+5)/10;   //minimal depth processing
    if (dz==0) dz=0.00001;
    //should be the on-resize-obtained canvas width/2 andn height/2
    let canvasWidth=1100;
    let canvasHeight=500;


    let left   = canvasWidth/2  + (item.x - x)/dz*10;
    let bottom = canvasHeight*1/6 +    dz*5     + (item.y - y)/dz*5;
    let w = item.w / dz *2 ;
    let h = item.h / dz *2 ;


    
    let s=item.elem.style;
    //bugbug get consts on resize, compare to actual main-div size
    if (dz<0 || left<-1000 || left>1500 ||  bottom<-100 || bottom>800) {
	s.visibility="hidden";  //bugbug remove completely
    }else{
	s.left   = cu(left);
	s.bottom = cu(bottom);
	s.width=cu(w);
	s.height=cu(h);
	s.zIndex=''+(item.z);  //no units!
	s.visibility="visible";
    }
    
}

const redraw = ()=>{
    items.forEach( (item,_ii,_array)=>{
	redrawOne(item);
    });
}

const jump= (shiftGear=1)=>{
    y+=speed*shiftGear;
    redraw();
    setTimeout((_)=>{
	y-=speedGear;
	redraw();
    },200);
}
const moveLeft= (shiftGear=1)=>{
    x-=speed*shiftGear;
    redraw();
}
const moveRight= (shiftGear=1)=>{
    x+=speed*shiftGear;
    redraw();    
}
const moveForward= (shiftGear=1)=>{
    z+=speed*shiftGear;
    redraw();    
}
const moveBack= (shiftGear=1)=>{
    z-=speed*shiftGear;
    redraw();
}


const setupKeys = ()=>{
    window.addEventListener("keydown", function(e){
	let c = String.fromCharCode(e.keyCode).toLowerCase();
	let shiftGear = (e.shiftKey)?    5 : 1  ;
	switch(c) {
	case 'v': anim(); break;
	    //case 'q': rotLeft(); break;
	    //case 'e': rotRight(); break;
	    //case 'c': cycleCam(); break;
	    //case 'z': zipNow(); break;  // later = zipToDest(selectedItem)
	    //case 'r': rise(shiftGear); break;
	    //case 'f': fall(shiftGear); break;
	case 'j': jump(shiftGear); break;
	case 'a': moveLeft(shiftGear); break;
	case 'd': moveRight(shiftGear); break;
	case 'w': moveForward(shiftGear); break;
	case 's': moveBack(shiftGear); break;

	default: //bugbug alert("ERRkey:"+e.keyCode);
	}
    });
    mainCanvas.focus();
}



let initialX = null;
let initialY = null;

function startTouch(e) {
    e.preventDefault();
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
};

function moveTouch(e) {
    e.preventDefault();
    if (initialX === null) 	return;
    if (initialY === null) 	return;
        
    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;

    let diffX = initialX - currentX;
    let diffY = initialY - currentY;


    x -= diffX/400;
    z += diffY/400;
    redraw();
}
    
const setupTouch = ()=>{
    mainCanvas.addEventListener("touchstart" ,startTouch,false);
    //mainCanvas.addEventListener("touchend"   ,show,false);
    //mainCanvas.addEventListener("touchcancel",retain,false);
    mainCanvas.addEventListener("touchmove"  ,moveTouch,false);
}


const addSelf = () =>{

    let e=document.createElement('div');
    e.innerHTML=    '<video style="position:absolute; left:0%; top:0%; z-index:-1" id="localStream" width="120" height="200"  muted></video>'   ;
    e.style="position:absolute; left:40%; top:70%";
    //document.body.insertBefore(e, document.body.childNodes[0] );
    document.body.appendChild(e);
}


    

//helps draw more than zIndex !!!! (but not 100% bugbug)
const sortItems = () => {
    items.sort( (a,b) => { return b.z - a.z } );
    items.forEach( (u)=>{ u.elem.style.zIndex=1000+u.z; mainCanvas.appendChild(u.elem); } );
}

const addFakeUsers = ()=>{
    for (let ii=0; ii<20; ii++){
	let e = document.createElement('div');
	e.innerHTML=''+ii;
	e.setAttribute('class','obj');
	let s = e.style;
	s['background-color']=['cyan','red','blue','brown'][ii%4];
	s.visibility='hidden'; //not yet....look in redraw

	let u = {};  //a fake user
	u.elem=e;
	u.x=20+ii*2;
	u.y=0;
	u.z=ii*2;
	u.w=20;
	u.h=30;
		
	items.push(u);

    }


}
const addFakeUsers_old = ()=>{
    for(let ii=0; ii<200; ii++) {
	let e = document.createElement('div');
	e.setAttribute('class','obj');
	let s = e.style;
	s['background-color']=['cyan','red','blue','brown'][ii%4];
	s.visibility='hidden'; //not yet....look in redraw

	let u = {};  //a fake user
	u.elem=e;
	u.x=90+ii*1+150*Math.cos(ii*4.109);
	u.y=0;
	u.z=150-ii*1+ii+100*Math.sin(ii);
	u.w=20;
	u.h=30;
		
	items.push(u);
    }

    //make the crowd excited....
    let randSeqA = [4,5,6,7,8,9,10,11,14,16,18,19,21,22,30,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,50,51,52,53,
		   54,55,56,58,59,61,71,72,74,76,81,99,101,120,140,180,190];
    randSeqA.forEach( enliven );  //on the beat
    setTimeout(()=>{  //some out of sync ppl
	[12,13,15,17,20,40,60,80].forEach( enliven );
    },50);

    let runnerId=15;
    let runner = items[runnerId];
    enliven(runnerId);
    //runner.w=800;
    //runner.h=1000;
    runner.y=10;
    runner.elem.style.color='white';
    runner.elem.style.opacity='1.0';
    //runner.elem.style.zIndex=0;
    runner.elem.innerHTML='phil';
    setTimeout(()=>{
	let q= setInterval(()=>{
	    if (runner.z<20) {
		clearInterval(q);
		return;  
	    }
	    runner.z-=1;
	    runner.x-=1/2;
	    redrawOne(runner);
	},230);
    },1400);

}



function isValidLocation(roomq) {
    return roomq=="pecos";

    //it's going to need to scan img dir for _____0.jpg  or ask db. 
    /*
    fs.stat(roomq , function (err, stats){
	if (err) return false;
	if (!stats.isDirectory()) return false;	    callback();
	}
    });
*/
}
// roomButton.onclick=function(evt){
//     alert("onclick bugbug2306");
//     room = document.querySelector("#roomName").value;
//     setRoom();
// }
function isValidColor(strColor) {
    var s = new Option().style;
    s.color = strColor;
    
    // return 'false' if color wasn't assigned
    return s.color == strColor.toLowerCase();
}




const addScreen0 = (cb)=>{
    //bugbug SR: please just do this as one big outerHTML ....
    let elem = document.createElement("div");
    elem.setAttribute("id","one");
    elem.setAttribute("align","center");
    elem.setAttribute("style","position:absolute; width:80%; height:50%;top:10%background-color:black;z-index:1;");
    elem.innerHTML=`
      <iframe id="theVid" align="center" width="650" height="240"
	      src="https://youtube.com/embed/WX36hA85MeM?t=32940&rel=1&autoplay=1&loop=1&mute=1"
	      frameborder="0" allow="accelerometer; autoplay; encrypted-media;"
	      allowfullscreen>
      </iframe>`;
    cb(elem);
}

//right now we are trying stuff...1a OR 1b....seee startup()


//put the screen at the "top" of the 3D render stack (treat as any other "sprite" in the system.
const addScreen1a = (elem)=>{
    //mainCanvas.appendChild(elem);  //later in sortItems
    //bugbug SR: decide screen location in 3space....
    let item={elem:elem, x:-1200, y:0, z:800, w:1024, h:480};
    items.push(item);
}

//put the screen at the "top" of HTML
const addScreen1b = (elem)=>{
    document.body.insertBefore(elem,document.body.childNodes[0]);
}


const unmuteVideo= (ii) =>{
    //bugbug does not work document.querySelector("#theVid").contentWindow.document.querySelector("#player").unmute();
};

const enliven= (ii) =>{
    setInterval(
	()=>{   otherJump(ii);  }
	,1200
    );
}

const JDONE = -999;
const otherJump=  (ii) => {
    let item=items[ii];
    let jumpHeight=3;
    if (item.hasOwnProperty('oy') && item.oy!=JDONE) return;  //already jumping
    item.oy=item.y;  //remember original y
    
    item.y+=jumpHeight;
    redrawOne(item);
    setTimeout(()=>{
	if (!item.hasOwnProperty('oy') || item.oy==JDONE) return;
	item.y=item.oy;  //restore original y
	redrawOne(item);
	item.oy=JDONE;  //mark done so can jump again
	
    },200);    
}




let room = null;
const roomPrep = () => {
    let maybeRoom = window.location.pathname;
    if ( !  /^\/[a-z]{3,16}$/.test(maybeRoom)){
	alert("bad room");
	return;
    }
    
    room=maybeRoom.substr(1);
    if (isValidColor(room)) {
	document.body.style.backgroundColor=room;
    } else if (isValidLocation(room)) {
	// document.body.style.backgroundImage="url('img/"+room+"0.jpg')";
	// document.body.style.backgroundSize="contain";
	// document.body.style.backgroundRepeat="no-repeat";
	// document.body.style.backgroundPosition="center";
	let e = document.createElement('div');
	e.setAttribute('class','obj');
	e.innerHTML="<img src='img/"+room+"0.jpg' style='object-fit:cover; position:relative; z-index:inherit' ></img>";
	let s = e.style;
	//s.visibility='hidden'; //not yet....look in redraw
	photo={elem:e, z:20, x:0, y:0, w:2000, h:2000};
	items.push(photo);
    }

}


const startup = () => {
    mainCanvas=document.querySelector("#c");
    roomPrep();  //adds to items
    setupKeys();
    setupTouch();
    //addScreen0(addScreen1b);  // <<-- bugbug either call 1a or 1b.  1b is screen nailed to your monitor.  1a is it parallaxes
    addFakeUsers();  //adds to items

    addSelf();
    sortItems();  //puts items into canvas and zIndex in .z order
    startConnecting();
    //unmuteVideo(theVid);
    mainCanvas.focus();
    redraw();
}


window.onload = startup;
