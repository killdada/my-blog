const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g
const forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/

const parseHTML = (html, option) => {
    const stack = []
    let currentParent
    let root
    let index = 0
    const advance = n => {
        index += n
        html = html.substring(n)
    }
    const parseText = text => {
        if (!defaultTagRE.test(text)) return
        const tokens = []
        let lastIndex = (defaultTagRE.lastIndex = 0)
        let match, index
        while ((match = defaultTagRE.exec(text))) {
            index = match.index

            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }

            const exp = match[1].trim()
            tokens.push(`_s(${exp})`)
            lastIndex = index + match[0].length
        }

        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        return tokens.join('+')
    }
    const getAttr = (el, name, remove = true) => {
        let val
        if ((val = el.attrsMap[name]) != null) {
            if (remove) {
                const list = el.attrsList
                for (let i = 0, l = list.length; i < l; i++) {
                    if (list[i].name === name) {
                        list.splice(i, 1)
                        break
                    }
                }
            }
        }
        return val
    }

    const processClass = el => {
        let exp = getAttr(el, ':class')
        if (exp) {
            el.classBinding = exp
        }
        let expC = getAttr(el, 'class', false)
        if (expC) {
            el.staticClass = expC
        }
    }

    const processIf = el => {
        let exp = getAttr(el, 'v-if')
        if (exp) {
            el.if = exp
            if (!el.ifConditions) {
                el.ifConditions = []
            }
            el.ifConditions.push({
                exp: exp,
                block: el
            })
        }
    }
    const processFor = el => {
        let exp = getAttr(el, 'v-for')

        if (exp) {
            const inMatch = exp.match(forAliasRE)
            el.for = inMatch[2].trim()
            el.alias = inMatch[1].trim()
        }
    }
    const makeAttrsMap = attrs => {
        const map = {}
        for (let i = 0, l = attrs.length; i < l; i++) {
            map[attrs[i].name] = attrs[i].value
        }
        return map
    }
    // 找到对应父标签，设置当前父currentParent
    const parseEndTag = tagName => {
        let pos
        for (pos = stack.length - 1; pos >= 0; pos--) {
            if (stack[pos].lowerCasedTag === tagName.toLowerCase()) {
                break
            }
        }

        if (pos >= 0) {
            stack.length = pos
            currentParent = pos === 0 ? null : stack[pos - 1]
        }
    }
    const parseStartTag = () => {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
                start: index
            }
            advance(start[0].length)
            let end
            let attr
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push({
                    name: attr[1],
                    value: attr[3]
                })
            }
            if (end) {
                advance(end[0].length)
                match.end = index
                return match
            }
        }
    }

    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                parseEndTag(endTagMatch[1])
                continue
            }
            if (html.match(startTagOpen)) {
                const startTagMatch = parseStartTag()
                const element = {
                    type: 1,
                    tag: startTagMatch.tagName,
                    lowerCasedTag: startTagMatch.tagName.toLowerCase(),
                    attrsList: startTagMatch.attrs,
                    attrsMap: makeAttrsMap(startTagMatch.attrs),
                    parent: currentParent,
                    children: []
                }

                processClass(element)
                processIf(element)
                processFor(element)

                if (!root) {
                    root = element
                }

                if (currentParent) {
                    currentParent.children.push(element)
                }
                // 非自闭合标签 <img/>这种
                if (!startTagMatch.unarySlash) {
                    stack.push(element)
                    currentParent = element
                }
                //...process start tag
                continue
            }
        } else {
            const text = html.substring(0, textEnd)
            advance(textEnd)
            let expression
            if ((expression = parseText(text))) {
                currentParent.children.push({
                    type: 2,
                    text,
                    expression
                })
            } else {
                currentParent.children.push({
                    type: 3,
                    text
                })
            }
            //...process text
            continue
        }
    }
    return root
}

const optimize = rootAst => {
    const isStatic = node => {
        if (node.type === 2) {
            return false
        }
        if (node.type === 3) {
            return true
        }
        return !node.if && !node.for
    }
    const markStatic = node => {
        node.static = isStatic(node)
        if (node.type === 1) {
            for (let i = 0, l = node.children.length; i < l; i++) {
                const child = node.children[i]
                markStatic(child)
                if (!child.static) {
                    node.static = false
                }
            }
        }
    }
    const markStaticRoots = node => {
        if (node.type === 1) {
            if (
                node.static &&
                node.children.length &&
                !(node.children.length === 1 && node.children[0].type === 3)
            ) {
                node.staticRoot = true
                return
            } else {
                node.staticRoot = false
            }
        }
    }
    markStatic(rootAst)
    markStaticRoots(rootAst)
}

const parse = html => {
    return parseHTML(html)
}

/**
 *
 * @param {*} ast ast
 * _c createtag 创建虚拟vnode 标签
 * _l 循环创建虚拟节点
 * _v 创建文本虚拟节点
 * _s 取值 _s(count) this.count
 */
const generate = ast => {
    let genIf, genFor, genElement, genChildren, genNode
    genNode = el => {
        if (el.type === 1) {
            return genElement(el)
        }
        return genText(el)
    }
    genChildren = el => {
        const children = el.children

        if (children && children.length > 0) {
            return `${children.map(genNode).join(',')}`
        }
    }
    genElement = el => {
        if (el.if && !el.ifProcessed) {
            return genIf(el)
        }
        if (el.for && !el.forProcessed) {
            return genFor(el)
        }
        const children = genChildren(el)
        return `_c('${el.tag}', {
            staticClass: ${el.attrsMap && el.attrsMap[':class']},
            class: ${el.attrsMap && el.attrsMap['class']},
        }${children ? `, ${children}` : ''})`
    }
    genIf = el => {
        el.ifProcessed = true // 标示位，避免重复
        if (!el.ifConditions.length) return `_e()` // 没有条件表达式直接返回空节点
        return `(${el.ifConditions[0].exp})?${genElement(el.ifConditions[0].block)}: _e()`
    }
    genFor = el => {
        el.forProcessed = true // 标示位，避免重复
        const { for: exp, alias } = el
        const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
        const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''
        return `_l((${exp}),
            function(${alias}${iterator1}${iterator2}) {
                return ${genElement(el)}
            }
        )`
    }
    const genText = el => {
        // 纯文本3的话不需要expression，纯文本3这个为undifined,type === 2 的话需要表达式 el.expression如： "count:" + _s(count)
        return `_v(${el.type === 3 ? el.text : el.expression})`
    }
    const code = ast ? genElement(ast) : '_c("div")'
    return {
        render: `with(this){return ${code}}`
    }
}

const compiler = html => {
    const ast = parse(html)
    optimize(ast)
    console.log('优化后的ast', ast)
    const code = generate(ast)
    console.log('编译后的renderString', code)
    return code
}

export { parse, optimize, generate, compiler }
