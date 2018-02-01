/**
 * Created by liy on 18/1/30.
 */
function MVVM(options) {
    this.$options = options || {};
    var data = this._data = this.$options.data;
    var _this = this;

    Object.keys(data).forEach(function (key) { // 筛选出data中的所有属性，对其进行数据代理
        _this.proxyData(key);
    });

    this.initComputed(); // 初始化
    observer(data, this); // 劫持监听所有属性
    this.$compile = new Compile(this.$options.el || document.body, this); // 解析指令
}

MVVM.prototype = {
    $watch: function (key, cb, options) {
       new Watcher(this, key, cb);
    },
    // 为data中的每一个属性定义get，set方法。get方法用来获取属性原来的值，set用来接收属性最新的值
    proxyData: function (key, setter, getter) {
        var _this = this;
        this.setter = setter ||
                Object.defineProperty(_this, key, {
                    configurable: false,
                    enumerable: true,
                    get: function () {
                        return _this._data[key];
                    },
                    set: function (newVal) {
                        _this._data[key] = newVal;
                    }
                })
    },
    initComputed: function () {
        var _this = this;
        var computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function (key) {
                Object.defineProperty(_this, key, {
                    get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
                    set: function () {}
                });
            });
        }
    }
};