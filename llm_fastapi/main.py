from enum import Enum
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
from groq import Groq
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ["MISTRAL_API_KEY"]
model ="mistral-large-latest"    

client_mistral = MistralClient(api_key=api_key)
client_groq = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)



def get_mistral_completion(input_text: str, history: List[ChatMessage] = []):
    history.append(HistoryItem(role="user", content=input_text))
    history = [ {"role": item.role, "content": item.content} for item in history]
    chat_completion = client_mistral.chat(
        messages=history,
        model=model,
    )
    print(chat_completion.choices[0].message.content, history)
    return chat_completion.choices[0].message.content


def get_llama_completion(input_text: str, history: List[ChatMessage] = []):
    history.append(ChatMessage(role="user", content=input_text))
    chat_completion = client_groq.chat.completions.create(
        messages=history,
        model="llama3-8b-8192",
    )
    return chat_completion.choices[0].message.content



app = FastAPI()

# Global variables to store the selected model and tokenizer
current_model = None
current_tokenizer = None
conversation_history = []

# Available models
MODELS = {
    "llama2": "meta-llama/Llama-2-7b-chat-hf",
    "mistral": "mistralai/Mistral-7B-v0.1"
}

class ModelEnum(str, Enum):
    llama2 = "llama2"
    mistral = "mistral"

class HistoryItem(BaseModel):
    role: str
    content: str

class Query(BaseModel):
    input_text: str
    model: Optional[ModelEnum] = ModelEnum.llama2
    history: Optional[List[HistoryItem]] = [{"role": "system", "content": "Hello! How can I help you today?"}]


class Response(BaseModel):
    answer: str
    model: ModelEnum
    history: Optional[List[HistoryItem]] 
    

class Conversation(BaseModel):
    messages: List[dict]



@app.post("/query", response_model=Response)
async def query(query: Query):
    input_text = query.input_text
    history = query.history
    print(history)
    if query.model == "llama2":
        completion = get_llama_completion(input_text, history)
    elif query.model == "mistral":
        completion = get_mistral_completion(input_text, history)
    else:
        raise HTTPException(status_code=400, detail="Invalid model")
    history.append({"role": "system", "content": completion})
    return {"answer": completion, "model": query.model, "history": history}



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000,)