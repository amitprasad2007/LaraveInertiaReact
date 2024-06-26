import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import { Head, Link } from "@inertiajs/react";
import ChatLayout from "@/Pages/ChatLayout.jsx";
import {useEffect, useRef, useState,useLayoutEffect } from "react";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/solid";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageItem from "@/Components/App/MessageItem.jsx";
import MessageInput from "@/Components/App/MessageInput.jsx";
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

    const scrollToBottom = () => {
        if (messagesCtrRef.current) {
            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        // Using a timeout to ensure the DOM updates are completed
        const timer = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timer);
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
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-3 gap-2">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-amber-500 text-2xl font-semibold">
                                Pending Tasks
                            </h3>
                            <p className="text-xl mt-4">
                                <span className="mr-2">{myPendingTasks}</span>/
                                <span className="ml-2">{totalPendingTasks}</span>
                            </p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-blue-500 text-2xl font-semibold">
                                In Progress Tasks
                            </h3>
                            <p className="text-xl mt-4">
                                <span className="mr-2">{myProgressTasks}</span>/
                                <span className="ml-2">{totalProgressTasks}</span>
                            </p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-green-500 text-2xl font-semibold">
                                Completed Tasks
                            </h3>
                            <p className="text-xl mt-4">
                                <span className="mr-2">{myCompletedTasks}</span>/
                                <span className="ml-2">{totalCompletedTasks}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-4">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-gray-200 text-xl font-semibold">
                                My Active Tasks
                            </h3>

                            <table className="mt-3 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                <tr>
                                    <th className="px-3 py-3">ID</th>
                                    <th className="px-3 py-3">Project Name</th>
                                    <th className="px-3 py-3">Name</th>
                                    <th className="px-3 py-3">Status</th>
                                    <th className="px-3 py-3">Due Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {activeTasks.data.map((task) => (
                                    <tr key={task.id}>
                                        <td className="px-3 py-2">{task.id}</td>
                                        <td className="px-3 py-2 text-white hover:underline">
                                            <Link href={route("project.show", task.project.id)}>
                                                {task.project.name}
                                            </Link>
                                        </td>
                                        <td className="px-3 py-2 text-white hover:underline">
                                            <Link href={route("task.show", task.id)}>
                                                {task.name}
                                            </Link>
                                        </td>
                                        <td className="px-3 py-2">
                        <span
                            className={
                                "px-2 py-1 rounded text-nowrap text-white " +
                                TASK_STATUS_CLASS_MAP[task.status]
                            }
                        >
                          {TASK_STATUS_TEXT_MAP[task.status]}
                        </span>
                                        </td>
                                        <td className="px-3 py-2 text-nowrap">{task.due_date}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
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
