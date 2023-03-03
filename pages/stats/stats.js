/*PARTY*/
function stats(){
  if(myStorage.get('calc')) calculate();
  calculate();
  let SD = document.getElementById('js-statsD')
  let SA = document.getElementById('js-statsA')
  
  makeTypes(SD, SA)
  Object.entries(myStorage.get('pData')).forEach(([name, pkmn]) => {
    let MON,PIC
    MON = create(SD, 'div', {'class': 'pokemon'});
    PIC = create(MON, 'img', {'class': 'stats__img'});
    getPokemon(PIC, name)
    setError(PIC)
    makeDEF(SD, pkmn)

    MON = create(SA, 'div', {'class': 'pokemon'});
    PIC = create(MON, 'img', {'class': 'stats__img'});
    getPokemon(PIC, name)
    setError(PIC)
    makeATK(SA, pkmn)
  });
  makeCum(SD, 'TDWEAK', 'WK', 'bg--wk')
  makeCum(SD, 'TDRES', 'RES', 'bg--rs')
  makeCum(SA, 'TATK', 'EFF', 'bg--wk')
  makeCum(SA, 'TCOMB', 'CUM', 'bg--rs')

}

function makeTypes(SD, SA){
  SDB_TYPES.forEach(type => {
    let D = create(SD, 'div', {'class': 'stats__type', 'data-color': type});
    let A = create(SA, 'div', {'class': 'stats__type', 'data-color': type});
    D.textContent = type
    A.textContent = type
  })
}

function makeDEF(SD, pkmn){
  let total = 1;
  pkmn.WEAKNESS.forEach(v => {
    total *= v == 0? 1/8: v
    const CELL = create(SD, 'div', {'class': 'stats__cell'});
    if(v == 1) return
    switch(v){
      case 4: CELL.classList.add('cell--redder'); break;
      case 2: CELL.classList.add('cell--red'); break;
      case 0.5: CELL.classList.add('cell--green'); break;
      case 0.25: CELL.classList.add('cell--greener'); break;
      case 0: CELL.classList.add('cell--immune'); break;
    }
    let tx = v == 0.25? '¼': v == 0.5? '½': v
    CELL.textContent = tx
  })
  const TOTAL = create(SD, 'div', {'class': 'stats__total'});
  if(total < 1) TOTAL.classList.add('cell--greener')
  else if(total > 1) TOTAL.classList.add('cell--redder')
  TOTAL.textContent = total > 1? total: 1/total;
}

function makeATK(SD, pkmn){
  let total = 0;
  pkmn.HITS.forEach(v => {
    total += v == 0? 0: 1
    const CELL = create(SD, 'div', {'class': 'stats__cell'});
    if(v == 0) return
    switch(v){
      case 0.5: CELL.classList.add('cell--redder'); break;
      case 1: CELL.classList.add('cell--red'); break;
      case 2: CELL.classList.add('cell--green'); break;
      case 4: case 8: CELL.classList.add('cell--greener'); break;
      case 16: CELL.classList.add('cell--immune'); break;
    }
    let tx = v == 0.25? '¼': v == 0.5? '½': v
    CELL.textContent = tx
  })
  const TOTAL = create(SD, 'div', {'class': 'stats__total total--norm'});
  TOTAL.textContent = total > 1? total: 1/total;
}

function makeCum(SD, prop, name, c){
  let p = myStorage.get('pivot')

  const T = create(SD, 'div', {'class': 'stats__title'});
  T.textContent = name;
  let total = 0
  p[prop].forEach(v => {
    total += v
    const CELL = create(SD, 'div', {'class': 'stats__cell'});
    create(CELL, 'div', {'class': 'stats__bg '+c});
    const SUM = create(CELL, 'div', {'class': 'stats__cum'});
    SUM.textContent = v
  })
  const TOTAL = create(SD, 'div', {'class': 'stats__total'});
  TOTAL.textContent = total;
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
    const MOVE = create(CONT, 'div', {'class': 'move', 'data-color': move.type});
    MOVE.style = `grid-row: ${index};`
    
    makeText(MOVE, pi, 'M'+index, 'move__name')
    
    makeSelect(MOVE, pi, 'T'+index, 'move__type', SDB_TYPES, 2)
    
    makeNumber(MOVE, pi, 'P'+index, 'move__pow')
    
    makeSelect(MOVE, pi, 'C'+index, 'move__cat', ['P','S','T'])
    
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
