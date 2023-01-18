import { ComponentConfig, CustomComponentConfig } from "./componentConfig"
import { IPropsConfig, IESDesiginComponent, ICustomComponentNode, DomNodeBase, IElementNode, IPageNode, RecordStr, Types, IAppConfig, ICustomComponentConfig, IPageConfig, IComponentConfig, IFetchConfig, ID, ArgConfig, IQueryConfig } from "packages/esdesign-components/dist/types"
import { API_NAMES, IAppDom, Rectangle } from "../types"
import { compileModule } from "packages/esdesign-core/dist"
import loadModule from "packages/esdesign-core/dist/loadModule"
import { createCustomComponentName, ESDESIGN_COMPONENT, isArgConfig, PREFIX_CUSTOM_COMPONENT } from "packages/esdesign-components/dist"
import { getUUID } from "../globals"
import { v4 } from "uuid"
import { action, makeObservable, observable, } from "mobx"
import { EventManager } from "./eventManager"
import { RectangleEdge, RECTANGLE_SLOT_CENTER } from "../PageEditor/DetectOverlay"

import _ from "lodash"
import AppConfig from "./appConfig"
import QueryConfig from "./queryConfig"




export default class PageConfig implements IPageConfig {
    pageName: string
    id: string
    domTree: RecordStr<ComponentConfig> = {}
    sort: Array<ID> = []
    query?: RecordStr<QueryConfig> = {}
    theme?: any

    appRoot: AppConfig


    scope: RecordStr<any> = {}



    parameters: RecordStr<any> = {}



    draggingNode: null | ComponentConfig = null

    selectedNode?: ComponentConfig = undefined

    drogOverNode: null | ComponentConfig | this = null


    pageSolt = {
        row: {
            id: '',
            parentId: '',
            attrs: {
                componentName: {
                    type: 1,
                    value: 'PageRow',
                },
                materialId: 'PageRow',
            },
            type: 'slot',
            child: {},
            childSort: []
        } as IComponentConfig,
        column: {
            id: '',
            parentId: '',
            attrs: {
                componentName: {
                    type: 1,
                    value: 'PageColumn',
                },
                materialId: 'PageColumn',
            },
            type: 'slot',
            child: {},
            childSort: []
        } as IComponentConfig
    }




    elementRects: RecordStr<Rectangle> = {}
    slotTipsRect: RecordStr<Rectangle> = {}


    constructor({ config, appConfig }: { config: IPageConfig, appConfig: AppConfig }) {

        this.pageName = config.pageName
        this.appRoot = appConfig

        if (config.scope) {
            this.scope = config.scope
        }

        if (!config.id) {
            this.id = getUUID()
        } else {
            this.id = config.id
        }

        // this.domTree 
        Object.entries(config.domTree).forEach(([id, node]) => {
            if (CustomComponentConfig.IsCustomComponentConfigType(node)) {
                this.domTree[id] = new CustomComponentConfig({ config: node, parentId: this.id, appRoot: this.appRoot, pageRoot: this })
            } else {
                this.domTree[id] = new ComponentConfig({ config: node, appRoot: this.appRoot, pageRoot: this })
            }

        })

        // sort
        if (config.sort) {
            this.sort = config.sort
        } else {
            this.sort = Object.keys(this.domTree)
        }



        // this.query
        this.initQuery(config.query || {})



        makeObservable(this, {
            sort: observable.shallow,
            pageName: observable,
            selectedNode: observable.ref,
            drogOverNode: observable.ref,
            updatePageName: action.bound,
            setSelectedNode: action.bound,
            clearSelectNode: action.bound,
            updateRects: action.bound,
            draggingStart: action.bound,
            placeDraggingNode: action.bound,
            setDrogOverNode: action.bound,
            clearDrogOverNode: action.bound,
            addOrMoveNode: action.bound
        })

    }

    updatePageName(val: string) {
        this.pageName = val
    }

    initQuery(configs: RecordStr<IQueryConfig>) {


        Object.entries(configs).map(([id, config]) => {

            if (!(id in this.query)) {
                this.query[id] = new QueryConfig<API_NAMES>({ page: this, config, fetchAuto: true })
            }
        })

    }

    AddQuery(config?: IQueryConfig | QueryConfig) {

        if (!config) {
            const id = getUUID()
            const temp: IQueryConfig<API_NAMES> = {
                pageId: this.id,
                id,
                name: "New Query",
                type: "fetch",
                attrs: {
                    url: '/api/GetEntityMetas',
                    params: {},
                    method: "GET"
                }
            }

            this.query[id] = new QueryConfig({ page: this, config: temp, fetchAuto: true })
        } else if ('constructor' in config) {
            const id = (config as QueryConfig).id
            this.query[id] = (config as QueryConfig)
        } else {
            const id = getUUID()
            this.query[id] = new QueryConfig({ page: this, config, fetchAuto: true })
        }



        // todo: 

        this.appRoot.event.dispatch('page.query.update', {})
    }


    getScope() {
        const scope = Object.assign({}, this.scope)
        // state

        // query
        scope.query = this.query
        // params

    }

    pageInit() {
        // parameters



    }

    updateGlobelScope() {

        'page.glabol.update'
    }


    setDrogOverNode(node: ComponentConfig | this) {
        // 只能是Page或者Element被Over
        // if (PageConfig.isPageConfig(node) || ComponentConfig)

        // 如果draggingNode和node一致，不设置新操作
        if (this.drogOverNode && this.drogOverNode.id == node.id) {
            return
        }

        // 如果dargging node 是 node 的子组件、子子组件，不允许选中drag over  node
        if (this.draggingNode && !!this.draggingNode.findElementById(node.id)) {
            this.drogOverNode = undefined
            return

        }


        // 不能draggingNode和drogOverNode是同一个Node
        if (this.draggingNode && this.draggingNode.id == node.id) {
            console.warn('出问题了：setDrogOverNode');

            return
        }


        console.log("setDrogOverNodesetDrogOverNodesetDrogOverNode");
        this.drogOverNode = node


    }

    setSelectedNode(nodeId: string) {


        const node = this.findElementById(nodeId)
        if (node && !PageConfig.isPageConfig(node)) {
            this.selectedNode = node
        }

    }

    clearSelectNode() {
        this.selectedNode = undefined
    }
    clearDrogOverNode() {
        this.drogOverNode = undefined
    }

    // 在拖拽到canvas后，释放时触发的动作
    placeDraggingNode(edgePostion: RectangleEdge | 'center') {

        if (!this.draggingNode || !this.drogOverNode) { return }

        // 空solt组件 从center 插入
        if (edgePostion == 'center' && !PageConfig.isPageConfig(this.drogOverNode) && !ComponentConfig.isNonSoltElement(this.drogOverNode)) {
            // 移除dropNode的parent联系
            const parentNode = this.findElementById(this.draggingNode.parentId)
            if (parentNode) {
                parentNode.removeChildrenById(this.draggingNode.id)
            }

            // 添加新的联系
            this.drogOverNode.addOrMoveNode(this.draggingNode)

            // 移除没有发现影响 - 23-1-8
            // this.appRoot.event.dispatch('appdom.update', {})
            this.draggingNode = undefined
            this.drogOverNode = undefined
            return
        }


        let node = this.draggingNode

        // 如果overnode是this(pageNode)。 TODO: 需要判断插入位置
        if (this.drogOverNode.id == this.id) {


            if (!node.parentId) {
                node.parentId = this.id
                this.domTree[node.id] = node
                this.sort.push(node.id)
                this.sort = [...this.sort]
            } else {
                const parentNode = this.findElementById(node.parentId)
                parentNode.addOrMoveNode(node)
            }


        } else {
            // 如果overNode是一个Element


            if (node.parentId) {
                // 从依赖的parentNode的child 列表 中移除这个node
                const oldParent = this.findElementById(node.parentId)
                oldParent?.removeChildrenById(node.id)
            }



            // 如果OverNode是page元素，直接在this插入 （TODO：sort）
            if (this.drogOverNode.id == this.id) {
                this.addOrMoveNode(node)

            } else {
                const overNode = this.drogOverNode as ComponentConfig
                const overNodeParent = this.findElementById(overNode.parentId)

                // 如果overNode的parent是pageNode，垂直方向直接插入，水平方向否则父容器PageRow
                // 如果OverNode的parent是布局元素，并且方向和新元素插入方向一致，这种情况只需要直接插入新元素到parent
                // 其他情况 我们需要给他放置一个父平行容器PageRow或者PageColumns
                if (PageConfig.isPageConfig(overNodeParent)) {
                    if (edgePostion == 'bottom' || edgePostion == 'top') {
                        // 垂直方向直接插入
                        const overNodeIndex = overNodeParent.sort.findIndex(id => id == overNode.id)
                        const insertIndex = edgePostion == 'bottom' ? overNodeIndex + 1 : overNodeIndex
                        overNodeParent.addOrMoveNode(node, insertIndex)
                    } else {
                        // 创建新的水平父容器PageRow
                        const overNodeIndex = overNodeParent.sort.findIndex(id => id == overNode.id)
                        overNodeParent.removeChildrenById(overNode.id)
                        const pageRow = new ComponentConfig({ config: this.pageSolt.row, appRoot: this.appRoot, pageRoot: this })
                        if (edgePostion == 'left') {
                            pageRow.addOrMoveNode(node)
                            pageRow.addOrMoveNode(overNode)
                        } else {
                            pageRow.addOrMoveNode(node)
                            pageRow.addOrMoveNode(overNode)
                        }
                        overNodeParent.addOrMoveNode(pageRow, overNodeIndex)
                    }

                } else if (ComponentConfig.isPageColumnElement(overNodeParent) && (edgePostion == 'bottom' || edgePostion == 'top')) {

                    const overNodeIndex = overNodeParent.childSort.findIndex(id => id == overNode.id)
                    const insertIndex = edgePostion == 'bottom' ? overNodeIndex + 1 : overNodeIndex
                    overNodeParent.addOrMoveNode(node, insertIndex)

                } else if (ComponentConfig.isPageRowElement(overNodeParent) && (edgePostion == 'left' || edgePostion == 'right')) {


                    const overNodeIndex = overNodeParent.childSort.findIndex(id => id == overNode.id)
                    const insertIndex = edgePostion == 'right' ? overNodeIndex + 1 : overNodeIndex
                    overNodeParent.addOrMoveNode(node, insertIndex)
                } else {
                    const overNodeIndex = overNodeParent.childSort.findIndex(id => id == overNode.id)
                    overNodeParent.removeChildrenById(overNode.id)
                    let pageSolt: ComponentConfig = null

                    if (edgePostion == 'bottom' || edgePostion == 'top') {
                        pageSolt = new ComponentConfig({ config: this.pageSolt.column, appRoot: this.appRoot, pageRoot: this })

                        if (edgePostion == 'bottom') {
                            pageSolt.addOrMoveNode(overNode)
                            pageSolt.addOrMoveNode(node)
                        } else {
                            pageSolt.addOrMoveNode(node)
                            pageSolt.addOrMoveNode(overNode)
                        }
                    } else {
                        pageSolt = new ComponentConfig({ config: this.pageSolt.row, appRoot: this.appRoot, pageRoot: this })
                        if (edgePostion == 'left') {
                            pageSolt.addOrMoveNode(node)
                            pageSolt.addOrMoveNode(overNode)
                        } else {
                            pageSolt.addOrMoveNode(node)
                            pageSolt.addOrMoveNode(overNode)
                        }

                    }

                    // 将 pageSolt parent 

                    pageSolt && overNodeParent.addOrMoveNode(pageSolt, overNodeIndex)
                }


            }

        }

        this.appRoot.event.dispatch('appdom.update', {})
        this.draggingNode = undefined
        this.drogOverNode = undefined
    }


    findElementById(nodeId: string) {


        if (nodeId == this.id) {
            return this
        }

        let node: ComponentConfig | undefined
        const doms = Object.values(this.domTree)
        for (let index = 0; index < doms.length; index++) {
            const element = doms[index].findElementById(nodeId);
            if (element) {
                node = element
                break;
            }

        }

        return node
    }


    removeChildrenById(nodeId: string) {
        if (nodeId in this.domTree) {
            delete this.domTree[nodeId]
            this.sort = this.sort.filter(idStr => idStr != nodeId)
        }
    }

    // 从界面底部的物料中拖拽某物料时，触发此动作
    async draggingStart(props: { type: 'NEW', config: IComponentConfig | ICustomComponentConfig } | { type: 'EXIST', nodeId: string }) {

        if (props.type == 'NEW') {


            const deepCloneConfig = _.cloneDeep(props.config)

            if (CustomComponentConfig.IsCustomComponentConfigType(deepCloneConfig)) {
                this.draggingNode = new CustomComponentConfig({ config: deepCloneConfig, parentId: this.id, appRoot: this.appRoot, pageRoot: this })
            } else {
                this.draggingNode = new ComponentConfig({ config: deepCloneConfig, appRoot: this.appRoot, pageRoot: this })
            }

        } else {
            const node = this.findElementById(props.nodeId)
            node && !PageConfig.isPageConfig(node) && (this.draggingNode = node)
        }
    }

    updateRects(elementRects: RecordStr<Rectangle>, slotTipsRect: RecordStr<Rectangle>) {

        this.elementRects = elementRects
        this.slotTipsRect = slotTipsRect

        Object.entries(elementRects).forEach(([id, rect]) => {
            const element = this.findElementById(id)
            if (element && !PageConfig.isPageConfig(element)) {
                element.updateRect(rect)
            }
        })

    }

    addOrMoveNode(node: ComponentConfig, insertIndex?: number) {


        node.parentId = this.id

        // 判断是否是位置移动
        if (node.id in this.sort) {
            // 如果node在当前parent下面，先拿掉
            const newSort = this.sort.filter(id => id != node.id)
            this.sort = newSort
            insertIndex = insertIndex ? (insertIndex - 1) : (newSort.length - 1)
        }


        if (insertIndex && insertIndex < this.sort.length) {
            this.sort.splice(insertIndex, 0, node.id)
        } else if (insertIndex <= -1) {
            this.sort.unshift(node.id)
        } else {
            this.sort.push(node.id)
        }

        this.domTree[node.id] = node
    }

    tryFindMyRectById(nodeId: string) {
        console.log('this.rects', this.elementRects);

        return this.elementRects[nodeId]
    }


    static isPageConfig(obj: any): obj is PageConfig {
        return typeof obj == 'object' && 'pageName' in obj
    }



}
