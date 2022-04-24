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

        this.hp = 1000;
        this.$hp = $(`.kof-hp-${this.id}>div`);
    }

    start() {

    }

    is_collision(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    is_attack(damage) {
        if (this.status === 6) return;
        this.status = 5;
        this.frame_current_cnt = 0;
        this.hp -= damage;

        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 1000
        }, 200);
        if (this.hp <= 0) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
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
        this.vy += this.gravity;

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        if (this.y > 450) { //  地板限制
            this.y = 449;
            this.vy = 0;
            if (this.status === 3)
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

    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 46) {
            let [me, you] = [this, this.root.players[1 - this.id]];
            let r1;
            if (this.direction > 0) {   //  正方向的 damage 范围
                r1 = {  //  伤害范围
                    x1: me.x + 205,
                    y1: me.y + 40,
                    x2: me.x + 205 + 20,
                    y2: me.y + 40 + 20,
                }
            } else {    //  反方向 damage 范围
                r1 = {
                    x1: me.x + me.width - 205 - 20,
                    y1: me.y + 40,
                    x2: me.x + me.width - 205 - 20 + 20,
                    y2: me.y + 40 + 20,
                }
            }

            let r2 = {  //  敌方 body 范围
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            }

            if (this.is_collision(r1, r2)) {
                you.is_attack(200);
            }
        }
    }

    update() {
        if (this.status !== 6) {
            this.update_direction();
            this.update_control();
            this.update_move();
            this.update_attack();
        }
        

        this.render();
    }

    render() {
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);

        // if (this.direction > 0) {
        //     this.ctx.fillRect(this.x + 205, this.y + 40, 20, 20);   //  damage 范围
        // } else {
        //     this.ctx.fillRect(this.x + this.width - 205 - 20, this.y + 40, 20, 20);   //  damage 范围
        // }

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
            

            if (status === 4 || status === 5 || status === 6) { //  攻击动作每次只进行一次
                if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                    if (status === 6) {
                        this.frame_current_cnt -- ;
                    } else {
                        this.frame_current_cnt = 0;
                        this.status = 0;
                    }
                }
            }

            this.frame_current_cnt ++ ;
        }

        
    }
}