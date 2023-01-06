
import { compileModule } from "packages/esdesign-core/dist";
import loadModule from "packages/esdesign-core/dist/loadModule";
import React, { useReducer, useRef } from "react";
import { useEffect, useState } from "react";
import { Box, Typography, styled } from "@mui/material"


const LoadingComp = ()=><>Loading...</>

const CodeRuntimeCanvas = (props: { code: string }) => {
    // const [BuildComp, setComponent] = useState<React.ComponentType>(LoadingComp)

    const [_, updateUI] = useReducer((x) => x + 1, 0)
    const virulDom = useRef<React.ComponentType>(LoadingComp)

    useEffect(() => {


        const test = async () => {

            const compiledModule = compileModule(props.code, 'sssss');
            const { default: Component } = await loadModule(compiledModule);
            virulDom.current = Component as React.ComponentType;
            updateUI()
        }

        test()

    }, [props.code])





    return <virulDom.current />
}

export default CodeRuntimeCanvas