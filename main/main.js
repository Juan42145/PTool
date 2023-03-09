Storage.prototype.set = function(key, obj){
  return this.setItem(key, JSON.stringify(obj));
}

Storage.prototype.get = function(key){
  return JSON.parse(this.getItem(key));
}

myStorage = localStorage;

//Storage
function store(id, value){
  let data = myStorage.get('DB'); data[id] = value;
  myStorage.set('DB', data);
}

function caching(id, key, value){
  let cache
  if(key == null) cache = value
  else{
    cache = myStorage.get(id); if(!cache) cache = {};
    cache[key] = value;
  }
  myStorage.set(id, cache); console.log(cache);
}

//Create Element
function create(parent, element, attr){
  const E = document.createElement(element); parent.append(E);
  if(!attr) return E;
  Object.entries(attr).forEach(([attribute, value]) => {
    E.setAttribute(attribute, value);
  })
  return E;
}

//Insert
function insert(url){
  const INSERT = document.getElementById('insert')
  fetch(url).then(res=>res.text()).then(data=>{INSERT.innerHTML=data})
}

//Import
function imp(){
  const script = document.createElement('script'); document.head.append(script);
  script.setAttribute('src', "../../main/static.js"); 
}
imp()

//Focus Input
function focusText(e){
  e.target.setSelectionRange(e.target.value.length, e.target.value.length);
}

/*--IMAGES--*/
function getError(){
  return 'https://img.pokemondb.net/sprites/items/poke-ball.png';
}

function setError(COMP){
  COMP.onerror = ()=>COMP.src = getError();
}

async function getPokemon(IMG, pname){
  let name = pname.toLowerCase().replaceAll(' ','-');
  let image = await fetch('https://pokeapi.co/api/v2/pokemon/'+name)
    .then(response => response.json())
    .then(json => {
      if(!json) return
      return json.sprites.front_default
    })
    .catch(err=>console.log(name, 'not found'))
  IMG.src = image
}

function getCat(category){
  if(category == 'P') return '../../assets/physical.png'
  else if(category == 'S') return '../../assets/special.png'
  else return '../../assets/status.png'
}

/*--NAVBAR--*/
function makeNav(active){
  const pages = {
    HOME: '../home/home.html',
    PARTY: '../party/party.html',
    POKEMON: '../pokemon/pokemon.html',
    CALCULATOR: '../calculator/calculator.html',
    ASSESS: '../assess/assess.html',
    STATS: '../stats/stats.html',
  }

  const NAV = document.getElementById('js-nav')

  const index = create(NAV,'a',{'href':'../../index.html','class':'nav__btn nav__btn--home'})
  index.innerHTML = '&curren;';
  index.onclick = ()=>myStorage.clear();
  const close = create(NAV,'a',{'href':'javascript:void(0)','class':'nav__btn nav__btn--close'})
  close.innerHTML = '&times;';
  close.onclick = ()=>closeNav();

  Object.entries(pages).forEach(([page, link]) => {
    let a, f = page == active;
    if(f) a = create(NAV,'a',{'href':'javascript:void(0)','class':'nav-active'});
    else a = create(NAV,'a',{'href':link});
    a.textContent = page;
  });
}

function openNav(){
  const NAV = document.getElementById('js-nav');
  NAV.style.width = '100%'; NAV.style.left = '0';
}

function closeNav(){
  const NAV = document.getElementById('js-nav');
  NAV.style.width = '0'; NAV.style.left = '-1rem';
}

/*--HEADER--*/
function makeHeader(click){
  const HEADER = document.getElementById('js-header')

  const menu = create(HEADER,'button',{'class':'header__menu'})
  menu.onclick = ()=>openNav(); menu.innerHTML = '&equiv;';

  if(!click) return
  const button = create(HEADER,'div',{'class':'header__button'})
  const icon = create(button,'div',{'class':'header__button--icon'})
  const input = create(button,'input',
  {'class':'header__button--input','type':'button','value':'Save'})
  input.onclick = ()=>click();
}

/*--CALC DATA--*/
let pivot, norm, nt
function calculate(){
  const DB = myStorage.get('DB');
  norm = 0
  nt = SDB_TYPES.length
  
  let pData = {};
  pivot = {
    'TATK': Array(nt).fill(0),
    'TCOMB': Array(nt).fill(0),
    'TDWEAK': Array(nt).fill(0),
    'TDRES': Array(nt).fill(0),
  };

  DB.Party.forEach(index => {
    if(index === '') return
    const info = DB.Pokemon[index];
    const DEF = info.Type2? vmult(SDB_DEF[info.Type1], SDB_DEF[info.Type2]): SDB_DEF[info.Type1]
    calcDef(DEF)
    let [moves, hits] = calcMoves(info, DEF)
    pData[info.Name] = {
      INDEX: index,
      WEAKNESS: DEF,
      MOVES: moves,
      HITS: hits,
    }
  })

  console.log(pData)
  console.log(pivot)
  myStorage.set('DB', DB);
  myStorage.set('pData', pData);
  myStorage.set('pivot', pivot);
  myStorage.set('norm', 100/norm);
  myStorage.set('calc', false);
}

function calcMoves(info, WEAKNESS){
  let aHit = Array(nt).fill(0)
  let cHit = Array(nt).fill(0)
  let moves = []
  for(let i = 1; i <= 4; i++){
    let move = calcMove(info, i, [aHit, cHit], WEAKNESS)
    if(move) moves.push(move)
  }
  reorderMoves(info, moves)
  calcAtk(aHit, cHit)
  return [moves, cHit]
}

function calcMove(info, index, pointers, WEAKNESS){
  const DEF = 1
  let name = info['M'+index]
  let type = info['T'+index]
  let power = info['P'+index]
  let category = info['C'+index]

  if(!name || !type || !power || !category) return false

  let dmg
  if(category == 'T') dmg = 0
  else{
    let base = (0.4*info.Level+2)*power/(50*DEF)
    let stat = category == 'P'? info.ATK: info.SPATK
    let stab = (type == info.Type1 || type == info.Type2)? 1.5: 1;
    dmg = Math.floor((base*stat+2)*stab)
  }

  norm = dmg > norm? dmg: norm;

  SDB_ATK[type].forEach((v,i) => {
    pointers[0][i] = Math.max(pointers[0][i], v)
    let div = v>1? WEAKNESS[i]:-1
    if(div == 0) div = 1/8
    pointers[1][i] = Math.max(pointers[1][i], v/div)
  })

  return {
    'name': name,
    'type': type,
    'power': power,
    'category': category,
    'dmg': dmg,
    'effectiveness': SDB_ATK[type]
  }
}

function reorderMoves(info, moves){
  moves.sort((a,b)=>(b.dmg - a.dmg))
  moves.forEach((move, i) => {
    let index = +i+1
    info['M'+index] = move.name
    info['T'+index] = move.type
    info['P'+index] = move.power
    info['C'+index] = move.category
  })
}

function calcDef(WEAKNESS){
  WEAKNESS.forEach((value,i) => {
    if(value > 1) pivot.TDWEAK[i]++
    else if(value < 1) pivot.TDRES[i]++
  })
}

function calcAtk(aHit, cHit){
  for(i=0; i < nt; i++){
    if(aHit[i] > 1) pivot.TATK[i]++
    if(cHit[i] > 1) pivot.TCOMB[i]++
  }
}

function vmult(a,b){
  return a.reduce((r,v,i) => {
    r[i] = a[i]*b[i];
    return r;
  }, []);
}