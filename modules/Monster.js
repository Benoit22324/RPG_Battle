class Monster {
    constructor(paraName, paraHp, paraPower, paraSprite, paraDrops = undefined, paraGolddrops = undefined) {
        this.name = paraName;
        this.hp = paraHp;
        this.maxhp = paraHp;
        this.power = paraPower;
        this.sprite = paraSprite;
        this.drops = paraDrops;
        this.golddrops = paraGolddrops;
    }

    Counter_Attack(hero, log) {
        hero.hp -= this.power;
        log.innerHTML += `<p class='log_txt'>In return of your attack, ${this.name} inflict ${this.power} damage.</p>`;
    }

    AntiFlee_Attack(hero, log) {
        hero.hp -= this.power + 5;
        log.innerHTML += `<p class='log_txt'>While you tried to flee during recovering, ${this.name} inflict you ${this.power + 5} damage.</p>`;
    }
}

export default Monster