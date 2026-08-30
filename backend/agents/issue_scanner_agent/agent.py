from google.adk import Agent
from pydantic import BaseModel, Field
from typing import List


class IssueAnalysisResult(BaseModel):
    difficulty: str = Field(description="Difficulty tier: beginner, moderate, or advanced")
    difficulty_score: int = Field(description="Numeric difficulty rating from 1 to 100")
    required_skills: List[str] = Field(description="Programming languages, frameworks, and libraries required")
    summary: str = Field(description="Clear, 1-2 sentence summary of what the issue actually asks for")
    estimated_time: str = Field(description="Realistic estimated resolution time")
    key_concepts: List[str] = Field(description="Core concepts needed to understand the issue")
    suggested_prerequisites: List[str] = Field(description="Prerequisite knowledge or setup needed")


root_agent = Agent(
    name="issue_scanner_agent",
    description="Scans GitHub repositories and categorizes open issues by difficulty, skills, and complexity",
    model="gemini-2.5-flash",
    instruction="You are the Issue Scanner Agent for Vectr. Accurately categorize GitHub issues by difficulty (beginner/moderate/advanced), difficulty_score (1-100), required skills, and estimated time.",
    output_schema=IssueAnalysisResult,
)
