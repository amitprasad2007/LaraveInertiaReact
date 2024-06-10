import {usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";

export default function ChatLayout({children}){
    const page =usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversation,setLocalConversation] =useState([]);
    const [sortedConversation,setSortedConversation] =useState([]);
    const [onlineUsers,setOnlineUsers]=useState({});
    const isUserOnline = (userId)=>onlineUsers[userId];

    useEffect( ()=>{
        setSortedConversation(
            localConversation.sort( (a,b)=>{
                if(a.blocked_at && b.blocked_at){
                    return a.blocked_at > b.blocked_at ? 1 :-1;
                }else if (a.blocked_at){
                    return  1;
                }else if(b.blocked_at){
                    return -1;
                }
                if(a.last_message_date && a.last_message_date ){
                    return b.last_message_date.localeCompare(
                        a.last_message_date
                    );
                }else if(a.last_message_date){
                    return -1;
                }else if(b.last_message_date){
                    return 1;
                }else {
                    return 0;
                }
            })
        );
    },[setLocalConversation]);

    useEffect( ()=>{
        setLocalConversation(conversations);
    },[conversations]);

    useEffect(() => {
        Echo.join("online")
            .here( (users)=>{
                const onlineUserObj =Object.fromEntries(
                    users.map( (user)=>[user.id,user])
                );
                setOnlineUsers((pervOnlieUsers)=>{
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
            {children}
        </div>
    );

}
