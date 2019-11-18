import Module from '../../Module.js';
import SetupTemplate from "./templates/Setup.html";


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

            setTimeout(() => this.app.removeIntro(), 2000);

            this.target = toDOM(SetupTemplate({
                scope: {

                }
            }));
            document.querySelector('body').append(this.target);

            this.emit('ready');
        });
    }


}
