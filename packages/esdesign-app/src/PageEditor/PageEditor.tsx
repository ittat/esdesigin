import { styled } from "@mui/material";
import dynamic from "next/dynamic";
import CanvasHost from "./CanvasHost";

// const  CanvasHost = dynamic(async ()=> await import('./CanvasHost'),{
//     ssr:false
// })


const PageEditor = ()=>{

    return <CanvasHost/>
}

export default PageEditor