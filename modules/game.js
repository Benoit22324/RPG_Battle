// Import
import Hero from './Hero.js';
import Monster from './Monster.js';

// Variables
let menu = document.getElementById('game_menu');
let start_btn = document.getElementById('start_btn');

let game_over_screen = document.getElementById('game_over_screen');
let game_over_txt = document.getElementById('game_over_txt');
let restart_btn = document.getElementById('restart_btn');

let game = document.getElementById('game');

let backpack = [];
let backpack_overlay = document.getElementById('backpack_overlay');
let backpack_close = document.getElementById('backpack_close');
let backpack_content = document.getElementById('backpack_content');
let backpack_description = document.getElementById('backpack_description');

let actions_btn = document.getElementsByClassName('action_selector');

let logs = document.getElementById('log_container');

const hero = new Hero(100, 50, 10);
let hero_hp_container = document.getElementById('hero_hp');
let hero_mp_container = document.getElementById('hero_mp');

let monster;
let monster_name_container = document.getElementById('monster_name');
let monster_hp_container = document.getElementById('monster_hp');
let monster_sprite_container = document.getElementById('monster_image_container');

let loots = {
    'Small Slime': [
        {name: 'Goo', pourcent: 20}
    ],
    'Medium Slime': [
        {name: 'Goo', pourcent: 35}
    ],
    'Powered Small Slime': [
        {name: 'Goo', pourcent: 50},
        {name: 'Enchanted Goo', pourcent: 20}
    ],
    'Stickman': [
        {name: 'Mana Potion', pourcent: 25},
        {name: 'Healing Potion', pourcent: 25},
        {name: 'Strange Potion', pourcent: 20},
        {name: 'Stick', pourcent: 50}
    ],
}

/****************************
******** Game System ********
****************************/

// Start Game
start_btn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    game.classList.toggle('hidden');
    GenerateMonster();
    updateHero();
})

// Restart Game
restart_btn.addEventListener('click', () => {
    logs.innerHTML = '';
    backpack_description.innerHTML = '';
    hero.hp = hero.maxhp;
    hero.mp = hero.maxmp;
    backpack = [];

    GenerateMonster();
    updateHero();
    updateBackpack();
    game_over_screen.classList.toggle('hidden');
})

// Backpack
backpack_close.addEventListener('click', () => {
    backpack_overlay.classList.toggle('hidden');
})

function addItem(drop) {
    let exist = false;

    for (let item of backpack) {
        if (item.name === drop) {
            item.quantity++;
            exist = true;
        }
    }

    if (exist === false) backpack.push({name: drop, quantity: 1});
}

function itemDescription(item) {
    backpack_description.innerHTML = `<h3>${item}</h3>`

    if (item === 'Goo') backpack_description.innerHTML += `<p>This is just Slime's goo.</p>`;
    if (item === 'Enchanted Goo') backpack_description.innerHTML += `<p>This goo was enchanted by the top hat that a Slime rarely wear.</p>`;
    if (item === 'Stick') backpack_description.innerHTML += `<p>How dare you to take the leg of the Stickman !</p>`;
    if (item === 'Strange Potion') backpack_description.innerHTML += `<p>This potion looks strange. It a bit purple and remind me Shion's meal.</p>`;
    if (item === 'Healing Potion') backpack_description.innerHTML += `<p>Watching this potion makes you feel good.</p>`;
    if (item === 'Mana Potion') backpack_description.innerHTML += `<p>You can feel that this potion will recover your mana.</p>`;
}

function itemInteraction(item) {
    if (item === 'Healing Potion') {
        hero.Regenerate('hp', logs);
        useItem(item);
    }
    else if (item === 'Mana Potion') {
        hero.Regenerate('mana', logs);
        useItem(item);
    }
    else return
}

function useItem(item) {
    for (let content of backpack) {
        if (content.name === item && content.quantity > 0 && content.quantity - 1 !== 0) content.quantity--;
        else if (content.name === item && content.quantity - 1 === 0) {
            let temp = backpack.filter(i => i.name !== item);
            backpack = temp;
        }
    }

    updateHero();
    updateBackpack();
    backpack_overlay.classList.toggle('hidden');
}

// Action Button Trigger
for (let action_btn of actions_btn) {
    action_btn.addEventListener('click', () => {
        doAction(action_btn.innerText);
    })
}

function doAction(type) {
    switch(type) {
        case 'Attack':
            hero.Slice(monster, logs);
            monster.Counter_Attack(hero, logs);
            break;
        case 'Magic':
            hero.Fireball(monster, logs);
            monster.Counter_Attack(hero, logs);
            break;
        case 'Backpack':
            backpack_overlay.classList.toggle('hidden');
            break;
        case 'Flee':
            GenerateMonster('yes');
            break;
    }
    updateHero();
    updateMonster();
    respawn();
}

// Monster Generation/Respawn/Drops
function GenerateMonster(flee = undefined) {
    let rng = Math.floor(Math.random()*4)+1;

    switch(rng) {
        case 1:
            monster = new Monster('Stickman', 100, 5, './asset/stickman.png', loots['Stickman']);
            break;
        case 2:
            monster = new Monster('Small Slime', 20, 1, './asset/Slime1.png', loots['Small Slime']);
            break;
        case 3:
            monster = new Monster('Medium Slime', 45, 2, './asset/Slime2.png', loots['Medium Slime']);
            break;
        case 4:
            monster = new Monster('Powered Small Slime', 60, 4, './asset/Slime3.png', loots['Powered Small Slime']);
            break;
    }

    flee === 'yes' ? logs.innerHTML = `<p class='log_txt'>A ${monster.name} appear when you tried to flee.</p>`
    : logs.innerHTML += `<p class='log_txt'>A ${monster.name} appear.</p>`;
    updateMonster();
}

function respawn() {
    if (monster.hp <= 0) {
        getDrops();
        GenerateMonster();
    }
}

function getDrops() {
    logs.innerHTML = '';

    for (let drop of monster.drops) {
        let rng = Math.floor(Math.random()*100);

        if (rng <= drop.pourcent) {
            addItem(drop.name)
            updateBackpack();
            logs.innerHTML += `<p class='log_txt'>You got ${drop.name} at ${drop.pourcent}% from ${monster.name}.</p>`
        }
    }
}

// Updater
function updateBackpack() {
    backpack_content.innerHTML = '';
    
    for (let content of backpack) {
        backpack_content.innerHTML += `<div class='backpack_items'>${content.name}</div> <p>x${content.quantity}</p>`;
    }

    let backpack_items = document.getElementsByClassName('backpack_items');
    for (let item of backpack_items) {
        item.addEventListener('mouseover', () => {
            itemDescription(item.innerText);
        })
        item.addEventListener('click', () => {
            itemInteraction(item.innerText);
        })
    }
}

function updateHero() {
    hero_hp_container.innerHTML = `<progress value=${hero.hp} max=${hero.maxhp} class='info_hp'></progress>`;
    hero_mp_container.innerHTML = `<progress value=${hero.mp} max=${hero.maxmp} class='info_mp'></progress>`;

    if (hero.hp <= 0) {
        game_over_txt.innerText = `You've been killed by ${monster.name}`;
        game_over_screen.classList.toggle('hidden');
    }
}

function updateMonster() {
    monster_name_container.innerText = `${monster.name}'s Info`;
    monster_sprite_container.innerHTML = `<img src='${monster.sprite}' />`;
    monster_hp_container.innerHTML = `<progress value=${monster.hp} max=${monster.maxhp} class='info_hp'></progress>`;
}