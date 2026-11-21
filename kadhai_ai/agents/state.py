from typing import List, Optional
from pydantic import BaseModel, Field
from kadhai_ai.schemas.ingredient import PantryScanResult
from kadhai_ai.schemas.recipe import CuisineRegion, DietaryType, Recipe


class ChefState(BaseModel):
    """
    State container passed through the KadhaiAI LangGraph workflow.
    """
    scan_result: PantryScanResult
    dietary_preference: DietaryType = DietaryType.PURE_VEG
    cuisine_preference: CuisineRegion = CuisineRegion.PAN_INDIAN
    max_cooking_time_minutes: int = 30
    spice_level: str = "Medium Desi"  # Mild, Medium Desi, Tikha / Spicy
    include_leftovers: bool = True

    # Intermediate / Working Data
    available_ingredient_names: List[str] = Field(default_factory=list)
    has_leftovers: bool = False
    filtered_leftovers: List[str] = Field(default_factory=list)

    # Final Outputs
    generated_recipes: List[Recipe] = Field(default_factory=list)
    quick_commerce_summary: Optional[dict] = None
    errors: List[str] = Field(default_factory=list)
