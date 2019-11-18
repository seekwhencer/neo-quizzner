import Module from '../../Module.js';


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

            this.emit('ready');
        });
    }


}
