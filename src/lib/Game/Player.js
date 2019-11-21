import Module from '../../Module.js';
import PlayerTemplate from './templates/Players/Player.html';

export default class extends Module {
    constructor(args) {
        super();
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
        });

        this.target = toDOM(PlayerTemplate({
            scope: {
                name: this.name,
                key: this.key,
            }
        }));
        this.players.target.append(this.target);

        this.emit('ready');
    }

    buzzer() {
        console.log('>>>', this.label, 'BUZZER', this.name);
        this.active = true;
        this.players.lock();
        this.players.game.emit('buzzer', this);
    }

    blur() {
        this.active = false;
    }

    answer(number) {
        if (this.number)
            return;

        if (!this.number)
            this.number = number;

        if (this.players.game.question.answer[this.number - 1].correct === true) {
            this.players.game.emit('correct', number);
        } else {
            this.players.game.emit('wrong', number);
        }
        console.log('>>>', this.label, this.name, 'ANSWERS:', number, this.players.game.question);
    }

    set active(val) {
        this._active = val;
        this.number = false;
        this.active ? this.target.classList.add('active') : this.target.classList.remove('active');
    }

    get active() {
        return this._active;
    }
}
