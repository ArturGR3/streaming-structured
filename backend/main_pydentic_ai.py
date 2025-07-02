import json
from typing import List
from typing_extensions import TypedDict, NotRequired
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic_ai import Agent
from dotenv import load_dotenv

load_dotenv()   

# TypedDict Models (better for streaming than Pydantic models)
class ContactInfo(TypedDict, total=False):
    name: str
    email: str
    phone: str
    possible_work_locations: List[str]

class WorkExperience(TypedDict, total=False):
    role: str
    company: str
    location: str
    from_date: str
    to_date: str
    description: List[str]

class Education(TypedDict, total=False):
    degree: str
    university: str
    from_date: str
    to_date: str
    special_achievements: List[str]

class Project(TypedDict, total=False):
    name: str
    date: str
    link: NotRequired[str]  # Optional field
    purpose: str
    key_technologies_concepts: str

class SkillCategory(TypedDict, total=False):
    name: str
    skills: List[str]

class Certification(TypedDict, total=False):
    name: str
    organization: str
    date: str
    certificate_link: NotRequired[str]  # Optional field
    description: str
    key_technologies_concepts: str

class CompleteResume(TypedDict, total=False):
    contact_info: ContactInfo
    summary: str
    work_experience: List[WorkExperience]
    education: List[Education]
    certification_and_training: List[Certification]
    projects: List[Project]
    skill_categories: List[SkillCategory]

# Initialize FastAPI and PydanticAI Agent
app = FastAPI(title="Resume Parser Stream - PydanticAI")

# Create PydanticAI agent with built-in streaming support
agent = Agent(
    'openai:gpt-4.1-mini',
    output_type=CompleteResume,
    system_prompt="""Parse resumes into structured JSON format with these sections:
    - contact_info: name, email, phone, locations  
    - summary: professional summary
    - work_experience: jobs with role, company, location, dates, descriptions
    - education: degrees, universities, dates, achievements
    - certification_and_training: certifications and training
    - projects: projects with tech stack and purpose
    - skill_categories: skills grouped by category
    
    Extract as much detail as possible from the resume text."""
)

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
    
    # Generate stream of JSON data
    async def generate_stream():
        try:
            # Run the agent and stream the output
            async with agent.run_stream(resume_text) as result:
                async for partial_resume in result.stream():
                    try: # Convert to JSON and send to client
                        json_data = json.dumps(partial_resume, default=str)
                        yield f"data: {json_data}\n\n"
                    except Exception:
                        continue
                        
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate_stream(), 
        media_type="text/event-stream",
        headers={"Connection": "keep-alive"} # Keep the connection alive
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True) 