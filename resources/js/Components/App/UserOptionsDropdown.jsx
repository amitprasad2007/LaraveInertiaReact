import {Menu, Transition} from "@headlessui/react";
import {Fragment} from "react";

export default function userOptionsDropdown(){

    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Item className="absolute right-0 mt-2 w-48 rounded-md bg-gray-800 shadow-lg z-50">

                    </Menu.Item>
                </Transition>
            </Menu>
        </div>
    )
}
