import Hero from './Hero.js';
import Monster from './Monster.js';

// Variables
let game = document.getElementById('game');

let actions_btn = document.getElementsByClassName('action_selector');

let logs = document.getElementById('log_container');

let hero_hp_container = document.getElementById('hero_hp');
let hero_mp_container = document.getElementById('hero_mp');

let monster;
let monster_name_container = document.getElementById('monster_name');
let monster_hp_container = document.getElementById('monster_hp');
let monster_sprite_container = document.getElementById('monster_image_container');

// Init
document.addEventListener('DOMContentLoaded', () => {
    GenerateMonster();
    updateHero();
})

// Game System
const hero = new Hero(100, 50, 10);

function GenerateMonster(flee = undefined) {
    let rng = Math.floor(Math.random()*4)+1;

    switch(rng) {
        case 1:
            monster = new Monster('Stickman', 100, 5, './asset/stickman.png');
            break;
        case 2:
            monster = new Monster('Small Slime', 20, 1, './asset/Slime1.png');
            break;
        case 3:
            monster = new Monster('Medium Slime', 45, 2, './asset/Slime2.png');
            break;
        case 4:
            monster = new Monster('Powered Small Slime', 60, 4, './asset/Slime3.png');
            break;
    }

    flee === 'yes' ? logs.innerHTML = `<p class='log_txt'>${monster.name} appear when you tried to flee.</p>`
    : logs.innerHTML = `<p class='log_txt'>${monster.name} appear.</p>`;
    updateMonster();
}

for (let action_btn of actions_btn) {
    action_btn.addEventListener('click', () => {
        doAction(action_btn.innerText);
    })
}

function doAction(type) {
    switch(type) {
        case 'Attack':
            hero.Slice(monster, logs);
            break;
        case 'Magic':
            hero.Fireball(monster, logs);
            break;
        case 'Items':
            logs.innerHTML = "<p class='log_txt'>This functionnality isn't implemented yet</p>";
            break;
        case 'Flee':
            GenerateMonster('yes');
            break;
    }
    updateHero();
    updateMonster();
    respawn();
}

function respawn() {
    if (monster.hp <= 0) {
        GenerateMonster();
    }
}

function updateHero() {
    hero_hp_container.innerHTML = `<progress value=${hero.hp} max=${hero.maxhp} class='info_hp'></progress>`;
    hero_mp_container.innerHTML = `<progress value=${hero.mp} max=${hero.maxmp} class='info_mp'></progress>`;
}

function updateMonster() {
    monster_name_container.innerText = `${monster.name}'s Info`;
    monster_sprite_container.innerHTML = `<img src='${monster.sprite}' />`;
    monster_hp_container.innerHTML = `<progress value=${monster.hp} max=${monster.maxhp} class='info_hp'></progress>`;
}