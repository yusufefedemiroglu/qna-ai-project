import express from "express"
import  mongoose from "mongoose"
import  cors from "cors"
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("db works"))
.catch(err => console.error("not works:",err));


const QnaSchema = new mongoose.Schema({
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now }
});

const Qna = mongoose.model("Qna", QnaSchema);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})


app.get("/",(req,res) => {
    res.send("backend working");
});

app.post("/ask",async (req,res) => {
    try{
    const { question } = req.body;

    if(!question || question.trim().length < 5) {
      return res.status(400).json({error:"Please enter a valid question."})
    }

    let exists = await Qna.findOne({question: {$regex:question,$options:"i"} });
    if (exists)  {
        return res.json({answer: exists.answer,source:"db"});

    }

    const completion = await openai.chat.completions.create({
      model:"gpt-4o-mini",
      messages:[
        {role:"system",content:"You are a helpful bot that gives short and clear answers, do not create confusion."},
        {role:"user",content:question},
      ],
    });

    const answer = completion.choices[0].message.content



    const newQna = new Qna ({question,answer});
    await newQna.save();

    res.json({question,answer, source: "ai",createdAt:newQna.createdAt});
}catch (err) {
    console.error("something  happened on post",err)
}
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`backend running  http://localhost:${PORT}`);
});

