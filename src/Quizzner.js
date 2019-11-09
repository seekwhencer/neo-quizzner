import './scss/app.scss';
import Module from './Module.js';
import Data from './lib/Data.js';

export default class extends Module {
    constructor(args) {
        super();

        return new Promise((resolve, reject) => {
            this.on('ready', () => {
                resolve(this);
            });

            this.options = args;

            new Data(this).then(data => {
                this.data = data;
                this.emit('ready');
            });

        });
    }
}