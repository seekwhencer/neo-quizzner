window.toDOM = string => new DOMParser().parseFromString(string, "text/xml").documentElement;
