import Module from '../../Module.js';
import SetupPlayerCards from './SetupPlayerCards.js';
import SetupCategoryCards from './SetupCategoryCards.js';
import SetupRoundCards from './SetupRoundCards.js';
import SetupTemplate from "./templates/Setup.html";

// https://tobiasahlin.com/moving-letters/#6

export default class extends Module {
    constructor(args) {
        super();
        return new Promise((resolve, reject) => {
            this.label = 'SETUP';
            this.game = args;
            this.app = this.game.app;

            console.log(this.label, '>>> INIT');

            this.on('ready', () => {
                console.log(this.label, '>>> READY');
                resolve(this);
            });
            this.target = toDOM(SetupTemplate({
                scope: {}
            }));
            document.querySelector('body').append(this.target);

            this
                .wait(2000)
                /*.then(() => {
                    return this.hello();
                })
                .then(() => {
                    return this.prepare();
                })*/
                .then(() => {
                    return this.players();
                })
                .then(() => {
                    return this.categories();
                })
                .then(() => {
                    return this.rounds();
                })
                .then(() => {
                    console.log('>>>>>>>>>>>>>>>>> PLAYERS', this.playerItems,  this.categoryItems, this.rounds);
                });

            this.emit('ready');
        });
    }

    // the scrambling text
    text(text, stay) {
        const target = toDOM(`<div data-scramble="title"></div>`);
        this.target.append(target);
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

    // say hello
    hello() {
        return this.text(_('intro.setup.welcome'));
    }

    // say prepare yourself
    prepare() {
        return this.text(_('intro.setup.prepare'));
    }

    // ask for number of players
    players() {
        return this
            .text(_('intro.setup.players'), true)
            .then(() => {
                return new SetupPlayerCards(this);
            })
            .then(playerCards => {
                this.playerCards = playerCards;
                this.playerItems = this.playerCards.players;
                return this.playerCards.away();
            });
    }

    categories(){
        return this
            .text(_('intro.setup.categories'), true)
            .then(() => {
                return new SetupCategoryCards(this);
            })
            .then(categoryCards => {
                this.categoryCards = categoryCards;
                this.categoryItems = this.categoryCards.categories;
                return this.categoryCards.away();
            });
    }

    rounds(){
        return this
            .text(_('intro.setup.rounds'), true)
            .then(() => {
                return new SetupRoundCards(this);
            })
            .then(roundCards => {
                this.roundCards = roundCards;
                this.rounds = this.roundCards.rounds;
                return this.roundCards.away();
            });
    }

}
