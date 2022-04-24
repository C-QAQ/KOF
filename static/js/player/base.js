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

        this.gravity = 50; //  重力

        this.pressed_keys = this.root.game_map.contorller.pressed_keys;

        this.status = 3;    //  0: idle, 1: 向前, 2: 向后, 3: 跳跃, 4: 攻击, 5: 被打, 6: 死亡

        this.animations = new Map();    //  存储动作对应的gif
        this.frame_current_cnt = 0; //  当前渲染某个动作的第几帧
    }

    start() {

    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');            
            d = this.pressed_keys.has('d');            
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');            
            d = this.pressed_keys.has('ArrowRight');            
            space = this.pressed_keys.has('Enter');
        }

        if (this.status === 0 || this.status === 1) {
            if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = -this.speedy;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    update_move() {
        this.vy += this.gravity;
        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        if (this.y > 450) { //  地板限制
            this.y = 450;
            this.vy = 0;
            this.status = 0;
        }

        if (this.x < 0) {   //  墙面限制
            this.x = 0
        } else if (this.x + this.width> this.root.width) {
            this.x = this.root.width - this.width;
        }
        if (this.y < 0) {   //  墙面限制
            this.y = 0;
        }
    }

    update() {
        this.update_control();
        this.update_move();
        this.render();
    }

    render() {
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);

        let status = this.status;

        let obj = this.animations.get(status);  //  取出相应动作的gif
        if (obj && obj.loaded) {
            let k = this.frame_current_cnt % obj.frame_cnt;
            let image = obj.gif.frames[k].image;
            console.log(image);
            this.ctx.drawImage(image, this.x, this.y, image.width, image.height);
            this.frame_current_cnt ++ ;
        }
    }
}