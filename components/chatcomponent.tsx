import React from 'react'
import { Textarea } from './ui/textarea'
import { useChat } from 'ai/react';
import { Button } from './ui/button';
import { Loader2, Send, TextSearch } from 'lucide-react';
import { Badge } from './ui/badge';
import Messages from './messages';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import Markdown from './markdown';

type Props = {
  reportData?: string
}

const ChatComponent = ({ reportData }: Props) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      api: "api/medichatgemini",
    });
  return (
    <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4 gap-4">
      <Badge variant={'outline'}
        className={`absolute right-3 top-2.5 ${reportData && "bg-[#00B612]"}`}
      >
        {reportData ? "✓ Report Added" : "No Report Added"}

      </Badge>
      <div className="flex-1" />
      <Messages messages={messages} isLoading={isLoading} />
      <form
        className="relative overflow-hidden rounded-lg border bg-background"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(event, {
            data: {
              reportData: reportData as string,
            },
          });
        }}
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your query here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button
            disabled={isLoading}
            type="submit"
            size="sm"
            className="ml-auto bg-[#13AF5B] text-white"
          >
            {isLoading ? "Analysing..." : "Ask Gemini 2.0 flash"}
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin ml-2" />
            ) : (
              <Send className="size-3.5 ml-2" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatComponent