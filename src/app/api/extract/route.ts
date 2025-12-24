import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.ZHIPU_AI_API_KEY;

    const systemPrompt = `
      你是一个专门解析招聘 Offer 的机器人。请从用户提供的文本中提取以下信息，并仅以 JSON 格式返回。
      必须包含的字段（如无则设为 0 或空）：
      {
        "companyName": "公司名",
        "monthlySalary": 数字,
        "months": 数字,
        "bonus": 数字(年终奖固定金额),
        "equity": 数字(总价值),
        "signOn": 数字(签字费),
        "city": "城市名"
      }
      不要输出任何多余的解释，只返回 JSON。
    `;

    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "glm-4-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.1 // 越低越稳定，保证 JSON 格式正确
      })
    });

    const result = await response.json();
    const content = result.choices[0].message.content;
    
    // 清理可能的 Markdown 标记
    const jsonStr = content.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(jsonStr));
  } catch (error: any) {
    return NextResponse.json({ error: "解析失败" }, { status: 500 });
  }
}