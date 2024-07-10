import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import ChatLayout from "@/Pages/ChatLayout.jsx";
import {useEffect, useRef, useState,  useCallback} from "react";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageItem from "@/Components/App/MessageItem.jsx";
import MessageInput from "@/Components/App/MessageInput.jsx";
import {useEventBus} from "@/EventBus";
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
    const [noMoreMessages,setNoMoreMessages] = useState(false);
    const [scrollFromBottom,setScrollFromBottom] = useState(0);
    const loadMoreIntersect =useRef(null);
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

    const loadMoreMessages = useCallback( ()=>{
        if(noMoreMessages){
            return ;
        }
        const firstMessage = localMessages[0];
        axios.get(route("message.loadOlder",firstMessage.id))
            .then(({data})=>{
                if(data.data.length==0){
                    setNoMoreMessages(true);
                    return ;
                }
                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop =messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;
                console.log('tmpScrollFromBottom',tmpScrollFromBottom);
                setScrollFromBottom(scrollHeight - scrollTop - clientHeight);
                setLocalMessages((prevMessage)=>{
                     return[...data.data.reverse(), ...prevMessage];
                })
            });
    },[localMessages,noMoreMessages]);
    useEffect(() => {
        setTimeout( ()=>{
            if(messagesCtrRef.current){
                messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
            }
        },10 );
        const offCreated = on('message.created',messageCreated);
        setScrollFromBottom(0)
        setNoMoreMessages(false)
        return ()=>{
            offCreated();
        };
    }, [ selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() :[]);
    }, [messages]);

    useEffect(() => {
        if(messagesCtrRef.current && scrollFromBottom != null){
            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight - messagesCtrRef.current.offsetHeight -scrollFromBottom;
        }
        if(noMoreMessages){
            return ;
        }
        const observer = new IntersectionObserver(
            (entries)=>
                entries.forEach(
                    (entry)=>entry.isIntersecting && loadMoreMessages()
                ),
            {
            rootMargin: "0px 0px 250px 0px",
            }
        );
        if(loadMoreIntersect.current){
            setTimeout(()=>{
                observer.observe(loadMoreIntersect.current)
            },100);
        }
        return ()=>{
            observer.disconnect();
        };
    }, [localMessages]);
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
                                <div ref={loadMoreIntersect}></div>
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
            <Taskmanage
                totalPendingTasks={totalPendingTasks}
                myPendingTasks={myPendingTasks}
                totalProgressTasks={totalProgressTasks}
                myProgressTasks ={myProgressTasks}
                totalCompletedTasks={totalCompletedTasks}
                myCompletedTasks={myCompletedTasks}
                activeTasks={activeTasks} />
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
