from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class DietaryType(str, Enum):
    PURE_VEG = "pure_veg"              # Standard Indian vegetarian (No meat, no eggs; dairy allowed)
    JAIN = "jain"                      # No meat, no eggs, NO ONION, NO GARLIC, no root vegetables
    EGGETARIAN = "eggetarian"          # Vegetarian + Eggs
    NON_VEG = "non_veg"                # Chicken, mutton, fish
    VRAT_FASTING = "vrat_fasting"      # Navratri/Shivratri fasting (Sendha namak, no grains/onion/garlic)


class CuisineRegion(str, Enum):
    NORTH_INDIAN = "north_indian"      # Punjabi, Mughlai, Awadhi (rich gravies, paneer, parathas)
    SOUTH_INDIAN = "south_indian"      # Tamil, Telugu, Kerala, Udupi (coconut, curry leaves, tamarind)
    MAHARASHTRIAN = "maharashtrian"    # Goda masala, peanuts, kokum, pav, phodnicha
    BENGALI = "bengali"                # Panch phoron, mustard oil, postho, jhol
    GUJARATI = "gujarati"              # Sweet-savory, khaman, kadhi, thepla
    PAN_INDIAN = "pan_indian"          # Everyday universal ghar ka khana


class TadkaSpec(BaseModel):
    oil_or_ghee: str = Field(
        description="Base fat used for tempering, e.g. '2 tbsp Desi Ghee' or '1 tbsp Mustard Oil'"
    )
    spices_in_sequence: List[str] = Field(
        description="Spices to add in precise cooking order (e.g. ['Hing', 'Jeera', 'Rai', 'Kadi Patta'])"
    )
    aromatics: Optional[str] = Field(
        default=None,
        description="Aromatics added to the tadka, e.g. 'Crushed ginger and slit green chillies'"
    )
    instructions: str = Field(
        description="Exact steps for tempering without burning spices (e.g. 'Heat ghee until shimmery, splutter jeera, turn flame low and add hing')"
    )


class MissingIngredient(BaseModel):
    name: str = Field(description="English name of missing ingredient")
    hindi_name: str = Field(description="Hindi name, e.g., 'Kasuri Methi'")
    is_critical: bool = Field(
        description="If True, dish cannot be made without it. If False, it's just a flavor enhancer"
    )
    estimated_cost_inr: float = Field(
        default=25.0,
        description="Approximate retail cost in Indian Rupees (e.g. ₹20 for coriander bunch, ₹45 for paneer)"
    )
    quick_commerce_query: str = Field(
        description="Search term formatted for quick commerce search (e.g. 'kasuri methi 50g')"
    )
    blinkit_link: str = Field(description="Direct search URL for Blinkit")
    zepto_link: str = Field(description="Direct search URL for Zepto")
    instamart_link: str = Field(description="Direct search URL for Swiggy Instamart")


class Recipe(BaseModel):
    title: str = Field(description="Name of the dish in English, e.g. 'Amritsari Paneer Bhurji'")
    hindi_title: str = Field(description="Name of the dish in Hindi, e.g. 'अमृतसरी पनीर भुर्जी'")
    description: str = Field(description="Delicious 2-sentence description of the flavor profile")
    dietary_type: DietaryType = Field(description="Dietary classification of the recipe")
    region: CuisineRegion = Field(description="Indian culinary regional origin")
    prep_time_minutes: int = Field(description="Preparation time in minutes")
    cook_time_minutes: int = Field(description="Cooking time in minutes")
    servings: int = Field(default=2, description="Number of people this serves")
    
    is_leftover_repurposed: bool = Field(
        default=False,
        description="True if this recipe specifically repurposes cooked leftovers (Jugaad Cooking)"
    )
    leftover_story: Optional[str] = Field(
        default=None,
        description="Fun explanation of how leftovers were transformed (e.g. 'Turned yesterday's dry rotis into savory Vaghareli Roti with curd and tadka')"
    )
    
    tadka: Optional[TadkaSpec] = Field(
        default=None,
        description="The heart of the dish: detailed tempering/chhonk specification"
    )
    ingredients_from_pantry: List[str] = Field(
        description="Ingredients found in the user's pantry that are utilized in this recipe"
    )
    missing_ingredients: List[MissingIngredient] = Field(
        default_factory=list,
        description="Small missing ingredients that elevate the dish (linked to Blinkit/Zepto)"
    )
    steps: List[str] = Field(
        description="Step-by-step cooking instructions crafted for an Indian kitchen (referencing kadhai, tawa, cooker, etc.)"
    )
    chef_secret_tip: str = Field(
        description="Pro-tip from an Indian grandmother/bawarchi (e.g. 'Whisk curd with 1 tsp besan before adding to avoid curdling')"
    )
    estimated_protein_g: float = Field(
        description="Estimated protein content per serving in grams (vital for Indian vegetarian nutrition)"
    )
    estimated_calories: float = Field(
        description="Estimated calories per serving"
    )
