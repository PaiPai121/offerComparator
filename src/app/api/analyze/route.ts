import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { comparisonData } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      你是一位资深的职场财务顾问和职业规划师。请根据以下两份 Offer 的深度对比数据进行分析。
      数据包含：税前总包、税后现金、公积金、股票归属。
      
      对比数据明细：
      ${JSON.stringify(comparisonData, null, 2)}

      请提供以下分析：
      1. 财务健康度：哪份 Offer 的现金流更好？哪份的长期收益更高？
      2. 潜在风险：从期权占比、公积金基数等方面指出可能的“坑”。
      3. 综合建议：给出一个明确的推荐倾向，并说明理由。
      
      要求：语气专业、客观、毒舌但有理有据。使用 Markdown 格式。
    `;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ advice: result.response.text() });
  } catch (error) {
    return NextResponse.json({ error: "AI 诊断失败" }, { status: 500 });
  }
}