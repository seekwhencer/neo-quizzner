import Module from '../../Module.js';
import PlayerTemplate from './templates/Players/Player.html';

export default class extends Module {
    constructor(args) {
        super();
        //return new Promise((resolve, reject) => {
        this.label = 'PLAYER';
        this.players = args.players;
        this.name = args.name;
        this.index = args.index;
        this.app = this.players.app;
        this.keys = ['q', 'c', 'm', 'p'];
        this.key = this.keys[this.index];
        this.timeout = false;
        this.locked_ms = 3000;

        console.log(this.label, '>>> INIT', this.name);

        this.on('ready', () => {
            console.log(this.label, '>>> READY');
            //resolve(this);
        });

        this.target = toDOM(PlayerTemplate({
            scope: {
                name: this.name,
                key: this.key,
            }
        }));
        this.players.target.append(this.target);

        this.emit('ready');
        //});
    }

    hit() {
        console.log('>>>', this.label, 'HITTING', this.name);
        this.target.classList.add('active');
        setTimeout(() => this.target.classList.remove('active'), this.locked_ms);
        this.players.game.emit('hit', this);
    }
}
