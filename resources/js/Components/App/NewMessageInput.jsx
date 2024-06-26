import React, {useEffect,useState,useRef} from "react";
export default function NewMessageInput({value,onChange,onSend}){
    const input =useRef();
    const onInputKeyDown = (ev)=>{
      if(ev.key === "Enter" && !ev.shiftKey ){
        ev.preventDefault();
        onSend();
      }
    };
    const onChangeEvent = (ev)=>{
        setTimeout(
            ()=>{
                adjustHeight()
            },10)
        onChange(ev);
    };

    const adjustHeight = ()=>{
        setTimeout( ()=>{
            input.current.style.height= "auto";
            input.current.style.height =input.current.scrollHeight + 1 +"px";
        },100)
    }
    return(
        <></>
        );
}
