# 正在实现
 - ### 优先级高


  - 实现 query + elemet 双向数据 获取、监听

  - 组件之间的dep实现
  - 实现 scope 获取逻辑


  - 实现事件路由跳转

  - 实现props按照情况自动改变


  - CustomComponent 的依赖引入问题
      - mui 样式问题 - ?



 - ### 优先级低


  - 实现事件输入参数

    - dom tree 查看


   - 完善 Setter Panel
   - CustomComponent 编辑界面 异常处理
   - AppsOverView 完善



 - ### 逻辑问题


     - 问题，为什么不把customCompoent 转换成 Component？

     - 目前有了app scope ，是否还需要实现 page scope ？ - 需要！！！


# 正在排期

  - component List 不在左侧显示（改成在底部抽屉）
  - 快捷按钮功能
  - Editor 插件性能问题
  - Left panel UI
  - 实现 grid 组件
  - save to loaction




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
