export class SnackBar {
    #element = document.createElement('div');

    constructor() {
        this.#element.classList.add('snack_bar');
        this.#element.addEventListener('animationend', event => {
            if(event.animationName === 'snack_bar_hide') {
                for(let key of this.#element.classList.keys())
                    this.#element.classList.remove(key);
                this.#element.parentNode.removeChild(this.#element);
            }
        });
    }

    show(message) {
        this.#element.innerText = message;
        if(!this.#element.classList.contains('show')) {
            this.#element.classList.add('show');
            document.body.appendChild(this.#element);
        }
    }

    hide() {
        if(this.#element.classList.contains('hide')) return;
        this.#element.classList.add('hide');
    }

    static showSnackBar(message, duration) {
        let snackBar = new SnackBar();
        snackBar.show(message);
        setTimeout(() => snackBar.hide(), duration || 3000);
    }
}