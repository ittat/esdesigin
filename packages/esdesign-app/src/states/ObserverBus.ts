class ObserverBus {

    // TODO : 这里应该有一个最大值
    listeners: Map<string, Set<Function>>;

    constructor() {
        this.listeners = new Map();
    }

    on(key: string, fn: Function) {

        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set())
        }

        const cellection = this.listeners.get(key);

        if (!cellection.has(fn)) {
            cellection.add(fn)
        }

    }

    remove(key: string, fn: Function) {
        if (this.listeners.has(key)) {
            const cellection = this.listeners.get(key);
            cellection.delete(fn)
        }
    }

    notify(key: string, value: any) {

        if (!this.listeners.has(key)) {
            // console.log("!this.listeners.has(key)");

            return
        }
        const cellection = this.listeners.get(key);
        Array.from(cellection.values()).forEach(fn => {
            // 要先判断一下fn是否被GC回收了
            if (typeof fn == 'function') {
                // console.log("!tfunctiony)");
                fn(value)
            }
        })
    }

}


interface IObsevableObject {
    dep: ObserverBus,
    [s: string]: any
}

export default new Proxy({
    // 这是一个proxy的容器,
    // 里面的数据都会被自动转成可监听数据
    dep: new ObserverBus(),
    // btn1:"sdfsdf"
} as IObsevableObject, {

    // 添加监听
    get: function (target, key: string) {

        console.log("进入了get！！", key);
        const _self = target
        return function (fn: Function) {


            if (['$$typeof', 'dep'].includes(key)) {
                console.warn(key, ": 这个属性不可以监听哦");
            } else {
                _self.dep.on(key, fn)
            }

            return target?.[key]
        }
    },

    // 发布监听
    set: function (target, key: string, value) {

        console.log("SET!", key, value, target);


        if (['dep'].includes(key)) {
            console.warn(key, ": 这个属性不可以写");
            return
        } else {

            // 如果是复杂类型,这里只是ref引用判断,也就是浅比较
            if (key in target && target[key] == value) {
                // 不更新
                console.log("不更新");
            } else {
                console.log("发布更新");

                target.dep.notify(key, value)
                // 对于满足条件的 age 属性以及其他属性，直接保存
                target[key] = value;

            }

        }

        return value
    }
})