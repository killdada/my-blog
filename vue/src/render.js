// render 将virdual-dom 对象渲染为实际 DOM 元素
function render(node) {
    let el = document.createElement(node.tag)
    let props = node.props
    // 设置节点的DOM属性
    for (let propName in props) {
        let propValue = props[propName]
        el.setAttribute(propName, propValue)
    }

    let children = node.children || []
    children.forEach(child => {
        let childEl = child.text
            ? document.createTextNode(child) // 如果字符串，只构建文本节点
            : child.render(child) // 如果子节点也是虚拟DOM，递归构建DOM节点
        el.appendChild(childEl)
    })
    return el
}

// "with(this){return _c('div', {
//             staticClass: undefined,
//             class: undefined,
//         }, (isShow)?_c('div', {
//             staticClass: classtest,
//             class: demo,
//         }, _l((list),
//             function((item, i)) {
//                 return _c('span', {
//             staticClass: undefined,
//             class: undefined,
//         }, _v(_s(item)))
//             }
//         )): _e(),_c('div', {
//             staticClass: undefined,
//             class: undefined,
//         }, _v("count:"+_s(count))),_c('div', {
//             staticClass: undefined,
//             class: undefined,
//         }, _v(点击count++)))}"
// 把compiler编译后的renderString,转换成vnode
function toVnode(str) {}

export { render, toVnode }
