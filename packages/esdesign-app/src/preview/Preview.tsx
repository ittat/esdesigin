import { observer } from "mobx-react"
import { createCustomComponentName } from "packages/esdesign-components/dist"
import { IAppConfig } from "packages/esdesign-components/dist/types"
import { useMemo } from "react"
import CanvasHost from "../PageEditor/CanvasHost"
import { PageProvider as pageProvider, Provider, useAppDom } from "../Provider"




const PageProvider = observer((props) => {

    const app = useAppDom()
    const page = useMemo(() => {


        const pageId = 'd23d2d-4g45-2d21d-h44'
        if (pageId) {
            return app.pages[pageId]

        } else {
            undefined
        }
    }, [app.pages])
    

    return < pageProvider.Provider value={{ page: page }} > {props.children}</pageProvider.Provider >

})

const Preview = () => {

    return <>
        <Provider>
            <PageProvider>
                <div style={{ width: '100vw', position: 'relative', height: '100vh' }}>
                    <CanvasHost previewMode={true} />
                </div>
            </PageProvider>
        </Provider>
    </>

}

export default Preview