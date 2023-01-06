
import { compileModule } from "packages/esdesign-core/dist";
import loadModule from "packages/esdesign-core/dist/loadModule";
import React, { useReducer, useRef } from "react";
import { useEffect, useState } from "react";
import { Box, Typography, styled } from "@mui/material"
import { ArgConfig, ICustomComponentConfig, IESDesiginComponent } from "packages/esdesign-components/dist/types";
import { useAppDom } from "../Provider";
import { useParams } from "react-router-dom";
import { createCustomComponentName } from "packages/esdesign-components/dist";


const LoadingComp = () => <>Loading...</>

const CodeRuntimeCanvas = (props: { dom?: IESDesiginComponent, code: string }) => {
    // const [BuildComp, setComponent] = useState<React.ComponentType>(LoadingComp)

    // const [_, updateUI] = useReducer((x) => x + 1, 0)
    // const virulDom = useRef<React.ComponentType | IESDesiginComponent>(LoadingComp)

    // const appdom = useAppDom()
    // const params  =   useParams()

    // useEffect(() => {

    //     const test = async () => {

    //         const compiledModule = compileModule(props.code, 'sssss');
    //         const { default: Component } = await loadModule(compiledModule);


    //         virulDom.current = Component as IESDesiginComponent;

    //         // TODO: 问题，为什么不把customCompoent 转换成 Component？
    //         if(params?.nodeId && (Component as IESDesiginComponent)?.EsDesginComponent){
    //             const config = (Component as IESDesiginComponent).EsDesginComponent
    //             console.log("ComponentComponentComponent,",config);



    //             // 将 config更新到 appdom的 customComponents 里面
    //             const customComponentId = params.nodeId
    //             const customConfig = config as ICustomComponentConfig<ArgConfig>
    //             customConfig.attrs['source'] = {
    //                 type: 1,
    //                 value: props.code
    //             }
    //             customConfig.id = customComponentId
    //             customConfig.attrs.materialId = createCustomComponentName(customComponentId)


    //             appdom.addOrUpdateCustomElement(customConfig)
    //         }
    //         updateUI()
    //     }

    //     test()

    // }, [props.code])





    return props.dom ? <props.dom /> : <LoadingComp />
}

export default CodeRuntimeCanvas
