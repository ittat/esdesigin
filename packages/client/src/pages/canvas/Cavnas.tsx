

import { observer } from 'mobx-react';
import { components } from '@ittat/esdesign-components';
import { useEffect, useReducer } from 'react'

import { getAppApi, getPageApi } from '@/Provider';

import Cell from './Cell';


const PageRoot = components.default['PageRoot']


const Cavnas = (props: { pageId: string }) => {
    // const [nodes, setNodes] = useState<DomNode[]>([])

    const [_, updateUI] = useReducer((x) => x + 1, 0)
    const {appApi} = getAppApi()

    const page = getPageApi()


    useEffect(() => {

        const farseUpdate = () => {
            updateUI()

        }


        farseUpdate()

        if (appApi) {
            appApi.event.addListener('appdom.update', farseUpdate)
        }

        return () => {
            appApi?.event.removeListener('appdom.update', farseUpdate)
        }


    }, [appApi])









    return <PageRoot>
        {
            // Object.values(page?.domTree || {}).map(node => <Cell node={node} />)
            page ? page.sort.map(nodeId => <Cell key={nodeId} node={page.domTree[nodeId]} />) : null
        }
    </PageRoot>



    {/* </Box> */ }
}



export default observer(Cavnas)
