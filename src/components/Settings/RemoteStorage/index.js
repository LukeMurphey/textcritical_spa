import { ENDPOINT_USER_PREFERENCE_EDIT, ENDPOINT_USER_PREFERENCE_DELETE } from "../../Endpoints/urls"

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
            return null;
        }
        
        // Get this from the server
        return this.store[key] || null;
    }
    
    setItem(key, value) {
        const searchParams = new URLSearchParams({'value': value});

        // Save this to the server
        /*
        POST calls in a Django app need a little work to make them function. I found that I needed to do the following:
          1) Include the "X-CSRFToken" header; this needs to match the value provided by the server
          2) Set the content-type to "application/x-www-form-urlencoded" and include the parameters as a URL encoded string
        */
        fetch(ENDPOINT_USER_PREFERENCE_EDIT(key), {
            method: 'POST',
            body: searchParams.toString(),
            headers: {
                'X-CSRFToken': this.csrfToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        this.store[key] = value.toString();
    }

    removeItem(key) {
        fetch(ENDPOINT_USER_PREFERENCE_DELETE(key), {
            method: 'POST',
            headers: {
                'X-CSRFToken': this.csrfToken,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
        delete this.store[key];
    }
}
