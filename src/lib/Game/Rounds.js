import Module from '../../Module.js';
import RoundsTemplate from './templates/Rounds.html';

export default class extends Module {
    constructor(args) {
        super();
        return new Promise((resolve, reject) => {
            this.label = 'ROUNDS';
            this.game = args;
            this.app = this.game.app;

            console.log(this.label, '>>> INIT');

            this.on('ready', () => {
                console.log(this.label, '>>> READY');
                resolve(this);
            });

            this.target = toDOM(RoundsTemplate());
            document.querySelector('body').append(this.target);

            this.actualElement = this.target.querySelector('.game-rounds-actual');
            this.maxElement = this.target.querySelector('.game-rounds-max');
            this.maxElement.innerHTML = this.game.setup.rounds;

            this.emit('ready');
        });
    }

    setRound() {
        this.actualElement.innerHTML = this.game.round + 1;
    }
}
