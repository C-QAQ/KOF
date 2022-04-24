import { Player } from "./base.js";
import { GIF } from "../utils/gif.js";

export class Kyo extends Player {
    constructor(root, info) {
        super(root, info);

        this.start();
    }

    start() {
        this.init_animations();
    }

    init_animations() {
        let outer = this;
        for (let i = 0; i < 7; i ++ ) {
            let gif = GIF();
            gif.load(`/static/images/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,
                frame_rate: 5,  //  每 5 帧渲染下一帧
                offset_y: 0,
                loaded: false,
                scale: 2,
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
            }
        }
    }

}