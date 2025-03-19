import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"



export default function MessageList({ messages }) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={cn("flex gap-3", message.sender === "me" && "flex-row-reverse")}>
          {message.sender === "them" && (
            <Avatar className="h-8 w-8 bg-orange-500">
              <div className="text-white text-xs">JD</div>
            </Avatar>
          )}
          {message.sender === "me" && (
            <Avatar className="h-8 w-8  bg-gray-600">
              <div className="text-xs">ME</div>
            </Avatar>
          )}
          <div className="max-w-[70%]">
            <div className={cn("rounded-lg p-3", message.sender === "me" ? "bg-black text-white" : "bg-muted")}>
              {message.content}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{message.timestamp}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

