import { IESDesiginComponent, RecordStr, IAppConfig, ICustomComponentConfig, IPageConfig, ArgConfig } from "@ittat/esdesign-components"
import { createCustomComponentName } from "@ittat/esdesign-components"
import { action, makeObservable, observable, } from "mobx"
import { EventManager } from "./eventManager"

import _ from "lodash"
import PageConfig from "./pageConfig"
import initObsevableObject from "./ObserverBus"



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


    appScopes: Record<string, any> = initObsevableObject({
        lalala:"sdsdsfsdf"
    });

    constructor({ appConfig, materials, preview }: { appConfig: IAppConfig, materials: Record<string, IESDesiginComponent>, preview?: boolean }) {

        this.id = appConfig.id
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
