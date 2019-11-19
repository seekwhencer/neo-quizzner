import Module from '../../Module.js';
import SetupPlayerCards from "./templates/SetupPlayerCards.html";
import SetupPlayerCard from "./templates/SetupPlayerCard.html";
import SetupPlayerButton from "./templates/SetupPlayerButton.html";

// https://tobiasahlin.com/moving-letters/#6

export default class extends Module {
    constructor(args) {
        super();
        return new Promise(resolve => {
            this.setup = args;
            this.app = this.setup.app;

            this.cards = toDOM(SetupPlayerCards());
            this.setup.target.append(this.cards);

            this.maxPlayers = this.app.options.maxPlayers || 4;

            for (let i = 0; i < this.maxPlayers; i++) {
                const card = toDOM(SetupPlayerCard({
                    scope: {
                        index: i
                    }
                }));
                i === 0 ? card.classList.add('active') : null;
                card.playerNameField = card.querySelector('input');
                card.playerNameField.onkeyup = e => this.changeValue(e, card, i);
                card.playerNameField.onblur = () => card.classList.remove('active');
                card.playerNameField.onfocus = () => card.classList.add('active');
                card.timeout = false;
                this.cards.append(card);
                this.items.push(card);
            }

            this.confirm = toDOM(SetupPlayerButton());
            this.confirmButton = this.confirm.querySelector('button');
            this.confirmButton.onclick = () => {
                this.getPlayers();
                resolve(this);
            };
            this.setup.target.append(this.confirm);
            setTimeout(() => this.cards.classList.add('active'), 100);
            this.cards.querySelectorAll('input')[0].focus();
            this.checkConfirm();
        });
    }

    changeValue(e, card, i) {
        if (e.key === "Tab")
            return;

        card.timeout ? clearTimeout(card.timeout) : null;
        card.timeout = setTimeout(() => this.moveEmpty(), 300);
        card.playerNameField.value === "" ? card.classList.remove('filled') : card.classList.add('filled');
    }

    moveEmpty() {
        const cards = Array.prototype.slice.call(this.cards.querySelectorAll('.player-card')).reverse();
        cards.map(card => {
            if (card.querySelector('input').value === "") {
                const filledCard = cards.filter(i => i.querySelector('input').value !== "")[0];
                if (filledCard) {
                    const playerName = filledCard.querySelector('input').value;
                    if (playerName !== card.querySelector('input').value) {
                        card.querySelector('input').value = playerName;
                        card.classList.add("filled");
                        card.querySelector('input').focus();
                        filledCard.querySelector('input').value = "";
                        filledCard.classList.remove("filled", "active");
                    }
                }
            }
        });
        this.checkConfirm();
    }

    checkConfirm() {
        const cards = Array.prototype.slice.call(this.cards.querySelectorAll('.player-card'));
        const playerNames = cards.filter(i => i.querySelector('input').value !== "").map(i => i.querySelector('input').value);
        playerNames.length === 0 ? this.confirmButton.disabled = true : this.confirmButton.disabled = false;
    }

    getPlayers() {
        const cards = Array.prototype.slice.call(this.cards.querySelectorAll('.player-card'));
        this.players = cards.filter(i => i.querySelector('input').value !== "").map(i => i.querySelector('input').value);
    }

    away() {
        const animation = this.app.anime
            .timeline({
                loop: false
            })
            .add({
                targets: '.player-card',
                opacity: 0,
                filter: 'blur(10px)',
                translateZ: 0,
                duration: 10,
                delay: (el, i) => 100 * i,
                changeComplete: () => {
                    this.setup.target.querySelector('.player-cards').remove();
                }
            })
            .add({
                targets: '.buttons',
                opacity: 0,
                filter: 'blur(10px)',
                translateZ: 0,
                duration: 10,
                delay: (el, i) => 100 * i,
                changeComplete: () => {
                    this.setup.target.querySelector('.buttons').remove();
                }
            })
            .add({
                targets: '[data-scramble="title"] .letter',
                opacity: 0,
                filter: 'blur(10px)',
                translateZ: 0,
                duration: 10,
                delay: (el, i) => 20 * i,
                changeComplete: () => {
                    this.setup.target.querySelector('[data-scramble="title"]').remove();
                }
            });

        return animation.finished;
    }
}
