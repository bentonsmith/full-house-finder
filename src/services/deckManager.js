import api from './api';

/**
 * Gets a new deck
 * 
 * @param {Number} count 
 */
export function getDeck(count = 1) {
    return api.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${count}`)
}

/**
 * Draws to draw cards from a given deck
 * 
 * @param {String} deckId The ID of the deck to draw cards from
 * @param {Number} count The number of cards to draw
 */
export function drawCards(deckId, count = 5) {
    return api.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
}