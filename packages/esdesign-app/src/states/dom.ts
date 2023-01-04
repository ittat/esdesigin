import { IPropsConfig, IESDesiginComponent, ICustomComponentNode, DomNodeBase, IElementNode, IPageNode, RecordStr, Types, IAppConfig, ICustomComponentConfig, IPageConfig, IComponentConfig, IFetchConfig, ID } from "packages/esdesign-components/dist/types"
import { IAppDom, Rectangle } from "../types"
import { compileModule } from "packages/esdesign-core/dist"
import loadModule from "packages/esdesign-core/dist/loadModule"
import { ESDESIGN_COMPONENT } from "packages/esdesign-components/dist"
import { getUUID } from "../globals"
import { v4 } from "uuid"
import { action, makeObservable, observable, } from "mobx"
import { EventManager } from "./eventManager"
import { RectangleEdge, RECTANGLE_SLOT_CENTER } from "../PageEditor/DetectOverlay"


export class AppConfig implements IAppConfig {
    version: string
    appName: string
    id: string
    pages: RecordStr<PageConfig> = {}
    customComponents: RecordStr<ICustomComponentConfig> = {}

    materials: Record<string, IESDesiginComponent>

    event: EventManager = new EventManager()

    editedPage: PageConfig | null = null

    constructor({ appConfig, materials }: { appConfig: IAppConfig, materials: Record<string, IESDesiginComponent> }) {

        this.materials = materials

        this.version = appConfig.version
        this.appName = appConfig.appName

        // pages
        Object.entries(appConfig.pages).forEach(([id, page]) => {
            this.pages[id] = new PageConfig({ config: page, appConfig: this })
        })

        // customComponents
        // Object.entries(appConfig.customComponents).forEach(([id, comp]) => {
        //     this.customComponents[id] = new CustomComponentConfig({ config: comp })
        // })

        this.customComponents = appConfig.customComponents

        makeObservable(this, {
            editedPage: observable.ref,
            pages: observable.deep,
            addPage: action.bound,
        })

    }



    addcustomElement(config: ICustomComponentConfig) {
        this.customComponents[config.id] = config
    }

    getCustomElements() {
        return Object
            .entries(this.customComponents)
            .map(([id, domNode]) => ({ id, node: domNode, code: domNode.attrs.source.value }))
    }

    addPage(config: IPageConfig) {
        this.pages[config.id] = new PageConfig({ config, appConfig: this })

    }
    getPages() {
        return Object.values(this.pages)
    }


}



export class PageConfig implements IPageConfig {
    pageName: string
    id: string
    domTree: RecordStr<ComponentConfig> = {}
    sort: Array<ID> = []
    query?: RecordStr<IFetchConfig>
    theme?: any

    appRoot: AppConfig




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

        if (!config.id) {
            this.id = getUUID()
        } else {
            this.id = config.id
        }

        // this.domTree 
        Object.entries(config.domTree).forEach(([id, node]) => {
            this.domTree[id] = new ComponentConfig({ config: node })
        })

        // sort
        if (config.sort) {
            this.sort = config.sort
        } else {
            this.sort = Object.keys(this.domTree)
        }



        // this.query
        // Object.entries(config.domTree).forEach(([id,node])=>{
        //     this.domTree[id]= new 
        // })




        makeObservable(this, {
            //     domTree: observable,
            sort: observable.deep,
            // domTree: observable,
            selectedNode: observable.ref,
            drogOverNode: observable.ref,
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

    setDrogOverNode(node: ComponentConfig | this) {
        // 只能是Page或者Element被Over
        // if (PageConfig.isPageConfig(node) || ComponentConfig)

        // 如果draggingNode和node一致，不设置新操作
        if (this.drogOverNode && this.drogOverNode.id == node.id) {
            return
        }

        // 不能draggingNode和drogOverNode是同一个Node
        if (this.draggingNode && this.draggingNode.id == node.id) {
            console.warn('出问题了：setDrogOverNode');

            return
        }

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
            parentNode.removeChildrenById(this.draggingNode.id)
            // 添加新的联系
            this.drogOverNode.addOrMoveNode(this.draggingNode)
            
            this.appRoot.event.dispatch('appdom.update', {})
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
                        const pageRow = new ComponentConfig({ config: this.pageSolt.row })
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
                        pageSolt = new ComponentConfig({ config: this.pageSolt.column })

                        if (edgePostion == 'bottom') {
                            pageSolt.addOrMoveNode(overNode)
                            pageSolt.addOrMoveNode(node)
                        } else {
                            pageSolt.addOrMoveNode(node)
                            pageSolt.addOrMoveNode(overNode)
                        }
                    } else {
                        pageSolt = new ComponentConfig({ config: this.pageSolt.row })
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
            if (CustomComponentConfig.IsCustomComponentConfigType(props.config)) {
                this.draggingNode = new CustomComponentConfig({ config: props.config, parentId: this.id })
            } else {
                this.draggingNode = new ComponentConfig({ config: props.config })
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


export class ComponentConfig implements IComponentConfig {
    id: string
    parentId: string
    props?: RecordStr<IPropsConfig>
    attrs: { componentName: { type: Types.String; value: string }; materialId: string }
    type: "" | "slot"
    child: RecordStr<ComponentConfig> = {}
    childSort: Array<ID> = []

    dom


    rect?: Rectangle = undefined


    constructor({ config }: { config: IComponentConfig }) {

        this.parentId = config.parentId
        this.props = config.props
        this.attrs = config.attrs
        this.type = config.type

        if (!config.id) {
            this.id = getUUID()
        } else {
            this.id = config.id
        }

        // this.child 
        Object.entries(config.child || {}).forEach(([id, node]) => {
            this.child[id] = new ComponentConfig({ config: node })
        })

        // this.childSort 
        if (config.sort) {
            this.childSort = config.sort
        } else {
            this.childSort = Object.keys(this.child || {})
        }

        makeObservable(this, {
            child: observable,
            childSort: observable,
            rect: observable,
            addOrMoveNode: action.bound,
            updateRect: action.bound,
            removeChildrenById: action.bound
        })
    }

    findElementById(id: string): ComponentConfig | undefined {
        if (this.id == id) {
            return this
        }

        let node
        const doms = Object.values(this.child)
        for (let index = 0; index < doms.length; index++) {
            const element = doms[index].findElementById(id);
            if (element) {
                node = element
                break;
            }

        }

        return node


    }

    addOrMoveNode(node: ComponentConfig, insertIndex?: number) {
        debugger
        node.parentId = this.id

        // 判断是否是位置移动
        if (node.id in this.childSort) {
            // 如果node在当前parent下面，先拿掉
            const newSort = this.childSort.filter(id => id != node.id)
            this.childSort = newSort
            insertIndex = insertIndex ? (insertIndex - 1) : (newSort.length - 1)
        }

        if (insertIndex != undefined && insertIndex < this.childSort.length) {
            this.childSort.splice(insertIndex, 0, node.id)
        } else if (insertIndex <= -1) {
            this.childSort.unshift(node.id)
        } else {
            this.childSort.push(node.id)
        }


        this.child[node.id] = node


    }

    updateRect(rect: Rectangle) {
        // console.log("updateRect", this.id, rect);

        this.rect = rect
    }

    removeChildrenById(id: string) {
        if (id in this.child) {
            delete this.child[id]
            this.childSort = this.childSort.filter(idStr => idStr != id)
        }
    }

    static async initMaterial(config: ComponentConfig, appApi: AppConfig, materials: Record<string, IESDesiginComponent>) {
        let dom: IESDesiginComponent = materials['Error']


        if (config.attrs.materialId.startsWith('customComponent.')) {
            const id = config.attrs.materialId.split('customComponent.')[1]


            const strCode = appApi.customComponents[id].attrs.source.value

            if (strCode) {
                const compiledModule = compileModule(strCode, 'sssss');
                const { default: Component } = await loadModule(compiledModule);
                const element: IESDesiginComponent = Object.assign(Component as React.ComponentType, { [ESDESIGN_COMPONENT]: config })
                dom = element
            }
        } else {
            const id = config.attrs.materialId
            const maybeMaterials = materials[id]
            if (maybeMaterials) {
                dom = maybeMaterials
            }
        }


        return dom

    }

    // 是否为PageRow
    static isPageRowElement(config: ComponentConfig) {
        return config.attrs.materialId == 'PageRow'
    }

    // 是否为PageColumn
    static isPageColumnElement(config: ComponentConfig) {
        return config.attrs.materialId == 'PageColumn'
    }

    // 是否为普通元素组件
    static isNonSoltElement(config: ComponentConfig) {
        return config.type != 'slot'
    }



}


export class CustomComponentConfig extends ComponentConfig implements ICustomComponentConfig {

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
    };

    constructor({ config, parentId }: { config: ICustomComponentConfig, parentId: string }) {

        const componentConfig: IComponentConfig = {
            ...config,
            parentId
        }
        super({ config: componentConfig })
        // ICustomComponentConfig 和 CustomComponentConfig 区别：
        //     ICustomComponentConfig 没有
        //     parentId?: string;
        //     child:undefined;
        //     childSort:undefined
        //      attrs.materialId


        this.attrs.materialId = `customComponent.${this.id}`
        // 移除attrs.source
        // delete this.attrs['source']
    }


    static IsCustomComponentConfigType(obj: IComponentConfig | ICustomComponentConfig): obj is ICustomComponentConfig {
        return ('source' in obj.attrs)
    }


}