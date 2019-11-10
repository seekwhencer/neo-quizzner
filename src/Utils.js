global.toDOM = string => {
    return new DOMParser().parseFromString(string, "text/xml").documentElement;
};