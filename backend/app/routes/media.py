
from fastapi import APIRouter, HTTPException
from backend.app.models import MediaUpload, SwingAnalysis
from backend.app.services.swing_analysis import analyze_swing
from backend.app.services.media_processor import process_media_upload, extract_voice_tag

router = APIRouter()

@router.post("/receive", response_model=SwingAnalysis)
def receive_media(upload: MediaUpload):
    """
    Receive media upload from WhatsApp (Meta Ray-Ban Smart Glasses)
    and automatically analyze swing footage
    """
    try:
        # Process the media upload (validate, log, etc.)
        processed_upload = process_media_upload(upload)
        
        # Extract voice tag if audio is present (stubbed for now)
        if not upload.voice_tag and upload.video_url:
            extracted_voice_tag = extract_voice_tag(upload.video_url)
            processed_upload.voice_tag = extracted_voice_tag
        
        # Analyze the swing using existing analysis service
        analysis_result = analyze_swing(processed_upload.video_url)
        
        # Enhance analysis with metadata from upload
        enhanced_analysis = {
            **analysis_result,
            "video_url": processed_upload.video_url,
            "summary": f"Analysis for player {processed_upload.player_id}: {analysis_result['summary']}",
            "advice": f"{analysis_result['advice']} (Analyzed from WhatsApp upload at {processed_upload.timestamp or 'unknown time'})"
        }
        
        return SwingAnalysis(**enhanced_analysis)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Media processing failed: {str(e)}")

@router.post("/webhook")
def whatsapp_webhook(payload: dict):
    """
    WhatsApp webhook endpoint for Twilio/WhatsApp Cloud API
    Simulates receiving media from Meta Ray-Ban Smart Glasses
    """
    try:
        # Extract media URL and metadata from WhatsApp payload
        # This is a simplified simulation - real implementation would parse Twilio/WhatsApp format
        if "media_url" in payload and "from" in payload:
            upload = MediaUpload(
                player_id=payload.get("from", "unknown"),
                video_url=payload["media_url"],
                timestamp=payload.get("timestamp"),
                voice_tag=payload.get("caption", payload.get("voice_tag"))
            )
            
            # Process through main media handler
            analysis = receive_media(upload)
            
            return {
                "status": "success",
                "message": "Swing analysis complete",
                "analysis_summary": analysis.summary,
                "player_id": upload.player_id
            }
        else:
            raise HTTPException(status_code=400, detail="Invalid WhatsApp payload format")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")
