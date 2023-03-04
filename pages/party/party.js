let LDB;

/*PARTY*/
function party(){
  if(myStorage.get('calc')) calculate();
  LDB = myStorage.get('DB').Pokemon;
  let PARTY = document.getElementById('js-party')
  PARTY.innerHTML = ''
  norm = myStorage.get('norm')
  
  Object.values(myStorage.get('pData')).forEach(pkmn => {
    const MON = create(PARTY, 'div', {'class': 'pokemon'});

    const INFO = create(MON, 'div', {'class': 'info'});
    makeInfo(INFO, pkmn, MON)

    const MOVES = create(MON, 'div', {'class': 'moves'});
    for(let i = 0; i < 4; i++){
      makeMoveData(MOVES, pkmn.MOVES[i], i+1, pkmn.INDEX)
    }
  });

}

function makeInfo(CONT, pkmn, ROOT){
  const PKMN = LDB[pkmn.INDEX]

  let t1 = PKMN.Type1.toLowerCase()
  let t2 = PKMN.Type2? PKMN.Type2.toLowerCase(): t1
  let d = Math.abs(PKMN.ATK - PKMN.SPATK)

  ROOT.style.setProperty('--c1', `var(--${t1})`);
  ROOT.style.setProperty('--c2', `var(--${t2})`);
  
  const BG = create(CONT, 'div', {'class': 'info--bg'});
  const CN = create(CONT, 'div', {'class': 'info--cont'});
  
  const PIC = create(BG, 'img', {'class': 'info__img'});
  getPokemon(PIC, PKMN.Name)
  setError(PIC)

  makeText(CN, pkmn.INDEX, 'Name', 'info__name')
  
  makeSelect(CN, pkmn.INDEX, 'Type1', 'info__type', SDB_TYPES, 1)
  makeSelect(CN, pkmn.INDEX, 'Type2', 'info__type', ['', ...SDB_TYPES], 1)
  
  makeNumber(CN, pkmn.INDEX, 'Level', 'info__level')
  makeNumber(CN, pkmn.INDEX, 'SPATK', 'info__spa')
  makeNumber(CN, pkmn.INDEX, 'ATK', 'info__atk')
}

function makeMoveData(CONT, move, index, pi){
  const MOVE = create(CONT, 'div', {'class': 'move'});
  if(move) MOVE.dataset.color = move.type
  MOVE.style = `grid-row: ${index};`
  
  makeText(MOVE, pi, 'M'+index, 'move__name')
  
  makeSelect(MOVE, pi, 'T'+index, 'move__type', [...SDB_TYPES,''], 2)
  
  makeNumber(MOVE, pi, 'P'+index, 'move__pow')
  
  makeSelect(MOVE, pi, 'C'+index, 'move__cat', ['P','S','T',''])
  
  if(!move) return
  const CALC = create(MOVE, 'div', {'class': 'move__calc'});
  const DMG = create(CALC, 'div', {'class': 'move__dmg'});
  const DMGT = create(DMG, 'div');
  DMGT.textContent = Math.floor(move.dmg*norm)
  const HIT = create(CALC, 'div', {'class': 'move__hit'});
  const HITT = create(HIT, 'div');
  HITT.textContent = Math.floor(move.dmg*norm*2)
  const MISS = create(CALC, 'div', {'class': 'move__miss'});
  const MISST = create(MISS, 'div');
  MISST.textContent = Math.floor(move.dmg*norm/2)
}

function makeText(CONT, index, prop, c){
  const PKMN = LDB[index]
  const INP = create(CONT, 'input', {'class': c, 'value': PKMN[prop], 'type': 'text'});
  makeInput(INP, index, prop)
}

function makeNumber(CONT, index, prop, c){
  const PKMN = LDB[index]
  const INP = create(CONT, 'input', {'class': c, 'value': PKMN[prop], 'type':'text','pattern':'\\d*'});
  makeInput(INP, index, prop)
}

function makeSelect(CONT, index, prop, c, opts, mode){
  //0:none, 1:color This, 2:color CONT
  const PKMN = LDB[index]
  const INP = create(CONT, 'select', {'class': c});
  opts.forEach(opt => {
    let o = create(INP, 'option')
    if(PKMN[prop] == opt){
      o.selected = true
      if(mode == 1) INP.dataset.color = opt
      else if(mode == 2) CONT.dataset.color = opt
    }
    o.textContent = opt
  })
  makeDropdown(INP, index, prop, mode, CONT)
}

function makeInput(INP, index, prop){
  const PKMN = LDB[index]
  INP.addEventListener('blur',()=>{ if(INP.defaultValue === INP.value) return;
    PKMN[prop] = INP.value; store('Pokemon', LDB);
    myStorage.set('calc', true); caching('cachePkm', PKMN.ROW, PKMN)
    party()
  }, false);
  INP.addEventListener('click', (e)=>{focusText(e)})
}

function makeDropdown(INP, index, prop, mode, CONT){
  const PKMN = LDB[index]
  INP.addEventListener('change',()=>{
    if(mode == 1) INP.dataset.color = INP.value
    else if(mode == 2) CONT.dataset.color = INP.value
    PKMN[prop] = INP.value; store('Pokemon', LDB);
    myStorage.set('calc', true); caching('cachePkm', PKMN.ROW, PKMN)
    party()
  }, false);
}

function save(){
  store('Pokemon', LDB); setPKM();
}