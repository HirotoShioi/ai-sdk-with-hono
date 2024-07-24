import { useChat } from "ai/react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Message } from "ai/react";

function AssistantMessage(m: Message) {
  return (
    <div className="flex w-full flex-col gap-1 items-start rtl:items-end">
      <div className="relative dark:bg-token-main-surface-secondary">
        {m.content.length > 0 ? (
          <ReactMarkdown>{m.content}</ReactMarkdown>
        ) : (
          <span className="italic font-light">
            {"calling tool: " + m?.toolInvocations?.[0].toolName}
          </span>
        )}
      </div>
    </div>
  );
}
function UserMessage(m: Message) {
  return (
    <div className="flex w-full flex-col gap-1 items-end rtl:items-start">
      <div className="relative max-w-[70%] rounded-3xl bg-[#f4f4f4] px-5 py-2.5 dark:bg-token-main-surface-secondary">
        {m.content.length > 0 ? (
          <ReactMarkdown>{m.content}</ReactMarkdown>
        ) : (
          <span className="italic font-light">
            {"calling tool: " + m?.toolInvocations?.[0].toolName}
          </span>
        )}
      </div>
    </div>
  );
}
function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: JSON.parse(localStorage.getItem("messages") || "[]"),
  });
  useEffect(() => {
    if (messages.length === 0) {
      return;
    }
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);
  return (
    <div className="flex flex-col w-full max-w-2xl overflow-scroll h-[83vh] py-4 mx-auto stretch">
      <div className="space-y-4 px-">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className={m.role === "user" ? "text-right" : "text-left"}>
              <div className="font-bold">{m.role}</div>
              {m.role === "user" ? <UserMessage {...m} /> : <AssistantMessage {...m} />}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-2xl p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}

function Title() {
  return (
    <div className="p-4 bg-gray-800 text-white w-full">
      <div className="flex flex-col w-full max-w-2xl mx-auto stretch">
        <h1 className="text-2xl">AI Chat</h1>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <Title />
      <Chat />
    </div>
  );
}

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<App />);
