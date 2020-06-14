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
const redraw = ()=>{
    //alert("items="+dumps(items));
    var ll="";
    items.forEach( (item,ii,_array)=>{
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
	let w = item.w / dz ;
	let h = item.h / dz ;

	let s=item.elem.style;
	//bugbug get consts on resize, compare to actual main-div size
	if (dz<0 || left<0 || left>1100 ||  bottom<-100 || bottom>800) {
	    s.visibility="hidden";
	}else{
	    ll += ","+item.x;
	    s.left   = cu(left);
	    s.bottom = cu(bottom);
	    s.width=cu(w);
	    s.height=cu(h);
	    s.zIndex=''+(item.z);  //no units!

	    s.visibility="visible";
	}
    });
    //alert(ll);
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
    elem.setAttribute("style","position:absolute; width:80%; height:50%;left:10%;top:10%;background-color:black;z-index:1");
    mainCanvas.appendChild(elem);

    elem.innerHTML=`
      <iframe id="theVid" align="center" width="650" height="240"
	      src="https://youtube.com/embed/WX36hA85MeM?t=32940&rel=1&autoplay=1&loop=1&mute=1"
	      frameborder="0" allow="accelerometer; autoplay; encrypted-media;"
	      allowfullscreen>
      </iframe>`;

    

}


const startup = () => {
    mainCanvas=document.querySelector("#c");
    setupKeys();
    addScreen();
    addFakeUsers();
    mainCanvas.focus();
    redraw();
}


window.onload = startup;
