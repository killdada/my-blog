import { Dep } from './reactive'
import { nextTick } from './nextTick'

let waiting = false
let queue = []
let uid = 0
let map = new Map()
// queueWatcher 和nexttick里面的思路类似,
// 额外多了一个去重处理，map映射，如果是同一个id的watcher说明这一段nexttick路程这个watcher实例频繁触发了多次update
// 我们需要保证不要重复，避免多次去跑run方法更新

const flushSchedulerQueue = () => {
    const copies = queue.slice(0)
    queue.length = 0 // 清空
    for (let i = 0; i < copies.length; i++) {
        // 依次执行所有callback
        const watcher = copies[i]
        watcher.run()
        map.delete(watcher.id) // 这个watcher 执行完清空这个map对应的ID映射
    }
    waiting = false // 所有执行完，重置标示位
}

const queueWatcher = watcher => {
    const { id } = watcher
    if (!map.has(id)) {
        map.set(id, true)
        queue.push(watcher)
        if (!waiting) {
            waiting = true
            nextTick(flushSchedulerQueue)
        }
    }
}

class Watcher {
    constructor() {
        Dep.target = this
        this.id = ++uid
    }
    update() {
        // 重写watch更新,推入到watcher队列里面去
        console.log('watch' + this.id + ' update')
        queueWatcher(this)
    }
    // 这个才是真正的视图更新
    run() {
        console.log('watch' + this.id + '视图更新啦～')
    }
}

export { Watcher }
