import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { comparisonData } = await req.json();
    const apiKey = process.env.ZHIPU_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "未配置智谱 API Key" }, { status: 500 });
    }

    // 构建 Prompt
    const prompt = `
      你是一位资深的职场财务顾问。请根据以下 Offer 对比数据进行深度分析：
      ${JSON.stringify(comparisonData, null, 2)}

      请提供以下分析（使用 Markdown 格式）：
      1. 财务健康度：分析现金流、公积金缴纳情况。
      2. 风险提示：指出股票占比过高或公积金基数低等潜在坑点。
      3. 综合建议：给出明确的选择倾向及其理由。
      
      语气要专业且客观。
    `;

    // 调用智谱 AI (OpenAI 兼容接口)
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "glm-4-flash", // 推荐使用 flash 模型，响应速度最快
        messages: [
          { role: "system", content: "你是一个专业的职场财务专家。" },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message);
    }

    return NextResponse.json({ advice: result.choices[0].message.content });
  } catch (error: any) {
    console.error("智谱分析失败:", error);
    return NextResponse.json({ error: "AI 诊断失败: " + error.message }, { status: 500 });
  }
}