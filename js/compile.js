/**
 * Created by liy on 18/1/30.
 */
function Compile(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el); // 判断是否为元素节点

    if(this.$el) {
        this.$fragment = this.copyOriginalFragment(this.$el); // 复制原生节点
        this.init(); // 初始化
        this.$el.appendChild(this.$fragment); // 将节点添加到各节点中
    }
}

Compile.prototype = {
    copyOriginalFragment: function (el) {
        var fragment = document.createDocumentFragment(); // 创建元素
        var childElement;

        while(childElement = el.firstChild) { // 将el中的元素全部复制到fragment集中
            fragment.appendChild(childElement);
        }

        return fragment;
    },
    init: function () {
        this.compileElement(this.$fragment); // 解析fragment集的元素
    },
    compileElement: function (el) {
        var _this = this;
        var child = el.childNodes;

        [].slice.call(child).forEach(function (item) {
            var text = item.textContent; // 获得元素的文本属性
            var reg = /\{\{(.*)\}\}/;

            if(_this.isElementNode(item)) { // 判断是否为元素节点
                _this.compile(item);
            } else if (_this.isTextNode(item) && reg.test(text)){ // 判断是否为文本内容
                _this.compileText(item, RegExp.$1); // 与正则表达式匹配的第一个子匹配的字符串
            }

            if(item.childNodes && item.childNodes.length) { // 遍历子元素
                _this.compileElement(item);
            }
        });
    },
    // 解析指令
    compile: function (node) {
        var _this = this;
        var nodeAttrs = node.attributes;
        [].slice.call(nodeAttrs).forEach(function (item) {
            var attrName = item.name;
            if(_this.isDirective(attrName)) {
                var value = item.value;
                var temp = attrName.substring(2); // 提取属性的v-后面的关键字

                if(_this.isEventDirective(temp)) { // 事件指令
                    compileUtil.eventHandler(node, _this.$vm, value, temp)
                } else {
                    compileUtil[temp] && compileUtil[temp](node, _this.$vm, value); // 这里只处理了v-model
                }
                node.removeAttribute(attrName); // 移除已读取处理过的dom节点上设置的属性
            }
        })
    },
    compileText: function (node, exp) { // 解析文本
        compileUtil.text(node, this.$vm, exp);
    },
    isDirective: function (attrName) { // 判断是否为指令
        return attrName.indexOf('v-') === 0;
    },
    isEventDirective: function (tmp) { // 判断是否为事件指令
        return tmp.indexOf('on') === 0;
    },
    isElementNode: function (node) { // 判断是否为元素节点
        return node.nodeType === 1;
    },
    isTextNode: function (node) { // 判断是否为文本内容
        return node.nodeType === 3;
    }
};

// 指令处理方法
var compileUtil = {
    text: function (node, vm, exp) { // 文本解析
        this.bind(node, vm, exp, 'text')
    },
    model: function (node, vm, value) { // model指令解析
        this.bind(node, vm, value, 'model');
        var _this = this;
        var val = this._getVMVal(vm, value); // 读取属性的值

        node.addEventListener('input', function (e) { // 为input输入框添加监听事件，value值发生变化时触发
            var newValue = e.target.value; //

            if(val === newValue) {
                return ;
            }
            _this._setVMVal(vm, value, newValue);
            val = newValue;

        })
    },
    bind: function (node, vm, exp, tmp) {
        var updaterFn = updater[tmp + 'Updater'];
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        new Watcher(vm, exp, function (value, originalValue) {
            updaterFn && updaterFn(node, value, originalValue);
        })
    },
    eventHandler: function (node, vm, exp, tmp) { // 事件指令处理方法
        var eventType = tmp.split(':')[1]; // 事件指令绑定的方法名
        var fun = vm.$options.methods && vm.$options.methods[exp]; // 绑定的方法

        if(eventType && fun) {
            node.addEventListener(eventType, fun.bind(vm), false); // 给元素添加监听事件，即绑定的事件
        }
    },
    _getVMVal: function (vm, exp) { // 读取属性的值
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function (item) {
            val = val[item];
        });
        return val;
    },
    _setVMVal: function (vm, exp, value) { // 设置属性的值
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function (item, index) { // 遍历子属性
            if(index < exp.length-1) {
                val = val[item];
            } else {
                val[item] = value;
            }

        });

    }
};

var updater = {
    textUpdater: function (node, value) { // 文本内容更新
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    modelUpdater: function (node, value, originValue) { // model指令绑定的属性值更新
        node.value = typeof value == 'undefined' ? '' : value;
    }

};
