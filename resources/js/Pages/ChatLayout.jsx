import {usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";
import {PencilSquareIcon} from "@heroicons/react/24/solid";
import TextInput from "@/Components/TextInput.jsx";
import ConversationItem from "@/Components/App/ConversationItem.jsx";
import {useEventBus} from "@/EventBus";

export default function ChatLayout({children}){

    const page =usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations,setLocalConversations] =useState([]);
    const [sortedConversations,setSortedConversations] =useState([]);
    const [onlineUsers,setOnlineUsers]=useState({});
    const {on}=useEventBus();
    const isUserOnline = (userId)=>onlineUsers[userId];

    const onSearch=(ev)=>{
        const search =ev.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversations)=>{
                return conversations.name.toLowerCase().includes(search);
            })
        );
    };

    const messageCreated= (message)=>{
        setLocalConversations((oldUsers)=>{
         return oldUsers.map((u)=> {
             if(message.receiver_id && !u.is_group &&
                 (u.id==message.sender_id || u.id==message.receiver_id )
             ){
                u.last_message = message.message;
                u.last_message_date = message.created_at;
                return u;
             }
             if(message.group_id && u.is_group && u.id == message.group_id){
                 u.last_message = message.message;
                 u.last_message_date = message.created_at;
                 return u;
             }
             return u;
         } )
      });
    };

    useEffect(()=>{
        console.log('werwerwerwerwer');
        const offCreated = on("message.created",messageCreated);
        return ()=>{
            offCreated();
        };
    },[on]);

    useEffect( ()=>{
        setSortedConversations(
            localConversations.sort( (a,b)=>{
                if(a.blocked_at && b.blocked_at){
                    return a.blocked_at > b.blocked_at ? 1 :-1;
                }else if (a.blocked_at){
                    return  1;
                }else if(b.blocked_at){
                    return -1;
                }
                if(a.last_message_date && b.last_message_date ){
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                }else if(b.last_message_date){
                    return 1;
                }else if(a.last_message_date){
                    return -1;
                }else {
                    return 0;
                }
            })
        );
    },[localConversations]);

    useEffect( ()=>{
        setLocalConversations(conversations);
    },[conversations]);

    useEffect(() => {
        Echo.join("online")
            .here( (users)=>{
                const onlineUserObj =Object.fromEntries(
                    users.map( (user)=>[user.id,user])
                );
                setOnlineUsers((pervOnlieUsers)=>{
                    //console.log(pervOnlieUsers);
                    return {...pervOnlieUsers,...onlineUserObj};
                });
            })
            .joining((user)=>{
               setOnlineUsers((pervOnlieUsers)=>{
                   const updatedUsers ={...pervOnlieUsers}
                   updatedUsers[user.id]=user;
                   return updatedUsers
               });
            })
            .leaving((user)=>{
                setOnlineUsers((pervOnlieUsers)=>{
                    const updatedUsers ={...pervOnlieUsers}
                   delete updatedUsers[user.id];
                    return updatedUsers
                });
            })
            .error((error)=>{
                console.log("erro",error);
            });
        return ()=>{
            Echo.leave("online");
        };
    }, []);

    return (
        <div>
            <div className="flex-1 w-full flex overflow-hidden">
                <div className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden ${selectedConversation ? "-ml-[100%] sm:ml-0":""}`}>
                    <div className="flex items-center justify-between py-2 px-3 text-xl font-medium text-gray-200 ">
                        My conversations
                        <div className="tooltip tooltip-left" data-tip="Create new Group" >
                            <button className="text-gray-400 hover:text-gray-200">
                                <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput onKeyUp={onSearch} placeholder="Filter users and groups" className="w-full" />
                    </div>
                    <div className="flex-1 overflow-auto">
                        { sortedConversations &&
                            sortedConversations.map((conversation)=>(
                                <ConversationItem
                                    key={`${
                                        conversation.is_group
                                            ? "group_"
                                            : "user_"
                                    } ${conversation.id}`}
                                    conversation={conversation} online={!!isUserOnline(conversation.id)}
                                    selectedConversation={selectedConversation}
                                     />
                            ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );

}
