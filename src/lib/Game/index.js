import Module from '../../Module.js';
import Setup from './Setup.js';
import Players from './Players.js';
import Rounds from './Rounds.js';

export default class extends Module {
    constructor(args) {
        super();
        return new Promise((resolve, reject) => {
            this.label = 'GAME';
            this.app = args;

            console.log(this.label, '>>> INIT');

            this.on('ready', () => {
                console.log(this.label, '>>> READY');
                resolve(this);

                this
                    .new()
                    .then(() => {
                        return this.run();
                    })
                    .then(() => {
                        console.log('>>>', this.label, 'GAME OVER');
                    });
            });

            this.on('hit', player => this.hit(player));
            this.emit('ready');
        });
    }

    new() {
        return wait(2000)
            .then(() => {
                //    return this.setup();
                //})
                //.then(setup => {
                //    this.setup = setup;
                this.setup = {
                    players: ['Matze', 'Horst', 'Marie', 'Holger'],
                    categories: ['Frontend', 'Universum'],
                    rounds: 2
                };
                console.log('>>>', this.label, 'SETUP COMPLETE:', this.setup.players, this.setup.categories, this.setup.rounds);
                return this.text(_('game.letsgo'));
            })
            .then(() => {
                return new Players(this);
            })
            .then(players => {
                this.players = players;
                return new Rounds(this);
            })
            .then(rounds => {
                this.rounds = rounds;
                return Promise.resolve();
            });
    }

    setup() {
        return new Setup(this);
    }

    run() {
        return this.oneRound();
    }

    oneRound(index) {
        if (!index)
            index = 0;

        if (index === this.setup.rounds) {
            return this.finish();
        }

        this.round = index;

        return this
            .ask(index)
            .then(() => {
                return this.text(`Nice.`);
            })
            .then(() => { // repeat it here
                return this.oneRound(index + 1);
            });
    }

    ask(index) {
        return new Promise(resolve => {
            console.log('>>>>>> ASKING', index + 1, `(${index})`, 'OF', this.setup.rounds);
            this
                .text(`${_('game.round')} ${index + 1}`)
                .then(() => {
                    // @TODO start here the timeout and the visual counter
                    this.on('hit', () => resolve()); // woohaaa - this must be the end
                });
        });
    }

    finish() {
        return new Promise(resolve => {
            console.log('>>>>>> FINISHED', this.setup.rounds);
            // @TODO make another, fancier end animation
            this
                .text(`${_('game.finish')}`)
                .then(() => {
                    resolve();
                });
        });
    }

    hit(player) {
        console.log('>>> !!! <<<', player.name);
    }

    text(text, stay) {
        const target = createScrambleWords(text);
        document.querySelector('body').append(target);

        const readDelay = text.length * 150;
        const animation = this.app.anime
            .timeline({
                loop: false
            })
            .add({
                targets: '[data-scramble="title"] .part',
                translateY: ["1.4em", 0],
                translateZ: 0,
                duration: 750,
                delay: (el, i) => 250 * i
            })
            .add({
                delay: readDelay
            });

        if (!stay) {
            animation.add({
                targets: '[data-scramble="title"] .part',
                opacity: 0,
                filter: 'blur(10px)',
                translateZ: 0,
                duration: 500,
                delay: (el, i) => 50 * i,
                changeComplete: () => {
                    target.remove();
                }
            });
        }
        return animation.finished;
    }

    get round() {
        return this._round;
    }
    set round(value) {
        this._round = value;
        this.rounds.setRound();
    }
}
