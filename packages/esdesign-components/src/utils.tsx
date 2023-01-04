import { DomNodeBase, DomNodeType, IArgsConfigs, IComponentConfig, IESDesiginComponent, Types } from "./types";

export const ESDESIGN_COMPONENT = 'EsDesginComponent';


export function createEsDesginComponent(component: React.ComponentType, type: IComponentConfig["type"], config: IArgsConfigs) {

    // return {
    //     ...component,
    // [ESDESIGN_COMPONENT]:{
    //     argsConfig: argPropsConfig,
    // }
    // }

    return Object.assign(component,
        {
            [ESDESIGN_COMPONENT]: {
                props: config,
                parentId: '',
                type: type || '',
                attrs: {
                    componentName: {
                        type: 1,
                        value: component.name
                    },
                    materialId: component.name
                }
            } as IComponentConfig
        }
    ) as IESDesiginComponent

}


