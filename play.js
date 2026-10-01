// ===== SPELL TABLE v0.20 — face-down permanent actions =====
// v0.16: enrich canonical shared card records instead of creating duplicate gallery/game records.
function enrichCard(name,data){
  let c=window.OUTER_REALMS_CARDS.find(x=>x.name===name);
  if(!c){c={name};window.OUTER_REALMS_CARDS.push(c)}
  Object.assign(c,data);
  return c;
}
enrichCard('Plains',{
  id:'plains',img:'cards/Plains.png',colors:['W'],manaCost:'',
  types:['Land'],supertypes:['Basic'],subtypes:['Plains'],rulesText:'{T}: Add {W}.'
});

// Test basics supplied for the Aethersplice / Spellmorph pass.
for (const data of [
  {id:'island-test-1',img:'cards/Island.png'},
  {id:'island-test-2',img:'cards/Island1.png'}
]) {
  if(!window.OUTER_REALMS_CARDS.some(c=>c.id===data.id)) window.OUTER_REALMS_CARDS.push({
    ...data,name:'Island',color:'BL',colors:[],manaCost:null,manaValue:0,
    supertypes:['Basic'],types:['Land'],subtypes:['Island'],rarity:'',
    rulesText:'{T}: Add {U}.',mechanics:[],keywords:[],
    abilities:[{kind:'mana',cost:['{T}'],effect:'addMana',mana:'U',amount:1}]
  });
}
const cards = window.OUTER_REALMS_CARDS || [];
const described = cards.filter(c => c.id && c.types);
const PHASES = ['Untap','Upkeep','Draw','Main 1','Beginning Combat','Declare Attackers','Declare Blockers','Combat Damage','End Combat','Main 2','End'];
const COLORS = ['W','U','B','R','G','C'];
const FACE_DOWN_ART={manifest:'ui/manifest.png',morph:'ui/morph.png',faceDownLand:'ui/face-down-land.png',terramorph:['ui/terramorph-a.png','ui/terramorph-b.png']};
const zones={library:[],hand:[],playerLands:[],playerPermanents:[],graveyard:[],exile:[],stack:[],opponentLibrary:[],opponentHand:[],opponentLands:[],opponentPermanents:[],opponentGraveyard:[],opponentExile:[]};
const freshPool=()=>({W:0,U:0,B:0,R:0,G:0,C:0});
const state={turn:1,active:'player1',phase:0,life:20,oppLife:20,landPlayed:false,log:[],mana:freshPool(),oppMana:freshPool(),attackers:[],blockers:{},lost:{player1:false,opponent:false},gameOver:false,winner:null,autoYield:false};
let serial=0;
let pendingDecision=null;
let targetSelection=null;
let openGraveyardZone=null;
let resolvingChoice=null;
const $=s=>document.querySelector(s);
const els={hand:$('#hand-cards'),lands:$('[data-zone="playerLands"]'),perms:$('[data-zone="playerPermanents"]'),oppLands:$('[data-zone="opponentLands"]'),oppPerms:$('[data-zone="opponentPermanents"]'),inspector:$('#card-inspector'),stack:$('#stack-content'),log:$('#game-log'),decision:$('#decision-ui')};
function def(i){return cards.find(c=>c.id===i.cardId)}
function isLand(c){return (c.types||[]).includes('Land')}
function isPermanent(c){return (c.types||[]).some(t=>['Creature','Artifact','Enchantment','Planeswalker','Land'].includes(t))}
function isCreature(i,c=def(i)){return i.faceDownKind==='morph'||i.faceDownKind==='manifest'||(c.types||[]).includes('Creature')}
function hasKeyword(c,word){return new RegExp(`\\b${word}\\b`,'i').test(c.rulesText||'')}
function creaturePower(i,c=def(i)){
  if(i.faceDownKind==='morph'||i.faceDownKind==='manifest')return 2;
  const p=c.power ?? c.pt?.split?.('/')[0];
  const n=parseInt(p,10);return (Number.isFinite(n)?n:0)+(i.tempPower||0);
}
function summoningSick(i,c=def(i)){
  return isCreature(i,c)&&!hasKeyword(c,'haste')&&!i.tempHaste&&i.enteredTurn===state.turn;
}
function morphAbilityAvailable(i,c=def(i),kind='morph'){
  // Morph, Spellmorph, and Terramorph are one ability family. If an effect
  // removes abilities from the permanent, these actions disappear. Manifest's
  // intrinsic creature turn-face-up permission is intentionally separate.
  if(i.abilitiesLost)return false;
  if(kind==='morph')return c.morphCost!=null;
  if(kind==='spellmorph')return c.spellmorphCost!=null;
  if(kind==='terramorph')return c.terramorphCost!=null;
  return false;
}
function manifestCanTurnFaceUp(i,c=def(i)){
  return i.faceDownKind==='manifest'&&(c.types||[]).includes('Creature');
}
function permanentActions(i,c=def(i)){
  if(i.owner!=='player1'||state.active!=='player1')return[];
  const out=[];
  if(i.faceDown){
    if(manifestCanTurnFaceUp(i,c))out.push({kind:'manifestFaceUp',label:`Turn face up — ${c.manaCost||'{0}'}`,cost:c.manaCost||''});
    if((i.faceDownKind==='morph'||i.faceDownKind==='manifest')&&morphAbilityAvailable(i,c,'morph'))out.push({kind:'morphFaceUp',label:`Morph — ${typeof c.morphCost==='string'?c.morphCost:'special cost'}`,cost:c.morphCost});
    if((i.faceDownKind==='morph'||i.faceDownKind==='manifest')&&morphAbilityAvailable(i,c,'spellmorph'))out.push({kind:'spellmorph',label:`Spellmorph — ${c.spellmorphCost}`,cost:c.spellmorphCost});
    if(i.faceDownKind==='terramorph'&&morphAbilityAvailable(i,c,'terramorph'))out.push({kind:'terramorph',label:`Terramorph — ${c.terramorphCost}`,cost:c.terramorphCost});
  }else{
    (c.abilities||[]).filter(a=>a.kind==='activated').forEach((a,n)=>out.push({kind:'activated',label:(c.rulesText||'').split('\\n')[n]||`Activate ability ${n+1}`,ability:a,index:n}));
  }
  return out;
}
function beginPermanentAction(i,c=def(i)){
  const actions=permanentActions(i,c);
  if(!actions.length){inspect(c,i);return}
  if(actions.length===1){startPermanentAction(i,actions[0]);return}
  pendingDecision={kind:'permanentActions',question:`${i.faceDown?'Face-down permanent':c.name} — choose an action.`,subtext:'Available actions for this permanent.',instance:i,actions};render();
}
function startPermanentAction(i,a){
  clearDecision();
  if(a.kind==='activated'){beginActivatedAbility(i,def(i));return}
  if(a.kind==='manifestFaceUp'||a.kind==='morphFaceUp'){beginFaceUpCost(i,a);return}
  if(a.kind==='spellmorph'||a.kind==='terramorph'){beginBattlefieldCast(i,a);return}
}
function beginFaceUpCost(i,a){
  const c=def(i),cost=a.cost;
  if(typeof cost!=='string'){log(`${c.name}'s non-mana Morph cost is not implemented yet.`);render();return}
  if(costTokens(cost).includes('X')){log('X in a turn-face-up cost is not implemented yet.');render();return}
  const result=paymentPlans(cost,state.mana,0);
  if(!result.plans.length){log(`${c.name}: ${result.reason}`);render();return}
  if(result.plans.length===1){turnFaceUp(i,a,result.plans[0]);return}
  pendingDecision={kind:'faceUpPayment',question:`Turn the face-down permanent face up?`,subtext:`${a.kind==='morphFaceUp'?'Morph':'Manifest'} cost ${cost}.`,instance:i,action:a,plans:result.plans};render();
}
function turnFaceUp(i,a,plan){
  const c=def(i);applyPayment(plan);clearDecision();
  i.faceDown=false;i.faceDownKind=null;i.castFaceDown=false;i.manaSpent={...plan.spend};
  log(`${c.name} is turned face up${a.kind==='morphFaceUp'?' using Morph':' from Manifest'}.`);
  // Turning face up is a special action and does not use the stack. Triggered
  // face-up abilities will be routed through the trigger system as it expands.
  render();
}
function beginBattlefieldCast(i,a){
  const c=def(i),cost=a.cost;
  // Spellmorph/Terramorph actually cast the underlying card from the battlefield.
  // Normal spell timing and target legality are checked before anything moves.
  if(!legalTiming(c)){render();return}
  if(costTokens(cost).includes('X')){
    pendingDecision={kind:'battlefieldCastX',question:`Choose X for ${c.name}`,subtext:`${a.kind==='spellmorph'?'Spellmorph':'Terramorph'} cost ${cost}.`,instance:i,action:a,x:0};render();return;
  }
  finishBattlefieldCastCost(i,a,0);
}
function finishBattlefieldCastCost(i,a,x=0){
  const c=def(i),result=paymentPlans(a.cost,state.mana,x);
  if(!result.plans.length){log(`${c.name}: ${result.reason}`);render();return}
  if(result.plans.length===1){completeBattlefieldCast(i,a,x,result.plans[0]);return}
  pendingDecision={kind:'battlefieldCastPayment',question:`Cast ${c.name} from the battlefield?`,subtext:`${a.kind==='spellmorph'?'Spellmorph':'Terramorph'} cost ${resolvedCost(a.cost,x)}.`,instance:i,action:a,x,plans:result.plans};render();
}
function completeBattlefieldCast(i,a,x,plan){
  const c=def(i),fx=effectFor(c),fromZone=i.zone;
  if(fx?.targets){
    const legal=legalTargets(fx.targets);
    if(legal.length<fx.targets.min){log(`${c.name} cannot be cast: it lacks the required legal target.`);render();return}
    targetSelection={spell:i,cost:a.cost,mode:'normal',x,plan,spec:fx.targets,selected:[],fromZone,castMethod:a.kind};
    pendingDecision={kind:'targets',question:`${c.name} — ${fx.targets.label}`,subtext:`Choose ${fx.targets.min===fx.targets.max?fx.targets.min:`${fx.targets.min} to ${fx.targets.max}`} target${fx.targets.max===1?'':'s'}.`};render();return;
  }
  castFromBattlefieldFinal(i,a,x,plan,[]);
}
function castFromBattlefieldFinal(i,a,x,plan,targets){
  const c=def(i),fromZone=i.zone;applyPayment(plan);clearDecision();
  i.targets=[...targets];i.faceDown=false;i.faceDownKind=null;i.castFaceDown=false;i.castX=x;i.manaSpent={...plan.spend};i.castMethod=a.kind;
  move(i,fromZone,'stack');
  log(`${c.name} is cast from the battlefield with ${a.kind==='spellmorph'?'Spellmorph':'Terramorph'} for ${resolvedCost(a.cost,x)||'{0}'}. Opponent passes priority.`);render();
}
function attackEligible(i,c=def(i)){
  return state.active==='player1'&&i.zone==='playerPermanents'&&isCreature(i,c)&&!i.tapped&&!summoningSick(i,c);
}
function canAttack(i,c=def(i)){
  return PHASES[state.phase]==='Declare Attackers'&&attackEligible(i,c);
}
function isAttacking(i){return state.attackers.includes(i.instanceId)}
function toggleAttacker(i,c){if(gameLocked())return;
  if(PHASES[state.phase]!=='Declare Attackers'){inspect(c,i);return}
  if(!isCreature(i,c)){inspect(c,i);return}
  const n=state.attackers.indexOf(i.instanceId);
  // A creature tapped by declaring it as an attacker can be withdrawn before
  // declaration is finalized. Only that attack-created tap is undone.
  if(n>=0){
    state.attackers.splice(n,1);
    if(i.tappedForAttack){i.tapped=false;i.tappedForAttack=false}
    log(`${c.name} is no longer attacking.`);
    render();return;
  }
  if(i.tapped){log(`${c.name} is tapped and cannot attack.`);render();return}
  if(summoningSick(i,c)){log(`${c.name} has summoning sickness.`);render();return}
  state.attackers.push(i.instanceId);
  if(!hasKeyword(c,'vigilance')){i.tapped=true;i.tappedForAttack=true}
  log(`${c.name} attacks.`);
  render();
}
function combatDamage(){
  if(!state.attackers.length){log('No combat damage is dealt.');return}
  let total=0;
  for(const id of state.attackers){
    const i=zones.playerPermanents.find(x=>x.instanceId===id);
    if(!i)continue;
    // Blocking structure is present now; passive opponent currently declares no blockers.
    if(!state.blockers[id]) total+=creaturePower(i);
  }
  if(total>0){state.oppLife-=total;log(`Your attackers deal ${total} combat damage to the opponent.`);checkLifeLosses()}
  else log('All attacking creatures are blocked.');
}
function clearCombat(){zones.playerPermanents.concat(zones.opponentPermanents).forEach(i=>i.tappedForAttack=false);state.attackers=[];state.blockers={}}

function shuffle(a){for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function instance(c,owner){return{instanceId:`${owner}-${++serial}`,cardId:c.id,owner,controller:owner,zone:'library',tapped:false,faceDown:false,faceDownKind:null,faceDownArt:0,damage:0,counters:{},enteredTurn:null,tappedForAttack:false}}
function coloredSymbols(cost=''){return [...String(cost).matchAll(/\{([WUBRG])\}/g)].map(m=>m[1])}
function buildDeck(owner){
  const basics=described.filter(c=>isLand(c)&&c.supertypes?.includes('Basic'));
  const available=new Set(basics.flatMap(c=>c.subtypes||[]).map(x=>({Plains:'W',Island:'U',Swamp:'B',Mountain:'R',Forest:'G'})[x]).filter(Boolean));
  let spells=described.filter(c=>!isLand(c)&&c.name!=='Careful Looting'&&coloredSymbols(c.manaCost).every(x=>available.has(x)));
  if(!spells.length)spells=described.filter(c=>!isLand(c)&&c.name!=='Careful Looting');
  const looting=described.find(c=>c.name==='Careful Looting');
  const deck=[];
  for(let i=0;i<30;i++)deck.push(instance(basics[i%basics.length]||described.find(isLand),owner));
  if(looting){for(let i=0;i<4;i++)deck.push(instance(looting,owner))}else console.error('Careful Looting missing from described card database');
  const focusNames=['Soul Summoner','Divide Spirit and Flesh','Rite of Reclamation','Flame Birth','Aethersplice','Animize','Dread Chant','Undergrowth Summons'];
  for(const name of focusNames){const c=described.find(x=>x.name===name);if(c)for(let n=0;n<2&&deck.length<60;n++)deck.push(instance(c,owner))}
  let k=0;while(deck.length<60&&spells.length){deck.push(instance(spells[k%spells.length],owner));k++}
  return shuffle(deck);
}
function log(msg){state.log.push(msg);if(state.log.length>16)state.log.shift()}
function move(i,from,to){const n=zones[from].findIndex(x=>x.instanceId===i.instanceId);if(n<0)return false;zones[from].splice(n,1);i.zone=to;zones[to].push(i);return true}
const TARGET_SPECS={
  cardInAGraveyard:{min:1,max:1,zones:['graveyard','opponentGraveyard'],test:i=>true,label:'Choose target card in a graveyard.'},
  creatureCardInAGraveyard:{min:1,max:1,zones:['graveyard','opponentGraveyard'],test:i=>isCreature(i),label:'Choose target creature card in a graveyard.'},
  upToOneArtifactOrEnchantment:{min:0,max:1,zones:['playerPermanents','opponentPermanents'],test:i=>{const c=def(i);return (c.types||[]).some(t=>t==='Artifact'||t==='Enchantment')},label:'Choose up to one target artifact or enchantment.'}
};
function normalizeEffect(e){
  if(typeof e==='string')e={effect:e};
  const name=e.effect;
  if(name==='gainLife')return{op:'gainLife',amount:e.amount||0};
  if(name==='drawCards')return{op:'draw',count:e.amount||1};
  if(name==='discardCards')return{op:'discard',count:e.amount||1};
  if(name==='manifestTopCard')return{op:'manifest',count:1};
  if(name==='manifestTopCards')return{op:'manifest',count:e.amount||1};
  if(name==='exileTarget')return{op:'exileTarget',index:0};
  if(name==='destroyTarget')return{op:'destroyTarget',index:0};
  if(name==='grantHasteUntilEndOfTurn')return{op:'modifyManifested',haste:true};
  if(name==='grantPlus1Plus0TrampleHaste')return{op:'modifyManifested',power:1,trample:true,haste:true};
  if(name==='sacrificeItAtEndOfTurn')return{op:'sacrificeManifestedAtEnd'};
  if(name==='addManaChoice')return{op:'addManaChoice',choices:e.choices||[]};
  if(name==='lookTopChooseManifestRestGraveyard')return{op:'lookTopChooseManifestRestGraveyard',count:e.amount||4};
  return null;
}
function effectFor(c){
  const a=(c.abilities||[]).find(x=>x.kind==='spell');if(!a)return null;
  let raw=a.effects||[a];
  const resolve=[];let targetName=a.target||null;
  for(const e0 of raw){const e=typeof e0==='string'?{effect:e0}:e0;if(e.target&&!targetName)targetName=e.target;const n=normalizeEffect(e);if(n)resolve.push(n)}
  return{targets:targetName?TARGET_SPECS[targetName]:null,resolve};
}
function targetStillLegal(spec,id){
  const i=findInst(id);if(!i||!spec)return false;
  return spec.zones.includes(i.zone)&&(!spec.test||spec.test(i));
}
function legalTargets(spec){
  if(!spec)return[];
  return spec.zones.flatMap(z=>zones[z]||[]).filter(i=>!spec.test||spec.test(i));
}
function beginTargetSelection(i,cost,mode,x,plan){
  const c=def(i),fx=effectFor(c),spec=fx?.targets;
  if(!spec){completeCastFinal(i,cost,mode,x,plan,[]);return}
  const legal=legalTargets(spec);
  if(legal.length<spec.min){
    log(`${c.name} cannot be cast: it needs ${spec.min===1?'a legal target':`${spec.min} legal targets`}.`);
    render();return;
  }
  targetSelection={spell:i,cost,mode,x,plan,spec,selected:[]};
  pendingDecision={kind:'targets',question:`${c.name} — ${spec.label}`,subtext:`Choose ${spec.min===spec.max?spec.min:`${spec.min} to ${spec.max}`} target${spec.max===1?'':'s'}. Open a graveyard and click a highlighted card.`};
  // If every legal target is in only one graveyard, open it automatically.
  const legalZones=[...new Set(legal.map(t=>t.zone))];
  if(legalZones.length===1)openGraveyard(legalZones[0]);
  render();
}
function selectTarget(i){
  if(!targetSelection)return;
  const {spec}=targetSelection;
  if(!targetStillLegal(spec,i.instanceId))return;
  const n=targetSelection.selected.indexOf(i.instanceId);
  if(n>=0)targetSelection.selected.splice(n,1);
  else if(targetSelection.selected.length<spec.max)targetSelection.selected.push(i.instanceId);
  render();
}
function confirmTargets(){
  if(!targetSelection)return;
  const t=targetSelection;
  if(t.selected.length<t.spec.min){log(`Choose ${t.spec.min} legal target${t.spec.min===1?'':'s'} first.`);render();return}
  const {spell,cost,mode,x,plan,selected}=t;
  const fromZone=t.fromZone||'hand',castMethod=t.castMethod||'normal',afterMadness=t.afterMadness;
  targetSelection=null;pendingDecision=null;closeGraveyard();
  if(castMethod==='spellmorph'||castMethod==='terramorph'){const action={kind:castMethod,cost};castFromBattlefieldFinal(spell,action,x,plan,selected)}
  else completeCastFinal(spell,cost,mode,x,plan,selected,fromZone,castMethod);
  if(afterMadness)afterMadness(true);
}
function cancelTargets(){targetSelection=null;pendingDecision=null;closeGraveyard();render()}
function manifestTop(player='player1',count=1){
  const made=[];
  const lib=player==='player1'?'library':'opponentLibrary';
  const dest=player==='player1'?'playerPermanents':'opponentPermanents';
  for(let n=0;n<count;n++){
    const i=zones[lib][zones[lib].length-1];if(!i)break;
    move(i,lib,dest);i.faceDown=true;i.faceDownKind='manifest';i.enteredTurn=state.turn;
    log(`${playerName(player)} manifests the top card of their library.`);made.push(i);
  }
  return made;
}
function executeEffect(spell,fx,legalTargetIds){
  if(!fx)return;
  for(const e of fx.resolve||[]){
    if(e.op==='gainLife'){
      if(spell.controller==='player1')state.life+=e.amount;else state.oppLife+=e.amount;
      log(`${playerName(spell.controller)} gains ${e.amount} life.`);
    }else if(e.op==='draw'){
      for(let n=0;n<(e.count||1);n++)draw(spell.controller,false);
      log(`${playerName(spell.controller)} draws ${e.count||1} card${(e.count||1)===1?'':'s'}.`);
    }else if(e.op==='discard'){
      if(spell.controller==='player1'){
        resolvingChoice={kind:'discard',spell,remaining:e.count||1};
        pendingDecision={kind:'discard',question:`${def(spell).name} — discard a card.`,subtext:'Click a card in your hand to discard it.'};
        return 'paused';
      }else{
        for(let n=0;n<(e.count||1)&&zones.opponentHand.length;n++){const t=zones.opponentHand[0];move(t,'opponentHand','opponentGraveyard')}
      }
    }else if(e.op==='manifest'){
      spell.lastManifested=manifestTop(spell.controller,e.count||1);
    }else if(e.op==='exileTarget'){
      const id=legalTargetIds[e.index||0];if(!id)continue;
      const t=findInst(id);if(!t)continue;
      const from=t.zone,to=t.owner==='player1'?'exile':'opponentExile';
      const name=def(t).name;move(t,from,to);log(`${name} is exiled from the graveyard.`);
    }else if(e.op==='destroyTarget'){const id=legalTargetIds[e.index||0];if(!id)continue;const t=findInst(id);if(!t)continue;const from=t.zone,to=t.owner==='player1'?'graveyard':'opponentGraveyard';const name=def(t).name;move(t,from,to);log(`${name} is destroyed.`)}else if(e.op==='modifyManifested'){for(const t of spell.lastManifested||[]){t.tempPower=(t.tempPower||0)+(e.power||0);if(e.haste)t.tempHaste=true;if(e.trample)t.tempTrample=true}}else if(e.op==='sacrificeManifestedAtEnd'){for(const t of spell.lastManifested||[])t.sacrificeAtEndTurn=true}else if(e.op==='addManaChoice'){resolvingChoice={kind:'manaChoice',spell,choices:e.choices};pendingDecision={kind:'manaChoice',question:`${def(spell).name} — choose mana to add.`,subtext:'Choose one.'};return 'paused'}else if(e.op==='lookTopChooseManifestRestGraveyard'){beginTopChoice(spell,e.count||4);return 'paused'}
  }
}
function finishPausedSpell(spell){
  resolvingChoice=null;pendingDecision=null;
  const dest=spell.castMethod==='flashback'?(spell.owner==='player1'?'exile':'opponentExile'):(spell.owner==='player1'?'graveyard':'opponentGraveyard');spell.zone=dest;zones[dest].push(spell);log(`${def(spell).name} resolves${spell.castMethod==='flashback'?' and is exiled by Flashback':''}.`);render();
}
function chooseMana(choice){const r=resolvingChoice;if(!r||r.kind!=='manaChoice')return;for(const ch of choice)state.mana[ch]=(state.mana[ch]||0)+1;log(`${def(r.spell).name} adds ${choice.split('').map(x=>`{${x}}`).join('')}.`);finishPausedSpell(r.spell)}
function beginTopChoice(spell,count){const lib=zones.library,seen=lib.slice(Math.max(0,lib.length-count));resolvingChoice={kind:'topChoice',spell,cards:seen};pendingDecision={kind:'topChoice',question:`${def(spell).name} — choose a card to manifest.`,subtext:'The other revealed cards will be put into your graveyard.'}}
function chooseTopManifest(id){const r=resolvingChoice;if(!r||r.kind!=='topChoice')return;const chosen=r.cards.find(x=>x.instanceId===id);if(!chosen)return;for(const t of r.cards){if(t===chosen){move(t,'library','playerPermanents');t.faceDown=true;t.faceDownKind='manifest';t.enteredTurn=state.turn;log('You manifest the chosen card.')}else move(t,'library','graveyard')}finishPausedSpell(r.spell)}
function cleanupEndTurn(){for(const z of ['playerPermanents','opponentPermanents'])for(const i of [...zones[z]]){if(i.sacrificeAtEndTurn){move(i,z,i.owner==='player1'?'graveyard':'opponentGraveyard');log(`${def(i).name} is sacrificed at end of turn.`)}else{i.tempPower=0;i.tempHaste=false;i.tempTrample=false}}}
function openGraveyard(zone){
  openGraveyardZone=zone;
  const panel=$('#graveyard-browser');panel.hidden=false;
  $('#graveyard-browser-title').textContent=zone==='graveyard'?'Player 1 Graveyard':'Player 2 Graveyard';
  renderGraveyardBrowser();
}
function closeGraveyard(){openGraveyardZone=null;const p=$('#graveyard-browser');if(p)p.hidden=true}
function renderGraveyardBrowser(){
  const box=$('#graveyard-browser-cards');if(!box||!openGraveyardZone)return;
  box.innerHTML='';
  const cardsHere=zones[openGraveyardZone]||[];
  if(!cardsHere.length){box.innerHTML='<div class="graveyard-empty">This graveyard is empty.</div>';return}
  cardsHere.forEach(i=>{
    const c=def(i),wrap=document.createElement('button');wrap.className='graveyard-card';
    const legal=targetSelection&&targetStillLegal(targetSelection.spec,i.instanceId);
    const selected=targetSelection?.selected.includes(i.instanceId);
    if(legal)wrap.classList.add('legal-target');if(selected)wrap.classList.add('selected-target');
    const img=document.createElement('img');img.src=c.img;img.alt=c.name;wrap.appendChild(img);
    const name=document.createElement('span');name.textContent=c.name+(i.owner==='player1'&&i.zone==='graveyard'&&c.flashbackCost?` · Flashback ${c.flashbackCost}`:'');wrap.appendChild(name);
    wrap.addEventListener('click',()=>{
      if(legal){selectTarget(i);return}
      if(!targetSelection&&i.owner==='player1'&&i.zone==='graveyard'&&c.flashbackCost){beginFlashback(i);return}
      inspect(c,i)
    });
    box.appendChild(wrap);
  });
}

function playerName(p){return p==='player1'?'Player 1':'Player 2'}
function losePlayer(p,reason=''){
  if(state.lost[p])return;
  state.lost[p]=true;
  if(reason)log(`${playerName(p)} loses the game — ${reason}`);
  else log(`${playerName(p)} loses the game.`);
  const alive=['player1','opponent'].filter(x=>!state.lost[x]);
  if(alive.length===1){
    state.gameOver=true;state.winner=alive[0];
    log(`${playerName(alive[0])} wins the game.`);
  }else if(alive.length===0){
    state.gameOver=true;state.winner=null;log('The game ends with no winner.');
  }
}
function checkLifeLosses(){
  if(state.life<=0)losePlayer('player1','life total is 0 or less.');
  if(state.oppLife<=0)losePlayer('opponent','life total is 0 or less.');
}
function gameLocked(){
  if(!state.gameOver)return false;
  log('The game is over. Start a new game to continue.');
  render();return true;
}
function draw(player='player1',announce=true){if(state.gameOver)return;if(player==='player2')player='opponent';const lib=player==='player1'?'library':'opponentLibrary',hand=player==='player1'?'hand':'opponentHand';const i=zones[lib][zones[lib].length-1];if(!i){losePlayer(player,'attempted to draw from an empty library.');render();return}move(i,lib,hand);if(announce)log(`${player==='player1'?'You draw':'Opponent draws'} a card.`)}
function visibleImage(i,c){if(!i.faceDown)return c.img;if(i.faceDownKind==='terramorph')return FACE_DOWN_ART.terramorph[i.faceDownArt%2];return FACE_DOWN_ART[i.faceDownKind]||'ui/card-back.jpg'}
function label(i,c){if(!i.faceDown)return c.name;return({manifest:'Manifest — face-down 2/2',morph:'Morph — face-down 2/2',terramorph:'Terramorph — face-down land',faceDownLand:'Face-down land'})[i.faceDownKind]||'Face-down card'}
function landMana(i,c){
  if(i.faceDown) return 'C';
  const types=c.subtypes||[];
  if(types.includes('Plains'))return'W';if(types.includes('Island'))return'U';if(types.includes('Swamp'))return'B';if(types.includes('Mountain'))return'R';if(types.includes('Forest'))return'G';
  return null;
}
function tapLandForMana(i,c){if(gameLocked())return;
  if(state.active!=='player1'){log('You can only use your lands while you have priority.');return}
  if(i.tapped){log(`${c.name} is already tapped.`);return}
  const mana=landMana(i,c);if(!mana){log(`${c.name}'s mana ability is not implemented yet.`);return}
  i.tapped=true;state.mana[mana]++;log(`${c.name} adds {${mana}}.`);render();
}
function costTokens(cost=''){return [...String(cost||'').matchAll(/\{([^}]+)\}/g)].map(m=>m[1])}
function resolvedCost(cost,x=0){return String(cost||'').replace(/\{X\}/g,`{${x}}`)}
function paymentPlans(cost,pool=state.mana,x=0){
  const tokens=costTokens(resolvedCost(cost,x));
  let generic=0, fixed=[], hybrid=[];
  for(const s of tokens){
    if(/^\d+$/.test(s))generic+=Number(s);
    else if(COLORS.includes(s))fixed.push(s);
    else if(/^[WUBRGC]\/[WUBRGC]$/.test(s))hybrid.push(s.split('/'));
    else return {plans:[],reason:`Mana symbol {${s}} is not implemented yet.`};
  }
  const assignments=[];
  function walk(n,chosen){
    if(n===hybrid.length){assignments.push([...chosen]);return}
    for(const c of hybrid[n]){chosen.push(c);walk(n+1,chosen);chosen.pop()}
  }
  walk(0,[]);
  if(!assignments.length)assignments.push([]);
  const plans=[];
  for(const choice of assignments){
    const need={W:0,U:0,B:0,R:0,G:0,C:0};
    fixed.concat(choice).forEach(c=>need[c]++);
    if(COLORS.some(c=>pool[c]<need[c]))continue;
    const remaining={...pool};COLORS.forEach(c=>remaining[c]-=need[c]);
    if(COLORS.reduce((n,c)=>n+remaining[c],0)<generic)continue;
    // Deterministic generic payment, preserving colored mana where possible only by fixed order.
    const spend={...need};let g=generic;
    for(const c of ['C','W','U','B','R','G']){
      const use=Math.min(remaining[c],g);spend[c]+=use;remaining[c]-=use;g-=use;if(!g)break;
    }
    plans.push({spend,hybridChoice:choice,generic,x});
  }
  // Remove duplicate spend plans.
  const unique=[];const seen=new Set();
  for(const p of plans){const k=COLORS.map(c=>p.spend[c]).join(',');if(!seen.has(k)){seen.add(k);unique.push(p)}}
  return {plans:unique,reason:unique.length?'':`Need ${resolvedCost(cost,x)}.`};
}
function applyPayment(plan,pool=state.mana){for(const c of COLORS)pool[c]-=plan.spend[c]}
function paymentLabel(plan){
  const bits=COLORS.filter(c=>plan.spend[c]).map(c=>`${plan.spend[c]}${c}`);
  return bits.join(' + ')||'0';
}
function emptyMana(){for(const c of COLORS){state.mana[c]=0;state.oppMana[c]=0}}
function manaHTML(pool){return COLORS.map(c=>`<span class="mana-chip${pool[c]?'':' empty'}">${c} ${pool[c]}</span>`).join('')}
function cardEl(i){const c=def(i),img=document.createElement('img');img.className='game-card'+(i.tapped?' tapped':'')+(isAttacking(i)?' attacking':'')+(summoningSick(i,c)&&i.zone==='playerPermanents'?' summoning-sick':'')+(canAttack(i,c)?' attack-ready':'')+(targetSelection&&targetStillLegal(targetSelection.spec,i.instanceId)?' legal-target':'');img.src=visibleImage(i,c);img.alt=label(i,c);img.draggable=i.owner==='player1'&&i.zone==='hand';img.dataset.instanceId=i.instanceId;img.dataset.zone=i.zone;img.addEventListener('mouseenter',()=>inspect(c,i));img.addEventListener('mouseleave',()=>showStack());img.addEventListener('click',()=>{if(targetSelection&&targetStillLegal(targetSelection.spec,i.instanceId)){selectTarget(i);return}if(resolvingChoice?.kind==='discard'&&i.zone==='hand'){discardForChoice(i);return}if(resolvingChoice?.kind==='discardAbilityCost'&&i.zone==='hand'){const src=resolvingChoice.source,a=resolvingChoice.ability;const finish=()=>{resolvingChoice=null;pendingDecision=null;resolveActivatedAbility(src,a)};if(c?.madnessCost){beginMadnessDiscard(i,finish);return}move(i,'hand','graveyard');log(`You discard ${c.name} to activate ${def(src).name}.`);finish();return}if(pendingDecision?.kind==='sacrificeCreature'&&i.zone==='playerPermanents'&&isCreature(i,c)){chooseSacrificeCreature(i);return}if(i.owner==='player1'&&i.zone==='playerLands'&&!i.faceDown)tapLandForMana(i,c);else if(i.owner==='player1'&&(i.zone==='playerPermanents'||i.zone==='playerLands')){if(i.zone==='playerPermanents'&&PHASES[state.phase]==='Declare Attackers'&&isCreature(i,c))toggleAttacker(i,c);else beginPermanentAction(i,c)}else inspect(c,i)});img.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',JSON.stringify({id:i.instanceId,from:i.zone})));return img}
function renderZone(el,z){el.querySelectorAll('.game-card').forEach(x=>x.remove());zones[z].forEach(i=>el.appendChild(cardEl(i)))}
function render(){renderZone(els.hand,'hand');renderZone(els.lands,'playerLands');renderZone(els.perms,'playerPermanents');renderZone(els.oppLands,'opponentLands');renderZone(els.oppPerms,'opponentPermanents');$('#hand-count').textContent=zones.hand.length;$('#life').textContent=state.life;$('#opp-life').textContent=state.oppLife;$('#library-count').textContent=zones.library.length;$('#graveyard-count').textContent=zones.graveyard.length;$('#exile-count').textContent=zones.exile.length;$('#opp-library-count').textContent=zones.opponentLibrary.length;$('#opp-hand-count').textContent=zones.opponentHand.length;$('#opp-graveyard-count').textContent=zones.opponentGraveyard.length;$('#opp-exile-count').textContent=zones.opponentExile.length;$('#mana-pool').innerHTML=manaHTML(state.mana);$('#opp-mana-pool').innerHTML=manaHTML(state.oppMana);$('#turn-label').textContent=`Turn ${state.turn} · ${state.active==='player1'?'You':'Opponent'}`;$('#phase-label').textContent=PHASES[state.phase];$('#advance').textContent=PHASES[state.phase]==='Declare Attackers'?'Confirm Attackers':PHASES[state.phase]==='Declare Blockers'?'Confirm Blockers':'Pass / Next';$('#advance').disabled=state.gameOver;$('#end-turn').disabled=state.gameOver;els.log.innerHTML=state.log.slice().reverse().map(x=>`<div>${x}</div>`).join('');renderDecision();if(openGraveyardZone)renderGraveyardBrowser();showStack(false)}
function inspect(c,i){const type=[...(c.supertypes||[]),...(c.types||[]),...(c.subtypes?.length?['—',...c.subtypes]:[])].join(' ');els.inspector.innerHTML=`<img src="${visibleImage(i,c)}" alt="${c.name}"><h2>${c.name}</h2><div class="meta">${c.manaCost||''} · ${type}</div><p>${c.rulesText||'Rules data not entered yet.'}</p>`}
function showStack(clearInspector=true){if(clearInspector)els.inspector.innerHTML='';if(!zones.stack.length){els.stack.innerHTML='<div class="stack-empty">The stack is empty.</div>';return}els.stack.innerHTML='';[...zones.stack].reverse().forEach(i=>{const c=def(i),row=document.createElement('div');row.className='stack-card';row.appendChild(cardEl(i));const t=document.createElement('div');t.innerHTML=i.castFaceDown?`<b>Face-down creature spell</b><small>2/2 · waiting to resolve</small>`:`<b>${c.name}</b><small>Waiting to resolve</small>`;row.appendChild(t);els.stack.appendChild(row)})}
function sorcerySpeedAvailable(){return state.active==='player1'&&PHASES[state.phase].startsWith('Main')&&zones.stack.length===0&&!pendingDecision&&!resolvingChoice&&!targetSelection}
function playLand(i,terramorph=false){if(!sorcerySpeedAvailable()||state.landPlayed){log(state.landPlayed?'You have already played a land this turn.':'You can only play a land during your main phase while the stack is empty.');return}if(terramorph){i.faceDown=true;i.faceDownKind='terramorph'}move(i,'hand','playerLands');state.landPlayed=true;log(`${terramorph?'Terramorph land':'Land'} played.`);render()}
function clearDecision(){pendingDecision=null}
function decisionButton(label,fn,cls=''){
  const b=document.createElement('button');b.textContent=label;if(cls)b.className=cls;b.addEventListener('click',fn);return b;
}
function renderDecision(){
  if(!els.decision)return;
  els.decision.innerHTML='';
  if(!pendingDecision)return;
  const d=pendingDecision,box=document.createElement('div');box.className='decision-box';
  const q=document.createElement('div');q.className='decision-question';q.textContent=d.question;box.appendChild(q);
  if(d.subtext){const s=document.createElement('div');s.className='decision-subtext';s.textContent=d.subtext;box.appendChild(s)}
  const actions=document.createElement('div');actions.className='decision-actions';
  if(d.kind==='castMode'){
    actions.appendChild(decisionButton(`Cast normally — ${d.card.manaCost||'{0}'}`,()=>{clearDecision();beginCostChoice(d.instance,d.card.manaCost,'normal')}));
    actions.appendChild(decisionButton('Face down — {3}',()=>{clearDecision();beginCostChoice(d.instance,'{3}','faceDown')}));
  }else if(d.kind==='x'){
    const minus=decisionButton('−',()=>{d.x=Math.max(0,d.x-1);renderDecision()});
    const val=document.createElement('strong');val.className='x-value';val.textContent=d.x;
    const plus=decisionButton('+',()=>{d.x++;renderDecision()});
    actions.append(minus,val,plus);
    const total=document.createElement('span');total.className='decision-cost';total.textContent=`Cost ${resolvedCost(d.cost,d.x)}`;actions.appendChild(total);
    actions.appendChild(decisionButton('Continue',()=>{const x=d.x,inst=d.instance,cost=d.cost,mode=d.mode;clearDecision();finishCostChoice(inst,cost,mode,x)},'primary'));
  }else if(d.kind==='discard'||d.kind==='discardAbilityCost'){
    const note=document.createElement('span');note.className='decision-cost';note.textContent='Choose a card directly from your hand.';actions.appendChild(note);
  }else if(d.kind==='targets'){
    const chosen=targetSelection?.selected.length||0;
    const status=document.createElement('span');status.className='decision-cost';status.textContent=`Selected ${chosen} / ${targetSelection?.spec.max||0}`;actions.appendChild(status);
    if(targetSelection?.spec.zones.includes('graveyard'))actions.appendChild(decisionButton('Player 1 Graveyard',()=>openGraveyard('graveyard')));
    if(targetSelection?.spec.zones.includes('opponentGraveyard'))actions.appendChild(decisionButton('Player 2 Graveyard',()=>openGraveyard('opponentGraveyard')));
    if(targetSelection?.spec.zones.some(z=>z.includes('Permanents'))){const note=document.createElement('span');note.className='decision-cost';note.textContent='Click a highlighted legal permanent on the battlefield.';actions.appendChild(note)}
    actions.appendChild(decisionButton('Confirm Targets',confirmTargets,'primary'));
  }else if(d.kind==='manaChoice'){
    d.choices.forEach(ch=>actions.appendChild(decisionButton(`Add ${ch.split('').map(x=>`{${x}}`).join('')}`,()=>chooseMana(ch),'primary')));
  }else if(d.kind==='topChoice'){
    resolvingChoice.cards.forEach(i=>actions.appendChild(decisionButton(def(i).name,()=>chooseTopManifest(i.instanceId))));
  }else if(d.kind==='additionalCost'){
    actions.appendChild(decisionButton('Sacrifice a creature',()=>beginSacrificeCost(d),'primary'));
    actions.appendChild(decisionButton('Pay 5 life',()=>payLifeCost(d,5),'primary'));
  }else if(d.kind==='sacrificeCreature'){
    const note=document.createElement('span');note.className='decision-cost';note.textContent='Click a creature you control to sacrifice it.';actions.appendChild(note);
  }else if(d.kind==='permanentActions'){
    d.actions.forEach(a=>actions.appendChild(decisionButton(a.label,()=>startPermanentAction(d.instance,a),a.kind==='activated'?'':'primary')));
  }else if(d.kind==='faceUpPayment'){
    d.plans.forEach(p=>actions.appendChild(decisionButton(`Pay ${paymentLabel(p)}`,()=>turnFaceUp(d.instance,d.action,p),'primary')));
  }else if(d.kind==='battlefieldCastX'){
    const minus=decisionButton('−',()=>{d.x=Math.max(0,d.x-1);renderDecision()});
    const val=document.createElement('strong');val.className='x-value';val.textContent=d.x;
    const plus=decisionButton('+',()=>{d.x++;renderDecision()});actions.append(minus,val,plus);
    const total=document.createElement('span');total.className='decision-cost';total.textContent=`Cost ${resolvedCost(d.action.cost,d.x)}`;actions.appendChild(total);
    actions.appendChild(decisionButton('Continue',()=>{const i=d.instance,a=d.action,x=d.x;clearDecision();finishBattlefieldCastCost(i,a,x)},'primary'));
  }else if(d.kind==='battlefieldCastPayment'){
    d.plans.forEach(p=>actions.appendChild(decisionButton(`Pay ${paymentLabel(p)}`,()=>completeBattlefieldCast(d.instance,d.action,d.x,p),'primary')));
  }else if(d.kind==='activatedAbility'){
    actions.appendChild(decisionButton('Activate',()=>activateAbility(d.instance),'primary'));
  }else if(d.kind==='madnessOffer'){
    actions.appendChild(decisionButton(`Cast for ${d.instance&&def(d.instance).madnessCost||'{0}'}`,()=>acceptMadness(d),'primary'));
    actions.appendChild(decisionButton('Discard normally',()=>declineMadness(d)));
  }else if(d.kind==='madnessPayment'){
    d.plans.forEach(p=>actions.appendChild(decisionButton(`Pay ${paymentLabel(p)}`,()=>castMadness(d.instance,d.cost,p,d.after))));
  }else if(d.kind==='flashbackPayment'){
    d.plans.forEach(p=>actions.appendChild(decisionButton(`Pay ${paymentLabel(p)}`,()=>{const i=d.instance,cost=d.cost;clearDecision();completeFlashback(i,cost,p)})));
  }else if(d.kind==='payment'){
    d.plans.forEach(p=>actions.appendChild(decisionButton(`Pay ${paymentLabel(p)}`,()=>completeCast(d.instance,d.cost,d.mode,d.x,p))));
  }
  if(!['discard','discardAbilityCost','manaChoice','topChoice','sacrificeCreature','madnessOffer','madnessPayment'].includes(d.kind))actions.appendChild(decisionButton('Cancel',()=>{if(targetSelection)cancelTargets();else{clearDecision();render()}},'cancel'));
  box.appendChild(actions);els.decision.appendChild(box);
}
function legalTiming(c,mode='normal'){
  if(state.active!=='player1'){log('It is not your turn.');return false}
  const needsSorcerySpeed=mode==='faceDown'||c.types?.includes('Sorcery')||(isPermanent(c)&&!c.types?.includes('Instant'));
  if(needsSorcerySpeed&&!sorcerySpeedAvailable()){log(`${mode==='faceDown'?'A face-down creature spell':c.name} can only be cast during your main phase while the stack is empty.`);return false}
  return true;
}
function beginCostChoice(i,cost,mode='normal'){
  const c=def(i);if(!legalTiming(c,mode)){render();return}
  if(costTokens(cost).includes('X')){
    pendingDecision={kind:'x',question:`Choose X for ${c.name}`,subtext:mode==='faceDown'?'Playing face down.':'Choose the value before paying mana.',instance:i,cost,mode,x:0};render();return;
  }
  finishCostChoice(i,cost,mode,0);
}
function finishCostChoice(i,cost,mode,x=0){
  const c=def(i),result=paymentPlans(cost,state.mana,x);
  if(!result.plans.length){log(`${c.name}: ${result.reason}`);render();return}
  if(result.plans.length===1){completeCast(i,cost,mode,x,result.plans[0]);return}
  pendingDecision={kind:'payment',question:`How do you want to pay for ${c.name}?`,subtext:`Cost ${resolvedCost(cost,x)} — choose which colors to spend.`,instance:i,cost,mode,x,plans:result.plans};render();
}
function completeCast(i,cost,mode,x,plan){
  const c=def(i);
  if(mode==='normal'&&c.additionalCost?.choose){pendingDecision={kind:'additionalCost',question:`${c.name} — choose an additional cost.`,subtext:'This cost is paid before the spell is cast.',instance:i,cost,mode,x,plan};render();return}
  if(mode!=='faceDown'&&effectFor(c)?.targets){beginTargetSelection(i,cost,mode,x,plan);return}
  completeCastFinal(i,cost,mode,x,plan,[]);
}
function payLifeCost(d,n){if(state.life<=n){log(`You cannot pay ${n} life.`);render();return}state.life-=n;clearDecision();completeCastAfterAdditional(d.instance,d.cost,d.mode,d.x,d.plan)}
function beginSacrificeCost(d){const creatures=zones.playerPermanents.filter(i=>isCreature(i));if(!creatures.length){log('You have no creature to sacrifice.');render();return}pendingDecision={kind:'sacrificeCreature',question:'Choose a creature to sacrifice.',data:d};render()}
function chooseSacrificeCreature(i){const d=pendingDecision?.data;if(!d)return;move(i,'playerPermanents','graveyard');log(`${def(i).name} is sacrificed as an additional cost.`);clearDecision();completeCastAfterAdditional(d.instance,d.cost,d.mode,d.x,d.plan)}
function completeCastAfterAdditional(i,cost,mode,x,plan){const c=def(i);if(mode!=='faceDown'&&effectFor(c)?.targets){beginTargetSelection(i,cost,mode,x,plan);return}completeCastFinal(i,cost,mode,x,plan,[])}
function beginActivatedAbility(i,c){const a=(c.abilities||[]).find(x=>x.kind==='activated');if(!a){inspect(c,i);return}pendingDecision={kind:'activatedAbility',question:`Activate ${c.name}?`,subtext:(c.rulesText||'').split('\n')[0],instance:i};render()}
function activateAbility(i){
  const c=def(i),a=(c.abilities||[]).find(x=>x.kind==='activated');if(!a)return;
  const costs=a.cost||[];const manaCost=costs.filter(x=>x!=='{T}'&&/^\{/.test(x)).join('');
  if(costs.includes('{T}')&&i.tapped){log(`${c.name} is tapped.`);render();return}if(costs.includes('{T}')&&isCreature(i,c)&&summoningSick(i,c)){log(`${c.name} has summoning sickness.`);render();return}
  if(costs.includes('discardCard')&&!zones.hand.length){log(`${c.name}: you need a card to discard.`);render();return}
  const result=paymentPlans(manaCost,state.mana);if(!result.plans.length){log(`${c.name}: ${result.reason}`);render();return}
  applyPayment(result.plans[0]);if(costs.includes('{T}'))i.tapped=true;
  if(costs.includes('discardCard')){pendingDecision={kind:'discardAbilityCost',question:`${c.name} — discard a card.`,subtext:'Click a card in your hand to pay the activation cost.'};resolvingChoice={kind:'discardAbilityCost',source:i,ability:a};render();return}
  resolveActivatedAbility(i,a);
}
function resolveActivatedAbility(source,a){
  pendingDecision=null;resolvingChoice=null;
  const e=normalizeEffect({effect:a.effect,amount:a.amount});
  if(e?.op==='manifest')manifestTop(source.controller,e.count||1);
  log(`${def(source).name}'s ability resolves.`);render();
}

function completeCastFinal(i,cost,mode,x,plan,targets=[],fromZone='hand',castMethod='normal'){
  const c=def(i);applyPayment(plan);clearDecision();
  i.targets=[...targets];
  if(mode==='faceDown'){
    i.faceDown=true;i.faceDownKind='morph';i.castFaceDown=true;i.castX=x;
    move(i,fromZone,'stack');log(`You cast a card face down as a 2/2 creature for {3}. Opponent passes priority.`);
  }else{
    i.castFaceDown=false;i.castX=x;i.manaSpent={...plan.spend};
    i.castMethod=castMethod;move(i,fromZone,'stack');log(`${c.name} is cast${castMethod==='flashback'?' with Flashback':castMethod==='madness'?' with Madness':''} for ${resolvedCost(cost,x)||'{0}'}. Opponent passes priority.`);
  }
  render();
}
function beginFlashback(i){
  if(gameLocked())return;
  const c=def(i);
  if(i.zone!=='graveyard'||i.owner!=='player1'||!c.flashbackCost){inspect(c,i);return}
  if(!legalTiming(c,'normal')){render();return}
  closeGraveyard();
  const result=paymentPlans(c.flashbackCost,state.mana,0);
  if(!result.plans.length){log(`${c.name}: ${result.reason}`);render();return}
  if(result.plans.length===1){completeFlashback(i,c.flashbackCost,result.plans[0]);return}
  pendingDecision={kind:'flashbackPayment',question:`Cast ${c.name} with Flashback?`,subtext:`Flashback cost ${c.flashbackCost}. Choose which colors to spend.`,instance:i,cost:c.flashbackCost,plans:result.plans};
  render();
}
function completeFlashback(i,cost,plan){
  const c=def(i),fx=effectFor(c);
  if(fx?.targets){
    // Current flashback card has no targets; preserve the architecture for later targeted flashback cards.
    log('Targeted Flashback casting will use the normal targeting flow when needed.');
  }
  completeCastFinal(i,cost,'normal',0,plan,[],'graveyard','flashback');
}
function cast(i){if(gameLocked())return;
  if(pendingDecision){log('Finish or cancel the current choice first.');render();return}
  const c=def(i);
  if(c.morphCost!=null||c.spellmorphCost!=null){
    pendingDecision={kind:'castMode',question:`How do you want to play ${c.name}?`,subtext:c.spellmorphCost!=null?'This card has Spellmorph.':'This card has Morph.',instance:i,card:c};render();return;
  }
  beginCostChoice(i,c.manaCost,'normal');
}
function finishPausedDiscardResolution(){
  if(!resolvingChoice)return;
  resolvingChoice.remaining--;
  if(resolvingChoice.remaining>0){pendingDecision={kind:'discard',question:`${def(resolvingChoice.spell).name} — discard a card.`,subtext:'Click a card in your hand to discard it.'};render();return}
  const spell=resolvingChoice.spell;resolvingChoice=null;pendingDecision=null;
  spell.zone=spell.castMethod==='flashback'?(spell.owner==='player1'?'exile':'opponentExile'):(spell.owner==='player1'?'graveyard':'opponentGraveyard');
  zones[spell.zone].push(spell);
  log(`${def(spell).name} resolves${spell.castMethod==='flashback'?' and is exiled by Flashback':''}.`);
}
function beginMadnessDiscard(i,after){
  const c=def(i);
  if(!c?.madnessCost){after(false);return}
  pendingDecision={kind:'madnessOffer',question:`${c.name} — Madness ${c.madnessCost}`,subtext:'Cast this card for its Madness cost instead of discarding it?',instance:i,after};
  render();
}
function declineMadness(d){
  const i=d.instance,c=def(i);pendingDecision=null;
  if(i.zone==='hand'){move(i,'hand','graveyard');log(`Player 1 discards ${c.name}.`)}
  d.after(false);render();
}
function acceptMadness(d){
  const i=d.instance,c=def(i),cost=c.madnessCost;
  const result=paymentPlans(cost,state.mana,0);
  if(!result.plans.length){log(`${c.name}: ${result.reason}`);render();return}
  if(result.plans.length===1){castMadness(i,cost,result.plans[0],d.after);return}
  pendingDecision={kind:'madnessPayment',question:`Cast ${c.name} with Madness?`,subtext:`Madness cost ${cost}. Choose which colors to spend.`,instance:i,cost,plans:result.plans,after:d.after};render();
}
function castMadness(i,cost,plan,after){
  const c=def(i),fx=effectFor(c);
  // Madness ignores normal sorcery timing because the permission is created by the discard.
  if(fx?.targets){
    const legal=legalTargets(fx.targets);
    if(legal.length<fx.targets.min){log(`${c.name} cannot be cast with Madness: it lacks the required legal target.`);pendingDecision=null;move(i,'hand','graveyard');log(`Player 1 discards ${c.name}.`);after(false);render();return}
    // Preserve the discard continuation through target selection.
    targetSelection={spell:i,cost,mode:'normal',x:0,plan,spec:fx.targets,selected:[],fromZone:'hand',castMethod:'madness',afterMadness:after};
    pendingDecision={kind:'targets',question:`${c.name} — ${fx.targets.label}`,subtext:`Choose ${fx.targets.min===fx.targets.max?fx.targets.min:`${fx.targets.min} to ${fx.targets.max}`} target${fx.targets.max===1?'':'s'}.`};
    render();return;
  }
  pendingDecision=null;completeCastFinal(i,cost,'normal',0,plan,[],'hand','madness');after(true);
}
function discardForChoice(i){
  if(!resolvingChoice||i.zone!=='hand')return;
  const c=def(i);
  if(c?.madnessCost){beginMadnessDiscard(i,()=>finishPausedDiscardResolution());return}
  move(i,'hand','graveyard');log(`Player 1 discards ${c.name}.`);finishPausedDiscardResolution();render();
}
function resolveTop(){
  const i=zones.stack.pop();if(!i)return;
  const c=def(i),face=!!i.castFaceDown,fx=face?null:effectFor(c);
  let legalIds=i.targets||[];
  if(fx?.targets){
    legalIds=legalIds.filter(id=>targetStillLegal(fx.targets,id));
    if((i.targets||[]).length>0&&legalIds.length===0){
      i.zone=i.owner==='player1'?'graveyard':'opponentGraveyard';zones[i.zone].push(i);
      log(`${c.name} is countered on resolution because all of its targets are illegal.`);
      return;
    }
  }
  if(fx){const status=executeEffect(i,fx,legalIds);if(status==='paused'){i.zone='resolving';render();return}}
  const dest=i.castMethod==='flashback'?(i.owner==='player1'?'exile':'opponentExile'):face?(i.owner==='player1'?'playerPermanents':'opponentPermanents'):(isPermanent(c)?(i.owner==='player1'?'playerPermanents':'opponentPermanents'):(i.owner==='player1'?'graveyard':'opponentGraveyard'));
  i.zone=dest;if((dest==='playerPermanents'||dest==='opponentPermanents')&&isCreature(i,c))i.enteredTurn=state.turn;
  zones[dest].push(i);
  log(face?'The face-down 2/2 resolves onto the battlefield.':`${c.name} resolves${isPermanent(c)?' onto the battlefield':'.'}`);
}
function advance(){if(gameLocked())return;
  if(zones.stack.length){resolveTop();render();return}
  if(pendingDecision){log('Finish or cancel the current choice first.');render();return}
  const leaving=PHASES[state.phase];
  if(state.active==='player1'&&leaving==='Beginning Combat'){
    const eligible=zones.playerPermanents.filter(i=>attackEligible(i));
    if(!eligible.length){
      log('No creatures can attack. Declare attackers, blockers, and combat damage are skipped.');
      state.phase=PHASES.indexOf('End Combat');render();return;
    }
  }
  if(state.active==='player1'&&leaving==='Declare Attackers'){
    if(!state.attackers.length){
      log('No attackers are declared. Declare blockers and combat damage are skipped.');
      state.phase=PHASES.indexOf('End Combat');render();return;
    }
    state.attackers.forEach(id=>{const a=zones.playerPermanents.find(x=>x.instanceId===id);if(a)a.tappedForAttack=false});log(`${state.attackers.length} attacker${state.attackers.length===1?'':'s'} declared.`);
  }
  if(state.active==='player1'&&leaving==='Declare Blockers'){
    log('Opponent declares no blockers.');
  }
  if(state.active==='player1'&&leaving==='Combat Damage')combatDamage();
  if(leaving==='End Combat')clearCombat();
  if(leaving==='End')cleanupEndTurn();
  emptyMana();
  state.phase++;
  if(state.phase>=PHASES.length){
    if(state.active==='player1'){
      clearCombat();state.autoYield=false;state.active='opponent';state.phase=0;state.landPlayed=false;log('Opponent begins their turn.');autoOpponentTurn();return
    }else{
      clearCombat();state.autoYield=false;state.active='player1';state.turn++;state.phase=PHASES.indexOf('Upkeep');state.landPlayed=false;
      zones.playerLands.concat(zones.playerPermanents).forEach(i=>i.tapped=false);
      log(`Turn ${state.turn} begins. Permanents untap; upkeep begins.`);
    }
  }
  if(state.active==='player1'&&PHASES[state.phase]==='Draw')draw('player1');
  if(state.active==='player1'&&PHASES[state.phase]==='Declare Attackers'){
    const eligible=zones.playerPermanents.filter(i=>canAttack(i));
    log(eligible.length?'Declare attackers: click eligible creatures to attack, then press Pass / Next.':'Declare attackers: you have no creatures able to attack.');
  }
  render();
}
function endTurn(){
  if(gameLocked())return;
  if(state.active!=='player1')return;
  if(pendingDecision){log('Finish or cancel the current choice first.');render();return}
  state.autoYield=true;
  log('Player 1 yields priority through the rest of the turn.');
  runAutoYield();
}
function runAutoYield(){
  if(!state.autoYield||state.gameOver||state.active!=='player1')return;
  // Stop whenever the game presents a choice or something appears on the stack.
  if(pendingDecision||zones.stack.length){state.autoYield=false;render();return}
  let guard=30;
  while(state.autoYield&&!state.gameOver&&state.active==='player1'&&!pendingDecision&&!zones.stack.length&&guard-->0){
    advance();
  }
  render();
}
function autoOpponentTurn(){emptyMana();zones.opponentLands.concat(zones.opponentPermanents).forEach(i=>i.tapped=false);draw('opponent');log('Opponent draws, then passes through their turn.');state.active='player1';state.turn++;state.phase=PHASES.indexOf('Upkeep');state.landPlayed=false;zones.playerLands.concat(zones.playerPermanents).forEach(i=>i.tapped=false);log(`Turn ${state.turn} begins. Permanents untap; upkeep begins.`);render()}
function reset(){clearDecision();targetSelection=null;resolvingChoice=null;closeGraveyard();Object.keys(zones).forEach(z=>zones[z]=[]);Object.assign(state,{turn:1,active:'player1',phase:PHASES.indexOf('Upkeep'),life:20,oppLife:20,landPlayed:false,log:[],mana:freshPool(),oppMana:freshPool(),attackers:[],blockers:{},lost:{player1:false,opponent:false},gameOver:false,winner:null,autoYield:false});zones.library=buildDeck('player1');zones.opponentLibrary=buildDeck('player2');for(let n=0;n<7;n++){draw('player1',false);draw('player2',false)}log('Opening hands drawn. You play first; upkeep begins. Click an untapped land to add mana.');render()}
function findInst(id){return Object.values(zones).flat().find(i=>i.instanceId===id)}
document.querySelectorAll('.drop-zone').forEach(el=>{el.addEventListener('dragover',e=>{e.preventDefault();el.classList.add('drag-over')});el.addEventListener('dragleave',()=>el.classList.remove('drag-over'));el.addEventListener('drop',e=>{e.preventDefault();el.classList.remove('drag-over');let d;try{d=JSON.parse(e.dataTransfer.getData('text/plain'))}catch{return}const i=findInst(d.id);if(!i||i.zone!=='hand')return;const c=def(i),to=el.dataset.zone;if(to==='playerLands'){if(isLand(c))playLand(i,false);else if(c.terramorphCost)playLand(i,true);else log('That card cannot be played as a land.')}else if(to==='stack'||to==='playerPermanents'){if(isLand(c))playLand(i,false);else cast(i)}render()})});
document.querySelectorAll('.graveyard-open').forEach(b=>b.addEventListener('click',()=>openGraveyard(b.dataset.graveyard)));
$('#close-graveyard').addEventListener('click',closeGraveyard);
$('#advance').addEventListener('click',advance);
$('#end-turn').addEventListener('click',endTurn);$('#reset').addEventListener('click',reset);reset();
