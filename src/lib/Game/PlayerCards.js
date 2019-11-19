import Module from '../../Module.js';
import SetupPlayerCards from "./templates/SetupPlayerCards.html";
import SetupPlayerCard from "./templates/SetupPlayerCard.html";

// https://tobiasahlin.com/moving-letters/#6

export default class extends Module {
    constructor(args) {
        super();

        this.setup = args;
        this.app = this.setup.app;

        this.cards = toDOM(SetupPlayerCards());
        this.setup.target.append(this.cards);

        this.maxPlayers = 4;

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
            //card.onmousemove = e => this.mouseMove(e, card, i);
            card.timeout = false;
            this.cards.append(card);
            this.items.push(card);
        }
        setTimeout(() => {
            this.cards.classList.add('active');
            this.cards.querySelectorAll('input')[0].focus();
        }, 200);
    }

    changeValue(e, card, i) {
        card.timeout ? clearTimeout(card.timeout) : null;
        card.timeout = setTimeout(() => this.moveContent(), 300);
        card.playerNameField.value === "" ? card.classList.remove('filled') : card.classList.add('filled');
    }

    moveContent() {
        const cards = Array.prototype.slice.call(this.cards.querySelectorAll('.player-card')).reverse();
        cards.map(card => {
            if (card.querySelector('input').value === "") {
                const filledCard = cards.filter(i => i.querySelector('input').value !== "")[0];
                if (filledCard) {
                    card.querySelector('input').value = filledCard.querySelector('input').value;
                    card.classList.add("filled", "active");
                    card.querySelector('input').focus();
                    filledCard.querySelector('input').value = "";
                    filledCard.classList.remove("filled", "active");
                }
            }
        });
    }
}
