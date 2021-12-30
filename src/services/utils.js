/**
 * Helpful function for using await to wait a certin number of milliseconds
 * 
 * @param {Number} milliseconds Number of milliseconds to wait. 
 */
export function wait(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds)
    })
}