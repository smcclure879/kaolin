
const dumps = JSON.stringify;


//bugbug SR: why this doesn't work???
const show = (ev)=>{ ev.preventDefault(); alert(ev); };
const setupTouch = ()=>{
    mainCanvas.addEventListener("touchstart" ,show,false);
    mainCanvas.addEventListener("touchend"   ,show,false);
    mainCanvas.addEventListener("touchcancel",show,false);
    mainCanvas.addEventListener("touchmove"  ,show,false);
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
