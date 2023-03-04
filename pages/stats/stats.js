/*PARTY*/
function stats(){
  if(myStorage.get('calc')) calculate();
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
