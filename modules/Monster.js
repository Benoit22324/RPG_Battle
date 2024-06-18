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
        log.innerHTML += `<p class='log_txt'>In return of your attack, ${this.name} inflict ${this.power} damage.</p>`
    }
}

export default Monster