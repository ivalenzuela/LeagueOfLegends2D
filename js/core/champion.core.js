import COLOR from "../constant/color.constant.js";
import {
    ALLOWED,
    DISABLED,
    UNCONTROLLABLE,
} from "../constant/crowd-control.constant.js";
import GlobalAssets from "../global/asset.global.js";
import Helper from "../helper/index.js";
import MovementObjectCore from "./movement-object.core.js";
import HealthBarCore from "./health-bar.core.js";
import CombatTextCore from "./combat-text.core.js";

// TODO https://leagueoflegends.fandom.com/wiki/On-action_effects#On-Attack
// TODO https://leagueoflegends.fandom.com/wiki/Channel
export default class ChampionCore extends MovementObjectCore {
    constructor(config = {}) {
        super(config);

        // override
        this.fillColor = "#0000";
        this.radius = 30;
        this.speed = 3;

        // abilities
        this.status = {
            movement: ALLOWED,
            attacking: ALLOWED,
            abilities: ALLOWED,
        };
        this.abilities = {
            basicAttack: null,

            spell1: null,
            spell2: null,
            spell3: null,
            spell4: null,

            avatarSpell1: null,
            avatarSpell2: null,
        };

        // base statistic
        this.sightRadius = 500;
        this.maxHealth = 1000;
        this.maxMana = 400;
        this.fakeHealth = 0;
        this.healthRegen = 0.1;
        this.manaRegen = 0.1;

        // attributes
        this.name = "Champion name";
        this.exp = 0;
        this.level = 0;
        this.health = this.maxHealth;
        this.mana = this.maxMana;
        this.basicAttackDamage = 15;
        this.basicAttackRadius = 250;

        this.visibility = [];
        this.championsInSight = [];
        this.isCheckCollideTerrain = true;

        // UI
        this.world = null;
        this.combatTexts = [];

        // set value from config
        Helper.Other.setValueFromConfig(this, config);

        // stand still
        this.removeDestination();

        // check killed
        this.lastDamageSource = null;

        // team
        const c =
            COLOR.HEALTHBAR.HEALTH[this.isAllyWithPlayer ? "ALLY" : "ENEMY"];

        this.healthBar = new HealthBarCore({
            champion: this,
            healthColor: c,
        });
        this.strokeColor = c;
        this.strokeWeight = 4;
    }

    // override
    show() {
        super.show();

        // avatar
        if (GlobalAssets[this.avatarCirclePath]) {
            image(
                GlobalAssets[this.avatarCirclePath],
                this.position.x,
                this.position.y,
                this.radius * 2,
                this.radius * 2
            );
        }

        // destination direction
        if (!this.isArrivedDestination()) {
            let heading = this.getHeadingVector()
                .setMag(this.radius)
                .add(this.position.x, this.position.y);

            stroke("#ddd");
            line(this.position.x, this.position.y, heading.x, heading.y);
        }

        // health bar
        this.healthBar.show();

        // show notification effects
        for (let cbt of this.combatTexts) {
            cbt.show();
        }
    }

    // override
    update() {
        super.update();

        // abilities
        for (let abkey in this.abilities) {
            this.abilities[abkey] && this.abilities[abkey].update();
        }

        // heal + mana
        this.health += this.healthRegen;
        this.mana += this.manaRegen;

        this.health = constrain(this.health, 0, this.maxHealth);
        this.mana = constrain(this.mana, 0, this.maxMana);

        // update notification effects
        for (let i = this.combatTexts.length - 1; i >= 0; i--) {
            this.combatTexts[i].update();

            if (this.combatTexts[i].isFinished()) {
                this.combatTexts.splice(i, 1);
            }
        }
    }

    // override
    move() {
        if (this.status.movement == ALLOWED) super.move();
    }

    // override
    moveTo(x, y) {
        if (this.status.movement != UNCONTROLLABLE) super.moveTo(x, y);
    }

    basicAttack(destination) {
        this.castSpell("basicAttack", destination);
    }

    showIndicator(abilityKey, destination) {
        if (this.canSpell(abilityKey))
            this.abilities[abilityKey].showIndicator(destination);
    }

    castSpell(abilityKey, destination) {
        if (this.canSpell(abilityKey)) {
            this.abilities[abilityKey].castSpell(destination);
        }
    }

    canSpell(abilityKey) {
        return (
            this.status.abilities == ALLOWED &&
            this.abilities[abilityKey] &&
            this.abilities[abilityKey].isCoolDownFinished() &&
            this.mana >= this.abilities[abilityKey].cost
        );
    }

    heal(value) {
        this.health += value;

        this.combatTexts.push(
            new CombatTextCore({
                text: "+ " + value,
                color: "green",
                position: this.position, // reference to this position
                velocity: createVector(random(-1, 1), random(-1.5, -2)),
            })
        );
    }

    loseHealth(value, damageSource) {
        this.fakeHealth -= value;

        if (this.fakeHealth < 0) {
            this.health -= -this.fakeHealth;
            this.fakeHealth = 0;

            if (damageSource.owner) {
                this.lastDamageSource = damageSource.owner;
            }
        }

        noStroke();
        fill("red");
        circle(this.position.x, this.position.y, this.radius * 2.5);

        this.combatTexts.push(
            new CombatTextCore({
                text: "- " + value,
                color: "red",
                position: this.position, // reference to this position
                velocity: createVector(0, -2),
            })
        );
    }

    addMana(value) {
        this.mana += value;

        this.combatTexts.push(
            new CombatTextCore({
                text: "+ " + value,
                color: "lightblue",
                position: this.position, // reference to healthbar's position
                velocity: createVector(random(-1, 1), random(-1.5, -2)),
            })
        );
    }

    loseMana(value) {
        this.mana -= value;

        this.combatTexts.push(
            new CombatTextCore({
                text: "- " + value,
                color: "lightblue",
                position: this.position, // reference to healthbar's position
                velocity: createVector(0, -2),
            })
        );
    }

    spawn({ position, health = this.maxHealth, mana = this.maxMana }) {
        this.health = health;
        this.mana = mana;
        this.position.set(position.x, position.y);
        this.moveTo(position.x, position.y);
        this.killedBy = null;
    }

    isDead() {
        return this.health == 0;
    }

    // =================== on action-effect ===================
    // https://leagueoflegends.fandom.com/wiki/On-action_effects
    // ch??a bi???t l??m g??, ????? t???m ??? ????y nh?? v???y
    // v??? dealing/taking n???a ... r???i
    onAttack() {}
    onCast() {}
    onCrowdControl() {}
    onCrit() {}
    onDamage() {}
    onDeath() {}
    onHit() {}
    onHealing() {}
    onShielding() {}
    onSpell() {}

    // =================== utils ===================
    getSightBoundary() {
        return {
            x: this.position.x - this.sightRadius,
            y: this.position.y - this.sightRadius,
            w: this.sightRadius * 2,
            h: this.sightRadius * 2,
        };
    }
}
