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
        this.speedy = 1300; //  跳起时的初始速度

        this.gravity = 40; //  重力

        this.pressed_keys = this.root.game_map.contorller.pressed_keys;

        this.status = 3;    //  0: idle, 1: 向前, 2: 向后, 3: 跳跃, 4: 攻击, 5: 被打, 6: 死亡

        this.animations = new Map();    //  存储动作对应的gif
        this.frame_current_cnt = 0; //  当前渲染某个动作的第几帧
    }

    start() {

    }

    update_direction() {
        let players = this.root.players;
        if (players[0] && players[1]) {
            let [me, you] = [this, players[1 - this.id]];
            if (me.x < you.x) this.direction = 1;
            else this.direction = 0;
        }
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
            if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = -this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
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
        if (this.status === 3) {
            this.vy += this.gravity;
        }

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        if (this.y > 450) { //  地板限制
            this.y = 449;
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
        this.update_direction();
        this.update_control();
        this.update_move();
        this.render();
    }

    render() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.direction > 0) {
            this.ctx.fillRect(this.x + 205, this.y + 40, 20, 20);   //  damage 范围
        } else {
            this.ctx.fillRect(this.x + this.width - 205 - 20, this.y + 40, 20, 20);   //  damage 范围
        }


        let status = this.status;
        if (this.status === 1 && this.direction * this.vx < 0) status = 2;

        let obj = this.animations.get(status);  //  取出相应动作的gif
        if (obj && obj.loaded) {

            if (this.direction > 0) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

            } else {    //  反方向
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.width, 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.width - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);


                this.ctx.restore();
            }
            
            this.frame_current_cnt ++ ;
        }

        if (status === 4) { //  攻击动作每次只进行一次
            if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                this.frame_current_cnt = 0;
                this.status = 0;
            }
        }
    }
}