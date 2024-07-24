import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { openai } from '@ai-sdk/openai'
import { convertToCoreMessages, streamText } from 'ai'
import { renderer } from './renderer'

const app = new Hono()

app.use(logger())

const schema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string()
    })
  )
})

app.post('/api/chat', zValidator('json', schema), async (c) => {
  const { messages } = c.req.valid('json')
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: "You are a helpful assistant.",
    messages: convertToCoreMessages(messages)
  })
  return result.toAIStreamResponse()
})

app.get('*', renderer, async (c) => {
  return c.render(<div id="root"></div>)
})

export default app
