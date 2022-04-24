let GAMEOBJECTS = [];

export class GameObject {
    constructor() {
        GAMEOBJECTS.push(this);

        this.has_start = false;
        this.timedelta;
    }

    start() {

    }

    update() {

    }

    destory() {
        for (let i = 0; i < GAMEOBJECTS.length; i++) {
            if (GAMEOBJECTS[i] === this) {
                GAMEOBJECTS.splice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;
let GAME_ANIMATION = (timestamp) => {
    for (let obj of GAMEOBJECTS) {
        if (!obj.has_start) {
            obj.start();
            obj.has_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(GAME_ANIMATION);
}

requestAnimationFrame(GAME_ANIMATION);