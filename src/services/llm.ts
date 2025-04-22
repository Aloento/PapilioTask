import * as webllm from "@mlc-ai/web-llm";
import { useCallback, useEffect, useState } from "react";

// Define the model identifier for Phi-3.5-mini
const MODEL_ID = "Phi-3.5-mini-instruct-q4f16_1-MLC";

// 全局LLM实例变量
let globalLLM: webllm.MLCEngineInterface | null = null;
let isInitializing = false;
let progressCallbacks: ((progress: number) => void)[] = [];

// Hook to initialize and load the LLM engine with progress reporting
export function useLLM() {
  const [llm, setLLM] = useState<webllm.MLCEngineInterface | undefined>(globalLLM || undefined);
  const [loadingProgress, setLoadingProgress] = useState(globalLLM ? 100 : 0);

  useEffect(() => {
    // 如果全局LLM已存在，直接使用
    if (globalLLM) {
      setLLM(globalLLM);
      setLoadingProgress(100);
      return;
    }

    // 注册进度回调
    progressCallbacks.push(setLoadingProgress);

    // 如果已经有初始化过程，无需重复初始化
    if (isInitializing) {
      return () => {
        progressCallbacks = progressCallbacks.filter(cb => cb !== setLoadingProgress);
      };
    }

    // 开始初始化
    isInitializing = true;
    const init = async () => {
      const onProgress = (report: webllm.InitProgressReport) => {
        // 更新所有注册的进度回调
        const progress = report.progress;
        progressCallbacks.forEach(cb => cb(progress));
      };

      try {
        const engine = await webllm.CreateMLCEngine(MODEL_ID, { initProgressCallback: onProgress });
        globalLLM = engine;
        setLLM(engine);
        progressCallbacks.forEach(cb => cb(100));
      } catch (error) {
        console.error("Failed to initialize LLM:", error);
      } finally {
        isInitializing = false;
      }
    };
    init();

    return () => {
      progressCallbacks = progressCallbacks.filter(cb => cb !== setLoadingProgress);
    };
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
