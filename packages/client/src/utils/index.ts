import { v4 } from "uuid";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export const __CANVAS_CONTROL_DETECT_OVERLAY__ = 'control_detect_overlay'

export function getUUID(){
    return   v4()
}


 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}