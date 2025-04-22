import * as webllm from "@mlc-ai/web-llm";
import { useCallback, useEffect, useState } from "react";

// Define the model identifier for Phi-3.5-mini
const MODEL_ID = "Phi-3.5-mini-instruct-q4f16_1-MLC";

// Hook to initialize and load the LLM engine with progress reporting
export function useLLM() {
  const [llm, setLLM] = useState<webllm.MLCEngineInterface>();
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const onProgress = (report: webllm.InitProgressReport) => {
        if (mounted) {
          setLoadingProgress(report.progress);
        }
      };

      const engine = await webllm.CreateMLCEngine(MODEL_ID, { initProgressCallback: onProgress });
      if (mounted) {
        setLLM(engine);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  return { llm, loadingProgress };
}

// 1. Event description/reply polishing
export async function polishText(llm: webllm.MLCEngineInterface, input: string): Promise<string> {
  const prompt = `You are a professional editor. Please rewrite the following text to be clearer and more polished without adding any extra AI commentary:\n\n${input}`;
  const result = await llm.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: MODEL_ID,
    stream: false,
  });
  if (!result.choices[0].message || !result.choices[0].message.content) {
    throw new Error("Unexpected response format from LLM");
  }
  return result.choices[0].message.content.trim();
}

// 2. AI chat helper for PapilioTask
export function usePapilioChat() {
  const { llm } = useLLM();

  const sendMessage = useCallback(
    async (history: { role: string; content: string }[]) => {
      if (!llm) throw new Error("LLM not loaded");
      const messages = [
        { role: "system", content: "You are PapilioTask assistant. Help the user manage events." },
        ...history,
      ];
      const stream = llm.chat.completions.create({
        messages: messages.map(msg => ({ role: msg.role as "system" | "user" | "assistant", content: msg.content })),
        model: MODEL_ID,
        stream: true,
      });
      return stream;
    },
    [llm]
  );

  return { sendMessage };
}

// 3. Event recommendation (sort by importance)
export async function recommendEvents(
  llm: webllm.MLCEngineInterface,
  events: { id: string; title: string }[]
): Promise<string[]> {
  const list = events.map(e => `- ID: ${e.id}, Title: ${e.title}`).join("\n");
  const prompt = `Given the following events with IDs and titles, rank them by importance from highest to lowest and return only a JSON array of IDs:\n${list}`;
  const result = await llm.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: MODEL_ID,
    stream: false,
  });
  // Expect result.choices[0].message.content to be a JSON array
  if (!result.choices[0].message || !result.choices[0].message.content) {
    throw new Error("Unexpected response format from LLM");
  }
  return JSON.parse(result.choices[0].message.content);
}
