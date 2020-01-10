const isObject = value => {
    return Object.prototype.toString.call(value) === '[object Object]'
}

export { isObject }
