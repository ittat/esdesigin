import { types } from "@ittat/esdesign-components";
import { IArgsConfigs, IPropsConfig } from "packages/esdesign-components/dist/types";
import AppConfig from "./states/appConfig";
import PageConfig from "./states/pageConfig";


export type IModules = Record<string, types.IESDesiginComponent>

export interface IHostYoube {
    hostDom: AppConfig,
    pageApi: PageConfig,
    ondomTreeUpdate?(rects:RecordStr<Rectangle>):void,
    previewMode?:boolean
    test?: any
}

export  interface Rectangle {
    x:number,
    y:number,
    width:number,
    height:number
}


export interface IAppDom {
    // nodes: RecordStr<DomNode>
    rootId: string
    version?: string
}



export type RecordStr<T= any> = Record<string, T>
