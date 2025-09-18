import {React,useActionState,useEffect,useRef,useState} from 'react'
import "./styles/ChatWidget.css"

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000"

export default function ChatWidget() {

    const [isOPEN, setIsOPEN] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setinput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);


    useEffect(() => {
        if(scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    },[messages])

    const sendToBackend = async (questionText) => {
        setLoading(true);
        try {

            const res = await fetch(`${API_BASE}/ask`,{
                method:"POST",
                headers:{"Content-Type":"applicaton/json"},
                body:JSON.stringfy({question:questionText})
            })

            if(!res.ok) {
                const err = await res.json.catch(()=> ({}));
                const msg = err?.err || "Error."
                setMessages((prev) => [...prev,{ sender:"bot",text:msg}])
            }

        } catch (err) {

        }
    }

  return (
    <div>ChatWidget</div>
  )
}
