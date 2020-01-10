class VNode {
    constructor(tag, data, children, text, elm) {
        /*当前节点的标签名*/
        this.tag = tag
        /*当前节点的一些数据信息，比如props、attrs等数据*/
        this.data = data
        /*当前节点的子节点，是一个数组*/
        this.children = children
        /*当前节点的文本*/
        this.text = text
        /*当前虚拟节点对应的真实dom节点*/
        this.elm = elm
    }
}

const createEmptyVNode = () => {
    return new VNode(undefined, undefined, undefined, '')
}

const createTextVNode = val => {
    return new VNode(undefined, undefined, undefined, String(val))
}

const cloneVNode = node => {
    return new VNode(node.tag, node.data, node.children, node.text, node.elm)
}
