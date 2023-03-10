const SDB_TYPES = [
    'Bug',
    'Dark',
    'Dragon',
    'Electric',
    'Fairy',
    'Fighting',
    'Fire',
    'Flying',
    'Ghost',
    'Grass',
    'Ground',
    'Ice',
    'Normal',
    'Poison',
    'Psychic',
    'Rock',
    'Steel',
    'Water',
]

const SDB_ATK = {
    'Bug':[1,2,1,1,0.5,0.5,0.5,0.5,0.5,2,1,1,1,0.5,2,1,0.5,1],
    'Dark':[1,0.5,1,1,0.5,0.5,1,1,2,1,1,1,1,1,2,1,1,1],
    'Dragon':[1,1,2,1,0,1,1,1,1,1,1,1,1,1,1,1,0.5,1],
    'Electric':[1,1,0.5,0.5,1,1,1,2,1,0.5,0,1,1,1,1,1,1,2],
    'Fairy':[1,2,2,1,1,2,0.5,1,1,1,1,1,1,0.5,1,1,0.5,1],
    'Fighting':[0.5,2,1,1,0.5,1,1,0.5,0,1,1,2,2,0.5,0.5,2,2,1],
    'Fire':[2,1,0.5,1,1,1,0.5,1,1,2,1,2,1,1,1,0.5,2,0.5],
    'Flying':[2,1,1,0.5,1,2,1,1,1,2,1,1,1,1,1,0.5,0.5,1],
    'Ghost':[1,0.5,1,1,1,1,1,1,2,1,1,1,0,1,2,1,1,1],
    'Grass':[0.5,1,0.5,1,1,1,0.5,0.5,1,0.5,2,1,1,0.5,1,2,0.5,2],
    'Ground':[0.5,1,1,2,1,1,2,0,1,0.5,1,1,1,2,1,2,2,1],
    'Ice':[1,1,2,1,1,1,0.5,2,1,2,2,0.5,1,1,1,1,0.5,0.5],
    'Normal':[1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0.5,0.5,1],
    'Poison':[1,1,1,1,2,1,1,1,0.5,2,0.5,1,1,0.5,1,0.5,0,1],
    'Psychic':[1,0,1,1,1,2,1,1,1,1,1,1,1,2,0.5,1,0.5,1],
    'Rock':[2,1,1,1,1,0.5,2,2,1,1,0.5,2,1,1,1,1,0.5,1],
    'Steel':[1,1,1,0.5,2,1,0.5,1,1,1,1,2,1,1,1,2,0.5,0.5],
    'Water':[1,1,0.5,1,1,1,2,1,1,0.5,2,1,1,1,1,2,1,0.5],
}

const SDB_DEF = {
    'Bug':[1,1,1,1,1,0.5,2,2,1,0.5,0.5,1,1,1,1,2,1,1],
    'Dark':[2,0.5,1,1,2,2,1,1,0.5,1,1,1,1,1,0,1,1,1],
    'Dragon':[1,1,2,0.5,2,1,0.5,1,1,0.5,1,2,1,1,1,1,1,0.5],
    'Electric':[1,1,1,0.5,1,1,1,0.5,1,1,2,1,1,1,1,1,0.5,1],
    'Fairy':[0.5,0.5,0,1,1,0.5,1,1,1,1,1,1,1,2,1,1,2,1],
    'Fighting':[0.5,0.5,1,1,2,1,1,2,1,1,1,1,1,1,2,0.5,1,1],
    'Fire':[0.5,1,1,1,0.5,1,0.5,1,1,0.5,2,0.5,1,1,1,2,0.5,2],
    'Flying':[0.5,1,1,2,1,0.5,1,1,1,0.5,0,2,1,1,1,2,1,1],
    'Ghost':[0.5,2,1,1,1,0,1,1,2,1,1,1,0,0.5,1,1,1,1],
    'Grass':[2,1,1,0.5,1,1,2,2,1,0.5,0.5,2,1,2,1,1,1,0.5],
    'Ground':[1,1,1,0,1,1,1,1,1,2,1,2,1,0.5,1,0.5,1,2],
    'Ice':[1,1,1,1,1,2,2,1,1,1,1,0.5,1,1,1,2,2,1],
    'Normal':[1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,1],
    'Poison':[0.5,1,1,1,0.5,0.5,1,1,1,0.5,2,1,1,0.5,2,1,1,1],
    'Psychic':[2,2,1,1,1,0.5,1,1,2,1,1,1,1,1,0.5,1,1,1],
    'Rock':[1,1,1,1,1,2,0.5,0.5,1,2,2,1,0.5,0.5,1,1,2,2],
    'Steel':[0.5,1,0.5,1,0.5,2,2,0.5,1,0.5,2,0.5,0.5,0,0.5,0.5,0.5,1],
    'Water':[1,1,1,2,1,1,0.5,1,1,2,1,0.5,1,1,1,1,0.5,0.5],
}