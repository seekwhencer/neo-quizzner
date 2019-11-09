import Module from '../../Module.js';

export default class extends Module {
    constructor(args) {
        super();
        this.label = 'CATEGORY';
        this.app = args.app;
        this.data = args.data;
        this.options = args.options;

        this.name = this.options.name;
        this.url = this.options.url;

        console.log(this.label, '>>> INIT', this.name);

        this.on('get-questions', () => {
            console.log(this.label, '>>>', 'GET QUESTIONS FOR CATEGORY:', this.name);
        });
        this.on('got-questions', () => {
            console.log(this.label, '>>>', 'GOT', this.questions.length, 'QUESTIONS FOR CATEGORY:', this.name, 'WITH', this.questions);
        });
    }

    getQuestions() {
        this.emit('get-questions', this);

        return this.fetch(this.url)
            .then(csvData => {
                let rows = csvData.split(/\n/);
                rows.shift();
                const questions = rows.map(row => {
                    const match = row.match(new RegExp(/"([^"]+)"/gi));
                    if (match)
                        match.map(i => {
                            const temp = i.replace(/,/gi, '####');
                            row = row.replace(i, temp);
                        });

                    const split = row.replace(/"/gi, '').replace(/\r/, '').split(',').map(i => i.replace(/####/gi, ',') || i);

                    if (!split[0])
                        return false;

                    let data = {
                        text: split[0]
                    };
                    data.answer = [];

                    //Answer 1
                    if (split[1]) {
                        data.answer.push({
                            text: split[1],
                            correct: split[2] === '1'
                        });
                    }

                    //Answer 2
                    if (split[3]) {
                        data.answer.push({
                            text: split[3],
                            correct: split[4] === '1'
                        });
                    }

                    //Answer 3
                    if (split[5]) {
                        data.answer.push({
                            text: split[5],
                            correct: split[6] === '1'
                        });
                    }

                    //Answer 4
                    if (split[7]) {
                        data.answer.push({
                            text: split[7],
                            correct: split[8] === '1'
                        });
                    }

                    //Answer 5
                    if (split[9]) {
                        data.answer.push({
                            text: split[9],
                            correct: split[10] === '1'
                        });
                    }

                    //Answer 6
                    if (split[11]) {
                        data.answer.push({
                            text: split[11],
                            correct: split[12] === '1'
                        });
                    }
                    return data;
                });
                this.questions = questions;
                this.emit('got-questions', this.name, questions);
                return;
            });
    }

    fetch(url) {
        return this.data.fetch(url);
    }

}