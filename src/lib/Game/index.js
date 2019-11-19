import Module from '../../Module.js';
import Setup from './Setup.js';
import Players from './Players.js';

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
                    });
            });

            this.emit('ready');
        });
    }

    new() {
        return this
            .wait(2000)
            .then(() => {
                return this.setup();
            })
            .then(setup => {
                this.setup = setup;
                /*this.setup = {
                    players: ['Matze','Horst','Marie','Holger'],
                    categories: ['Frontend', 'Universum'],
                    rounds: 12
                };*/
                console.log('>>>', this.label, 'SETUP COMPLETE:', this.setup.players, this.setup.categories, this.setup.rounds);
                return this.text(_('game.letsgo'));
            })
            .then(() => {
                return new Players(this);
            })
            .then(players => {
                this.players = players;
            });
    }

    setup() {
        return new Setup(this);
    }

    run() {
        return this.ask();
    }

    ask(index) {
        return new Promise(resolve => {
            if (!index)
                index = 0;


            resolve();
        });


    }

    text(text, stay) {
        const target = toDOM(`<div data-scramble="title"></div>`);
        document.querySelector('body').append(target);
        target.innerHTML = (`<span class="text-wrapper"><span class="letters">${text}</span></span>`);
        const textWrapper = target.querySelector('.letters');
        textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        const readDelay = text.length * 150;
        const animation = this.app.anime
            .timeline({
                loop: false
            })
            .add({
                targets: '[data-scramble="title"] .letter',
                translateY: ["1.4em", 0],
                translateZ: 0,
                duration: 750,
                delay: (el, i) => 50 * i
            })
            .add({
                delay: readDelay
            });

        if (!stay) {
            animation.add({
                targets: '[data-scramble="title"] .letter',
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

    wait(ms) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    }
}
