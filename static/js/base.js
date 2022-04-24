import { GameMap } from "/static/js/game_map/base.js";
import { Player } from "/static/js/player/base.js";


export class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        this.width = this.$kof.width();
        this.height = this.$kof.height();
        console.log("KOF: w, h", this.width, this.height);

        this.game_map = new GameMap(this);

        this.players = [
            new Player(this, {
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                color: "blue",
                id: 0,
            }),
            new Player(this, {
                x: 930,
                y: 0,
                width: 120,
                height: 200,
                color: "red",
                id: 1,
            }),
        ];
    }
}