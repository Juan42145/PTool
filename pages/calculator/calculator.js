const LDB = myStorage.get('DB').Pokemon;
let types = Array(2).fill(-1);
let scores = [];
let dict = {4:4, 2:2, 1:1, 0.5:'1/2', 0.25:'1/4', 0:'IMMUNE'}

/*CALCULATE*/
function calculator(){
  if(myStorage.get('calc')) calculate();
  norm = myStorage.get('norm')
  makeButtons('js-type1',false)
  makeButtons('js-type2',true)
}

function makeButtons(CID, isNone){
  let CONT = document.getElementById(CID)
  let n = +isNone
  if(isNone){
    let BTN = create(CONT, 'button', {'class': 'btn-type btn--none btn--selected', 'data-color':'',
    'onClick': `selectType(this,-1,${n})`});
    BTN.textContent = 'None'
  }
  SDB_TYPES.forEach((type, i) => {
    let BTN = create(CONT, 'button', {'id': 'TB-'+i,'class': 'btn-type', 'data-color': type,
    'onClick': `selectType(this,${i},${n})`});
    BTN.textContent = type
  })
}

function selectType(BTN, i, num){
  let cont = document.getElementById('js-type'+(num+1))
  let oppo = document.getElementById('js-type'+(2-num))
  if(types[num] == i){
    types[num] = -1
    if(i == -1) return
    BTN.classList.remove('btn--selected')
    oppo.querySelector('#TB-'+i).classList.remove('btn--un')
    if(num){
      document.querySelector('.btn--none').classList.add('btn--selected')
    }
  }
  else{
    let s = cont.querySelector('.btn--selected')
    if(s) s.classList.remove('btn--selected')
    let o = oppo.querySelector('.btn--un')
    if(o) o.classList.remove('btn--un')
    types[num] = i
    BTN.classList.add('btn--selected')
    if(i != -1) oppo.querySelector('#TB-'+i).classList.add('btn--un')
  }
  if(types[0] == -1) calc(0)
  else if(types[1] == -1) calc(1)
  else calc(2)
}

function calcScore(pokemon){
  pokemon.forEach(pkmn => {
    let score = pkmn.MOVES.reduce((acc, val) => {
      let v = val.effectiveness[types[0]]
      if(types[1] != -1) v *= val.effectiveness[types[1]]
      return v > acc? v : acc;
    }, 0);
    score /= getDiv(pkmn.WEAKNESS[types[0]])
    if(types[1] != -1) score /= getDiv(pkmn.WEAKNESS[types[1]])
    scores[pkmn.INDEX] = score
  })
}

function getDiv(val){
  return val == 0? 1/8: val
}

function sorting(a,b){
  return scores[b.INDEX] - scores[a.INDEX]
}

function calc(num){
  const DATA = document.getElementById('js-data')
  DATA.innerHTML = ''
  if(!num) return
  let pokemon = Object.values(myStorage.get('pData'))
  calcScore(pokemon)
  pokemon.sort(sorting).forEach(pkmn => {
    const MON = create(DATA, 'div', {'class': 'pokemon'});

    const INFO = create(MON, 'div', {'class': 'info'});
    makeInfo(INFO, pkmn, MON, num)

    const MOVES = create(MON, 'div', {'class': 'moves'});
    pkmn.MOVES.forEach(move => {
      makeMove(MOVES, move)
    })
  });
}

function makeInfo(CONT, pkmn, ROOT, num){
  const PKMN = LDB[pkmn.INDEX]

  let t1 = PKMN.Type1.toLowerCase()
  let t2 = PKMN.Type2? PKMN.Type2.toLowerCase(): t1

  ROOT.style.setProperty('--c1', `var(--${t1})`);
  ROOT.style.setProperty('--c2', `var(--${t2})`);
  
  const BG = create(CONT, 'div', {'class': 'info--bg'});
  const CN = create(CONT, 'div', {'class': 'info--cont'});
  
  const PIC = create(BG, 'img', {'class': 'info__img'});
  getPokemon(PIC, PKMN.Name)
  setError(PIC)

  const NAME = create(CN, 'div', {'class': 'info__name'});
  NAME.textContent = PKMN.Name
  
  const SCORE = create(CN, 'div', {'class': 'info__score'});
  SCORE.textContent = scores[pkmn.INDEX]
  
  for(let i = 0; i < num; i++){
    const D = create(CN, 'div', {'class': 'info__type', 'data-color': SDB_TYPES[types[i]]});
    let w = pkmn.WEAKNESS[types[i]]
    let mod = w > 1?'bg--weak': w < 1? 'bg--res': ''
    create(D, 'div', {'class': 'type__bg ' + mod});
    const DT = create(D, 'div', {'class': 'type__tx'});
    DT.textContent = dict[w]
  }
}

function makeMove(CONT, move){
  const MOVE = create(CONT, 'div', {'class': 'move', 'data-color': move.type});
  
  const NAME = create(MOVE, 'div', {'class': 'move__name'});
  NAME.textContent = move.name
  
  const TYPE = create(MOVE, 'div', {'class': 'move__type'});
  TYPE.textContent = move.type
  
  const CAT = create(MOVE, 'div', {'class': 'move__cat'});
  const CATI = create(CAT, 'img', {'class': 'move__img', 'src':getCat(move.category)});
  setError(CATI)
  
  let t1 = SDB_TYPES[types[0]].toLowerCase()
  let t2 = t1
  let mult = move.effectiveness[types[0]]
  if(types[1] != -1){
    t2 = SDB_TYPES[types[1]].toLowerCase()
    mult *= move.effectiveness[types[1]]
  }

  const HIT = create(CONT, 'div', {'class': 'hit', 'data-color': move.type});
  HIT.style.setProperty('--c1', `var(--${t1})`);
  HIT.style.setProperty('--c2', `var(--${t2})`);

  const TEFF = create(HIT, 'div', {'class': 'teff'});
  
  let text = '';
  if(mult == 0) TEFF.classList.add('teff--none')
  else if(mult == 4) text = 'auto_awesome'
  else if(mult == 2) text = 'star'
  else if(mult == 0.5) text = 'block'
  else if(mult == 0.25) text = 'cancel'
      
  const TEFFT = create(TEFF, 'span', {'class': 'teff__tx material-symbols-outlined'});
  TEFFT.textContent = text

  const DMG = create(HIT, 'div', {'class': 'move__dmg'});
  DMG.textContent = Math.floor(move.dmg*norm*mult)
}