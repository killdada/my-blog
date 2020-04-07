import { observer } from './reactive'
import { compiler } from './compiler'
import { Watcher } from './watcher'

class Vue {
    /* Vue构造类 */
    constructor(options) {
        this._rootElm = options.el ? document.querySelector(options.el) : 'body'
        if (!options.template) {
            console.warn('缺少模板')
            return
        }

        const renderString = compiler(options.template)

        this._data = options.data
        this._proxy(options.data)

        observer(this._data) // 建立联系， Object.defineProperty get set处理

        // 实际每一个属性都是一个watcher
        // 创建watcher,通过console.log( this._data.test)触发get进行依赖收集
        let watch1 = new Watcher()
        console.log('触发get,收集当前watcher对象', this._data.test1)
        let watch2 = new Watcher()
        console.log('触发get,收集当前watcher对象', this._data.test2)
        // 打印所有的update之后，才会执行run，最后的视图更新实际在nexttick包裹了
    }
    _proxy(data) {
        const that = this
        Object.keys(data).forEach(key => {
            Object.defineProperty(that, key, {
                enumerable: true /* 属性可枚举 */,
                configurable: true /* 属性可被修改或删除 */,
                get: function proxyGetter() {
                    return that._data[key]
                },
                set: function reactiveSetter(newVal) {
                    that._data[key] = newVal
                }
            })
        })
    }
}

window.Vue = Vue

export { Vue }
