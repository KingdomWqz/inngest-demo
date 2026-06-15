import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const baseURL = process.env.CHAT_BASE_URL;
  const apiKey = process.env.CHAT_API_KEY;
  const model = process.env.CHAT_MODEL;

  if (!baseURL) {
    return Response.json({ error: "CHAT_BASE_URL is not configured" }, { status: 500 });
  }
  if (!apiKey) {
    return Response.json({ error: "CHAT_API_KEY is not configured" }, { status: 500 });
  }
  if (!model) {
    return Response.json({ error: "CHAT_MODEL is not configured" }, { status: 500 });
  }

  const { messages } = (await req.json()) as {
    messages: { role: string; content: string }[];
  };

  const client = new OpenAI({ apiKey, baseURL });

  const input = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const completion = await client.chat.completions.create({
          model,
          messages: input,
          stream: true,
        });
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (typeof delta === "string") {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(delta)}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
