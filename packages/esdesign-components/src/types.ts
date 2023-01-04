
import { ReactNode } from "react";
import { ESDESIGN_COMPONENT } from "./utils";
export declare type IESDesiginComponent = React.ComponentType & {
    [ESDESIGN_COMPONENT]: IComponentConfig;
};
export declare type IArgsConfigs = Record<string, IPropsConfig>;
export interface IPropsConfig {
    type: string;
    value: any;
}
export declare type RecordStr<T = any> = Record<string, T>;
export declare type DomNodeType = 'app' | 'page' | 'element' | 'customComponent' | 'fetch';
export interface DomNodeBase {
    id: string;
    parentId: string | null;
    type: DomNodeType;
    props?: RecordStr<IPropsConfig>;
    attrs?: object;
}
export declare enum Types {
    String = 1,
    Number = 2
}
export interface IAppNode extends DomNodeBase {
    parentId: null;
    type: 'app';
    attrs: {
        appName: {
            type: Types.String;
            value: unknown;
        };
    };
}
export interface IPageNode extends DomNodeBase {
    parentId: string;
    type: 'page';
    attrs: {
        pageName: {
            type: Types.String;
            value: unknown;
        };
    };
}
export interface IElementNode extends DomNodeBase {
    parentId: string;
    type: 'element';
    props?: IArgsConfigs;
    attrs: {
        componentName: {
            type: Types.String;
            value: string;
        };
        src: string;
    };
}
export interface ICustomComponentNode extends DomNodeBase {
    parentId: string;
    type: 'customComponent';
    props?: IArgsConfigs;
    attrs: {
        componentName: {
            type: Types.String;
            value: string;
        };
        source: {
            type: Types.String;
            value: string;
        };
    };
}
export interface IFetchNode extends DomNodeBase {
    parentId: string;
    type: 'fetch';
    attrs: {
        url: {
            type: Types.String;
            value: unknown;
        };
        params: {
            type: Types.String;
            value: unknown;
        };
        method: {
            type: Types.String;
            value: unknown;
        };
    };
}

// refactor - 2023!
export interface IAppConfig {
    version: string,
    appName: string,
    id: string,
    pages: RecordStr<IPageConfig>,
    customComponents: RecordStr<ICustomComponentConfig>

}


export interface IPageConfig {

    pageName: string,
    id: string,
    domTree: RecordStr<IComponentConfig>,
    sort?: Array<ID>
    query?: RecordStr<IFetchConfig>,
    theme?: any,//TODO


}

export type ID = string

export interface IComponentConfig {
    id: string,
    parentId: string;
    props?: RecordStr<IPropsConfig>;
    attrs: {
        componentName: {
            type: Types.String;
            value: string;
        };
        materialId: string;
    };
    type: 'slot' | '',
    child?: RecordStr<IComponentConfig>,
    sort?: Array<ID>;
    // rect?: 
}

// ICustomComponentConfig 实例化后会变成 CustomComponentConfig
//  CustomComponentConfig对象 是 继承 ComponentConfig
// ICustomComponentConfig 和 CustomComponentConfig 区别：
//     ICustomComponentConfig 没有
//     parentId?: string;
//     child:undefined;
//     childSort:undefined
//      attrs.materialId
export interface ICustomComponentConfig extends IComponentConfig {
    parentId: string;
    child?: RecordStr<IComponentConfig>;
    sort?: Array<ID>;
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

}

export interface IFetchConfig {
    parentId: string;
    type: 'fetch';
    attrs: {
        url: {
            type: Types.String;
            value: unknown;
        };
        params: {
            type: Types.String;
            value: unknown;
        };
        method: {
            type: Types.String;
            value: unknown;
        };
    };
}


export interface ISoltProps {
    children?: ReactNode | undefined;
}