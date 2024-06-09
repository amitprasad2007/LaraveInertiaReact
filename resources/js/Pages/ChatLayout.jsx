import {usePage} from "@inertiajs/react";
import {useEffect} from "react";

export default function ChatLayout({children}){
    const page =usePage();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    useEffect(() => {
        Echo.join("online")
            .here( (users)=>{
                console.log("here",users);
            })
            .joining((user)=>{
                console.log("joining",user);
            })
            .leaving((user)=>{
                console.log("leaving",user);
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
