require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAI } = require('openai');

const app = express();
app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // 環境変数を利用
});
const openai = new OpenAIApi(configuration);

// OpenAI API 設定
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get('/result', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'result.html'));
});


// 静的ファイルの提供
app.use(express.static('public'));
app.use(bodyParser.json());

// 占い結果の生成エンドポイント
app.post('/api/fortune', async (req, res) => {
    const { question, card, position } = req.body;

    if (!question || !card || !position) {
        console.error("Missing request parameters:", req.body);
        return res.status(400).json({ error: "必要な情報が不足しています。" });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",  // モデルを gpt-3.5-turbo に変更
            messages: [
                { role: "system", content: "あなたは親しみやすく、簡潔でポジティブな占い師です。" },
                { role: "user", content: `質問: ${question}\n引いたカード: ${card}\nカードの位置: ${position}\nこのカードのポジティブな解釈を短く伝えてください。` }
            ],
            max_tokens: 150
        });

        console.log("ChatGPT Response:", completion.choices[0].message.content);
        res.json({ result: completion.choices[0].message.content });

    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({ error: "占いの結果を生成できませんでした。" });
    }
});

console.log("API Key:", process.env.OPENAI_API_KEY);

// サーバー起動
module.exports = app;
