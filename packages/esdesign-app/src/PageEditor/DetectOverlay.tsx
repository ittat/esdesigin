import styled from "@emotion/styled"
import { Box, Button, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react"
import { CSSProperties, DragEvent, useCallback, useEffect, useReducer, useRef, useState } from "react"
import { getPage, useAppDom } from "../Provider"
import { ComponentConfig } from "../states/dom"
import { Rectangle } from "../types"
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { pink } from "@mui/material/colors"



const OverlayRoot = styled('div')({
    height: '100%',
    width: '100%',
    position: 'relative',
    backgroundColor: 'blue'
})







export const RECTANGLE_EDGE_TOP = 'top';
export const RECTANGLE_EDGE_BOTTOM = 'bottom';
export const RECTANGLE_EDGE_LEFT = 'left';
export const RECTANGLE_EDGE_RIGHT = 'right';
export const RECTANGLE_SLOT_CENTER = 'center';
export type RectangleEdge =
    | typeof RECTANGLE_EDGE_TOP
    | typeof RECTANGLE_EDGE_BOTTOM
    | typeof RECTANGLE_EDGE_LEFT
    | typeof RECTANGLE_EDGE_RIGHT;


const highlight_style: Record<RectangleEdge, CSSProperties> = {
    [RECTANGLE_EDGE_TOP]: {
        borderTop: "3px solid green"
    },
    [RECTANGLE_EDGE_BOTTOM]: {
        borderBottom: "3px solid green"
    },
    [RECTANGLE_EDGE_LEFT]: {
        borderLeft: "3px solid green"
    },
    [RECTANGLE_EDGE_RIGHT]: {
        borderRight: "3px solid green"
    }
}


const calcNodeInsertPosition = (
    overRect: Rectangle,
    relatX: number,
    relatY: number
): RectangleEdge | null => {

    const { height: rectHeight, width: rectWidth } = overRect;

    // 如果不在边界内
    if (relatX < 0 || relatX > rectWidth || relatY < 0 || relatY > rectHeight) {
        return null;
    }

    // 判断是否落在斜右上三角形区域内
    const isOverFirstDiagonal = relatY < (rectHeight / rectWidth) * relatX;
    // 判断是否落在斜左上三角形区域内
    const isOverSecondDiagonal = relatY < -1 * (rectHeight / rectWidth) * relatX + rectHeight;

    // 如果落在重合区域内，判断为上边插入
    if (isOverFirstDiagonal && isOverSecondDiagonal) {
        return RECTANGLE_EDGE_TOP;
    }
    // 右插入
    if (isOverFirstDiagonal) {
        return RECTANGLE_EDGE_RIGHT;
    }
    // 左插入
    if (isOverSecondDiagonal) {
        return RECTANGLE_EDGE_LEFT;
    }
    // 其他区域。底部插入
    return RECTANGLE_EDGE_BOTTOM;
}

const OverlayDom = observer((props: { node: ComponentConfig, parentRect?: Rectangle, zIndex?: number }) => {
    const { node, parentRect, zIndex = 0 } = props
    const pageApi = getPage()
    const [insertBound, setInsertBound] = useState<RectangleEdge>()

    const [isOverSlot, setIsOverSlot] = useState(false)

    const nodeName = node.attrs.componentName.value || 'component'

    const rect = node.rect || pageApi.tryFindMyRectById(node.id)

    const onDomDeleteHandler = useCallback(() => {
        node.removeMyself()
    }, [node])



    if (!rect) {
        console.warn("can not get the rect info of ", node.id);
        return <>^^^^^^6666666*******</>
    }

    const isSelected = pageApi.selectedNode?.id == node.id
    const child = node.child

    const onDragOverHandler = (event: DragEvent<HTMLDivElement>) => {
        pageApi.setDrogOverNode(node)
        // 如果没有node没有计算出位置信息rect，返回
        if (!node.rect) { return }
        // 如果 dragNode == overNode ，返回
        if (!pageApi.draggingNode || pageApi.draggingNode.id == node.id) { return }


        // 实时计算dragNode 在当前overNode的插入位置
        const relatX = event.clientX - node.rect.x
        const relatY = event.clientY - node.rect.y

        const canInsertInSide = calcNodeInsertPosition(node.rect, relatX, relatY)

        // console.log("canInsertInSide", highlight_style[insertBound]);
        setInsertBound(canInsertInSide)


    }

    const onDropHandler = (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();

        // 如果insertBound存在数据
        if (insertBound && pageApi.draggingNode) {

            pageApi.placeDraggingNode(insertBound)
        }

        // 清除insertBound数据，清除pageapi的dropover dropnode 数据
        setInsertBound(undefined);
        pageApi.clearSelectNode();
        pageApi.clearDrogOverNode();
    }





    return <>

        <div
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                pageApi.setSelectedNode(node.id);
            }}
            style={Object.assign({
                position: 'absolute',
                top: rect.y - (parentRect?.y || 0),
                left: rect.x - (parentRect?.x || 0),
                height: rect.height,
                width: rect.width,
                border: (isSelected || insertBound) ? '1px solid red' : '1px dashed #cbcbcbab',
                display: 'flex',
                zIndex
            }, insertBound ? highlight_style[insertBound] : {})}
            onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDragOverHandler(e)
            }}
            onDragLeave={() => setInsertBound(undefined)}
            onDrop={(e) => {
                onDropHandler(e)
            }}
        >
            {isSelected ?
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        bottom: '100%',
                        backgroundColor: 'orangered',
                        zIndex: zIndex + 1,
                        display: 'flex',
                        flexDirection: 'row',
                        height: 20,
                        padding: 3,
                        paddingLeft: 8
                    }}
                >

                    <Typography
                        variant='caption'
                        noWrap
                        sx={{ cursor: 'grab' }}
                        draggable
                        onDragStart={() => {
                            pageApi.draggingStart({ type: 'EXIST', nodeId: node.id })
                        }}
                    >
                        {nodeName}
                    </Typography>
                    <MoreVertIcon sx={{ color: pink[500] }} />
                    <DeleteIcon color="action" onClick={onDomDeleteHandler} />
                </div>
                : null}

            {/* solt area */}
            {
                node.type == 'slot' && (node.id in pageApi.slotTipsRect) ?
                    <div
                        style={{
                            display: 'flex',
                            clear: 'both',
                            boxSizing: 'border-box',
                            position: 'absolute',
                            backgroundColor: isOverSlot ? '#00ff1f12' : 'unset',
                            top: pageApi.slotTipsRect[node.id].y - (node.rect.y || 0),
                            left: pageApi.slotTipsRect[node.id].x - (node.rect.x || 0),
                            height: pageApi.slotTipsRect[node.id].height,
                            width: pageApi.slotTipsRect[node.id].width,
                        }}
                        onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsOverSlot(true)
                            setInsertBound(undefined);
                        }}
                        onDragLeave={() => {
                            setIsOverSlot(false)
                        }}
                        onDrop={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            pageApi.placeDraggingNode(RECTANGLE_SLOT_CENTER)
                            // 清除insertBound数据，清除pageapi的dropover dropnode 数据
                            setInsertBound(undefined);
                            pageApi.clearSelectNode();
                            pageApi.clearDrogOverNode();
                        }}
                    /> : null
            }


        </div>
        {Object.values(child).map(n => <OverlayDom node={n} zIndex={zIndex + 1} />)}

    </>


})


const DetectOverlay = () => {

    const appDom = useAppDom()
    const pageApi = getPage()


    const [_, updateUI] = useReducer((x) => x + 1, 0)


    useEffect(() => {

        const farseUpdate = () => {
            updateUI()


        }


        farseUpdate()

        if (appDom) {
            appDom.event.addListener('appdom.update', farseUpdate)
        }

        return () => {
            appDom?.event.removeListener('appdom.update', farseUpdate)
        }


    }, [appDom])


    const handleNodeDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        // TODO: 这里计算元素的插入位置并提示


        console.log("handleNodeDragOver");

        // pageApi.draggingNode.parentId = pageApi.id
        pageApi.setDrogOverNode(pageApi)
    }


    const deSelectedNode = () => {
        // appDom.clearSelectNode()

        pageApi.clearSelectNode()

    }

    // 放入元素
    const handleNodeDrop = (event: DragEvent<HTMLDivElement>) => {
        // TODO: 插入位置
        pageApi.placeDraggingNode('bottom')
    }


    return <OverlayRoot
        style={{
            height: '100%',
            width: '100%',
            position: 'relative',
        }}
        onDragOver={handleNodeDragOver}
        onDrop={handleNodeDrop}
        onClick={deSelectedNode}
    >
        {pageApi.sort && Object.values(pageApi.domTree).map((n) => <OverlayDom key={n.id} node={n} />)}
    </OverlayRoot>
}

export default observer(DetectOverlay)