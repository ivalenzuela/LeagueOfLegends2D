class NotiEffectCore {
    constructor(config = {}) {
        // default value
        this.position = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.gravity = createVector(0.01, 0.05);
        //this.friction = 0.95;
        this.movedVector = createVector(0, 0);

        this.text = "noti";
        this.color = "red";
        this.alpha = 255;

        this.lifeSpan = 700;
        this.startTime = millis();

        Helper.Other.setValueFromConfig(this, config);
    }

    run() {
        this.update();
        this.show();
    }

    show() {
        strokeWeight(2);
        stroke(this.colorAlpha);
        fill(this.colorAlpha);
        textSize(this.textSize);
        text(
            this.text,
            this.position.x + this.movedVector.x,
            this.position.y + this.movedVector.y
        );
    }

    update() {
        const lifeTime = millis() - this.startTime;

        this.movedVector.add(this.velocity);
        this.velocity.add(this.gravity);
        //this.velocity.mult(this.friction);
        this.alpha = map(lifeTime, 0, this.lifeSpan, 255, 10);
        this.colorAlpha = Helper.Color.applyColorAlpha(this.color, this.alpha);
        this.textSize = map(lifeTime, 0, this.lifeSpan, 25, 10);
    }

    isFinished() {
        return millis() - this.startTime > this.lifeSpan;
    }
}
