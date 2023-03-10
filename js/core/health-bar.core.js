import Helper from "../helper/index.js";

export default class HealthBarCore {
    constructor(config = {}) {
        this.champion = null;

        this.distanceFromChamp = 20;
        this.width = 125;
        this.height = 17;
        this.manaHeight = 5;
        this.healthManaGap = 1;
        this.borderWidth = 3;
        this.borderRadius = [2, 2, 2, 2];

        this.healthColor = "#43C41D";
        this.fakeHealthColor = "#C8C8CB";
        this.manaColor = "#6CB3D5";
        this.levelColor = "#3287B9";
        this.nameColor = "#aaa";
        this.nameStroke = "#000";
        this.levelBg = "#101F26";
        this.emptyBg = "#020F15";
        this.borderColor = "#5B5C57";

        this.position = createVector(0, 0);

        Helper.Other.setValueFromConfig(this, config);
    }

    show() {
        let topleft = {
            x: this.champion.position.x - this.width * 0.5,
            y:
                this.champion.position.y -
                this.champion.radius -
                this.distanceFromChamp -
                this.height,
        };

        this.position.set(
            topleft.x + this.width * 0.5,
            topleft.y + this.height * 0.5
        );

        // background
        fill(this.emptyBg);
        stroke(this.borderColor);
        strokeWeight(this.borderWidth);
        rect(
            topleft.x - this.borderWidth * 0.5,
            topleft.y - this.borderWidth * 0.5,
            this.width + this.borderWidth,
            this.height + this.borderWidth,
            ...this.borderRadius
        );

        noStroke();

        // health
        const { health, fakeHealth, maxHealth } = this.champion;
        const totalHealth = maxHealth + fakeHealth;
        const healthContainerW = this.width - this.height;
        const healthW = map(health, 0, totalHealth, 0, healthContainerW);

        fill(this.healthColor);
        rect(
            topleft.x + this.height,
            topleft.y,
            healthW,
            this.height - this.manaHeight - this.healthManaGap
        );

        // fake health
        const fakeHW = map(fakeHealth, 0, totalHealth, 0, healthContainerW);

        fill(this.fakeHealthColor);
        rect(
            topleft.x + this.height + healthW,
            topleft.y,
            fakeHW,
            this.height - this.manaHeight - this.healthManaGap
        );

        // mana
        const { mana, maxMana } = this.champion;
        const manaW = map(mana, 0, maxMana, 0, this.width - this.height);

        fill(this.manaColor);
        rect(
            topleft.x + this.height,
            topleft.y + this.height - this.manaHeight,
            manaW,
            this.manaHeight
        );

        // level
        fill(this.levelBg);
        rect(topleft.x, topleft.y, this.height, this.height);

        fill(this.levelColor);
        stroke(this.levelColor);
        strokeWeight(1);
        text(
            this.champion.level,
            topleft.x + this.height * 0.5,
            topleft.y + this.height * 0.5
        );

        // name
        fill(this.nameColor);
        stroke(this.nameStroke);
        text(this.champion.name, topleft.x + this.width * 0.5, topleft.y - 14);
    }
}
