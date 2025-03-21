from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import ollama

app = FastAPI()

# CORS Configuration to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.post("/chat")
async def chat_endpoint(data: dict):
    user_message = data.get("message", "")

    if not user_message:
        return {"response": "No message provided"}

    try:
        response = ollama.chat(
            model="mistral",
            messages=[{"role": "user", "content": user_message}]
        )

        # Extract only the 'content' from response
        assistant_response = response.get("message", {}).get("content", "No response received")

        return {"response": assistant_response}
    
    except Exception as e:
        return {"error": f"Failed to connect to Ollama: {str(e)}"}

@app.get("/")
def home():
    return {"message": "Backend is running with Ollama!"}
