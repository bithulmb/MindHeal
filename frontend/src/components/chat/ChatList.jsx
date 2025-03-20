import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"


export default function ChatList({ chats, selectedChatId, onSelectChat, isPsychologist }) {

  return (
    <div className="overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={cn(
            "flex cursor-pointer items-center gap-3 p-3 transition-colors hover:bg-muted/50",
            selectedChatId === chat.id && "bg-muted/50",
          )}
          onClick={() => onSelectChat(chat)}
        >
          <Avatar className="h-10 w-10">
            {chat.psychologist_image || chat.patient_image ? (
              <AvatarImage src={isPsychologist ? chat.patient_image : chat.psychologist_image} />
            ) : (
              <div className="text-white bg-orange-400 m-auto">
              {isPsychologist ? (
                chat.patient_name
                .split(" ")
                .map((n) => n[0])
                .join("") )
                 :(
                   chat.psychologist_name
                .split(" ")
                .map((n) => n[0])
                .join("") 
              )}
            </div>
            )}
        
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <div className="font-medium">{isPsychologist ? chat.patient_name : chat.psychologist_name}</div>
            {/* <div className="truncate text-sm text-muted-foreground">{chat.status || "No recent messages"}</div> */}
          </div>

        </div>
      ))}
    </div>
  )
}

