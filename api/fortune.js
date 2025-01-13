require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAI } = require('openai');

const app = express();
app.use(express.json());  // body-parser を使わずに JSON を処理

// OpenAI API 設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 占い結果の生成エンドポイント
app.post('/api/fortune', async (req, res) => {
    const { question, card, position } = req.body;

    if (!question || !card || !position) {
        return res.status(400).json({ error: "必要な情報が不足しています。" });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "あなたは親しみやすく、簡潔でポジティブな占い師です。" },
                { role: "user", content: `質問: ${question}\n引いたカード: ${card}\nカードの位置: ${position}\nこのカードのポジティブな解釈を短く伝えてください。` }
            ],
            max_tokens: 150
        });

        res.json({ result: completion.choices[0].message.content });

    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({ error: "占いの結果を生成できませんでした。" });
    }
});

// Vercel 用のエクスポート
module.exports = app;
