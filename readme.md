project的设计过程：
1.理清Vue双向数据绑定的原理，核心是数据劫持方法。它通过Object.defineProperty()来劫持data中各个属性的getter／setter，当数据发生变化时发
布消息给订阅者，触发相应的监听事件。

2.将MVVM框架拆分为四个模块：observer、compile、watcher、mvvm。
（1）observer：数据监听器，对所有属性进行监听。如果数据发生变化，通过notify方法通知订阅者。
（2）compile：指令解析器，将模版中的指令解析成数据。此次设计的指令有v-on/v-model指令，v-on绑定事件，v-model绑定属性。
（3）watcher:是observer、compile之间的桥梁。通过update方法触发compile中绑定的回调，更新数据。
（4）mvvm：数据绑定的入口，初始化时执行observer方法及事例化compile对象。

3.index.html中使用上述设计的mvvm框架，进行简单的测试。



＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
遇到的主要问题及解决方案：
1.一开始想要实现简单的数据交互功能时，没有整体的概念，对vue框架中实现数据交互的了解不够深刻，只停留在表面。
    搜索了大量博客，筛选出帮助自己理解简单mvvm框架实现的设计思路及核心方法。在github上下载了一些project，研究他们的代码实现。

2.怎么实现各模块之间的联系？
    首先，添加一个入口文件mvvm。在mvvm对象中，调用observer方法来监听数据。遍历data中所有属性，通过defineProperty方法检测属性值的变化。
当属性发生变化时通过observer中notify方法通知订阅者，调用watcher模块的update方法。之后通过update方法触发compile中绑定的回调函数，更新数据。

3.解析时，会有大量对dom节点的操作，影响效率及性能，怎么优化？
    为了优化性能，我们将el根节点转化为文档碎片fragment进行操作，对其解析完成后再将其添加到真实的dom中。



＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
反思：
    这一次demo练习，让我意识到自己技术能力十分地欠缺。很多前端爱好者的github都很活跃，而我的hub好像很久都没有维护过了，上面也没有什么
有价值的东西，很是惭愧。不知道该怎么表达，但是该好好有计划认真深入地学习前端的知识了。圈子内有很多大牛，也许我成不了像他们一样厉害的人。但确
实要用心学习自己选择的方向，可能做不到每一天都进步，但希望每一周都能有收获，在技术上有所成长。



＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
参考资料：
https://segmentfault.com/a/1190000006599500
https://github.com/DMQ/mvvm.git
https://www.cnblogs.com/libin-1/p/6893712.html
https://segmentfault.com/a/1190000007741904
https://github.com/zp1996/A-simple-MVVM.git
https://www.cnblogs.com/tongbiao/p/6539148.html
https://www.jianshu.com/p/817c411d0d90
https://github.com/fwing1987/MyVue.git

