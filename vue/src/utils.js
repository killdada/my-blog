const isObject = value => {
    return Object.prototype.toString.call(value) === '[object Object]'
}

const isUndef = value => {
    return value === undefined || value === null
}
export { isObject, isUndef }
