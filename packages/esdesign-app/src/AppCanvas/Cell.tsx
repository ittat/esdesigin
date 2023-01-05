import { Box, Typography, styled } from "@mui/material"
import { ESDESIGN_COMPONENT, components, createEsDesginComponent } from "packages/esdesign-components/dist"
import { IComponentConfig, IESDesiginComponent } from "packages/esdesign-components/dist/types"
import React, { useReducer, useRef } from "react"
import { useEffect, useMemo, useState } from "react"
import { useAppDom, useMaterial } from "../Provider"
import { ComponentConfig } from "../states/dom"
import { RecordStr } from "../types"
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface IProps {
    node: ComponentConfig
}

const TipsBorder = styled(Box)({
    boxSizing: 'border-box',
    color: 'green',
    padding: 2,
    border: "3px dashed",
    borderRadius: 5,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 65,
    backgroundColor: 'white'
})

const BlanksSoltTips = (props: { nodeid: string }) => {
    return <TipsBorder className="blanks-solt-tips-area" data-soltid={props.nodeid}>
        <AddCircleIcon />
        <Typography>Drop Component in here</Typography>
    </TipsBorder>
}


const LoadingComponent = createEsDesginComponent(() => <Box>Loading...</Box>, '', {})



const Cell = (props: IProps) => {

    const { node } = props

    const appApi = useAppDom()
    const materials = useMaterial()


    // 不可以使用state来保存Component！！！！
    // const [Dom, setDom] = useState<IESDesiginComponent>(TempComponent)

    const [_, updateUI] = useReducer((x) => x + 1, 0)
    const virulDom = useRef<IESDesiginComponent>(LoadingComponent)


    async function getDom() {
        const dom = await ComponentConfig.initMaterial(node, appApi, materials)

        virulDom.current = dom
        updateUI()
    }

    useEffect(() => {
        getDom()

        function checkProps(event,data:{ id: string, name:string, oldValue:any, value:any}){

            if(data.id == node.id){
                updateUI()
            }
        }

        setTimeout(() => appApi.event.dispatch('appdom.update', {}))

        appApi.event.addListener('component.props.update',checkProps)

        return ()=>{
            appApi.event.removeListener('component.props.update',checkProps)
        }
    }, [])




    return <Box className={`node-element`} data-node={node} data-nodeid={node.id} >

        {
            node.type == 'slot'
                ? <virulDom.current {...node.getProps()} >
                    {node ?
                        node.childSort.length ?
                            node.childSort.map(nodeId => <Cell key={nodeId} node={node.child[nodeId]} />) :
                            <BlanksSoltTips nodeid={node.id} /> :
                        <LoadingComponent />
                    }
                </virulDom.current>
                : <virulDom.current />
        }
    </Box>

}

export default Cell

