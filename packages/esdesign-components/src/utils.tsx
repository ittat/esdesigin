import { ArgConfig, DomNodeBase, DomNodeType, IArgsConfigs, IComponentConfig, IESDesiginComponent, RecordStr, Types } from "./types";

export const ESDESIGN_COMPONENT = 'EsDesginComponent';


export function createEsDesginComponent(component: React.ComponentType, type: IComponentConfig["type"], propsConfig?: RecordStr<ArgConfig>,attrsConfig?:RecordStr<ArgConfig>) {

    // return {
    //     ...component,
    // [ESDESIGN_COMPONENT]:{
    //     argsConfig: argPropsConfig,
    // }
    // }

    return Object.assign(component,
        {
            [ESDESIGN_COMPONENT]: {
                props: propsConfig,
                parentId: '',
                type: type || '',
                attrs: {
                    componentName: {
                        type: 1,
                        value: component.name
                    },
                    materialId: component.name,
                    ...attrsConfig
                }
            } as IComponentConfig
        }
    ) as IESDesiginComponent

}

