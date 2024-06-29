import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import { Head, Link } from "@inertiajs/react";
import ChatLayout from "@/Pages/ChatLayout.jsx";
import {useEffect, useRef, useState,useLayoutEffect } from "react";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageItem from "@/Components/App/MessageItem.jsx";
import MessageInput from "@/Components/App/MessageInput.jsx";
import {useEventBus} from "@/EventBus.jsx";
import Taskmanage from "@/Components/App/Taskmanage.jsx";
function Dashboard({
                                      totalPendingTasks,
                                      myPendingTasks,
                                      totalProgressTasks,
                                      myProgressTasks,
                                      totalCompletedTasks,
                                      myCompletedTasks,
                                      activeTasks,
                                      messages=null,
                                      selectedConversation=null,
                                  }) {
    const[localMessages,setLocalMessages]=useState([]);
    const messagesCtrRef =useRef(null);
    const {on}=useEventBus();
    const messageCreated = (message)=>{
        if(
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ){
            setLocalMessages((prevMessage)=> [...prevMessage,message]);
        }
        if(
            selectedConversation &&
            selectedConversation.is_user &&
            (selectedConversation.id == message.sender_id ||
                selectedConversation.id == message.receiver_id)
        ){
            setLocalMessages((prevMessage)=> [...prevMessage,message]);
        }
    };
    useEffect(() => {
        setTimeout( ()=>{
            if(messagesCtrRef.current){
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
            }
        },10 );
        const offCreated = on('message.created',messageCreated);
        return ()=>{
            offCreated();
        };
    }, [ selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() :[]);
    }, [messages]);

    return (

        <>
            <Head title="Dashboard" />
            {
                !messages &&(
                    <div className="flex flex-col gap-6 justify-center items-center text-center h-full opacity-35">
                        <div className="text-2xl md:text-4xl p-16 text-slate-200" >
                            Please select Conversation to see messages
                        </div>
                        <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block"/>
                    </div>
                )
            }
            {messages &&(
                <>
                    <ConversationHeader selectedConversation={selectedConversation}/>
                    <div
                        ref={messagesCtrRef}
                        className="flex-1 overflow-auto p-5"
                    >
                        {localMessages.length===0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200" >
                                    No Messages Found
                                </div>
                            </div>
                        )}
                        {localMessages.length>0 && (
                            <div className="flex-1 flex flex-col">
                                {localMessages.map((message)=>(
                                  <MessageItem
                                      key={message.id}
                                      message={message}
                                  />
                                ))
                                }
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation}/>
                </>
            )}
            {/*<Taskmanage */}
            {/*    totalPendingTasks={totalPendingTasks} */}
            {/*    myPendingTasks={myPendingTasks} */}
            {/*    totalProgressTasks={totalProgressTasks} */}
            {/*    myProgressTasks ={myProgressTasks} */}
            {/*    totalCompletedTasks={totalCompletedTasks} */}
            {/*    myCompletedTasks={myCompletedTasks} */}
            {/*    activeTasks={activeTasks} />*/}
        </>
    );
}


Dashboard.layout=(page)=>{
    return(
        <AuthenticatedLayout user={page.props.auth.user}>
            <ChatLayout children={page} />
        </AuthenticatedLayout>


    )
}
export default Dashboard
