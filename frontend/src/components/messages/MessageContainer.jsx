import Messages from "./Messages.jsx"
import MessageInput from "./MessageInput.jsx"
function MessageContainer (){

    return (
        <div className="md:min-w-[450px] flex flex-col">
           {/* Header */}
           <div className="bg-slate-500 px-4 py-2 mb-2">
            <span className="label-text">To:</span> <span className="text-gray-900 font-bold">Ishu</span>
           </div>
            <Messages />
           <MessageInput />
        </div>
    )
}


export default MessageContainer