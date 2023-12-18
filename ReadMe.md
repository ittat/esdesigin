# 原理

esdesign-app - 主程序 nextjs

  根目录入口 pages/[index].tsx -->







esdesign-comps - 组件库



esdesign-core - 基础库






# 产品规划

  目标： 给设计师有前端能力的人提供一个简单易用的前端生成方法，给人快速创建小项目? 小切片？
      面向对象，有基础前端能力的设计师，后端开发者

        总之就是快，简单，全面，可扩展
        快 - 打开就是项目
        简单 - 编辑器直接拓展
        全面 - 丰富的ui库支持，（sql支持?）
        可拓展 - 自定义组件




  - 用户注册登录
  - 直接创建项目
  - 直接创建组件
  - 官方提供一些必要组件
  - 编辑器根据自定义组件的自定义接口生成编辑器属性
    分成两步
      1 用户语法生成
      2 界面UI配置
  - 编辑器强大的界面布局能力
  - 配合后端项目实现SQL的生成和管理
  - 多种继承使用方法
     1 schema页面级别渲染
     2 schema应用级别渲染
  - 适配多款组件库
     antd
     material
     mui
  - 对齐世界
     tailwind
     web component






















# 正在实现
 - ### 优先级高

  - 实现 page scope 和 对应 ui
    - 下次任务：
        目前只是page/root单向对应ui，ui保存回scope没有实现
          1. 实现i保存回scope没有实现
          2. pageconfig 的scope 没有测试依赖收集功能是否正常
          3. pageconfig 关于 scope 初始化 todo
          4. element 可以获取 pagescope
          5. 实现 element 可以查看当前的scope

  - 实现 query 和 其他element的props 的 响应式(可以属于同一个方法)

  - 实现事件路由跳转

  - 实现props按照情况自动改变 (??)


  - dom tree 查看

  - 完善 Setter Panel

  - Editor 插件性能问题

  - save to loaction


 - ### 优先级低

  - 实现事件输入参数
  - CustomComponent 的依赖引入问题
      - mui 样式问题 - ?
  - CustomComponent 编辑界面 异常处理
  - AppsOverView 完善

 - ### 逻辑问题


     - 问题，为什么不把customCompoent 转换成 Component？




# 正在排期

  - component List 不在左侧显示（改成在底部抽屉）
  - 快捷按钮功能

  - Left panel UI
  - 实现 grid 组件




# 计划实现

  - 项目独立分包依赖
  - shema 导出导入
  - 界面样式
  - props 的 required 标记
  - 拓展Antd 功能
  - cavnas 有不同分辨率的效果 - https://mui.com/material-ui/react-toggle-button/#enforce-value-set
  - 添加右击菜单 [here](https://mui.com/material-ui/react-menu/#context-menu)




# 已经实现


Canvas 自适应更新

Slot 组件适配

成为独立项目 ESDesign

添加git代码管理

 2023-01-05
 - 重新整理 settr props 标准协议问题
 - 完善props的 interface part 1
 - 实现 PageRow、column 的对齐
 - 补充Button props
 - 补充 boolean Setter
 - 解决 路由切换问题

 2023-01-06
 - fix:  添加元素报错；future: 编辑器热键保存[here](https://microsoft.github.io/monaco-editor/playground.html#interacting-with-the-editor-listening-to-key-events)
 - feature: CustomComponent 的 config 提取分离
 - feature: 完善 CustomComponent 编辑界面UI
 - feature: 完善 CustomComponent 完善 props 预览区域
 - feature: 实现 CustomComponent 编辑界面 添加 运行按钮
 - feature: 实现 canvas 元素删除

2023-01-07
  - bug parent can drop into his child!!!!
  - Setter 补全props 类型编辑

2023-01-08
  - feature: 补充 textfiled组件
  - feature: 完成props事件绑定
  - feature: 完成props输入绑定


2023-01-18
  - feature: 基本实现query的获取和编辑
  - fix: Query - 矫正params


2023-03-13
  - feature: 实现 scope 和 elemet 之间的获取、监听更新(使用Proxy+ Event)
  - feature: 实现 element 获取 query(不是响应式的)
  - feature: 实现 element 获取 page parameters
  - feature: 实现 element 获取 当前page的其他element的props


2023-03-14
  - feature: 实现 page/root scope 和 对应 ui (只是page/root单向对应ui，ui保存回scope没有实现)
