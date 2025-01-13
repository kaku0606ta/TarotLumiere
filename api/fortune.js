// api/fortune.js
const { Configuration, OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  // POSTリクエストで受け取ったデータを取得
  const { question, card, position } = req.body;

  if (!question || !card || !position) {
    return res.status(400).json({ error: "必要な情報が不足しています。" });
  }

  try {
    // OpenAI APIを使って占い結果を生成
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // モデルの指定
      messages: [
        {
          role: "system",
          content: "あなたは親しみやすく、簡潔でポジティブな占い師です。",
        },
        {
          role: "user",
          content: `質問: ${question}\n引いたカード: ${card}\nカードの位置: ${position}\nこのカードのポジティブな解釈を短く伝えてください。`,
        },
      ],
      max_tokens: 150,
    });

    // 結果を返す
    return res.json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "占いの結果を生成できませんでした。" });
  }
};
