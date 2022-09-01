import { ENDPOINT_USER_PREFERENCE } from "../../Endpoints"

// Setup a remote storage
export default class RemoteStorage {
    constructor(prefs = null, csrfToken = null) {
        this.store = prefs;
        this.csrfToken = csrfToken;
    }

    clear() {
        this.store = null;
    }

    getItem(key) {
        if(this.store === null) {
            fetch(ENDPOINT_USER_PREFERENCE())
            .then((response) => response.json())
            .then((json) => {
                const store_parsed = {};

                Object.keys(json).forEach((key) => {
                    // TODO figure out a better solution that parsing all prefs as JSON
                    store_parsed[key] = JSON.parse(json[key]);
                })

                this.store = store_parsed;
            });
        }
        
        else{
            // Get this from the server
            return this.store[key] || null;
        }
    }
    
    setItem(key, value) {
        const data = new FormData();
        data.append('name', 'key');
        data.append('value', value);

        const searchParams = new URLSearchParams({'name': key, 'value': value});

        // Save this to the server
        /*
        POST calls in a Django app need a little work to make them function. I found that I needed to do the following:
          1) Include the "X-CSRFToken" header; this needs to match the value provided by the server
          2) Set the content-type to "application/x-www-form-urlencoded" and include the parameters as a URL encoded string
        */
        fetch(ENDPOINT_USER_PREFERENCE(), {
            method: 'POST',
            body: searchParams.toString(),// data,
            headers: {
                'X-CSRFToken': this.csrfToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        this.store[key] = value.toString();
    }

    removeItem(key) {
        delete this.store[key];
    }
}