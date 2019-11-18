import Module from '../../Module.js';
import Setup from './Setup.js';

export default class extends Module {
    constructor(args) {
        super();
        return new Promise((resolve, reject) => {
            this.label = 'GAME';
            this.app = args;

            console.log(this.label, '>>> INIT');

            this.on('ready', () => {
                console.log(this.label, '>>> READY');
                this.new();
                resolve(this);
            });

            this.emit('ready');
        });
    }

    new() {
        return this.setup().then(setup => {
            this.setup = setup;
        });
    }

    setup() {
        return new Setup(this);
    }
}
