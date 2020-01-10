let callbacks = []
let pending = false

const flushCallbacks = () => {
    const copies = callbacks.slice(0)
    callbacks.length = 0 // 清空callback
    for (let i = 0; i < copies.length; i++) {
        // 依次执行所有callback
        copies[i]()
    }
    pending = false //执行完所有的callback了，重置标示位
}

const nextTick = cb => {
    // 把这个回调推入到回调数组里面,并不马上指向这些回调函数，而是所以同步任何执行完毕以后，
    // 进入异步任务的时候去执行所所有的callbacks
    callbacks.push(cb)

    if (!pending) {
        // 标示位，避免一次性创建多个异步任务，导致更新多次
        pending = true
        // 这里直接使用的是setTimeout推入到异步任务里面，实际是Promise - MutationObserver -setImmediate - setTimeout
        setTimeout(flushCallbacks, 0)
    }
}

export { nextTick }
