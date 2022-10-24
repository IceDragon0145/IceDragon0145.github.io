class Player {
  #tracks = {};
  
  constructor() {
    this.element = document.createElement('audio');
    this.element.onended = this.next;
  }
  
  prepare() {
    return new Promise((resolve, reject) => {
      fetch('tracks.json')
        .then(response => response.json())
        .then(json => {
          this.#tracks = json;
          this.skipTo().then(resolve).catch(reject);
        })
        .catch(reject);
    });
  }
  
  next() {
    let names = Object.keys(this.#tracks);
    let index = names.indexOf(this.element.getAttribute('track'));
    this.skipTo(names[++index >= names.length ? 0 : index]);
  }
  
  skipTo(trackName) {
    return new Promise((resolve, reject) => {
      if(!trackName) trackName = 'doraemon_no_uta_1992';
      if(!this.#tracks[trackName]) {
        console.error('Invalid track name "' + trackName + '".');
        reject('Invalid track name "' + trackName + '".');
      }
      this.element.src = this.#tracks[trackName].url;
      this.element.volume = this.#tracks[trackName].volume;
      this.element.currentTime = this.#tracks[trackName].startTime;
      this.element.setAttribute('track', trackName);
      this.element.play().then(() => {
        resolve(trackName);
      }).catch(reject);
    });
  }
}