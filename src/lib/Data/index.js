import Module from '../../Module.js';
import Categories from './Categories.js';

export default class extends Module {
    constructor(args) {
        super();

        return new Promise((resolve, reject) => {
            this.label = 'DATASOURCE';
            console.log(this.label, '>>> INIT');
            this.app = args;

            this.on('ready', () => {
                console.log(this.label, '>>>', 'READY');
                resolve(this);
            });

            new Categories(this.app).then(categories => {
                this.categories = categories;
                this.emit('ready');
            });

        });
    }
}