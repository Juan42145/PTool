let LDB;
let assData = []

/*ASSESS*/
function assess(){
  if(myStorage.get('calc')) calculate();
  LDB = myStorage.get('DB').Pokemon;

  let MENU = document.getElementById('js-menu')
  const INP = create(MENU, 'select', {'class': 'ass__name'});
  create(INP, 'option', {'selected': true, 'hidden': true})
  Object.entries(myStorage.get('pData')).forEach(([opt, data], i) => {
    let o = create(INP, 'option')
    o.textContent = opt
    o.value = data.INDEX
  })
  INP.addEventListener('change',()=>{ass(INP.value)}, false);
}

function ass(opt){
  let CONT = document.getElementById('js-cont')
  CONT.innerHTML = ''
  const PKMN = LDB[opt]
  const INFO = create(CONT, 'div', {'class': 'info'});
  makeInfo(INFO, PKMN)
  const WEAK = create(CONT, 'div', {'class': 'weak', 'id': 'js-weak'});
  makeWeak(PKMN)
  const MOVES = create(CONT, 'div', {'class': 'moves'});
  for(let i = 0; i < 4; i++){
    makeSelect(MOVES, PKMN, 'T'+(i+1), 'move', [...SDB_TYPES,''])
  }
  document.getElementById('js-data').classList.remove('hide')
  generate()
}

function makeInfo(CONT, PKMN){
  CONT.dataset.t1 = PKMN.Type1.toLowerCase()
  CONT.dataset.t2 = PKMN.Type2.toLowerCase()
  color(CONT)

  create(CONT, 'div', {'class': 'info--bg'});
  
  const PIC = create(CONT, 'img', {'class': 'info__img'});
  getPokemon(PIC, PKMN.Name)
  setError(PIC)
  
  makeSelect(CONT, PKMN, 'Type1', 'info__type', SDB_TYPES, 1)
  makeSelect(CONT, PKMN, 'Type2', 'info__type', ['', ...SDB_TYPES], 2)
}

function makeWeak(PKMN){
  CONT = document.getElementById('js-weak')
  CONT.innerHTML = ''

  const w4H = create(CONT, 'div', {'class': 'weak__header'})
  const w4T = create(w4H, 'div')
  w4T.textContent = '4'
  const w2H = create(CONT, 'div', {'class': 'weak__header'})
  const w2T = create(w2H, 'div')
  w2T.textContent = '2'
  const r2H = create(CONT, 'div', {'class': 'weak__header'})
  const r2T = create(r2H, 'div')
  r2T.textContent = '½'
  const r4H = create(CONT, 'div', {'class': 'weak__header'})
  const r4T = create(r4H, 'div')
  r4T.textContent = '¼'
  const x0H = create(CONT, 'div', {'class': 'weak__header weak__header--immune'})
  const x0T = create(x0H, 'div')
  x0T.textContent = '0'

  const w4 = create(CONT, 'div', {'class': 'weak__cont'})
  const w2 = create(CONT, 'div', {'class': 'weak__cont'})
  const r2 = create(CONT, 'div', {'class': 'weak__cont'})
  const r4 = create(CONT, 'div', {'class': 'weak__cont'})
  const x0 = create(CONT, 'div', {'class': 'weak__cont'})

  let [type1, type2] = Array.from(document.querySelectorAll('.info__type')).map(x => x.value)
  let weakness = type2? vmult(SDB_DEF[type1], SDB_DEF[type2]): SDB_DEF[type1]
  weakness.forEach((value, i) => {
    let c
    if(value == 1) return
    else if (value == 4) c = w4
    else if (value == 2) c = w2
    else if (value == 0.5) c = r2
    else if (value == 0.25) c = r4
    else c = x0
    let type = create(c, 'div', {'class': 'weak__type type', 'data-color': SDB_TYPES[i]})
    type.textContent = SDB_TYPES[i].substring(0,3)
  })
}

function color(CONT){
  let [t1, t2] = [CONT.dataset.t1, CONT.dataset.t2]
  if(!t2) t2 = t1
  CONT.style.setProperty('--c1', `var(--${t1})`);
  CONT.style.setProperty('--c2', `var(--${t2})`);
}

function makeSelect(CONT, PKMN, prop, c, opts, update){
  const INP = create(CONT, 'select', {'class': c});
  opts.forEach(opt => {
    let o = create(INP, 'option')
    if(PKMN[prop] == opt){
      o.selected = true
      INP.dataset.color = opt
    }
    o.textContent = opt
  })
  makeDropdown(INP, update, CONT, PKMN)
}

function makeDropdown(INP, update, CONT, PKMN){
  INP.addEventListener('change',()=>{
    INP.dataset.color = INP.value
    if(update){
      CONT.dataset['t'+update] = INP.value.toLowerCase()
      color(CONT)
      makeWeak(PKMN)
    }
    else{
      generate()
    }
  }, false);
}

function generate(){
  let offense = Array.from(document.querySelectorAll('.move')).map(x => x.value)
  let data = {'0': [], '0.25':[], '0.5':[], '1':[], '2':[], '4':[]}
  SDB_TYPES.forEach((type1, t1) => {
    SDB_TYPES.forEach((type2, t2) => {
      if(t1 > t2) return
      let score = -1
      offense.forEach(moveType => {
        if(!moveType) return
        if(t1 == t2) score = Math.max(score, SDB_ATK[moveType][t1])
        else score = Math.max(score, SDB_ATK[moveType][t1] * SDB_ATK[moveType][t2])
      })
      data[score].push({
        text: (t1 == t2)? type1: type1.substring(0,3)+'/'+type2.substring(0,3),
        t1: type1.toLowerCase(),
        t2: type2.toLowerCase(),
      })
    })
  })
  showData(data)
}

function sorting(a,b){
  return a[0]*4 - b[0]*4;
}

function showData(data){
  let DATA = document.getElementById('js-data')
  DATA.innerHTML = ''
  Object.entries(data).sort(sorting).forEach(([mult, list]) => {
    if(!list.length) return
    let ROW = create(DATA, 'div', {'class': 'data--row'});

    let HEAD = create(ROW, 'div', {'class': 'data--head'});
    let TAG = create(HEAD, 'div', {'class': 'data__tag'});
    TAG.textContent = `Deals ${mult}x to`
    let NUM = create(HEAD, 'div', {'class': 'data__num'});
    NUM.textContent = `(${list.length})`

    let LIST = create(ROW, 'div', {'class': 'data--list'});
    list.forEach(v => {
      let VAL = create(LIST, 'div', {'class': 'data__value type'});
      VAL.textContent = v.text
      VAL.style.setProperty('--c1', `var(--${v.t1})`);
      VAL.style.setProperty('--c2', `var(--${v.t2})`);
    })
  })
}