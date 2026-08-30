from google.adk import Agent
from pydantic import BaseModel, Field
from typing import List, Dict


class LanguageProficiency(BaseModel):
    language: str = Field(description="Language name e.g. Python, TypeScript")
    proficiency: str = Field(description="Proficiency level: beginner, intermediate, advanced")


class ProfileAnalysisResult(BaseModel):
    username: str = Field(description="GitHub username")
    calculated_points: int = Field(description="Initial points calculated from GitHub activity")
    level: int = Field(description="Skill level from 0 to 99")
    tier: str = Field(description="Developer tier: beginner, moderate, advanced, expert")
    top_languages: List[str] = Field(description="Top programming languages by proficiency")
    language_breakdown: List[LanguageProficiency] = Field(description="List of languages with proficiency levels")
    strengths: List[str] = Field(description="Key technical strengths and domain specialties")
    summary: str = Field(description="Concise 2-sentence assessment of their open-source profile")
    recommended_focus: List[str] = Field(description="Recommended issue tags/types to start contributing")


root_agent = Agent(
    name="profile_agent",
    description="Analyzes developer GitHub metadata and calculates skill score and proficiency",
    model="gemini-2.5-flash",
    instruction="You are the Profile Analysis Agent for Vectr. Analyze a developer's GitHub profile data and calculate their skill assessment accurately.",
    output_schema=ProfileAnalysisResult,
)
