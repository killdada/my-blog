// 对应platform里面的web和weex实现跨平台操作
const nodeOps = {
    createElement(tagName) {
        return document.createElement(tagName)
    },

    createTextNode(text) {
        return document.createTextNode(text)
    },
    setTextContent(node) {
        node.textContent = text
    },
    parentNode(node) {
        return node.parentNode
    },
    appendChild(node, child) {
        node.appendChild(child)
    },
    removeChild(node, child) {
        node.removeChild(child)
    },
    nextSibling(node) {
        return node.nextSibling
    },
    insertBefore(parentNode, newNode, referenceNode) {
        parentNode.insertBefore(newNode, referenceNode)
    }
}

export { nodeOps }
