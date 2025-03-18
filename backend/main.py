from fastapi import FastAPI, HTTPException
import ollama
from pydantic import BaseModel

app = FastAPI()

# Define request model
class ChatRequest(BaseModel):
    message: str

# API Route
@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = ollama.chat(model="mistral", messages=[{"role": "user", "content": request.message}])
        return {"response": response["message"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def home():
    return {"message": "AI Chatbot is running!"}
