import { styled } from "@mui/material"
import Box from "@mui/material/Box"
import dynamic from "next/dynamic"
import React, { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import CodeRuntimeCanvas from "./CodeRuntimeCanvas"
import SplitPane from "../Layout/SplitPane"
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import ErrorAlert from "../components/ErrorAlert"
import { useRouter } from "next/router"
import { useAppDom } from "../Provider"
import { ExtraLib } from "../components/MonacoEditor"

const TypescriptEditor = dynamic(() => import("../components/TypescriptEditor"), {
    ssr: false
})



const CanvasIframe = styled('iframe')({
    height: '100%',
    width: '100%'
})


function RuntimeError({ error: runtimeError }: FallbackProps) {
    return <ErrorAlert error={runtimeError} />;
}

const templator = `
//import * as React from 'react';
import React from "https://esm.sh/react@18"
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

const ComponentEditorContent = () => {

    const iframeRef = useRef<any>(null)
    const [iframeLoaded, onLoad] = React.useReducer(() => true, false);

    const [value, setValue] = useState(templator)

    const router = useRouter()

    const appDom = useAppDom()



    useEffect(() => {
        const nodeId = router.query.index[3]
        if (nodeId) {
            const elements = appDom.getCustomElements()
            const element = elements.find(e => e.node.id == nodeId)

            if (element) {
                setValue(element.code)
            }
        }
    }, [router.query])


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
                value={value}
                onChange={()=>{}}
                onSave={(newValue) => {
                    setValue(newValue)
                }}

                extraLibs={extraLibs}
            />






            <SplitPane split="horizontal" allowResize size="20%" primary="second">
                <CanvasIframe
                    ref={iframeRef}
                    onLoad={onLoad}
                />
                <div>2</div>
            </SplitPane>

        </SplitPane>

        {iframeRef && iframeRef.current && iframeRef.current?.contentDocument && iframeLoaded
            ?
            ReactDOM.createPortal((
                <React.Suspense fallback={null}>
                    <ErrorBoundary resetKeys={[CodeRuntimeCanvas]} fallbackRender={RuntimeError}>
                        <CodeRuntimeCanvas code={value} />
                    </ErrorBoundary>
                </React.Suspense>

            ), iframeRef.current?.contentDocument.body)
            : null
        }

    </Box>
}

export default ComponentEditorContent