import {
  IESDesiginComponent,
  RecordStr,
  Types,
  ICustomComponentConfig,
  IComponentConfig,
  ID,
  ArgConfig,
} from "@ittat/esdesign-components";
import { Rectangle } from "../types";
import { compileModule, loadModule } from "@ittat/esdesign-core";
import {
  ESDESIGN_COMPONENT,
  isArgConfig,
  PREFIX_CUSTOM_COMPONENT,
} from "@ittat/esdesign-components";
import { getJSExpressionHander } from "@ittat/esdesign-core";

import { action, makeObservable, observable } from "mobx";

import _ from "lodash";
import AppConfig from "./appConfig";
import PageConfig from "./pageConfig";
import { getUUID } from "@/utils";

export class ComponentConfig implements IComponentConfig {
  id: string;
  parentId: string;
  props?: RecordStr<ArgConfig> = {};
  attrs: {
    componentName: { type: Types.String; value: string };
    materialId: string;
  } & RecordStr<ArgConfig>;
  type: "" | "slot";
  child: RecordStr<ComponentConfig> = {};
  childSort: Array<ID> = [];

  appRoot: AppConfig;
  pageRoot: PageConfig;

  materialId: string;

  // 组件的挂载点，只有在数据挂载到页面后才有数据
  ref?: any = undefined;

  rect?: Rectangle = undefined;

  /**
   * TODO: config 和 materialsConfig有功能重叠了！！！！
   * materialsConfig - 如果是custom 的 component ，我们需要提供一些预处理，并传入materialsConfig
   */
  constructor({
    config,
    appRoot,
    pageRoot,
    materialsConfig,
  }: {
    config: IComponentConfig;
    appRoot: AppConfig;
    pageRoot: PageConfig;
    materialsConfig?: IComponentConfig<ArgConfig>;
  }) {
    this.parentId = config.parentId;
    this.appRoot = appRoot;
    this.pageRoot = pageRoot;
    this.type = config.type;
    this.materialId = config.attrs.materialId;

    const isCustomComponentConfig = this.materialId.startsWith(
      PREFIX_CUSTOM_COMPONENT
    );

    if (!config.id) {
      this.id = getUUID();
    } else {
      this.id = config.id;
    }

    // props 和 attrs 的 合并预处理
    let materialConfig = isCustomComponentConfig
      ? appRoot.customComponents[
          this.materialId.split(PREFIX_CUSTOM_COMPONENT)[1]
        ]
      : appRoot.materials[this.materialId]?.EsDesginComponent;

    materialConfig = _.cloneDeep(materialConfig);

    if (!!materialConfig) {
      const { props = {}, attrs } = materialConfig;
      //--- props ----
      this.props = props;

      Object.entries(config.props || {}).forEach(([name, value]) => {
        if (name in this.props) {
          // fix: TODO 解析判断原因，重构
          if (isArgConfig(value)) {
            this.props[name].value = value.value;
          } else {
            this.props[name].value = value;
          }
        }
      });

      //---- attrs ----
      this.attrs = { ...attrs };
      const preProcessingAttr = { ...attrs } as RecordStr<ArgConfig>;
      delete preProcessingAttr["materialId"];
      delete preProcessingAttr["componentName"];
      delete preProcessingAttr["source"];

      Object.entries(preProcessingAttr || {}).forEach(([name, value]) => {
        if (name in this.attrs) {
          // @ts-ignore
          (this.attrs[name] as ArgConfig).value = value;
        }
      });
    } else {
      console.warn("ComponentConfig constructor Error!");
    }

    // this.child
    Object.entries(config.child || {}).forEach(([id, node]) => {
      if (CustomComponentConfig.IsCustomComponentConfigType(node)) {
        this.child[id] = new CustomComponentConfig({
          config: node,
          parentId: this.id,
          appRoot: this.appRoot,
          pageRoot: pageRoot,
        });
      } else {
        this.child[id] = new ComponentConfig({
          config: node,
          appRoot: this.appRoot,
          pageRoot: pageRoot,
        });
      }
    });

    // this.childSort
    if (config.sort) {
      this.childSort = config.sort;
    } else {
      this.childSort = Object.keys(this.child || {});
    }

    makeObservable(this, {
      child: observable.ref,
      childSort: observable.shallow,
      rect: observable.ref,
      props: observable.ref,
      addOrMoveNode: action.bound,
      updateRect: action.bound,
      removeChildrenById: action.bound,
    });
  }

  findElementById(id: string): ComponentConfig | undefined {
    if (this.id == id) {
      return this;
    }

    let node;
    const doms = Object.values(this.child);
    for (let index = 0; index < doms.length; index++) {
      const element = doms[index].findElementById(id);
      if (element) {
        node = element;
        break;
      }
    }

    return node;
  }

  addOrMoveNode(node: ComponentConfig, insertIndex?: number) {
    node.parentId = this.id;

    // 判断是否是位置移动
    if (node.id in this.childSort) {
      // 如果node在当前parent下面，先拿掉
      const newSort = this.childSort.filter((id) => id != node.id);
      this.childSort = newSort;
      insertIndex = insertIndex ? insertIndex - 1 : newSort.length - 1;
    }

    if (insertIndex != undefined && insertIndex < this.childSort.length) {
      this.childSort.splice(insertIndex, 0, node.id);
    } else if (insertIndex <= -1) {
      this.childSort.unshift(node.id);
    } else {
      this.childSort.push(node.id);
    }

    this.child[node.id] = node;
  }

  updateRect(rect: Rectangle) {
    // console.log("updateRect", this.id, rect);

    this.rect = rect;
  }

  // 直接移除某个child，不管child是否存在子子child
  removeChildrenById(id: string) {
    if (id in this.child) {
      delete this.child[id];
      this.childSort = this.childSort.filter((idStr) => idStr != id);
    }
  }

  // 移除自身节点，并深度清除所有child依赖
  removeMyself() {
    // 深度清除所有child依赖
    if (this.child) {
      Object.values(this.child).forEach((node) => node.removeMyself());
    }

    this.child = {};
    this.childSort = [];

    // 在其parent node中，把这个node移除
    const parentNode = this.pageRoot.findElementById(this.parentId);
    if (parentNode) {
      parentNode.removeChildrenById(this.id);
    }

    this.parentId = "";

    this.appRoot.event.dispatch("appdom.update", {});

    // NOTE: 这个时候并没有被GC回收
  }

  // this function can recomplute props and rerender react UI
  forcesToUpdate() {
    this.appRoot.event.dispatch("component.props.update", { id: this.id });
  }

  // this function can return the current value in a observable scope
  // and add some thing (forcesToUpdate) to make action,when target value has been change
  //
  getObserveValue(scope: RecordStr, key: string) {
    if (key in scope) {
      const rx = scope[key] as Function;

      return rx(this.forcesToUpdate);
    }
  }

  /**
   *
   * 把ArgConfig类型得props转换成key-value类型，喂给react组件
   *
   *
   * 关于如何属性响应式的说明：
   *  1 app的scope时实现了proxy劫持的
   *          当需要get里面的数据时，需要提供一个fn回调
   *          这个回调需要在set的时候进行触发依赖回调
   *  2 在依赖侧，封装了一个方法getObserveValue
   *          它收到app的scope回调后，会去执行this.forcesToUpdate
   *          this.forcesToUpdate 回去 触发全局事件
   *          在react侧的<Cell/>组件内有设置对应id的判断
   *          然后强制触发Cell组件的自身重新计算一遍
   *          最后实现界面的改变
   *
   *
   * 例子：
   *       this.appRoot.appScopes["sdadda"] = "asdasdsad21312";
   *       this.getObserveValue(this.appRoot.appScopes,"sdadda")
   *
   * 在 jsexpress里面的语法
   *       读：$scope(key)
   *       写：$scope(key,value)
   *
   */
  getProps() {
    const props = Object.entries(this.props || {}).reduce(
      (sum, [name, arg], idx) => {
        if (arg.action) {
          // bound
          const action = arg.action;
          if (action.type == "JSExpression") {
            //  glabal scope
            //  $scope 是 为了更加方便获取get states的写法
            //  $query(key) -> find key in page query -> get + 注册
            //  $params: $params.get(key)
            const scope = {
              getObserveValue: this.getObserveValue,
              appScope: this.appRoot.appScopes,
              $scope: (key: string, value: any) => {
                const scope = this.appRoot.appScopes;
                if (key && value) {
                  // --- set 方法
                  scope[key] = value;
                } else if (key && !value) {
                  // --- get 方法

                  // 这样可以防止在set一个新的key之前就对这个key进行get
                  // 导致fn没有加入dep依赖收集中
                  if (!(key in scope)) {
                    scope[key] = undefined;
                  }

                  // 返回数据
                  return this.getObserveValue(scope, key);
                } else {
                  console.warn("Do you know what you do?");
                }
              },
              $query: (key: string) => {
                if (key in this.pageRoot.query) {
                  const q = this.pageRoot.query[key];
                  // TODO: 没能实现
                  //    return q.rxResult.res(this.forcesToUpdate)
                  return q.result;
                }
                return undefined;
              },
              $params: new URLSearchParams(
                window.location.search.split("?")[1]
              ),
              $element: (id: string) => {
                return {
                  id,
                  // @ts-ignore - 不对这个行为负责，只是尽可能找到对应id的props
                  props: this.pageRoot.findElementById(id)?.props ?? undefined,
                  //  不对这个行为负责，只是尽可能找到对应id的dom
                  dom: this.pageRoot.tryFindMyRectById(id),
                };
              },
            };

            const fn = getJSExpressionHander(action, scope);

            if (arg.type == "event") {
              sum[name] = fn;
            } else {
              sum[name] = fn();
            }
          }

          // TODO： nav
        } else {
          sum[name] = arg.value || undefined;
        }

        return sum;
      },
      {} as RecordStr<any>
    );

    return props;
  }

  static async initMaterial(
    config: ComponentConfig,
    appApi: AppConfig,
    materials: Record<string, IESDesiginComponent>
  ) {
    let dom: IESDesiginComponent = materials["Error"];

    if (config.materialId.startsWith(PREFIX_CUSTOM_COMPONENT)) {
      const id = config.materialId.split(PREFIX_CUSTOM_COMPONENT)[1];

      const strCode = appApi.customComponents[id].attrs.source.value;

      if (strCode) {
        const compiledModule = compileModule(strCode, "sssss");
        const { default: Component } = await loadModule(compiledModule);
        const element: IESDesiginComponent = Object.assign(
          Component as React.ComponentType,
          { [ESDESIGN_COMPONENT]: config }
        );
        dom = element;
      }
    } else {
      const id = config.materialId;
      const maybeMaterials = materials[id];
      if (maybeMaterials) {
        dom = maybeMaterials;
      }
    }

    return dom;
  }

  // 是否为PageRow
  static isPageRowElement(config: ComponentConfig) {
    return config.materialId == "PageRow";
  }

  // 是否为PageColumn
  static isPageColumnElement(config: ComponentConfig) {
    return config.materialId == "PageColumn";
  }

  // 是否为普通元素组件
  static isNonSoltElement(config: ComponentConfig) {
    return config.type != "slot";
  }
}

export class CustomComponentConfig
  extends ComponentConfig
  implements ICustomComponentConfig
{
  attrs: {
    source: {
      type: Types.String;
      value: string;
    };
    componentName: {
      type: Types.String;
      value: string;
    };
    materialId: string;
  } & RecordStr<ArgConfig>;

  constructor({
    config,
    parentId,
    appRoot,
    pageRoot,
  }: {
    config: ICustomComponentConfig;
    parentId: string;
    appRoot: AppConfig;
    pageRoot: PageConfig;
  }) {
    const componentConfig: IComponentConfig = {
      ...config,
      parentId,
    };

    super({
      config: componentConfig,
      appRoot,
      materialsConfig: componentConfig,
      pageRoot,
    });
    // ICustomComponentConfig 和 CustomComponentConfig 区别：
    //     ICustomComponentConfig 没有
    //     parentId?: string;
    //     child:undefined;
    //     childSort:undefined
    //      attrs.materialId

    // 为自定义组件的数据管理类添加监听
    // 监听事件1： 本自定义组件的props attr等数据是否被用户修改
    this.appRoot.event.addListener(
      "appdom.add.or.update.customComponents",
      this.updateConfigDataHandler.bind(this)
    );

    makeObservable(this, {
      updateConfigDataHandler: action.bound,
    });
  }

  // 如果监听到config被用户更新
  updateConfigDataHandler(
    name: string,
    data: { config?: ICustomComponentConfig }
  ) {
    if (data?.config && data.config.attrs.materialId == this.materialId) {
      const config = _.cloneDeep(data.config);

      const { props = {}, attrs } = config;
      //--- props ----
      this.props = props;

      Object.entries(config.props || {}).forEach(([name, value]) => {
        if (name in this.props) {
          // fix: TODO 解析判断原因，重构
          if (isArgConfig(value)) {
            this.props[name].value = value.value;
          } else {
            this.props[name].value = value;
          }
        }
      });

      //---- attrs ----
      this.attrs = { ...attrs };
      const preProcessingAttr = { ...attrs } as RecordStr<ArgConfig>;
      delete preProcessingAttr["materialId"];
      delete preProcessingAttr["componentName"];
      delete preProcessingAttr["source"];

      Object.entries(preProcessingAttr || {}).forEach(([name, value]) => {
        if (name in this.attrs) {
          // @ts-ignore
          (this.attrs[name] as ArgConfig).value = value;
        }
      });
    }
  }

  static IsCustomComponentConfigType(
    obj: IComponentConfig | ICustomComponentConfig
  ): obj is ICustomComponentConfig {
    return (
      "source" in obj.attrs ||
      obj.attrs.materialId.startsWith(PREFIX_CUSTOM_COMPONENT) ||
      ("_type" in obj && obj["_type"] == "custom")
    );
  }
}
