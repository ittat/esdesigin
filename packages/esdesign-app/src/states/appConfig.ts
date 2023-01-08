import { IPropsConfig, IESDesiginComponent, ICustomComponentNode, DomNodeBase, IElementNode, IPageNode, RecordStr, Types, IAppConfig, ICustomComponentConfig, IPageConfig, IComponentConfig, IFetchConfig, ID, ArgConfig } from "packages/esdesign-components/dist/types"
import { IAppDom, Rectangle } from "../types"
import { compileModule } from "packages/esdesign-core/dist"
import loadModule from "packages/esdesign-core/dist/loadModule"
import { createCustomComponentName, ESDESIGN_COMPONENT, isArgConfig, PREFIX_CUSTOM_COMPONENT } from "packages/esdesign-components/dist"
import { getUUID } from "../globals"
import { v4 } from "uuid"
import { action, makeObservable, observable, } from "mobx"
import { EventManager } from "./eventManager"
import { RectangleEdge, RECTANGLE_SLOT_CENTER } from "../PageEditor/DetectOverlay"

import _ from "lodash"
import PageConfig from "./pageConfig"

export default class AppConfig implements IAppConfig {
    version: string
    appName: string
    id: string
    pages: RecordStr<PageConfig> = {}
    customComponents: RecordStr<ICustomComponentConfig<ArgConfig>> = {}

    materials: Record<string, IESDesiginComponent>

    event: EventManager = new EventManager()

    editedPage: PageConfig | null = null

    previewMode: boolean = false

    constructor({ appConfig, materials, preview }: { appConfig: IAppConfig, materials: Record<string, IESDesiginComponent>, preview?: boolean }) {

        this.materials = materials

        this.version = appConfig.version
        this.appName = appConfig.appName
        this.previewMode = preview || false

        this.customComponents = appConfig.customComponents

        if (!this.previewMode) {
            // @ts-ignore
            window.appdom = this
        }



        // pages
        Object.entries(appConfig.pages).forEach(([id, page]) => {
            this.pages[id] = new PageConfig({ config: page, appConfig: this })
        })




        makeObservable(this, {
            editedPage: observable.ref,
            pages: observable.ref,
            addPage: action.bound,
        })

    }



    addOrUpdateCustomElement(config: ICustomComponentConfig) {
        if (!config.id) {
            console.warn(" config.id 不存在");
            return
        }

        config.attrs.materialId = createCustomComponentName(config.id)
        this.customComponents[config.id] = config

        this.event.dispatch('appdom.add.or.update.customComponents', { config: config })

    }

    getCustomElements() {
        return Object
            .entries(this.customComponents)
            .map(([id, domNode]) => ({ id, node: domNode, code: domNode.attrs.source.value }))
    }

    addPage(config: IPageConfig) {
        this.pages[config.id] = new PageConfig({ config, appConfig: this })
        this.event.dispatch('appdom.add.page', { config: config })

    }
    getPages() {
        return Object.values(this.pages)
    }


}
