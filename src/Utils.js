window.toDOM = string => new DOMParser().parseFromString(string, "text/html").documentElement.querySelector('body').firstChild;
