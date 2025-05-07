import express from 'express';
import cors    from 'cors';
import dotenv  from 'dotenv';
import OpenAI  from 'openai';

dotenv.config();
const app = express();

// allow your frontend origin
app.use(
    cors({
        origin: [ 'http://localhost:3000', 'http://localhost:1234' ]
    })
);
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat', async (req, res) => {
    const { message, uid } = req.body;
    try {
        const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user",   content: message }
        ]
        });

        const reply = completion.choices[0].message.content;
        res.json({ reply });
    } catch (err) {
        console.error("OpenAI error:", err);
        res.status(500).json({ error: "AI service error" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
