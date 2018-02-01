/**
 * Created by liy on 18/1/30.
 */
function Observer(data) {
    this.data = data;
    this.run(data);
}
Observer.prototype = {
    run: function (data) {
        var _this = this;
        Object.keys(data).forEach(function (key) { // 遍历data中的所有属性并为每个属性添加数据劫持方法
            _this.convert(key, data[key])
        });
    },
    convert: function (key, value) {
        this.defineReactive(this.data, key, value);
    },
    defineReactive: function (data, key, value) {
        var deep = new Deep();
        var obj = observer(value); // 监听子属性

        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function () {
                if(Deep.target) {
                    deep.depend();
                }
                return value;
            },
            set: function (newVal) {
                if(value ===  newVal) {
                    return ;
                }
                value = newVal;
                obj = observer(value); // 新的值是object的话，进行监听
                deep.notify(); // 通知订阅者

            }
        })
    }
};
function observer(data,vm) {
    if(!data || typeof data !== 'object') { // 判断其是否还有子属性
        return ;
    }
    return new Observer(data);
}

var uid = 0;
function Deep() { // 属性订阅器
    this.id = uid++;
    this.arrs = []; // 用来存储属性
}

Deep.prototype = {
    addArr: function (arr) { // 向订阅器中添加属性的方法
        this.arrs.push(arr)
    },
    depend: function () {
        Deep.target.addDeep(this);
    },
    notify: function () {
        this.arrs.forEach(function (arr) {
            arr.update(); //更新属性
        })
    }
};
Deep.target = null; // 定义全局变量暂存watcher