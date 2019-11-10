import './scss/app.scss';
import './Globals.js';
import Module from './Module.js';
import Intro from './lib/Intro/index.js';
import Game from './lib/Game/index.js';
import Data from './lib/Data/index.js';

export default class extends Module {
    constructor(args) {
        super();

        return new Promise((resolve, reject) => {
            this.label = 'QUIZZNER';
            this.options = args;

            this.on('ready', () => {
                resolve(this);
            });

            this.on('resize-start', () => {
                console.log(this.label, '>>> WINDOW RESIZE START');
            });

            this.on('resize-end', () => {
                console.log(this.label, '>>> WINDOW RESIZE END');
            });

            // window resize end behavior
            this.resizeTimeout = false;
            this.resizing = false;
            window.addEventListener('resize', () => {
                clearTimeout(this.resizeTimeout);
                this.resizeStart();
                this.resizeTimeout = setTimeout(() => {
                    this.resizeEnd();
                }, 500);
            });

            //
            new Intro(this).then(intro => {
                this.intro = intro;
                return new Data(this);
            }).then(data => {
                this.data = data;
                return new Game(this);
            }).then(game => {
                this.game = game;
                this.emit('ready');
            })

        });
    }

    resizeStart() {
        if (this.resizing === true)
            return;

        this.resizing = true;
        this.emit('resize-start', this);
    }

    resizeEnd() {
        this.emit('resize-end', this);
        this.resizing = false;
    }

}