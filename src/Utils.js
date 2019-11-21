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
 * Wrap a text in a usable markup for scrambling
 * Wants a text
 * Returns a DOM element (tree)
 *
 * @param text
 * @returns {ChildNode}
 */
window.createScramble = text => {
    const element = toDOM(`<div data-scramble="title"></div>`);
    element.innerHTML = (`<span class="text-wrapper"><span class="letters">${text}</span></span>`);
    const textWrapper = element.querySelector('.letters');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    return element;
};
