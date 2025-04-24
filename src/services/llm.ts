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
        // 将[0,1]范围的小数转换为[0,100]的百分比
        const progress = Math.round(report.progress * 100);
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
export function usePolishText() {
  const { llm, loadingProgress } = useLLM();

  const polishText = useCallback(
    async (input: string, onUpdate?: (text: string) => void): Promise<{ result: string | null; loadingProgress: number }> => {
      if (!llm) {
        return { result: null, loadingProgress };
      }

      try {
        // 创建流式请求
        const stream = await llm.chat.completions.create({
          messages: [
            { role: "system", content: "You are a professional editor. Please rewrite text to be clearer and more polished without adding any extra AI commentary." },
            { role: "user", content: input }
          ],
          model: MODEL_ID,
          stream: true, // 启用流式响应
          temperature: 0,
          presence_penalty: -1,
          frequency_penalty: 1
        });

        let fullText = "";

        // 处理流式响应
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          fullText += content;

          // 如果提供了更新回调，则调用它
          if (onUpdate && content) {
            onUpdate(fullText);
          }
        }

        return { result: fullText.trim(), loadingProgress: 100 };
      } catch (error) {
        console.error("Error polishing text:", error);
        return { result: null, loadingProgress };
      }
    },
    [llm, loadingProgress]
  );

  return { polishText, loadingProgress };
}

// 2. AI chat helper for PapilioTask
export function usePapilioChat() {
  const { llm, loadingProgress } = useLLM();

  const sendMessage = useCallback(
    (history: { role: string; content: string }[]) => {
      if (!llm) {
        return { stream: null, loadingProgress };
      }

      try {
        const messages = [
          { role: "system", content: "You are PapilioTask assistant. Help the user manage events." },
          ...history,
        ];
        const stream = llm.chat.completions.create({
          messages: messages.map(msg => ({ role: msg.role as "system" | "user" | "assistant", content: msg.content })),
          model: MODEL_ID,
          stream: true,
          temperature: 0.2,
          presence_penalty: -1,
          frequency_penalty: 1
        });
        return { stream, loadingProgress: 100 };
      } catch (error) {
        console.error("Error sending message:", error);
        return { stream: null, loadingProgress };
      }
    },
    [llm, loadingProgress]
  );

  return { sendMessage, loadingProgress };
}

// 3. Event recommendation (sort by importance)
export function useRecommendEvents() {
  const { llm, loadingProgress } = useLLM();

  const recommendEvents = useCallback(
    async (events: { id: string; title: string }[]): Promise<{ result: string[] | null; loadingProgress: number }> => {
      if (!llm) {
        return { result: null, loadingProgress };
      }

      try {
        const list = events.map(e => `- ID: ${e.id}, Title: ${e.title}`).join("\n");
        const prompt = `Given the following events with IDs and titles, rank them by importance from highest to lowest and return only a JSON array of IDs:\n${list}`;
        const result = await llm.chat.completions.create({
          messages: [{ role: "system", content: prompt }],
          model: MODEL_ID,
          stream: false,
          temperature: 0,
          presence_penalty: -1,
          frequency_penalty: 1
        });
        if (!result.choices[0].message || !result.choices[0].message.content) {
          return { result: null, loadingProgress: 100 };
        }
        return { result: JSON.parse(result.choices[0].message.content), loadingProgress: 100 };
      } catch (error) {
        console.error("Error recommending events:", error);
        return { result: null, loadingProgress };
      }
    },
    [llm, loadingProgress]
  );

  return { recommendEvents, loadingProgress };
}
