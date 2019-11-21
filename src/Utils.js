/**
 * Wants a valid html string
 * Returns a valid DOM Element Tree
 *
 * @param string
 * @returns {ChildNode}
 */
window.toDOM = string => new DOMParser().parseFromString(string, "text/html").documentElement.querySelector('body').firstChild;

/**
 * Wait for n milliseconds
 * Returns a promise
 *
 * @param ms
 * @returns {Promise<any>}
 */
window.wait = ms => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

/**
 * Wrap a text, letter by letter, in a usable markup for scrambling
 * Wants a text
 * Returns a DOM element (tree)
 *
 * @param text
 * @returns {ChildNode}
 */
window.createScramble = text => {
    const element = toDOM(`<div data-scramble="title" class="scramble scramble-letters"></div>`);
    element.innerHTML = (`<span class="text-wrapper"><span class="parts">${text}</span></span>`);
    const textWrapper = element.querySelector('.parts');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='part'>$&</span>");
    return element;
};

/**
 * Wrap a text, word by word, in a usable markup for scrambling
 * Wants a text
 * Returns a DOM element (tree)
 *
 * @param text
 * @returns {ChildNode}
 */
window.createScrambleWords = text => {
    const words = text.split(/ /g);
    const element = toDOM(`<div data-scramble="title" class="scramble scramble-words"><span class="text-wrapper"><span class="parts"></div>`);
    words.map(i => {
        element.querySelector('.parts').append(toDOM(`<span class="part">${i}</span>`));
    });
    return element;
};
