/**
 * Created by liy on 18/1/30.
 */
function Watcher(vm, expFn, cb) {
    this.cb = cb;
    this.vm = vm;
    this.expFn = expFn;
    this.deepIds = {};

    if(typeof expFn === 'function') {
        this.getter = this.expFn;
    } else {
        this.getter = this.parseGetter(expFn); // 从getter中解析出function
    }

    this.value = this.get();
}

Watcher.prototype = {
   update: function () { // data属性变化时，更新数据的方法
       this.watchRun();
   },
   watchRun: function () {
       var value = this.get(); // 更新后属性的值
       var originalValue = this.value; // 更新前属性的值

       if(value !== originalValue) {
           this.value = value;
           this.cb.call(this.vm, value, originalValue); // 属性发生变化时，更新属性
       }
   },
    addDeep: function (deep) { // 添加订阅器的方法
        if(!this.deepIds.hasOwnProperty(deep.id)) { // 如果订阅器不存在，则添加一个订阅器用来监控此属性
            deep.addArr(this);
            this.deepIds[deep.id] = deep;
        }
    },
    get: function () {
        Deep.target = this; // 将当前订阅者指向自己
        var value = this.getter.call(this.vm, this.vm); // 将自己添加到属性订阅器中
        Deep.target = null; // 添加完毕后，释放闭包中的变量
        return value; // 返回从订阅器中获取的属性最新值
    },
    parseGetter: function (exp) {
        if (/[^\w.$]/.test(exp)) return;

        exp = exp.split('.');

        return function (obj) {
            for(var i = 0; i < exp.length; i++) {
                if(!obj) return ;
                obj = obj[exp[i]];
            }
            return obj;
        }
    }

};
