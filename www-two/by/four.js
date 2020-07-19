//position of "self"
let x=100; //moving 'right'
let y=3; //jumping
let z=110; //away from stage  (band at high Z??)
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

    //projection
    let dz=(item.z-z); 
    if (dz==0) dz=0.00001;
    //should be the on-resize-obtained canvas width/2 andn height/2
    let canvasWidth=1100;
    let canvasHeight=500;
    let left   = canvasWidth/2  + (item.x - x)/dz*1000;
    let bottom = canvasHeight*1/6 +    dz*2     + (item.y - y)/dz*2;
    let w = item.w / dz *80 ;
    let h = item.h / dz *80 ;
    
    let s=item.elem.style;
    //bugbug get consts on resize, compare to actual main-div size
    if (dz<0 || left<0 || left>1400 ||  bottom<-100 || bottom>1000) {
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

const jump= (shiftGear)=>{
    y+=speed;
    redraw();
    setTimeout((_)=>{
	y-=speed;
	redraw();
    },200);
}
const moveLeft= (shiftGear)=>{
    x-=speed;
    redraw();
}
const moveRight= (shiftGear)=>{
    x+=speed;
    redraw();    
}
const moveForward= (shiftGear)=>{
    z+=speed;
    redraw();    
}
const moveBack= (shiftGear)=>{
    z-=speed;
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
    window.focus();
}

//bugbug SR: why this doesn't work???
const show = (ev)=>{ ev.preventDefault(); alert(ev); };
const setupTouch = ()=>{

    mainCanvas.addEventListener("touchstart" ,show,false);
    mainCanvas.addEventListener("touchend"   ,show,false);
    mainCanvas.addEventListener("touchcancel",show,false);
    mainCanvas.addEventListener("touchmove",show,false);
}



const arenaDepth=10;
const arenaWidth=800;


let mainCanvas=null;
const addFakeUsers = ()=>{
    for(let ii=0; ii<2000; ii++) {

	let e = document.createElement('div');
	e.setAttribute('class','obj');
	let s = e.style;
	s['background-color']=['olive','darkred','darkblue','darkbrown'][ii%4];
	s.visibility='hidden'; //not yet....look in redraw
	


	let u = {};  //a fake user
	u.elem=e;
	u.x=90 + ii*1 + arenaWidth*Math.cos(ii*4.109);
	u.y=0;
	u.z=150 + arenaDepth*Math.sin(ii);
	u.w=20;
	u.h=30;
		
	items.push(u);
    }
    for(let ii=2000; ii<2100;ii++){
	let e = document.createElement('img');
	e.setAttribute('class','obj');
	e.setAttribute('src','tree.png');
	let s = e.style;
	s['background-color']='black';
	s.visibility='hidden'; //not yet....look in redraw
	let u = {};  //a fake user
	u.elem=e;
	u.x=(ii-2000)*30;
	u.y=0;
	u.z=120;
	u.w=10;
	u.h=20;
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

    
    let runner = items[65];
    enliven(65);
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
      <iframe id="theVid" align="center" width="640" height="360"
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
    let jumpHeight=30;
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
    addScreen0(addScreen1b);  // <<-- bugbug either call 1a or 1b.  1b is screen nailed to your monitor.  1a is it parallaxes
    addFakeUsers();
    unmuteVideo(theVid);
    mainCanvas.focus();
    redraw();
}


window.onload = startup;
