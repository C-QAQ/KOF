import { GameObject } from "/static/js/game_object/base.js";


export class Player extends GameObject {
    constructor(root, info) {
        super();

        this.root = root;

        this.id = info.id;

        this.x = info.x;
        this.y = info.y;

        this.direction = 1; //  方向 1: 正方向， 0: 反方向
        this.vx = 0;
        this.vy = 0;

        this.width = info.width;
        this.height = info.height;

        this.color = info.color;
        this.ctx = this.root.game_map.ctx;

        this.speedx = 400;  //  水平移动速度
        this.speedy = 1000; //  跳起时的初始速度

        this.gravity = 500; //  重力

        this.status = 3;    //  0: idle, 1: 向前, 2: 向后, 3: 跳跃, 4: 攻击, 5: 被打, 6: 死亡
    }

    start() {

    }

    move() {
        this.vy += this.gravity * this.timedelta / 1000;
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
        }
    }

    update() {
        this.move();
        this.render();
    }

    render() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}