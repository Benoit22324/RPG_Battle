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

let gold_txt = document.getElementById('gold_txt');

let backpack = [];
let backpack_overlay = document.getElementById('backpack_overlay');
let backpack_close = document.getElementById('backpack_close');
let backpack_content = document.getElementById('backpack_content');
let backpack_description = document.getElementById('backpack_description');

let actions_btn = document.getElementsByClassName('action_selector');
let action1 = document.getElementById('action_1');
let action2 = document.getElementById('action_2');
let action4 = document.getElementById('action_4');

let logs = document.getElementById('log_container');

let fleecount = 0;

const hero = new Hero(100, 50, 10);
let hero_hp_container = document.getElementById('hero_hp');
let hero_mp_container = document.getElementById('hero_mp');

let monster;
let monster_name_container = document.getElementById('monster_name');
let monster_hp_container = document.getElementById('monster_hp');
let monster_sprite_container = document.getElementById('monster_image_container');

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
    hero.gold = 0;
    backpack = [];

    GenerateMonster();
    updateHero();
    updateGold();
    updateBackpack();
    game_over_screen.classList.toggle('hidden');
})

// Backpack Functionnality
backpack_close.addEventListener('click', () => {
    backpack_overlay.classList.toggle('hidden');
})

function addItem(drop, drop_quantity) {
    let exist = false;

    for (let item of backpack) {
        if (item.name === drop) {
            item.quantity += drop_quantity;
            exist = true;
        }
    }

    if (exist === false) backpack.push({name: drop, quantity: drop_quantity});
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
    else if (item === 'Strange Potion') {
        StrangePotion();
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

// Specific Item function
function StrangePotion() {
    let rng_effect = Math.floor(Math.random()*4) + 1;

    switch(rng_effect) {
        case 1:
            hero.hp -= 50;
            logs.innerHTML = `<p class='log_txt'>You've lost 50 hp from drinking the Strange Potion.</p>`;
            break;
        case 2:
            hero.mp -= 20;
            logs.innerHTML = `<p class='log_txt'>You've lost 20 mp from drinking the Strange Potion.</p>`;
            break;
        case 3:
            hero.hp = hero.maxhp;
            logs.innerHTML = `<p class='log_txt'>You've been fully healed from drinking the Strange Potion.</p>`;
            break;
        case 4:
            hero.mp = hero.maxmp;
            logs.innerHTML = `<p class='log_txt'>You've restored all your mana from drinking the Strange Potion.</p>`;
            break;
    }
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
            if (fleecount === 3) forceFight();
            else GenerateMonster('yes');
            break;
        case 'Buy':
            logs.innerHTML = "<p class='log_txt'>You cannot buy for now (functionnality not added).</p>"
            break;
        case 'Sell':
            logs.innerHTML = "<p class='log_txt'>You cannot sell for now (functionnality not added).</p>"
            break;
        case 'Go away':
            ShopAway();
            break;
    }
    updateHero();
    updateMonster();
    respawn();
}

// Monster Generation/Respawn/Drops
let loots = {
    'Small Slime': [
        {name: 'Goo', pourcent: 20, quantity: {min: 1, max: 3}}
    ],
    'Medium Slime': [
        {name: 'Goo', pourcent: 35, quantity: {min: 1, max: 3}}
    ],
    'Powered Small Slime': [
        {name: 'Goo', pourcent: 50, quantity: {min: 1, max: 4}},
        {name: 'Enchanted Goo', pourcent: 20, quantity: {min: 1, max: 1}}
    ],
    'Stickman': [
        {name: 'Mana Potion', pourcent: 25, quantity: {min: 1, max: 2}},
        {name: 'Healing Potion', pourcent: 25, quantity: {min: 1, max: 2}},
        {name: 'Strange Potion', pourcent: 30, quantity: {min: 1, max: 3}},
        {name: 'Stick', pourcent: 50, quantity: {min: 1, max: 2}}
    ],
}

function GenerateMonster(flee = undefined) {
    let rng = Math.floor(Math.random() * 5) + 1;

    switch(rng) {
        case 1:
            monster = new Monster('Stickman', 100, 5, './asset/stickman.png', loots['Stickman'], {min: 10, max: 15});
            break;
        case 2:
            monster = new Monster('Small Slime', 20, 1, './asset/Slime1.png', loots['Small Slime'], {min: 1, max: 3});
            break;
        case 3:
            monster = new Monster('Medium Slime', 45, 2, './asset/Slime2.png', loots['Medium Slime'], {min: 2, max: 4});
            break;
        case 4:
            monster = new Monster('Powered Small Slime', 60, 4, './asset/Slime3.png', loots['Powered Small Slime'], {min: 3, max: 5});
            break;
        case 5:
            monster = new Monster('Shop', 9999, 9999, './asset/Shop.png');
            break;
    }

    if (monster.name === 'Shop') {
        ShopEncounter();
    }

    if (flee === 'yes') {
        fleecount++;
        logs.innerHTML = `<p class='log_txt'>A ${monster.name} appear when you tried to flee.</p>`;
    }
    else if (flee === 'shop') logs.innerHTML = `<p class='log_txt'>A ${monster.name} appear when you go away from the shop.</p>`
    else {
        fleecount = 0;
        logs.innerHTML += `<p class='log_txt'>A ${monster.name} appear.</p>`;
    }
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

    addGold(monster);

    for (let drop of monster.drops) {
        let rng = Math.floor(Math.random()*100);

        if (rng <= drop.pourcent) {
            let quantity = Math.floor(Math.random() * (drop.quantity.max - drop.quantity.min)) + drop.quantity.min;

            addItem(drop.name, quantity);
            updateBackpack();
            logs.innerHTML += `<p class='log_txt'>You got ${quantity} ${drop.name} at ${drop.pourcent}% from ${monster.name}.</p>`
        }
    }
}

// Event
function ShopEncounter() {
    action1.innerText = 'Buy';
    action2.innerText = 'Sell';
    action4.innerText = 'Go away';
}
function ShopAway() {
    action1.innerText = 'Attack';
    action2.innerText = 'Magic';
    action4.innerText = 'Flee';

    GenerateMonster('shop');
}

// Utility
function addGold(monster) {
    let test = Math.floor(Math.random() * (monster.golddrops.max - monster.golddrops.min)) + monster.golddrops.min;
    hero.gold += test;
    updateGold();
}
function forceFight() {
    logs.innerHTML = `<p class='log_txt'>You're tired of running around everywhere !</p>`;
    monster.AntiFlee_Attack(hero, logs);
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

function updateGold() {
    gold_txt.innerHTML = `${hero.gold} <img src='asset/gold.png'/>`;
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