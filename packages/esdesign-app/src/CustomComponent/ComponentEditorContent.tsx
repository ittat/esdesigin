import { Button, Stack, styled, Typography } from "@mui/material"
import Box from "@mui/material/Box"
import dynamic from "next/dynamic"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom"
import CodeRuntimeCanvas from "./CodeRuntimeCanvas"
import SplitPane from "../Layout/SplitPane"
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorAlert from "../components/ErrorAlert"
import { useRouter } from "next/router"
import { useAppDom } from "../Provider"
import { ExtraLib } from "../components/MonacoEditor"
import loadModule, { compileModule } from "packages/esdesign-core/dist/loadModule"
import { ArgConfig, ICustomComponentConfig, IESDesiginComponent } from "packages/esdesign-components/dist/types"
import { useParams } from "react-router-dom"
import { createCustomComponentName } from "packages/esdesign-components/dist"
import build from "next/dist/build"
import PropsPreviewPanel from "./PropsPreviewPanel"
import { monaco } from "react-monaco-editor"

const TypescriptEditor = dynamic(() => import("../components/TypescriptEditor"), {
    ssr: false
})



const CanvasIframe = styled('iframe')({
    height: '100%',
    width: '100%',
    border: 'none'
})



function RuntimeError({ error: runtimeError }: FallbackProps) {
    return <ErrorAlert error={runtimeError} />;
}

const templator = `
import * as React from 'react';
//import React from "https://esm.sh/react@18"
function myComponent() {
  return (
    <div style={{fontSize:'30px'}} >lalalalalla</div>
  );
}

export default myComponent;    
`

const extraLibs: ExtraLib[] = [
    {
        content: `	declare class Facts {
              /**
              * Returns the next fact
              *   
             */
           static next1():string
        }`,
    },
    {
        content: `declare module "https://*";`,
    },
]

const ButtonBan = (props: { onPreview?(): void, onSave?(): void }) => {

    return <Stack sx={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        height: '48px',
        width: '100%',
        backgroundColor: '#f5f5f5',
        gap: 3,
        px: 3,
        py: 1,
        boxSizing: 'border-box'
    }} direction={'row'} justifyContent='flex-end' >
        <Button variant='contained' onClick={props.onPreview}>Preview</Button>
        <Button variant='outlined' onClick={props.onSave}>Update</Button>
    </Stack>
}



const ComponentEditorContent = () => {

    const iframeRef = useRef<any>(null)
    const editorRef = useRef<any>(null)
    const [iframeLoaded, onLoad] = React.useReducer(() => true, false);



    const [value, setValue] = useState(templator)

    const [previewData, setPreviewData] = useState<{
        dom: IESDesiginComponent,
        config: ICustomComponentConfig<ArgConfig>
    }>()

    // const router = useRouter()

    const appDom = useAppDom()

    const params = useParams()

    useEffect(() => {

        const build = async () => {
            const compiledModule = compileModule(value, 'sssss');
            const { default: Component } = await loadModule(compiledModule);

            // TODO: 问题，为什么不把customCompoent 转换成 Component？
            if (params?.nodeId && (Component as IESDesiginComponent)?.EsDesginComponent) {
                const previewDom = Component as IESDesiginComponent

                const previewConfig = (Component as IESDesiginComponent).EsDesginComponent as ICustomComponentConfig<ArgConfig>

                setPreviewData({
                    dom: previewDom,
                    config: previewConfig
                })



            }
        }

        build()
    }, [value])


    const onSaveToAppDomHandler = useCallback(() => {

        if (!previewData) { return }
        // 将 config更新到 appdom的 customComponents 里面
        const { config } = previewData

        const customComponentId = params.nodeId
        const customConfig = config
        customConfig.attrs['source'] = {
            type: 1,
            value: value
        }
        customConfig.id = customComponentId
        customConfig.attrs.materialId = createCustomComponentName(customComponentId)


        appDom.addOrUpdateCustomElement(customConfig)
    }, [value, previewData, appDom])

    const onPreviewHandler = useCallback(() => {

        const editor: monaco.editor.IStandaloneCodeEditor | undefined = editorRef.current?.editor
        if (editor) {
            const newValue = editor.getValue()
            setValue(newValue)
        }

    }, [editorRef.current])



    useEffect(() => {
        if (params.nodeId) {
            const nodeId = params.nodeId
            const elements = appDom.getCustomElements()
            const element = elements.find(e => e.node.id == nodeId)

            if (element) {
                setValue(element.code)
            }
        }
    }, [params])


    React.useEffect(() => {
        const document = iframeRef.current?.contentDocument;
        // When we hydrate the iframe then the load event is already dispatched
        // once the iframe markup is parsed (maybe later but the important part is
        // that it happens before React can attach event listeners).
        // We need to check the readyState of the document once the iframe is mounted
        // and "replay" the missed load event.
        // See https://github.com/facebook/react/pull/13862 for ongoing effort in React
        // (though not with iframes in mind).
        if (document?.readyState === 'complete' && !iframeLoaded) {
            onLoad();
        }
    }, [iframeLoaded]);

    return <Box sx={{ height: '100%', width: '100%' }}>
        <SplitPane split="vertical" allowResize size="50%">
            <TypescriptEditor
                refT={editorRef}
                value={value}
                onChange={() => { }}
                onSave={(newValue) => {
                    setValue(newValue)
                }}

                extraLibs={extraLibs}
            />


            <SplitPane split="horizontal" allowResize size="20%" primary="second">
                <Box border={'5px solid #e7e7e7'} height={'100%'} boxSizing={'border-box'}>
                    <Typography bgcolor={"#e7e7e7"} textAlign='center'>UI Preview</Typography>
                    <CanvasIframe
                        ref={iframeRef}
                        onLoad={onLoad}
                    />
                </Box>
                <React.Suspense fallback={null}>
                    <ErrorBoundary resetKeys={[PropsPreviewPanel]} fallbackRender={RuntimeError}>
                        <PropsPreviewPanel config={previewData?.config} />
                    </ErrorBoundary>
                </React.Suspense>
            </SplitPane>

        </SplitPane>

        {iframeRef && iframeRef.current && iframeRef.current?.contentDocument && iframeLoaded
            ?
            ReactDOM.createPortal((
                <React.Suspense fallback={null}>
                    <ErrorBoundary resetKeys={[CodeRuntimeCanvas]} fallbackRender={RuntimeError}>
                        <CodeRuntimeCanvas dom={previewData?.dom} code={value} />
                    </ErrorBoundary>
                </React.Suspense>

            ), iframeRef.current?.contentDocument.body)
            : null
        }


        <ButtonBan onPreview={onPreviewHandler} onSave={onSaveToAppDomHandler} />

    </Box>
}

export default ComponentEditorContent

