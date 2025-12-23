import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" } // 强制要求返回 JSON
    });

    const prompt = `
      你是一位资深的薪酬分析师。我会给你一段 Offer 内容文本。
      请从中提取薪酬数据，并严格按照以下 JSON 格式返回。不要包含任何解释文字。

      JSON 格式要求：
      {
        "companyName": "公司名",
        "jobTitle": "职位",
        "baseSalary": { "monthly": 月薪数字, "monthsPerYear": 发薪月数 },
        "bonus": { "fixed": 固定奖金数额, "targetPercent": 比例奖金百分比数字 },
        "signOn": { "year1": 第一年签字费, "year2": 第二年签字费 },
        "equity": { 
           "type": "RSU" 或 "Option", 
           "totalValue": 4年总包股票价值数字, 
           "pattern": "linear",
           "schedule": [第一年比例, 第二年比例, 第三年比例, 第四年比例] 
        }
      }

      注意：
      - 如果提到14薪，monthsPerYear 就是 14。
      - 如果提到 15% 奖金，targetPercent 就是 15。
      - 如果没提到某项，请填 0。
      - 必须返回有效的 JSON。

      Offer 文本内容：
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return NextResponse.json(JSON.parse(response.text()));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI 解析失败" }, { status: 500 });
  }
}