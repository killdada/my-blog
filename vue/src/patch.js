import { nodeOps } from './nodeOps'

// 指定父节点插入一个子节点，如果指定了ref，那么相当与在这个ref节点前面插入一个子节点
const insert = (parent, ele, ref) => {
    if (parent) {
        if (ref) {
            if (ref.parentNode === parent) {
                nodeOps.insertBefore(parent, ele, ref)
            }
        } else {
            nodeOps.appendChild(parent, ele)
        }
    }
}

// 根据一个虚拟节点创建一个子节点，如果是tag创建标签节点，如果是text创建文本节点
const createElm = (vnode, parentNode, refElm) => {
    if (vnode.tag) {
        insert(parentNode, nodeOps.createElement(vnode.tag), refElm)
    } else {
        insert(parentNode, nodeOps.createTextNode(), refElm)
    }
}

// 批量创建子节点
const addVnodes = (parentElm, refElm, vnodes, startIdx, endIdx) => {
    for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], parentElm, refElm)
    }
}

// 移除节点
const removeNode = ele => {
    const parent = nodeOps.parentNode(ele)
    if (parent) {
        nodeOps.removeChild(parent, ele)
    }
}

// 批量移除节点
const removeVnodes = (vnodes, startIdx, endIdx) => {
    for (; startIdx <= endIdx; ++startIdx) {
        const vnode = vnodes[startIdx]
        if (vnode) {
            removeNode(vnodes[startIdx].elm)
        }
    }
}

const sameInputType = (a, b) => {
    if (a.tag !== 'input') return true
    let i
    const typeA = (i = a.data) && (i = a.attrs) && i.type
    const typeB = (i = b.data) && (i = b.attrs) && i.type
    return typeA === typeB
}

// key, tag相同，data存在，并且如果是input必须input 的type必须相同，有些浏览器不支持动态改input类型
const sameVnode = (a, b) => {
    return a.key === b.key && a.tag === b.tag && !!a.data === !!b.data && sameInputType(a, b)
}

// {key1: 0, key2: 1}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    let i, key
    const map = {}
    for (i = beginIdx; i <= endIdx; ++i) {
        key = children[i].key
        if (key !== undefined) map[key] = i
    }
    return map
}

// 子节点对比更新，最重要的同层级的树diff处理
/**
 *
 * @param {*} parentElm ,父级node
 * @param {*} oldCh 旧的子节点数组
 * @param {*} ch 新的子节点数组
 * 新旧节点首尾都增加idx标示位
 * 往中间靠拢，如果旧的oldStartIdx >= oldEndIdx 并且新的 newStartIdx >= newEndIdx结束循环
 *
 */
const updateChildren = (parentElm, oldCh, ch) => {
    let oldStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[oldStartIdx]
    let oldEndVnode = oldCh[oldEndIdx]
    let newStartIdx = 0
    let newEndIdx = ch.length - 1
    let newStartVnode = ch[newStartIdx]
    let newEndVnode = ch[newEndIdx]
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm
    /**
     * 当 oldStartVnode 或者 oldEndVnode 不存在的时候，oldStartIdx 与 oldEndIdx 继续向中间靠拢，
     * oldStartIdx、newStartIdx、oldEndIdx 以及 newEndIdx 两两比对的过程 2*2  次比对
     */
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (!oldStartVnode) {
            oldStartVnode = oldCh[++oldStartIdx]
        } else if (!oldEndVnode) {
            oldEndVnode = oldCh[--oldEndIdx]
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
            // 相同直接往后移动
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = ch[++newStartIdx]
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            // 相同直接往前移动
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = ch[--newEndIdx]
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
            // 老的开始和新的尾相同，把老节点直接移动到末尾
            patchVnode(oldStartVnode, newEndVnode)
            nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = ch[--newEndIdx]
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
            // 老节点尾和新节点头相同，移动到头
            patchVnode(oldEndVnode, newStartVnode)
            nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = ch[++newStartIdx]
        } else {
            let elmToMove
            if (!oldKeyToIdx) {
                // 给旧节点以key创建一个map表实际跟idx映射
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
            }
            // 以新节点的开始节点的key，在老节点map里面找
            idxInOld = newStartVnode.key ? oldKeyToIdx[newStartVnode.key] : null
            if (!idxInOld) {
                // 新节点的开始节点没找到同样的key，直接创建节点，并把newStartIdx++
                createElm(newStartVnode, parentElm, oldStartVnode.elm)
                newStartVnode = ch[++newStartIdx]
            } else {
                // 新节点在老节点map里面找到了,找到了这个节点了，把这个节点和newStartVnode对比下
                elmToMove = oldCh[idxInOld]
                if (sameVnode(elmToMove, newStartVnode)) {
                    // 不仅仅key相同，并且也是同一类节点
                    patchVnode(elmToMove, newStartVnode) // 比对二个节点
                    oldCh[idxInOld] = undefined // 老节点的这个位置设置为空
                    // 匹配的这个newStartVnode节点添加到老节点的start前面
                    nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm)
                    newStartVnode = ch[++newStartIdx]
                } else {
                    // 实际没有匹配，这只能创建新节点，往后移,跟!idxInOld一样
                    createElm(newStartVnode, parentElm, oldStartVnode.elm)
                    newStartVnode = newCh[++newStartIdx]
                }
            }
        }
    }

    if (oldStartIdx > oldEndIdx) {
        // 老节点比对完了，但是新节点还有节点，需要把新节点全部加进来
        // 1 2 3 4
        // 1 2 5 6 3 4
        // 比对。是需要把 5 6 加到3前面，这里的 ch[newEndIdx + 1]可以用oldCh[oldStartIdx]替换
        refElm = ch[newEndIdx + 1] ? ch[newEndIdx + 1].elm : null
        addVnodes(parentElm, refElm, ch, newStartIdx, newEndIdx)
    } else if (newStartIdx > newEndIdx) {
        // 新节点并对完，但老节点还有多余的节点。需要删除掉
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}

// 相同节点，进行对比更新
function patchVnode(oldVnode, vnode) {
    if (oldVnode === vnode) return // 新老节点相同直接返回
    // 之前的静态标记节点如果都是静态直接返回不比对，直接用旧的vnode填充新的vnode
    if (oldVnode.isStatic && vnode.isStatic && oldVnode.key === vnode.key) {
        vnode.elm = oldVnode.elm
        vnode.componentInstance = oldVnode.componentInstance
        return
    }
    let elm = (vnode.elm = oldVnode.elm)
    let oldCh = oldVnode.has - children
    let ch = vnode.children

    if (vnode.text) {
        // 新节点是文本节点，直接设置textcontent
        nodeOps.setTextContent(elm, vnode.text)
    } else {
        if (oldCh && ch) {
            // 都有子节点，且不同，对比子节点children
            if (old !== ch) {
                updateChildren(elm, oldCh, ch)
            }
        } else if (ch) {
            // 新节点有子节点，老节点没有
            if (oldVnode.text) nodeOps.setTextContent(elm, '') // 如果老节点是文本节点先清空
            addVnodes(elm, null, ch, 0, ch.length - 1) // 然后把新的节点的children全部添加过来
        } else if (oldCh) {
            // 老节点有子节点，新节点没有，需要移除老节点的子节点
            removeVnodes(elm, null, oldCh, 0, oldCh.length - 1)
        } else if (oldVnode.text) {
            // 都没有子节点,老节点文本节点，新节点不是文本节点，清空老节点文本
            nodeOps.setTextContent(elm, '')
        }
    }
}

const patch = (oldVNode, VNode, parentElm) => {
    if (!oldVNode) {
        // 没有旧节点，直接新增所有新节点
        addVnodes(parentElm, null, VNode, 0, VNode.length - 1)
    } else if (!VNode) {
        // 新节点没有，需要吧老节点全部移除
        removeVnodes(oldVNode, 0, oldVNode.length - 1)
    } else {
        // 新老节点都有
        if (sameVnode(oldVNode, VNode)) {
            // 相同节点，进行比较
            patchVnode(oldVNode, VNode)
        } else {
            // 不相同节点，删除旧节点，新增新节点
            removeVnodes(oldVNode, 0, oldVNode.length - 1)
            addVnodes(parentElm, null, VNode, 0, VNode.length - 1)
        }
    }
}

export { patch }
