import Helper from "../helper/index.js";

export default class CameraCore {
    constructor(config = {}) {
        // default value
        this.position = createVector(0, 0);
        this.target = null;
        this.isFollow = true;
        this.followLerp = 0.1;
        this.scale = 1;
        this.scaleTo = 1;
        this.scaleLerp = 0.07;
        this.borderSize = 25;
        this.borderSpeed = 30;

        Helper.Other.setValueFromConfig(this, config);
    }

    update() {
        // update scale
        this.scale = lerp(this.scale, this.scaleTo, this.scaleLerp);

        // follow target
        if (this.isFollow) {
            this.position = p5.Vector.lerp(
                this.position,
                this.target,
                this.followLerp
            );
        }

        // move camera on edge
        else if (this.isMouseOnEdge()) {
            let vec = createVector(
                mouseX - width * 0.5,
                mouseY - height * 0.5
            ).setMag(this.borderSpeed);
            this.position.add(vec);
        }
    }

    beginState() {
        push();
        translate(width * 0.5, height * 0.5);
        scale(this.scale);
        translate(-this.position.x, -this.position.y);
    }

    endState() {
        pop();
    }

    follow(target, immediately) {
        this.target = target;

        if (immediately) this.position.set(target.x, target.y);
    }

    getViewBoundary() {
        let topLeftCanvas = this.canvasToWorld(0, 0);
        let bottomRightCanvas = this.canvasToWorld(width, height);

        return {
            x: topLeftCanvas.x,
            y: topLeftCanvas.y,
            w: bottomRightCanvas.x - topLeftCanvas.x,
            h: bottomRightCanvas.y - topLeftCanvas.y,
        };
    }

    canvasToWorld(canvasX, canvasY) {
        let worldX = (canvasX - width * 0.5) / this.scale + this.position.x;
        let worldY = (canvasY - height * 0.5) / this.scale + this.position.y;

        return createVector(worldX, worldY);
    }

    worldToCanvas(worldX, worldY) {
        let canvasX = (worldX - this.position.x) * this.scale + width * 0.5;
        let canvasY = (worldY - this.position.y) * this.scale + height * 0.5;

        return createVector(canvasX, canvasY);
    }

    isMouseOnEdge() {
        return (
            mouseX > width - this.borderSize ||
            mouseX < this.borderSize ||
            mouseY > height - this.borderSize ||
            mouseY < this.borderSize
        );
    }
}
