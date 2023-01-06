import { ArgConfig, DomNodeBase, DomNodeType, IArgsConfigs, IComponentConfig, ICustomComponentConfig, IESDesiginComponent, RecordStr, Types } from "./types";

export const ESDESIGN_COMPONENT = 'EsDesginComponent';

export const PREFIX_CUSTOM_COMPONENT = 'customComponent.'

export function createCustomComponentName(name:string){

    return `${PREFIX_CUSTOM_COMPONENT}${name}`

}


export function createBuiltInComponent(name: string, component: React.ComponentType, type: IComponentConfig["type"], propsConfig?: RecordStr<ArgConfig>, attrsConfig?: RecordStr<ArgConfig>) {
    return Object.assign(component,
        {
            [ESDESIGN_COMPONENT]: {
                _type: 'builtIn',
                props: propsConfig,
                parentId: '',
                type: type || '',
                attrs: {
                    componentName: {
                        type: 1,
                        value: name || component.name
                    },
                    materialId: name || component.name,
                    ...attrsConfig
                }
            } as IComponentConfig
        }
    ) as IESDesiginComponent

}

export function createEsDesginComponent(name: string, component: React.ComponentType, type: IComponentConfig["type"], propsConfig?: RecordStr<ArgConfig>, attrsConfig?: RecordStr<ArgConfig>) {
    return Object.assign(component,
        {
            [ESDESIGN_COMPONENT]: {
                _type: 'custom',
                id: name || component.name,
                props: propsConfig,
                parentId: '',
                type: type || '',
                attrs: {
                    componentName: {
                        type: 1,
                        value: name || component.name
                    },
                    materialId: createCustomComponentName(`${name || component.name}`),
                    ...attrsConfig
                }
            } as ICustomComponentConfig
        }
    ) as IESDesiginComponent

}

export function isArgConfig(obj: any): obj is ArgConfig {
    return obj && (typeof obj == 'object') && ('type' in obj)
}

export function filterProps(props: RecordStr<any>, excludes: Array<string> = []) {
    const clearProps = { ...props }
    excludes.forEach(key => {
        delete clearProps[key]
    })
    return clearProps
}