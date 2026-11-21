from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class FreshnessState(str, Enum):
    FRESH = "fresh"
    WILTING = "wilting"  # Urgent: use within 24-48 hrs (e.g. coriander, tomatoes)
    STALE = "stale"      # Needs frying/repurposing (e.g. dry bread, old rotis)
    COOKED_LEFTOVER = "cooked_leftover"  # Cooked dal, sabzi, boiled rice
    LONG_SHELF = "long_shelf"  # Spices, flours, grains, potatoes, onions


class IndianFoodCategory(str, Enum):
    VEGETABLE = "vegetable"              # Bhindi, Gobi, Aloo, Baingan, etc.
    LEAFY_GREEN = "leafy_green"          # Palak, Methi, Coriander/Dhaniya, etc.
    AROMATIC = "aromatic"                # Adrak, Lehsun, Hari Mirch, Pyaz, Lemon
    SPICE_WHOLE = "spice_whole"          # Jeera, Rai, Tej Patta, Laung, Dalchini
    SPICE_GROUND = "spice_ground"        # Haldi, Mirch, Dhania powder, Garam Masala
    LENTIL_PULSE = "lentil_pulse"        # Toor, Moong, Chana, Urad, Rajma, Chole
    DAIRY = "dairy"                      # Dahi/Curd, Paneer, Ghee, Milk, Malai
    GRAIN_FLOUR = "grain_flour"          # Atta, Basmati/Rice, Besan, Sooji, Poha
    COOKED_LEFTOVER = "cooked_leftover"  # Cooked dal, boiled rice, stale roti
    OTHER = "other"


class IngredientItem(BaseModel):
    name: str = Field(description="English common name, e.g., 'Coriander Leaves'")
    hindi_name: str = Field(description="Hindi/Regional name, e.g., 'Dhaniya Patti' or 'धनिया'")
    category: IndianFoodCategory = Field(description="Indian culinary classification")
    estimated_quantity: str = Field(
        description="Visual estimate of quantity, e.g. '~250g', '3 medium pieces', '1 small bunch'"
    )
    freshness: FreshnessState = Field(
        default=FreshnessState.FRESH,
        description="Freshness state of the item (useful for prioritizing what to cook first)"
    )
    is_leftover: bool = Field(
        default=False,
        description="True if this is cooked leftover food (e.g., leftover dal, cooked rice)"
    )
    notes: Optional[str] = Field(
        default=None,
        description="Observations from image, e.g. 'slightly dry', 'ripe', 'needs washing'"
    )


class PantryScanResult(BaseModel):
    ingredients: List[IngredientItem] = Field(
        default_factory=list,
        description="List of raw or pantry ingredients identified in the scan"
    )
    leftovers_detected: List[IngredientItem] = Field(
        default_factory=list,
        description="Any cooked leftovers detected (e.g. bowl of yellow dal, cooked chawal, dry rotis)"
    )
    confidence_score: float = Field(
        default=0.9,
        ge=0.0,
        le=1.0,
        description="Confidence score of the visual scan"
    )
    summary: str = Field(
        description="A concise 2-sentence summary of the detected inventory in an encouraging Indian home-chef tone"
    )
