import Module from '../../Module.js';
import Player from './Player.js';
import PlayersTemplate from './templates/Players/index.html';

export default class extends Module {
    constructor(args) {
        super();
        return new Promise((resolve, reject) => {
            this.label = 'PLAYERS';
            this.game = args;
            this.app = this.game.app;
            this.locked = false;
            this.locked_ms = 3000;

            console.log(this.label, '>>> INIT');

            this.on('ready', () => {
                console.log(this.label, '>>> READY');
                resolve(this);
            });

            this.target = toDOM(PlayersTemplate());
            document.querySelector('body').append(this.target);

            this.game.setup.players.map((player, index) => {
                this.items.push(new Player({
                    players: this,
                    name: player,
                    index: index
                }));
            });

            const animation = this.app.anime
                .timeline({
                    loop: false
                })
                .add({
                    targets: '.game-players .game-player',
                    translateY: [200, 0],
                    duration: 500,
                    delay: (el, i) => 200 * i,
                    easing: 'easeOutExpo',
                    changeComplete: () => {
                        this.emit('ready');
                    }
                });

            document.body.addEventListener('keydown', e => this.keypress(e));

        });
    }

    keypress(e) {
        if (this.locked === false) {
            const player = this.items.filter(i => i.key === e.key)[0];
            if (!player)
                return;

            player.hit();
        }
    }

    lock(stay) {
        if (this.locked === true)
            return;

        this.locked = true;

        if (stay === true)
            return;

        this.timeout ? clearTimeout(this.timeout) : null;
        this.timeout = setTimeout(() => {
            this.unlock();
        }, this.locked_ms);
    }

    unlock() {
        this.locked = false;
        this.items.map(player => player.blur());
    }
}
