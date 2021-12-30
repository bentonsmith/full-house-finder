<template>
    <div class="d-flex flex-column align-center">
        <div class="d-flex" :class="{ success: hasFullHouse }">
            <Card 
                v-for="(card, index) in hand"
                :key="index"
                :url="card.image"
                :value="card.value"
                :suit="card.suit"
            />
        </div>
        <div class="d-flex" v-if="error === ''">
            <span>{{ message }}</span>
        </div>
        <div v-if="error !== ''">
            <span>{{ error }}</span>
        </div>
        <div>
            <v-btn
                v-if="hasFullHouse || error !== ''"
                color="primary"
                @click="initializeGame"
            >Restart</v-btn>
        </div>
    </div>
</template>

<script>
import { getDeck, drawCards } from '@/services/deckManager';
import { wait } from '@/services/utils';
import { isFullHouse, findDiscards } from '@/services/gameManager';
import Card from './Card'

export default {
    name: 'GameContainer',
    components: {
        Card
    },
    data() {
        return {
            deckInfo: {},
            remainingCards: 52,
            discardPile: {},
            hand: [],
            hasFullHouse: false,
            message: 'Getting first hand',
            steps: 0,
            error: ''
        }
    },
    created() {
        this.initializeGame()
    },
    methods: {
        /**
         * Initializes the game with default data
         */
        async initializeGame() {
            try {
                this.hasFullHouse = false;
                this.setMessage('Getting first hand');
                this.deckInfo = await getDeck();
                let firstDraw = await drawCards(this.deckInfo.deck_id, 5);
                this.hand = firstDraw.cards;
                this.remainingCards = firstDraw.remaining;
                this.discardPile = {};
                this.steps = 0;
                this.error = '';
                this.runGame();
            }
            catch(err) {
                this.errorGettingCards(err);
            }
        },
        /**
         * Starts the game loop
         */
        async runGame() {
            while(!this.hasFullHouse && this.error === '') {
                // Keep track of how many steps it took to get a full house. 
                this.steps = this.steps + 1;
                if(isFullHouse(this.hand)) {
                    this.completeGame();
                    continue;
                }

                this.setMessage('Waiting... Looking at the deck...');
                await wait(1500);
                
                // Showing a message telling the user we're about to discard. Otherwise it is difficult
                // to tell when we are discarding
                this.setMessage('Discarding');

                // Find which cards to discard and get rid of them
                this.discardCards();
                await wait(500);

                // Refill our deck
                this.setMessage('Getting new cards');
                try {
                    await this.getNewCards();
                }
                catch(err) {
                    this.errorGettingCards(err);
                }
            }
        },
        /**
         * Sets the message to display to the user
         */
        setMessage(message) {
            this.message = message;
        },
        /**
         * Display an error that ends the game.
         * 
         * @param {Error} error The error to log
         */
        errorGettingCards(error) {
            console.error(error);
            this.error = 'Error getting connecting to the server to get cards. Please restart the game.';
        },
        /**
         * Shows that the game has been completed and that we have found a full house.
         */
        completeGame() {
            this.hasFullHouse = true;
            this.setMessage(`Full house found in ${this.steps} steps with ${this.remainingCards} cards left`);
        },
        /**
         * Figures out which cards we do not want and discards them
         */
        discardCards() {
            let discards = findDiscards(this.hand, this.discardPile);

            discards.forEach(cardCode => this.discardCard(cardCode));
        },
        /**
         * Discard an individual card. This will actually remove it from our hand.
         * 
         * @param {String} codeToDiscard The code of the card we would like to discard.
         */
        discardCard(codeToDiscard) {
            let index = this.hand.findIndex(card => card.code === codeToDiscard);
            let card = this.hand[index];

            // Keep track of the values we've discarded. We can use this to improve our decision making
            if(!(card.value in this.discardPile))
                this.discardPile[card.value] = 1;
            else 
                this.discardPile[card.value] = this.discardPile[card.value] + 1;
            
            // Actually remove the cards from our hand. 
            this.hand.splice(index, 1);
        },
        /**
         * Gets enough cards to fill our hand back up to 5 cards.
         */
        async getNewCards() {
            // Get enough new cards to get our deck up to five cards
            let newCards = await drawCards(this.deckInfo.deck_id, 5 - this.hand.length);

            this.remainingCards = newCards.remaining;

            // Add the cards to our hand
            this.hand.push(...newCards.cards);
        }
    }
}
</script>