import COLOR from "../../../../constant/color.constant.js";
import GlobalTime from "../../../../global/time.global.js";
import Helper from "../../../../helper/index.js";
import AbilityCore from "../../../../core/ability.core.js";
import AhriBasicAttackObject from "./ahri.basic-attack.object.js";

export default class AhriBasicAttack extends AbilityCore {
    constructor(config = {}) {
        super(config);

        // override
        this.cooldown = 1000;

        // custom attributes
        this.attackRadius = this.owner.basicAttackRadius;
    }

    // override
    showIndicator() {
        stroke(COLOR.ABILITY.INDICATOR.BORDER);
        strokeWeight(3);
        fill("white"); // turn on fill to use Gradient below

        Helper.Color.createRadialGradient(
            p5.instance,
            this.owner.position.x,
            this.owner.position.y,
            max(0, this.attackRadius - 100),
            this.attackRadius,
            [
                { stop: 0, color: "#1111" },
                { stop: 1, color: COLOR.ABILITY.INDICATOR.CIRCLEFILL },
            ]
        );

        circle(
            this.owner.position.x,
            this.owner.position.y,
            this.attackRadius * 2
        );
    }

    // override
    castSpell(destination) {
        // basic attack do not use super.castSpell();
        //super.castSpell(destination);

        // find all enemy in attackRange
        let enemiesInRange = this.world.getChampionsInRange({
            rootPosition: this.owner.position,
            inRange: this.attackRadius,
            addChampRadiusToRange: true,
            allyWithPlayer: !this.owner.isAllyWithPlayer,
            excludes: [this.owner],
        });

        if (enemiesInRange.length > 0) {
            // get closest champion to mouse
            let closestEnemy = this.world.getClosestChampionInRange({
                rootPosition: destination,
                champions: enemiesInRange,
            });

            this.world.addNewSpellObjects(
                new AhriBasicAttackObject({
                    world: this.world,
                    owner: this.owner,
                    position: this.owner.position.copy(),
                    destination: closestEnemy.position,
                    targetChampion: closestEnemy,
                })
            );

            this.lastCastSpell = GlobalTime.getNow();
        }
    }

    // other functions here
}
