class Player {
    #tracks = {};
    #listeners = {
        'onplay': [],
        'onerror': [],
    };
    
    constructor() {
        this.element = document.createElement('audio');
        this.element.onended = () => this.next();
    }
    
    prepare() {
        return new Promise((resolve, reject) => {
            fetch('tracks.json')
                .then(response => response.json())
                .then(json => this.#tracks = json)
                .then(resolve)
                .catch(reject);
        });
    }
    
    next() {
        let names = Object.keys(this.#tracks);
        let index = names.indexOf(this.element.getAttribute('track'));
        this.skipTo(names[++index >= names.length ? 0 : index]);
    }
    
    skipTo(trackName) {
        if(!trackName) trackName = 'doraemon_no_uta_1992';
        if(!this.#tracks[trackName]) {
            console.error('Invalid track name "' + trackName + '".');
            this.#listeners.onerror.forEach(onError => onError(new Error('Invalid track name "' + trackName + '".')));
        }
        this.element.src = this.#tracks[trackName].url;
        this.element.volume = this.#tracks[trackName].volume;
        this.element.currentTime = this.#tracks[trackName].startTime;
        this.element.setAttribute('track', trackName);
        this.element.play().then(() => {
            this.#listeners.onplay.forEach(onPlay => onPlay(this.#tracks[trackName].name));
        }).catch(e => {
            this.#listeners.onerror.forEach(onError => onError(e));
        });
    }

    addListener(name, handler) {
        this.#listeners[name].push(handler);
    }
}