class Hero {
    constructor(paraHp, paraMp, paraPower) {
        this.hp = paraHp;
        this.maxhp = paraHp;
        this.mp = paraMp;
        this.maxmp = paraMp;
        this.power = paraPower;
        this.gold = 0;
    }

    Slice(monster, log) {
        monster.hp -= this.power;
        log.innerHTML = `<p class='log_txt'>${monster.name} took ${this.power} damages.</p>`;
    }

    Fireball(monster, log) {
        if (this.mp >= 10) {
            monster.hp -= 25;
            this.mp -= 10;
            log.innerHTML = `<p class='log_txt'>${monster.name} took 25 damages but you loose 10 mana.</p>`;
        }
        else {
            log.innerHTML = `<p class='log_txt'>You don't have enough mana.</p>`;
        }
    }

    Regenerate(type, log) {
        switch(type) {
            case 'hp':
                if (this.hp <= this.maxhp - 20) {
                    this.hp += 20;
                    log.innerHTML = `<p class='log_txt'>You've been healed and regain 20 hp.</p>`;
                }
                else log.innerHTML = `<p class='log_txt'>You cannot heal yet.</p>`;
                break;
            case 'mana':
                if (this.mp <= this.maxmp - 10) {
                    this.mp += 20;
                    log.innerHTML = `<p class='log_txt'>You've restored your mana and regain 20 mp.</p>`;
                }
                else log.innerHTML = `<p class='log_txt'>You cannot recover your mana yet.</p>`;
                break;
        }
    }
}

export default Hero