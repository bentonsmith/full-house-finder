/**
 * Maps an array of cards to an object keyed off of the card values. The returned 
 * object looks like this:
 *      {
 *          '<value>: [ { card, index } ]
 *      }
 * 
 * We include the original index of the card to give the user the ability to 
 * manage their card array.
 * 
 * @param {Array} hand An array of card objects representing a hand
 * @returns {Object} An object containing arrays of cards keyed off their values
 */
function mapHandToValueArrays(hand) {
    let countObject = {};

    for(let card of hand) {
        if(!(card.value in countObject))
            countObject[card.value] = [card];

        else 
            countObject[card.value].push(card);
    }

    return countObject;
}

/**
 * Determines if an array of cards contains a full house. 
 * 
 * @param {Array} hand An array of card objects representing a hand
 * @returns {Boolean} A boolean representing whether or not the hand is a full house
 */
export function isFullHouse(hand) {
    if(Array.isArray(hand)) {
        let countObject = mapHandToValueArrays(hand);

        let valueArrays = Object.values(countObject);

        // We know we have a full house if we have 3 cards of one rank and 2 cards of another
        return (valueArrays.some(array => array.length === 2) && valueArrays.some(array => array.length === 3))
    }
    else {
        throw new Error('Must pass an array of cards');
    }
}

/**
 * Method to find the which cards in the array to discard
 * 
 * @param {Array} hand An array of card objects representing a hand
 * @returns {Array} An array of card codes to discard
 */
export function findDiscards(hand, discardPile) {
    if(Array.isArray(hand)) {
        let countObject = mapHandToValueArrays(hand);

        // Get all of the values (ranks) that we have in our hand
        let values = Object.keys(countObject);

        // Sort the values (ranks) by which one occurs most. 
        // TODO: Make sort more sophisticated. Could look at discard pile to make sure we prioritize 
        // cards that could lead to a full house.
        values.sort((a, b) => {
            let difference = countObject[b].length - countObject[a].length;

            // If we have the same number of two cards in our hand, we want to rank higher the one that
            // has more cards remaining in the deck (this means they have fewer in the discard pile). We'll
            // use the number of cards in the discard pile to compare here. 
            if(difference == 0) {
                difference = (discardPile[a] || 0) - (discardPile[b] || 0)
            }

            return difference;
        })

        let discards = [];

        // Figure out which cards to discard. 
        for(let index in values) {
            let value = values[index];

            let cardArray = countObject[value];
            // Since the array is sorted in order, we can assume that the first two indexes
            // are the most common. 
            if(index <= 1) {
                // If we have more than 3 cards, there is no sense keeping extras since we want a full house
                if(cardArray.length > 3) {
                    for(var i=3; i < cardArray.length; i++) {
                        discards.push(cardArray[i].code);
                    }
                }
            }
            // If it isn't the first two, we don't want it. 
            else {
                cardArray.forEach(card => discards.push(card.code));
            }
        }

        return discards;
    }
    else {
        throw new Error('Must pass an array of cards');
    }
}