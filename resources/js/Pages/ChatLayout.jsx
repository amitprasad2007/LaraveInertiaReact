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
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Messages
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
