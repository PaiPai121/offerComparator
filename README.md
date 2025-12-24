# 🚀 OfferVision (niyabox.cc)

![Hits](https://hits.dwyl.com/paipai121/offercomparator.svg?style=flat-square&show=true)
![Stars](https://img.shields.io/github/stars/paipai121/offercomparator?style=flat-square)
![License](https://img.shields.io/github/license/paipai121/offercomparator?style=flat-square)

> **"让每一份 Offer 的价值都清晰可见。"** > 基于 AI 的职场财务价值深度诊断工具。不仅计算月薪，更洞察未来 4 年的现金流与资产增值。

[查看在线演示: niyabox.cc](http://niyabox.cc)

---

### ✨ 核心特性

- **🤖 AI 智能解析**: 粘贴 Offer 文本或聊天记录，自动识别薪资结构（支持智谱 AI/DeepSeek）。
- **📊 4年累计收益看板**: 自动生成 4 年现金流趋势图，直观对比不同 Offer 的长期“含金量”。
- **📑 战报级海报生成**: 一键导出 HD 深度对比海报，包含 AI 专家建议、收入结构占比。
- **⚖️ 金融级个税模型**: 内置 2025 最新中国个税及五险一金封顶基数计算逻辑。

### 🛠 技术栈

- **框架**: Next.js 15 (App Router)
- **状态管理**: Zustand + Persist
- **图表**: Recharts (数据可视化)
- **渲染**: html-to-image (海报导出)
- **AI 引擎**: 智谱 AI (GLM-4)

### 🚀 快速开始

1. **配置环境变量**:
   在根目录创建 `.env.local`：
   ```env
   ZHIPU_AI_API_KEY=你的API密钥
   ```