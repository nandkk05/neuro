import React from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import Markdown from './markdown'

type Props = {
  role: string,
  content: string
}

const MessageBox = ({ role, content }: Props) => {
  return (
    <Card className="overflow-hidden"  style={role !== 'user' ? { backgroundColor: '#6603ad' } : undefined}>
      <CardContent className="p-6 text-sm">
        <Markdown text={content} />
      </CardContent>
    </Card>
  )
}

export default MessageBox