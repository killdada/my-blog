import { isObject } from './utils'

class Dep {
    constructor() {
        this.subs = [] // 观察者对象数组
    }
    addSub(sub) {
        this.subs.push(sub) // 增加一个观察者
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}

Dep.target = null

/**
 * Object.defineProperty实现响应式
 * get依赖收集
 * set触发更新
 */
const defineReactive = (obj, key, val) => {
    const dep = new Dep()
    Object.defineProperty(obj, key, {
        enumerable: true /* 属性可枚举 */,
        configurable: true /* 属性可被修改或删除 */,
        get: function reactiveGetter() {
            if (Dep.target) {
                dep.addSub(Dep.target)
            }
            return val /* 实际上会依赖收集，下一小节会讲 */
        },
        set: function reactiveSetter(newVal) {
            if (newVal === val) return
            dep.notify()
        }
    })
}

// 通过遍历所有属性的方式对该对象的每一个属性都通过 defineReactive 处理。
const observer = value => {
    if (!value || !isObject(value)) return

    Object.keys(value).forEach(key => {
        defineReactive(value, key, value[key])
    })
}

export { observer, Dep }
