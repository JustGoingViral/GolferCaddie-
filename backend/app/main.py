
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from pathlib import Path
from pydantic import BaseModel

# Import route modules
from .routes import caddie, course_ai, mcp, media, sponsor, swing, chatbot
from .services.golf_chatbot import get_golf_chat_response

class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

app = FastAPI(
    title="OnlyGolfers DAC-SMART API",
    description="AI-powered golf strategy and player matching platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "OnlyGolfers DAC-SMART"}

# Direct golf chat endpoint for compatibility
@app.post("/api/golf-chat", response_model=ChatResponse)
async def golf_chat_direct(chat_message: ChatMessage):
    """
    Direct golf chat endpoint for frontend compatibility
    """
    try:
        response_text = get_golf_chat_response(chat_message.message)
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat message: {str(e)}")

# API routes
app.include_router(caddie.router, prefix="/api/caddie", tags=["caddie"])
app.include_router(course_ai.router, prefix="/api/course", tags=["course"])
app.include_router(mcp.router, prefix="/api/mcp", tags=["mcp"])
app.include_router(media.router, prefix="/api/media", tags=["media"])
app.include_router(sponsor.router, prefix="/api/sponsor", tags=["sponsor"])
app.include_router(swing.router, prefix="/api/swing", tags=["swing"])
app.include_router(chatbot.router, prefix="/api/golf", tags=["chatbot"])

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
