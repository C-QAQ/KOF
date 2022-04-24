import { GameMap } from "/static/js/game_map/base.js";
import { Kyo } from "/static/js/player/kyo.js";


export class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        this.width = this.$kof.width();
        this.height = this.$kof.height();

        this.game_map = new GameMap(this);

        this.players = [
            new Kyo(this, {
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                color: "blue",
                id: 0,
            }),
            new Kyo(this, {
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