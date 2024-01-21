import { Box, Typography, styled } from "@mui/material"
import { createBuiltInComponent } from "@ittat/esdesign-components"
import { IESDesiginComponent } from "@ittat/esdesign-components"
import { useReducer, useRef } from "react"
import { useEffect } from "react"
import { getAppApi, useMaterial } from "@/Provider"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { ComponentConfig } from "@/states/componentConfig"

// NOTE： 不知道为什么 mobx 在这里面监听响应的没有效果！！！

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


const LoadingComponent = createBuiltInComponent('Loading', () => <Box>Loading...</Box>, '', {})



const Cell = (props: IProps) => {

    const { node } = props

    const {appApi} = getAppApi()
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

        function checkProps(event, data: { id: string, name: string, oldValue: any, value: any }) {

            if (data.id == node.id) {
                updateUI()
            }
        }

        // 移除没有发现影响 - 23-1-8
        // setTimeout(() => appApi.event.dispatch('appdom.update', {}))

        appApi?.event.addListener('component.props.update', checkProps)

        return () => {
            appApi?.event.removeListener('component.props.update', checkProps)
        }
    }, [appApi])



    const cleanProps = node.getProps()


    return <Box className={`node-element`} data-node={node} data-nodeid={node.id} >

        {
            node.type == 'slot'
                ? <virulDom.current {...cleanProps} >
                    {node ?
                        node.childSort.length ?
                            node.childSort.map(nodeId => <Cell key={nodeId} node={node.child[nodeId]} />) :
                            <BlanksSoltTips nodeid={node.id} /> :
                        <LoadingComponent />
                    }
                </virulDom.current>
                : <virulDom.current {...cleanProps} />
        }
    </Box>

}

export default Cell
