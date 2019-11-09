import Module from '../Module.js';

export default class extends Module {
    constructor(args) {
        super();

        return new Promise((resolve, reject) => {
            this.label = 'DATASOURCE';

            this.app = args;
            this.categoriesUrl = this.app.options.categoriesUrl;
            this.categories = [];

            this.on('ready', () => {
                console.log(this.label, '>>>', 'GOT ALL QUESTIONS', this.categories);
                resolve(this);
            });

            this.on('get-categories', () => {
                console.log(this.label, '>>>', 'GET CATEGORIES');
            });
            this.on('got-categories', () => {
                console.log(this.label, '>>>', 'GOT CATEGORIES', this.categories.map(i => i.category));
                this.categories.simsalabim();
            });

            this.on('get-questions', category => {
                console.log(this.label, '>>>', 'GET QUESTIONS FOR CATEGORY:', category);
            });
            this.on('got-questions', (category, questions) => {
                console.log(this.label, '>>>', 'GOT', questions.length, 'QUESTIONS FOR CATEGORY:', category, 'WITH', questions);
            });

            this.getCategories().then(() => {
                return this.getAllData();
            }).then(() => {
                this.emit('ready');
            })
        });
    }

    getCategories() {
        this.emit('get-categories');
        return this.fetch(this.categoriesUrl)
            .then(csvCategories => {
                let rows = csvCategories.split(/\n/);
                rows.map(row => {
                    const match = row.match(new RegExp(/"([^"]+)"/gi));
                    if (match)
                        match.map(i => {
                            const temp = i.replace(/,/gi, '####');
                            row = row.replace(i, temp);
                        });
                    const split = row.split(',').map(i => i.replace(/####/gi, ',').replace(/"/gi, ''));

                    this.categories.push({
                        category: split[0],
                        url: split[1]
                    });
                });
                this.emit('got-categories');
            });
    }

    getData(category) {
        const url = this.categories.filter(i => i.category === category).map(i => i.url)[0];
        this.emit('get-questions', category);
        return this.fetch(url)
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
                this.categories.filter(i => i.category === category)[0].questions = questions;
                this.emit('got-questions', category, questions);
                return;
            });
    }

    getAllData(index) {
        if (!index)
            index = 0;

        if (!this.categories[index])
            return Promise.resolve();

        const category = this.categories[index].category;
        return this.getData(category).then(() => {
            return this.getAllData(index + 1);
        });
    }

    fetch(url) {
        const requestOptions = {
            method: 'GET'
        };
        return fetch(url, requestOptions)
            .then(response => {
                if (!response.ok)
                    return Promise.reject(response.statusText);

                return response.text();
            })
            .then(csv => {
                if (csv) {
                    return csv;
                }
            });
    }
}