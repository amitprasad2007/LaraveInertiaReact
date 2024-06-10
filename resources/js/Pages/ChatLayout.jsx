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
