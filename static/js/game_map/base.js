import { GameObject } from "/static/js/game_object/base.js";
import { Contorller } from "../contorller/base.js";

export class GameMap extends GameObject {
    constructor(root) {
        super();

        this.root = root;

        this.$canvas = $('<canvas tabindex=0 width="1280" height="720"></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;

        this.start();

        this.contorller = new Contorller(this.$canvas);
    }

    start() {
        this.$canvas.focus();
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // this.ctx.fillStyle = 'green';
        // this.ctx.fillRect(0, 0, this.width, this.height);
    }
}