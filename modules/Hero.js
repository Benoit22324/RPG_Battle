class Hero {
    constructor(paraHp, paraMp, paraPower) {
        this.hp = paraHp;
        this.maxhp = paraHp;
        this.mp = paraMp;
        this.maxmp = paraMp;
        this.power = paraPower;
    }

    Slice(monster, log) {
        monster.hp -= this.power;
        log.innerHTML = `<p class='log_txt'>${monster.name} took ${this.power} damages.</p>`;
    }

    Fireball(monster, log) {
        if (this.mp >= 10) {
            monster.hp -= 15;
            this.mp -= 10;
            log.innerHTML = `<p class='log_txt'>${monster.name} took 15 damages but you loose 10 mana.</p>`;
        }
        else {
            log.innerHTML = `<p class='log_txt'>You don't have enough mana.</p>`;
        }
    }
}

export default Hero