import os
import json
from typing import List, Optional
from openai import OpenAI
import instructor
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

# Pydantic Models
class ContactInfo(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    possible_work_locations: List[str] = Field(default_factory=list)

class WorkExperience(BaseModel):
    role: str = ""
    company: str = ""
    location: str = ""
    from_date: str = ""
    to_date: str = ""
    description: List[str] = Field(default_factory=list)

class Education(BaseModel):
    degree: str = ""
    university: str = ""
    from_date: str = ""
    to_date: str = ""
    special_achievements: List[str] = Field(default_factory=list)

class Project(BaseModel):
    name: str = ""
    date: str = ""
    link: Optional[str] = None
    purpose: str = ""
    key_technologies_concepts: str = ""

class SkillCategory(BaseModel):
    name: str = ""
    skills: List[str] = Field(default_factory=list)

class Certification(BaseModel):
    name: str = ""
    organization: str = ""
    date: str = ""
    certificate_link: Optional[str] = None
    description: str = ""
    key_technologies_concepts: str = ""

class CompleteResume(BaseModel):
    contact_info: ContactInfo = Field(default_factory=ContactInfo)
    summary: str = ""
    work_experience: List[WorkExperience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    certification_and_training: List[Certification] = Field(default_factory=list)
    projects: List[Project] = Field(default_factory=list)
    skill_categories: List[SkillCategory] = Field(default_factory=list)

# Initialize FastAPI and OpenAI
app = FastAPI(title="Resume Parser Stream")
client = instructor.from_openai(OpenAI())

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/parse-resume")
async def parse_resume(request: Request):
    body = await request.json()
    resume_text = body.get("text", "").strip()
    
    if not resume_text:
        raise HTTPException(status_code=400, detail="Resume text is required")
    
    async def generate_stream():
        try:
            resume_stream = client.chat.completions.create_partial(
                model="gpt-4o-mini",
                messages=[{
                    "role": "user", 
                    "content": f"""Parse this resume into structured JSON format:
                    
                    - contact_info: name, email, phone, locations
                    - summary: professional summary
                    - work_experience: jobs with role, company, location, dates, descriptions
                    - education: degrees, universities, dates, achievements  
                    - certification_and_training: certifications and training
                    - projects: projects with tech stack and purpose
                    - skill_categories: skills grouped by category
                    
                    Resume: {resume_text}"""
                }],
                response_model=CompleteResume,
                stream=True,
            )
            
            last_json = ""
            for partial_resume in resume_stream:
                if partial_resume:
                    try:
                        json_data = partial_resume.model_dump_json()
                        if json_data != last_json:
                            json.loads(json_data)  # Validate JSON
                            yield f"data: {json_data}\n\n"
                            last_json = json_data
                    except:
                        continue
                        
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate_stream(), 
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
