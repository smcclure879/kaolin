//position of "self"
let x=100; //moving 'right'
let y=3; //jumping
let z=-10; //away from stage  (band at high Z??)
let speed=2;



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
    
    let dz=(item.z-z)/10;   //minimal depth processing
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
    if (dz<0 || left<0 || left>1100 ||  bottom<-100 || bottom>800) {
	s.visibility="hidden";
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


/* bugbug
const dump3 = (obj,depth=3)=>{
    if (depth <1) return ''; 
    var out = '';
    for (var i in obj) {
	result=dump3(obj[i],depth-1);
	if (result && result!='null')
	    out += i + ": " + result + "\n";
    }
    if (!out) out +=  obj;
    return out;
}
var ll=null;
const clog = (x)=>{
    if (!ll) ll=document.getElementById("ll");
    ll.innerHTML += x;
};

//bugbug SR: why this doesn't work???
let moves=[];
const retain = (ev)=>{
    ev.preventDefault(); moves.push(dump3(ev));
    // if (ev.detail) alert("detail"+dumps(ev.detail));
    // if (ev.timeStamp) alert("timeStamp"+dumps(ev.timeStamp));
    // if ('composedPath' in ev) alert("path"+dumps(ev.composedPath()));
};
const show = (ev)=>{ ev.preventDefault(); if (!moves.length) return; clog(moves); };

*/


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




let mainCanvas=null;
const addFakeUsers = ()=>{
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

    //helps draw more than zIndex !!!! (but not 100% bugbug)
    items.sort( (a,b) => { return b.z - a.z } );
    items.forEach( (u)=>{ mainCanvas.appendChild(u.elem); } );

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
    mainCanvas.appendChild(elem);
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


const startup = () => {
    mainCanvas=document.querySelector("#c");
    setupKeys();
    setupTouch();
    addScreen0(addScreen1b);  // <<-- bugbug either call 1a or 1b.  1b is screen nailed to your monitor.  1a is it parallaxes
    addFakeUsers();
    unmuteVideo(theVid);
    mainCanvas.focus();
    redraw();
}


window.onload = startup;
