

import * as React from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { SpeedDialIcon } from '@mui/material';
import { getPage, useAppDom } from '../Provider';
import { margin } from '@mui/system';
import { DomNodeBase, IComponentConfig, ICustomComponentConfig } from 'packages/esdesign-components/dist/types';



const drawerBleeding = 48;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

export default function SwipeableEdgeDrawer(props: Props) {
  const { window } = props;
  const [open, setOpen] = React.useState(false);


  const appDom = useAppDom()

  const page = getPage()

  const materials = React.useMemo(() => {
    const bulitInComps = Object.entries(appDom.materials).map(([key, value]) => ({ name: key, node: value.EsDesginComponent })).filter(m => (m.name != 'PageRow' && m.name != 'PageColumn'&& m.name != 'PageRoot'))
    const customComps = appDom.getCustomElements()

    return { bulitInComps, customComps }
  }, [appDom])

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  // This is used only for the example
  const container = window !== undefined ? () => window().document.body : undefined;


  const handleDragStart = (node: IComponentConfig | ICustomComponentConfig) => {

    // 通知Appdom 新建一个node，并且把它放到 dragnode里面

    page.draggingStart({ type: 'NEW', config: node })


  }

  return (
    <Root >
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: 'visible',
          },
        }}
      />
      <Box sx={{ position: 'fixed', bottom: 80, left: 280 }}>
        <Button color='primary' variant='outlined' onClick={toggleDrawer(true)} ><SpeedDialIcon /></Button>
      </Box>
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            // borderTopLeftRadius: 8,
            // borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
            borderTop: '1px solid grey'
          }}
          onDragLeave={toggleDrawer(false)}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary' }}>Components in here</Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
        >
          {/* <Skeleton variant="rectangular" height="100%" /> */}

          <Box display="flex" gridTemplateColumns="1fr 1fr 1fr" gap={1} padding={1}>
            {materials.bulitInComps.map(item => <ComponentCatalogItem key={item.name} name={item.name} onDragStart={() => handleDragStart(item.node)} />)}
          </Box>

          <span>Custom Components</span>
          <Box display="flex" gridTemplateColumns="1fr 1fr 1fr" gap={1} padding={1}>
            {materials.customComps.map(item => <ComponentCatalogItem  key={item.node.id} name={item.node.attrs.componentName.value} onDragStart={() => handleDragStart(item.node)} />)}
          </Box>


        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

const ComponentCatalogItem = (props: { name: string, onDragStart(): void }) => {

  return <>
    <div style={{
      height: 100,
      width: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid blue',
      boxSizing: 'border-box',
      borderRadius: '15px',
      margin: 2,
      fontSize: 10
    }}
      draggable
      onDragStart={props.onDragStart}
    >

      {props.name}
    </div>
  </>
}