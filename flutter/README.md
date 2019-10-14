# flutter

### 跨平台技术简介

1. webview 渲染

   用 JavaScript 等前端技术进行开发，在客户端上用 WebView 来进行渲染。如微信小程序，cordova 等，

   优点：使用成熟的前端技术进行开发，学习成本低，开发效率高，并且支持动态发布代码。

   缺点：在性能体验上，和原生还是存在较大差距的。

2. 原生控件渲染

   这种方案，同样也是使用 JavaScript 开发，区别是它最终是调用原生控件进行渲染，如 React Native

   优点：使用原生控件进行渲染，性能体验也会更接近原生。

   缺点：但也只是更接近，和原生还是有差距的，因为它需要频繁的进行 JavaScript 和原生之间的通信，这个通信效率是比较低的。比如 RN 是通过 Jscore 解析 jsbunder 文件布局，和原生直接布局还是有那么一丁点差距的。由于需要适配各个平台的控件，那就有可能出现，系统控件更新了，而框架本身还没有更新，由此产生了一些问题。换句话说，这种方案是受到原生控件限制的。

3. 绘图引擎 Skia

   flutter 的 UI 渲染是基于 skia 图像引擎完成的，不依赖任何一个系统平台，平台仅仅提供一个画布，让 图像渲染在画布上。那么直接越过原生的渲染机制，从自身的渲染引擎去渲染视图，这就和原生一模一样，没有了中间商赚差价。

> 除了渲染上的区别，对于和原生服务的调用，别入照相、拍照、蓝牙，视频等，1 和 2 都是通过 bridge 协议来通讯的。3 flutter 是 用 Platform channel 的形式去调用系统服务

### 基础

flutter 开发语言：[dart](https://dart.dev/guides)

flutter [官方文档地址](https://flutter.dev/docs)

flutter [仓库地址](https://pub.dev)

### 学习路径

---

-- 入门 --

[中文文档地址](https://flutterchina.club/docs),按照上述的地址，完成起步的练习，初步了解 flutter 的使用，安装还有入门的过程中没有遇到阻碍，文档的安装和入门还是很亲和的。起步以后需要弄懂下面这二个基本的概念

#### 概念

1. widget

   不同于 Web 把页面分成了 HTML，CSS，JS， 在 Flutter 中，所有东西都是 widget 具体 widget 类型

   - 元素 widget。 如 button，menu，list
   - 样式 widget。如 font，color
   - 布局 widget。 如 padding，margin

   所有的 widget 嵌套组合在一起，就构成了一个 flutter app。

2. 状态

   分为 StatefulWidget 有状态 widget、StatelessWidget 无状态 widget

   - StatelessWidget 是不可变的, 这意味着它们的属性不能改变 - 所有的值都是最终的

   - StatefulWidget 当一个控件是可变的时候，就要使用 StatefulWidget 来构建。StatefulWidget 本身不可变，但它持有的状态 State 是可变的。

#### dart

flutter 使用 dart 作为开发语言，因此需要了解一下 dart 的基本语法

看了几遍 [dart 语法](https://www.jianshu.com/p/9e5f4c81cc7d)，这里的一些概括以后，简单的了解下语法，后续遇到问题，都是重新搜索文档，或者度娘搜索解决

---

-- 开发 --

有了上述简短的一些使用体验以后，开始开发我们自己的应用

从下面几个点开始深入开发

- 生命周期
- 布局、样式、交互
- 路由
- http 请求
- 状态
- 调试

#### 1 **生命周期**

---

#### 2 **布局、样式、交互**

---

#### 3 **路由**

---

#### 4 **http 请求**

---

#### 5 **状态**

---

#### 6 **调试**

---
