//position of "self"
let x=100; //moving 'right'
let y=3; //jumping
let z=100; //away from stage  (band at -1)
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
    let bottom = canvasHeight*1/6 + dz*5 + (item.y - y)/dz*5;
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

let mainCanvas=null;
const addFakeUsers = ()=>{
    for(let ii=0; ii<500; ii++) {

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

}

const addScreen = ()=>{
    let elem = document.createElement("div");
    elem.setAttribute("id","one");
    elem.setAttribute("align","center");
    elem.setAttribute("style","position:absolute; width:80%; height:50%;top:10%background-color:black;z-index:1;");
    mainCanvas.appendChild(elem);

    elem.innerHTML=`
      <iframe id="theVid" align="center" width="650" height="240"
	      src="https://youtube.com/embed/WX36hA85MeM?t=32940&rel=1&autoplay=1&loop=1&mute=1"
	      frameborder="0" allow="accelerometer; autoplay; encrypted-media;"
	      allowfullscreen>
      </iframe>`;

    let item={elem:elem, x:-1200, y:0, z:800, w:1024, h:480};
    items.push(item);
    return item;
}
const unmuteVideo= (ii) =>{
    //bugbug does not work document.querySelector("#theVid").contentWindow.document.querySelector("#player").unmute();
}

const enliven= (ii) =>{
    setInterval(
	()=>{   otherJump(ii);  }
	,1200
    );
}

const otherJump=  (ii) => {
    let item=items[ii];
    let jumpHeight=3;
    if (item.oy && item.oy!=-999) return;
    item.oy=item.y;
    

    item.y+=jumpHeight;
    redrawOne(item);
    setTimeout(()=>{
	item.y=item.oy;
	redrawOne(item);
	item.oy=-999;  //delete didn't work????bugbug
    },200);
    

}

const startup = () => {
    mainCanvas=document.querySelector("#c");
    setupKeys();
    addScreen();
    addFakeUsers();
    [4,5,6,7,8,9,10,11,14,16,18,19,21,22,30,31,32,33,34,35,36,37,38,39,41,42,43,44,45,46,47,48,49,50,51,52,53,
     54,55,56,58,59,61,71,72,74,76,81,99,199,200,201,390,392,409].forEach( enliven );
    setTimeout(()=>{  //some out of sync ppl
	[11,12,13,15,11,17,20,40,60,80].forEach( enliven );
    },50);
    unmuteVideo(theVid);
    mainCanvas.focus();
    redraw();
}


window.onload = startup;
