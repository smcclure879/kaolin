import sys,re

summary=""" 
this is a Contract between parties that wish to engage in small business together,
   --bartering goods, services, ownership in lines of business, and sometimes cash, 
   --in an attempt to synergistically incubate new corporations
   -- while spreading the risks and costs inherent in this activity, 
   -- until such times as the businesses can be viably spun off as companies. 
   -- with fair fast accounting of microfractional ownership in lines of business (value chains)
   -- that will hopefully graduate to become said companies.
"""


intents="""
Participants intent this document and teh protocosl and business methods herein to be business secrets held in confidence.  
To be a livign document continually adjusted to be fair. 
to track contributions of value as small as one hour of work or $30 of 2019 dollars, adjusted for inflation.
"""

contractLanguage="""
Language: this contract is written in the python language with large sections in english. it is intended to be a living document
understandable to all participants (do not sign if you cannot understand it). As part of this it is intended to be runnable in Python,
and to yield a list of owners and voting shares when run. 
"""

officialCopyLocationStatement="""
   parties agree that the document will live on github, starting in location shown as officialLocation, 
   and that this officialLocation will be amended in a programmtically followable way, by a 51% vote of the holders.
   and that the old location will be kept up, pointing to new location, for 6 months if a move is needed.
   and that every reasonable effort will be made to insure only one copy of the contract and value chains is made.
"""
officialLocation="https://github.com/smcclure879/kaolin/tree/master/valueChain/contract.py"


governance="""this contract is governed by the laws of king county, WA state, USA.  
Parties agree and commit to arbitration by a random panel of peers unknown to both parties instead of expensive litigation.
Parties agree signatures are electronic and  will be by adding ones'' personal  information to the Parties section

"""

sneakyBits=""" ???no voting peopls shares gone
--no just reporting a bunch of hours. 
--no coasting.  everyone checks someone else's hours they are familiar with, and someone they aren't. 
--yes rounding hurts small shareholders....they are also more work to process on per share basis. 
    and this is encouragement to do larger contributions.
--work in public. we are not vampires. check changes code and to hours into github. don't lose work or hours. 
--get hours for a month in by end of 2nd day of the next month
--the valueChain's owner(s) shall startmonth (as shown below in this document)  on the 3rd day so updates to values are computable. 
"""

liability=""" parties agree to not engage in activities which expose the group to unnecessary liability risks and to bear any liability for their actions rather than passing them on to the group """
negotiatingExits=""" we need a way to cash people out who wish to get out which is better than cashValue???"""
forcedExits=""" 80% vote of shares can "freeze" a holder for good cause. Voting rights lost on their shares. forced sale back to partnership upon valuation. """
cashValueStatement="""the redemption rate for shares is 1 penny each.  that is their only cash value.  one month turnaround for large cashouts. 

"""

##########################  ELECTRONIC SIGNATURE SECTION  #################################
def  partiesAndElectronicSignatures(): 
    ayvex={name: 'Ayvex Light Industries LLC',
           details: 'a WA state company 100% owned by Steven mcClure',
           agreeToAllTerms: 'true'}

    # add yourself here and sign below


    #by affixing my code to the below array, I hereby electronically sign this contract. 
    parties = [ ayvex,
                
                
                               # <--averum????
    ]

    return parties


valueChainsStatement="""
all work will be accounted for in one or several valuechains
the goal of valueChains is that ALL the people involved can get a small piece of the future profits, in proportion to contribution.
a valuechain is a file in the same directory as this file. 
a valuechain tracks who did how much work and assigns fractional ownership (shares) to those that do the work
each ongoing business idea being worked on has a separate value chain. 
"""

valueChainVoting="""
each chain does own voting and operates independent from others (this does not preclude agreements, mergers etc)
voting is online, in video session on our own servers unless otherwise agreed.
one vote per share
each chain has a large number of shares but trys to keep to the value of 1 share per hour or per $30 expense (2019 dollars)
each chain tries to keep a list of rewards maintained as comments in the VC file...
, but it is understood that when only 2 are in control in a value chain by virtue of voting share totals, agreements in email are fine. 
and this extends to voting.  if two control a vast majority of a chain, they may avoid consulting all members for votes. 
each chain tries to keep to principle of prizes up to max 3 times the labor cost.
"""

valueChainGeneralAgreements="""
parties check in change to file on github to add hours or claim agreed upon rewards
the chain is not your mommy. you must communicate with others on your value chain by your own means and do so fairly and peaceably
"""

valueChainDealsWithOtherValueChains="""
chains can transfer work or a technology to another chain by mutual consent. 
tech or technique that is used in muliple places can get credit for all of them....the person should get more if we use it more. 
transfers will be done as follows
--transfer the tech to its own value chain: A, total value shown va. old host points valuation va (or someother new valuation) at A.  
--other VC : B.....total value vb. B pays A an agreed fair share fee p ~ same as va for A.  
it is intended that transfers 
"""

treatmentOfExtraPettyCashByValueChains="""
the participants intent to do activities such as tipJars online, which may result in insignificant amounts of cash generated.
participants agree that this income shall be sent back down the value chain in as follows:
  1. some portion may at controlling voters aproval pay opex of the value chain (e.g. server rental)
  2. otherwise these small moneys shall where practical be sent to people on the valueChain in proportion to their ownership (excluding unassigned shares completely from calculation).  The code to compute this shall be developed as soon as moneys become technically feasible.
  3. this shall include devolution to other value chains that have acquired interest in the rewarding value chain 
  4. future value chains may omit this functionality later by vote, and specify 
"""

prohibitionOnCircularReferencesOfValueChains="""
the graph of all chains shall be a directed acyclic forest. no circular references are allowed. 
effective human and/or technical means shall be imposed by all parties to prevent this.
"""

#program notes
#NOTE: the contract you are signing includes ALL of this document including the python below, which details exactly how ownership
#      is computed in valueChains. Do not sign if you are not comfortable with this formula.
#following is the actual code used to compute values in the accompanying *.vc files.
#if runs in conjunction with the included makefile to output the ownership share numbers for all files *.vc in the current directory.


def err(msg):
    raise(ValueError(msg));

# GLOBALS
unassigned=None
month=None
year=None
monthCode=None
lineNum=None
totals=dict()

def whatMonthCode(mon):
    mon=mon.lower()[0:3]
    if mon=='jan': return 0
    if mon=='feb': return 1
    if mon=='mar': return 2
    if mon=='apr': return 3
    if mon=='may': return 4
    if mon=='jun': return 5
    if mon=='jul': return 6
    if mon=='aug': return 7
    if mon=='sep': return 8
    if mon=='oct': return 9
    if mon=='nov': return 10
    if mon=='dec': return 11
    err('bad month--'+mon)


def startmonth(monthAndYear,_):
    m=re.match(r'(\w{3})(\d{4})',monthAndYear)
    if not (  m  and  m.groups() and len(m.groups())>1  ):
        err('bad month and year--'+monthAndYear)
    g=m.groups()
    newMonth=g[0]
    newYear=int(g[1])-2000
    newMonthCode=whatMonthCode(newMonth)+12*newYear
    if monthCode is not None and newMonthCode<monthCode:
        err('temporal error old={}{} new={}{}, line={}'.format(newMonth,newYear,month,year,lineNum));
    iterateMonthSequence(newMonth,newYear,newMonthCode)
    
def iterateMonthSequence(newMonth,newYear,newMonthCode):
    global monthCode,month,year
    if monthCode is None:
        monthCode=newMonthCode
        return
    while(monthCode<newMonthCode):
        print("monthCode="+str(monthCode))
        for k in totals.keys():
            round=1000
            rateMult=1.01
            totals[k] = int(rateMult * totals[k] * round)/round   #monthly interest 1 percent, rounded down to thousandths
            print("   k={} v={}".format(k,totals[k]))
        monthCode += 1
    year=newYear
    month=newMonth

def int2(x):
    x=x.replace("_","")
    return int(x)
    
def initial(_,sharesTotal):
    global unassigned
    if unassigned is not None: err('only one initial per valchain, line='+lineNum)
    unassigned = int2(sharesTotal)
    print("totalShares="+str(unassigned))

    
def grant(who,what):
    global unassigned
    if unassigned<1: err('no shares left to assign')
    what=int2(what)
    if who not in totals:
        totals[who]=0
    totals[who] += what
    unassigned -= what
    
def sub(who,what):
    global unassigned
    if unassigned<1: err('not intialized1, line='+lineNum)
    if who not in totals: err('not initialized2, line='+lineNum);
    what=int2(what)
    if totals[who]<what: err('negative balance transaction prohibited line='+lineNum)
    totals[who] -= what
    unassigned += what

    
verbs={
    '': lambda _a,_b : None,  #comment lines have no verb
    'startmonth': startmonth,
    'initial': initial,
    'grant':grant,
    'sub':sub
}

def safe(arr,ind,default=""):
    return default if len(arr)<=ind else arr[ind] 

filename=sys.argv[1]
with open(filename) as fhr:
    for cnt, line in enumerate(fhr):
        lineNum=cnt #in global var for error handler.
        x=line.split("#",1)
        comment = "" if len(x)==1 else x[1] 
        line=x[0]
        
        y=re.split(r'\s+',line)
        verb=y[0]
        target=safe(y,1)
        amount=safe(y,2)
        
        verbs[verb](target,amount);   
        

for k,v in totals.items():
    print(k,v);
print("done-chain "+month+str(year))
