import React, { PropsWithChildren, useContext, useMemo } from "react"
import { components, types } from "@ittat/esdesign-components";
import { AppConfig, PageConfig } from "./states/dom";
import { IAppConfig, Types } from "packages/esdesign-components/dist/types";

export const appConfigProvider = React.createContext<{
    appDom: AppConfig | null,
}>({
    appDom: null,
})

export const materialProvider = React.createContext<{
    materials: Record<string, types.IESDesiginComponent>
}>({
    materials: {},
})

export const useMaterial = () => {

    const custom = useContext(materialProvider)

    return custom.materials
}


const tempConfig: IAppConfig = {
    version: '0.0.1',
    appName: '快熟开发',
    id: '1s2d34d-2f23f-f23f2c3f-2f23f23',
    pages: {
        'd23d2d-4g45-2d21d-h44': {
            id: 'd23d2d-4g45-2d21d-h44',
            pageName: 'page 1',
            sort: ['asdas-fdsf234-23423we4-ewsrwe234', 'customComp1-id', 'element1', 'sdfrf34-4sdf43-sdfd234-few234-ewr'],
            domTree: {
                'element1': {
                    id: 'element1',
                    parentId: 'd23d2d-4g45-2d21d-h44',
                    type: '',
                    props: {},
                    attrs: {
                        componentName: {
                            type: 1,
                            value: 'element 1'
                        },
                        materialId: 'Button'
                    }
                },
                'customComp1-id': {
                    id: 'customComp1-id',
                    parentId: 'd23d2d-4g45-2d21d-h44',
                    type: '',
                    attrs: {

                        componentName: {
                            type: 1,
                            value: 'Custom Component 1'
                        },
                        materialId: 'customComponent.customComp2-id'


                    }
                },
                'asdas-fdsf234-23423we4-ewsrwe234': {
                    id: 'asdas-fdsf234-23423we4-ewsrwe234',
                    parentId: 'd23d2d-4g45-2d21d-h44',
                    type: 'slot',
                    attrs: {
                        componentName: {
                            type: 1,
                            value: 'PageRow'
                        },
                        materialId: 'PageRow'
                    },
                    sort: ['few-4r-4334-34rr--r4', 'ds-erf23-5t5-5t45t-'],
                    child: {
                        'ds-erf23-5t5-5t45t-': {
                            id: 'ds-erf23-5t5-5t45t-',
                            parentId: 'asdas-fdsf234-23423we4-ewsrwe234',
                            type: '',
                            props: {},
                            attrs: {
                                componentName: {
                                    type: 1,
                                    value: 'element 1'
                                },
                                materialId: 'Button'
                            }
                        },
                        'few-4r-4334-34rr--r4': {
                            id: 'few-4r-4334-34rr--r4',
                            parentId: 'asdas-fdsf234-23423we4-ewsrwe234',
                            type: '',
                            attrs: {
                                componentName: {
                                    type: 1,
                                    value: 'Custom Component 1'
                                },
                                materialId: 'customComponent.customComp2-id'
                            }
                        },
                    }
                },
                'sdfrf34-4sdf43-sdfd234-few234-ewr': {
                    id: 'sdfrf34-4sdf43-sdfd234-few234-ewr',
                    parentId: 'd23d2d-4g45-2d21d-h44',
                    type: 'slot',
                    attrs: {
                        componentName: {
                            type: 1,
                            value: 'PageColumn'
                        },
                        materialId: 'PageColumn'
                    },
                    child: {
                        'sr32-dsfw3-4ef-34r5-34-r43': {
                            id: 'sr32-dsfw3-4ef-34r5-34-r43',
                            parentId: 'sdfrf34-4sdf43-sdfd234-few234-ewr',
                            type: '',
                            props: {},
                            attrs: {
                                componentName: {
                                    type: 1,
                                    value: 'element 1'
                                },
                                materialId: 'Button'
                            }
                        },
                        'd32d3-edwd23d-4t44t-d3': {
                            id: 'd32d3-edwd23d-4t44t-d3',
                            parentId: 'sdfrf34-4sdf43-sdfd234-few234-ewr',
                            type: '',
                            attrs: {
                                componentName: {
                                    type: 1,
                                    value: 'Custom Component 1'
                                },
                                materialId: 'customComponent.customComp2-id'
                            }
                        },
                    }
                }

            },
        }
    },
    customComponents: {
        'customComp2-id': {
            id: 'customComp2-id',
            parentId: '',
            type: "",
            attrs: {
                source: {
                    type: 1,
                    value: `//import React from "https://esm.sh/react@18";
import * as React from 'react';
import  Botton from '@mui/material/Button';
//import clone from "https://esm.sh/lodash/clone"
function Component1() {
  return (
      <Botton >Merry Xmas 🎄 🎄</Botton>
  );
 } 
function myComponent() {
  //console.log(clone({test:'sadsda',we:undefined}))
  return ( <>
    <Botton>Merry Xmas 🎄</Botton>
    <Component1 />
    </>);
 } 
 export default myComponent;  `
                },
                componentName: {
                    type: 1,
                    value: 'customComp2-id'
                },
                materialId: 'customComponent.customComp2-id'
            }
        }
    }
}

export const useAppDom = () => {

    const custom = useContext(appConfigProvider)

    return custom.appDom
}

export const Provider: React.FC<PropsWithChildren<{}>> = (props) => {

    const globalData = useMemo(() => {



        const results: Record<string, types.IESDesiginComponent> = {}
        for (const key in components.default) {
            results[key] = components.default[key]
        }

        const appDom = new AppConfig({
            appConfig: tempConfig,
            materials: results,
        })

        return {
            // materials:results,
            appDom
        }
    }, [])

    return <appConfigProvider.Provider value={globalData}>{props.children}</appConfigProvider.Provider>
}


export const PageProvider = React.createContext<{
    page: PageConfig,

}>({
    page: undefined,
})


export const getPage = () => {
    const { page } = useContext(PageProvider)
    return page
}