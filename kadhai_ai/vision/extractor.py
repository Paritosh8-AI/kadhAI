import os
from typing import Optional
from PIL import Image
from kadhai_ai.config import settings
from kadhai_ai.schemas.ingredient import (
    FreshnessState,
    IndianFoodCategory,
    IngredientItem,
    PantryScanResult,
)

INDIAN_KITCHEN_SYSTEM_PROMPT = """
You are an expert Indian Home Chef and Culinary Computer Vision Analyst examining a photo of an Indian kitchen refrigerator, pantry shelf, vegetable basket (tokri), or countertop.

YOUR MISSION:
Detect and categorize every ingredient with deep knowledge of Indian culinary conventions.

CRITICAL INDIAN KITCHEN GUIDELINES:
1. DETECT COOKED LEFTOVERS:
   - Look carefully for stainless steel containers (steel dabbas / katoris), Tupperware, or covered bowls containing cooked food.
   - Common leftovers: Cooked yellow/black dal, boiled basmati/regular rice, dry sabzi (aloo gobi, bhindi), cooked chole/rajma, or dry/stale rotis in a casserole/dabba.
   - Tag these as is_leftover=True and freshness=COOKED_LEFTOVER or STALE.

2. ACCURATE LEAFY GREEN & HERB IDENTIFICATION:
   - Differentiate strictly between:
     * Coriander / Dhaniya Patti (fine serrated delicate leaves)
     * Methi / Fenugreek (small oval tri-leaflets, bitter aroma)
     * Palak / Spinach (larger broad smooth green leaves)
     * Curry Leaves / Kadi Patta (glossy pinnate leaflets on sprigs)
     * Mint / Pudina (serrated, textured fragrant leaves)

3. SPICE BOX / MASALA DABBA DETECTION:
   - If a circular masala dabba or spice jars are visible:
     * Yellow powder -> Haldi (Turmeric)
     * Deep red powder -> Degi/Kashmiri Mirch
     * Dull brownish powder -> Dhania (Coriander) Powder
     * Small dark brown seeds -> Jeera (Cumin)
     * Tiny black round seeds -> Rai (Mustard Seeds)
     * Yellowish cuboid crystals/powder -> Hing (Asafoetida)

4. FRESHNESS EVALUATION:
   - FRESH: Crisp greens, firm tomatoes, bright colors.
   - WILTING: Drooping herbs, wrinkled chillies/tomatoes. Priority for immediate cooking!
   - STALE: Dry bread, stiff rotis, aging curd. Candidate for 'jugaad' repurposing!

5. QUANTITY ESTIMATION:
   - Use practical Indian kitchen units: e.g. '3 medium pieces', '~250g', '1 small bunch', '1 katori', 'half bowl'.

Return strictly the structured JSON adhering to the PantryScanResult schema.
"""


class IndianKitchenVisionExtractor:
    """
    Multi-modal vision extractor leveraging Gemini 2.0 Flash for structured Indian pantry detection.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")

    def scan_pantry_image(self, image: Image.Image) -> PantryScanResult:
        """
        Processes a PIL Image and returns a strictly-typed PantryScanResult.
        Falls back to a realistic mock scan if no API key is configured yet.
        """
        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            return self._get_fallback_mock_scan()

        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=self.api_key)

            # We use gemini-2.0-flash for high-speed multi-modal reasoning
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[image, INDIAN_KITCHEN_SYSTEM_PROMPT],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=PantryScanResult,
                    temperature=0.1,
                ),
            )

            # Parse and return validated Pydantic model
            if response.text:
                return PantryScanResult.model_validate_json(response.text)
            else:
                return self._get_fallback_mock_scan()

        except Exception as e:
            print(f"[VisionExtractor] Error during Gemini extraction: {e}. Falling back to demo sample.")
            return self._get_fallback_mock_scan()

    def _get_fallback_mock_scan(self) -> PantryScanResult:
        """
        High-fidelity realistic fallback for testing and offline development.
        Simulates an authentic Indian fridge snapshot.
        """
        return PantryScanResult(
            confidence_score=0.96,
            summary="Aapke fridge me taaza tamatar, paneer, shimla mirch aur kal ki bachi hui toor dal dikh rahi hai. Kadhai taiyyar rakhiye!",
            ingredients=[
                IngredientItem(
                    name="Paneer",
                    hindi_name="पनीर (Paneer)",
                    category=IndianFoodCategory.DAIRY,
                    estimated_quantity="~200g slab",
                    freshness=FreshnessState.FRESH,
                    is_leftover=False,
                    notes="Fresh malai paneer block, unopened"
                ),
                IngredientItem(
                    name="Tomatoes",
                    hindi_name="लाल टमाटर (Tamatar)",
                    category=IndianFoodCategory.VEGETABLE,
                    estimated_quantity="4 medium",
                    freshness=FreshnessState.FRESH,
                    is_leftover=False,
                    notes="Firm red ripe country tomatoes (desi tamatar)"
                ),
                IngredientItem(
                    name="Green Bell Pepper / Capsicum",
                    hindi_name="शिमला मिर्च (Shimla Mirch)",
                    category=IndianFoodCategory.VEGETABLE,
                    estimated_quantity="2 pieces",
                    freshness=FreshnessState.FRESH,
                    is_leftover=False,
                    notes="Crisp and green"
                ),
                IngredientItem(
                    name="Coriander Leaves",
                    hindi_name="धनिया पत्ती (Dhaniya)",
                    category=IndianFoodCategory.LEAFY_GREEN,
                    estimated_quantity="1 small bunch",
                    freshness=FreshnessState.WILTING,
                    is_leftover=False,
                    notes="Wilting slightly; recommend using in tadka or garnish today"
                ),
                IngredientItem(
                    name="Green Chillies",
                    hindi_name="हरी मिर्च (Hari Mirch)",
                    category=IndianFoodCategory.AROMATIC,
                    estimated_quantity="5-6 chillies",
                    freshness=FreshnessState.FRESH,
                    is_leftover=False,
                    notes="Fresh and spicy"
                ),
                IngredientItem(
                    name="Ginger",
                    hindi_name="अदरक (Adrak)",
                    category=IndianFoodCategory.AROMATIC,
                    estimated_quantity="~2 inch knob",
                    freshness=FreshnessState.LONG_SHELF,
                    is_leftover=False,
                    notes="Juicy fresh ginger"
                ),
                IngredientItem(
                    name="Curd / Dahi",
                    hindi_name="दही (Dahi)",
                    category=IndianFoodCategory.DAIRY,
                    estimated_quantity="~1 katori (~150g)",
                    freshness=FreshnessState.FRESH,
                    is_leftover=False,
                    notes="Slightly tangy fresh curd"
                ),
            ],
            leftovers_detected=[
                IngredientItem(
                    name="Leftover Yellow Toor Dal",
                    hindi_name="बची हुई पीली दाल (Cooked Dal)",
                    category=IndianFoodCategory.COOKED_LEFTOVER,
                    estimated_quantity="1 steel katori (~250ml)",
                    freshness=FreshnessState.COOKED_LEFTOVER,
                    is_leftover=True,
                    notes="Thick cooked toor dal from yesterday. Prime candidate for Dal Paratha or Dal Missi Roti dough!"
                )
            ]
        )
