import React, { useState } from 'react';
import ChatInterface from "@/components/chat/ChatInterface"


export default function Chat() {
    return (
      <main className="flex  flex-col items-center justify-center">
        <div className="w-full max-w-6xl rounded-xl border shadow-sm">
          <ChatInterface />
        </div>
      </main>
    )
  }