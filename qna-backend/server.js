import express from "express"
import  mongoose from "mongoose"
import  cors from "cors"
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("works"))
.catch(err => console.error("not works:",err));


const QnaSchema = new mongoose.Schema({
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now }
});

const Qna = mongoose.model("Qna", QnaSchema);

app.get("/",(req,res) => {
    res.send("server works");
});

app.post("/ask",async (req,res) => {
    try{
    const { question } = req.body;

    let exists = await Qna.findOne({question: {$regex:question,$options:"i"} });
    if (exists)  {
        return res.json({answer: exists.answer,source:"db"});

    }
    const answer = "rnnotexisting";



    const newQna = new Qna ({question,answer});

    await newQna.save();

    res.json({answer, source: "willbeai"});
}catch (err) {
    console.error("something  happened on post",err)
}
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`backend running  http://localhost:${PORT}`);
});

