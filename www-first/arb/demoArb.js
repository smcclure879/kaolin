//written by ayvex for agreedis, 2020 

//INPUTS
const arbiterUrl="https://first.ayvexllc.com:3333";  //bugbug pass in 
let auth={debate: 4380, randCode: '4a32s9-0412x3098u', loginTimeCode: 1094857142313, userId: 471 }; //grabbed from django??



const log =  (x) =>  {    document.querySelector("#log").value += (x+"\n");   }
const dumps = JSON.stringify;
const bugbug =  (x,y) => {  log("bugbug"+x+dumps(y||"-nothing-"));   };

const sig = {
    doneEarly: 'doneEarly',
    timeSync: 'timeSync'

}

const arbiter = BuildArbiter();

$( (_ev) => {   //MAIN
    arbiter.init(arbiterUrl, auth, ()=>{
	bugbug(1758);
	arbiter.onMsg((msgObj)=>{
	    bugbug("2203a");
	    log(dumps(msgObj));
	});

	$('#button1').click(()=>{
	    arbiter.tell(sig.doneEarly); 
	}).fadeOut(1000).fadeIn(1000).fadeOut(1000).fadeIn(500).fadeOut(500).fadeIn(500);  //click me blink prompts
	bugbug("2203b");
    });

    

    
});

