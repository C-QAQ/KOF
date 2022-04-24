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

        this.root.$kof.append($(`
        <div class="kof-head">
            <div class="kof-hp-0"><div></div></div>
            <div class="kof-timer">60</div>
            <div class="kof-hp-1"><div></div></div>
        </div>
        `));

        this.game_time = 60000;
        this.$timer = $(`.kof-timer`);
    }

    start() {
        this.$canvas.focus();
    }

    update() {
        this.game_time -= this.timedelta;

        if (this.game_time < 0) {
            this.game_time = 0;
            let [a, b] = this.root.players;
            if (a.status !== 6 && b.status !== 6) {
                a.status = b.status = 6;
                a.frame_current_cnt = b.frame_current_cnt = 0;
                a.vx = b.vx = 0;
            }
        }
        
        this.$timer.text(parseInt(this.game_time / 1000));
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // this.ctx.fillStyle = 'green';
        // this.ctx.fillRect(0, 0, this.width, this.height);
    }
}