export default {
    /**
     * Helper method to make api requests
     * 
     * @param {String} method The HTTP method of the request you're making (currntly only GET is implemented)
     * @param {String} url The URL to fetch
     */
    async request(method, url) {
        let response = await fetch(url, {
            method
        });

        return await response.json();
    },

    /**
     * Helper method to make GET requests
     * 
     * @param {String} url The URL to fetch
     */
    get(url) {
        return this.request('GET', url);
    }
}