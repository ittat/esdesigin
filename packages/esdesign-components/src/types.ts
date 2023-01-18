
import { ReactNode } from "react";
import { ESDESIGN_COMPONENT } from "./utils";


export declare type IESDesiginComponent = React.ComponentType & {
    [ESDESIGN_COMPONENT]: IComponentConfig<ArgConfig>;
};
export declare type IArgsConfigs = Record<string, IPropsConfig>;
export type IArgsTypes = 'string' | 'number' | 'object' | 'array' | 'event'

export interface ArgBoundActionConfig {
    action?: EventActionConfig
}

export interface ArgStringConfig<T extends string = string> extends ArgBoundActionConfig {
    type: 'string';
    value: T;
    enums?: Array<T>;
    required?: boolean;

}
export interface ArgNumberConfig extends ArgBoundActionConfig {
    type: 'number';
    value: number;
    enums?: Array<number>;
    range?: [number, number];
    required?: boolean;
}
export interface ArgBooleanConfig extends ArgBoundActionConfig {
    type: 'boolean';
    value: boolean;
    required?: boolean;
}
export interface ArgJsonConfig extends ArgBoundActionConfig {
    type: 'object' | 'array';
    value: string;
    required?: boolean;
}
export interface ArgEventConfig extends ArgBoundActionConfig {
    type: 'event';
}

export interface JSExpressionActionConfig {
    type: 'JSExpression',
    value: string
}

export interface NavigationActionConfig {
    type: 'Navigation',
    value: string,
    isOutSize?: boolean
}

export type EventActionConfig = JSExpressionActionConfig | NavigationActionConfig

export type ArgConfig = ArgStringConfig | ArgNumberConfig | ArgJsonConfig | ArgBooleanConfig | ArgEventConfig;

export interface IPropsConfig {
    type: string;
    value: any;
}
export declare type RecordStr<T = any> = Record<string, T>;
export declare type DomNodeType = 'app' | 'page' | 'element' | 'customComponent' | 'fetch';

export declare enum Types {
    String = 1,
    Number = 2
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
    query?: RecordStr<IQueryConfig>,
    theme?: any,//TODO
    globelScope: RecordStr<any>,


}

export type ID = string

export interface IComponentConfig<T = any> {
    _type?: 'builtIn' | 'custom',
    id: string,
    parentId: string;
    props?: RecordStr<T>;
    attrs: {
        componentName: {
            type: Types.String;
            value: string;
        };
        materialId: string;
    } & RecordStr<T>;
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
//     attrs.materialId
export interface ICustomComponentConfig<T = any> extends IComponentConfig<T> {
    _type?: 'custom',
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
    } & RecordStr<T>;
}

export interface IQueryConfig<T extends string = string> {
    pageId: string;
    id: ID,
    name: string,
    type: 'fetch';
    attrs: {
        // url: ArgStringConfig;
        // params?: Array<ArgStringConfig>;
        // method: ArgStringConfig
        // dataHandler?:JSExpressionActionConfig

        url: T;
        params?: RecordStr<string>;
        method: "GET" | "POST"
        dataHandler?: string


    };
}


export interface ICommonProps {
    [k: string]: any
}

export interface ISoltProps extends ICommonProps {
    children?: ReactNode | undefined;
}
