import { types } from "@ittat/esdesign-components";
import { IArgsConfigs, IPropsConfig } from "@ittat/esdesign-components";
import AppConfig from "./states/appConfig";
import PageConfig from "./states/pageConfig";


export type IModules = Record<string, types.IESDesiginComponent>

export interface IHostYoube {
    appApi?: AppConfig,
    pageApi?: PageConfig,
    ondomTreeUpdate?(rects: RecordStr<Rectangle>): void,
    previewMode?: boolean
    test?: any
}

export interface Rectangle {
    x: number,
    y: number,
    width: number,
    height: number
}


export interface IAppDom {
    // nodes: RecordStr<DomNode>
    rootId: string
    version?: string
}



export type RecordStr<T = any> = Record<string, T>


export type API_NAMES = '/api/Query' | '/api/QueryLinq' | '/api/GetById' | '/api/SaveEntity' | '/api/AddEntity' | '/api/GetEntityMetas' | '/api/SaveGroup' | '/api/Remove' |
    '/api/GetAllPickList' | '/api/GetExhibitionDetailById' | '/api/GetContactDetailById' | '/api/RemoveEntity' | '/api/RemoveGroup'

export const API_NAMES_LIST = [
    '/api/Query',
    '/api/QueryLinq',
    '/api/GetById',
    '/api/SaveEntity',
    '/api/AddEntity',
    '/api/GetEntityMetas',
    '/api/SaveGroup',
    '/api/Remove',
    '/api/GetAllPickList',
    '/api/GetExhibitionDetailById',
    '/api/GetContactDetailById',
    '/api/RemoveEntity',
    '/api/RemoveGroup',
]

export type RequestType = 'post' | 'get';

export enum ApiErrType {
    NoErr = 0,
    WorngParameter = 1,
    NoAccount = 2,
    ServerError = 3,
    Unauthenticated = 4,
    WongPasssword = 5,
    EmailUsed = 6,
}

export interface IApiResult<T> {
    status: ApiErrType;
    pgSize?: number;
    page?: number;
    total?: number;
    data?: T;
    // groupInfo?: ISelmGroup; //减少一下查询，所以和查询实体列表一起查询
    msg?: string;
}




declare global {
    interface Window {
        __ESYOUBE__?: IHostYoube;
        __ESYOUBE_injured_?(): void;
    }
}