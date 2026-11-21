import json
import os
from typing import List
from kadhai_ai.config import settings
from kadhai_ai.schemas.ingredient import FreshnessState, IndianFoodCategory
from kadhai_ai.schemas.recipe import (
    CuisineRegion,
    DietaryType,
    Recipe,
    TadkaSpec,
)
from kadhai_ai.tools.quick_commerce import QuickCommerceHelper
from kadhai_ai.culinary.taxonomy import LEFTOVER_TRANSFORMATIONS, GRAVY_BASES
from kadhai_ai.agents.state import ChefState


CHEF_REASONING_PROMPT = """
You are 'kadhAI' — a master Indian Executive Chef and culinary mentor.
Your job is to craft authentic, practical, delicious Indian recipes using the user's scanned pantry inventory.

INPUT CONTEXT:
- Available Pantry Ingredients: {ingredients}
- Leftovers Detected: {leftovers}
- Dietary Preference: {dietary_preference}
- Regional Style: {cuisine_preference}
- Max Cooking Time: {max_time} minutes
- Spice Level: {spice_level}

CRITICAL INDIAN CULINARY RULES:
1. TADKA / CHHONK IS SACRED:
   - Every cooked dal, sabzi, or rice MUST specify the exact Tadka order (e.g. Heat oil -> Mustard seeds splutter -> Jeera sizzles -> Hing -> Ginger/Chillies -> Curry leaves).
2. LEFTOVER REPURPOSING (JUGAAD COOKING):
   - If leftovers are present (e.g. cold rice, cooked dal, stale roti), at least ONE recipe MUST repurpose them into a fresh breakfast or snack (e.g. Phodnicha Bhaat, Dal Paratha, Vaghareli Roti).
3. STRICT DIETARY ADHERENCE:
   - If JAIN: Absolutely NO onion, garlic, ginger (if strict), potatoes, carrots, radishes. Use hing, jeera, amchur, tomatoes, curd, and green chillies.
   - If PURE VEG: No eggs, no meat.
4. HIGH PROTEIN FOR INDIAN HOMES:
   - Highlight protein sources (paneer, dals, besan, soya, curd) and accurately estimate grams of protein.
5. MISSING INGREDIENT CONSTRAINTS:
   - Use mostly what is already available.
   - You may suggest 1 or 2 small missing ingredients (e.g. Kasuri methi, fresh coriander, ginger) that can be quick-delivered via Blinkit/Zepto to elevate the dish.

Output a JSON array containing 2 to 3 `Recipe` objects matching the specified schema.
"""


class KadhaiChefAgent:
    """
    Autonomous Indian Culinary Agent that reasons through pantry state,
    applies dietary filters, and produces verified recipes.
    """

    def __init__(self, groq_api_key: str = "", gemini_api_key: str = ""):
        self.groq_api_key = groq_api_key or settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY", "")
        self.gemini_api_key = gemini_api_key or settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY", "")

    def run(self, state: ChefState) -> ChefState:
        """
        Executes the agentic pipeline:
        1. Pre-filter ingredients (Jain compliance, leftover isolation)
        2. Generate authentic recipes using Groq (Llama 3.3 70B) or Gemini
        3. Enrich missing ingredients with live Quick Commerce links (Blinkit/Zepto/Instamart)
        4. Calculate total cart ROI
        """
        # Step 1: Pre-filtering
        state = self._filter_ingredients_step(state)

        # Step 2: Recipe Generation
        recipes = self._generate_recipes_step(state)

        # Step 3: Quick Commerce Deep Linking
        enriched_recipes = []
        all_missing_items = []
        for r in recipes:
            enriched_missing = []
            for item in r.missing_ingredients:
                enriched = QuickCommerceHelper.create_missing_ingredient(
                    name=item.name,
                    hindi_name=item.hindi_name,
                    is_critical=item.is_critical,
                    estimated_cost_inr=item.estimated_cost_inr
                )
                enriched_missing.append(enriched)
                all_missing_items.append(enriched)
            r.missing_ingredients = enriched_missing
            enriched_recipes.append(r)

        state.generated_recipes = enriched_recipes
        state.quick_commerce_summary = QuickCommerceHelper.calculate_basket_roi(all_missing_items)

        return state

    def _filter_ingredients_step(self, state: ChefState) -> ChefState:
        """Enforces dietary boundaries like Jain restrictions."""
        filtered_items = []
        jain_forbidden = ["onion", "pyaz", "garlic", "lehsun", "potato", "aloo", "carrot", "gajar", "radish", "mooli"]

        for item in state.scan_result.ingredients:
            if state.dietary_preference == DietaryType.JAIN:
                name_lower = item.name.lower()
                hindi_lower = item.hindi_name.lower()
                if any(f in name_lower or f in hindi_lower for f in jain_forbidden):
                    continue  # Skip for Jain diet
            filtered_items.append(f"{item.name} ({item.hindi_name}, {item.estimated_quantity})")

        state.available_ingredient_names = filtered_items

        # Check leftovers
        leftovers = []
        for l in state.scan_result.leftovers_detected:
            leftovers.append(f"{l.name} ({l.hindi_name}, {l.estimated_quantity})")
        state.filtered_leftovers = leftovers
        state.has_leftovers = len(leftovers) > 0

        return state

    def _generate_recipes_step(self, state: ChefState) -> List[Recipe]:
        """
        Invokes LLM (Groq Llama 3.3 or Gemini) to generate recipes.
        Falls back to curated authentic recipes if API keys are not present.
        """
        # If Groq is available, use ultra-fast LPU inference (GPT-OSS 120B / 20B)
        if self.groq_api_key and self.groq_api_key != "your_groq_api_key_here":
            try:
                from groq import Groq
                client = Groq(api_key=self.groq_api_key)

                schema_str = json.dumps(Recipe.model_json_schema())
                sys_prompt = (
                    "You are kadhAI. Respond ONLY with a valid JSON object containing a 'recipes' list of Recipe objects. "
                    f"Every Recipe object in the list MUST adhere strictly to this JSON Schema:\n{schema_str}"
                )

                prompt = CHEF_REASONING_PROMPT.format(
                    ingredients=", ".join(state.available_ingredient_names),
                    leftovers=", ".join(state.filtered_leftovers) if state.has_leftovers else "None",
                    dietary_preference=state.dietary_preference.value,
                    cuisine_preference=state.cuisine_preference.value,
                    max_time=state.max_cooking_time_minutes,
                    spice_level=state.spice_level
                )

                chat_completion = client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": sys_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    model="openai/gpt-oss-120b",
                    temperature=0.3,
                    response_format={"type": "json_object"}
                )

                content = chat_completion.choices[0].message.content
                data = json.loads(content)
                recipe_list = data if isinstance(data, list) else data.get("recipes", list(data.values())[0])
                return [Recipe.model_validate(r) for r in recipe_list]

            except Exception as e:
                print(f"[ChefAgent] Groq error: {e}. Falling back to Gemini or default recipes.")

        # If Groq is not configured but Gemini is, use Gemini 2.0 Flash for reasoning
        if self.gemini_api_key and self.gemini_api_key != "your_gemini_api_key_here":
            try:
                from google import genai
                from google.genai import types
                from pydantic import BaseModel

                class RecipeListContainer(BaseModel):
                    recipes: List[Recipe]

                client = genai.Client(api_key=self.gemini_api_key)
                prompt = CHEF_REASONING_PROMPT.format(
                    ingredients=", ".join(state.available_ingredient_names),
                    leftovers=", ".join(state.filtered_leftovers) if state.has_leftovers else "None",
                    dietary_preference=state.dietary_preference.value,
                    cuisine_preference=state.cuisine_preference.value,
                    max_time=state.max_cooking_time_minutes,
                    spice_level=state.spice_level
                )

                response = client.models.generate_content(
                    model="gemini-3.5-flash",
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=RecipeListContainer,
                        temperature=0.3,
                    ),
                )
                if response.text:
                    container = RecipeListContainer.model_validate_json(response.text)
                    return container.recipes
            except Exception as e:
                print(f"[ChefAgent] Gemini error: {e}. Falling back to default recipes.")

        # Default high-quality authentic recipes for testing/demo
        return self._get_fallback_recipes(state)

    def _get_fallback_recipes(self, state: ChefState) -> List[Recipe]:
        """Authentic, highly detailed fallback recipes matching Indian home standards."""
        recipes = []

        # Recipe 1: Leftover Repurposed or Quick Kadhai dish
        if state.has_leftovers:
            recipes.append(
                Recipe(
                    title="Crispy Dal Missi Paratha with Tadka Curd",
                    hindi_title="दाल मिस्सी पराठा एवं तड़का दही",
                    description="Transform yesterday's cooked dal into flaky, spiced whole-wheat flatbreads paired with tempered curd.",
                    dietary_type=DietaryType.PURE_VEG,
                    region=CuisineRegion.NORTH_INDIAN,
                    prep_time_minutes=10,
                    cook_time_minutes=15,
                    servings=2,
                    is_leftover_repurposed=True,
                    leftover_story="Jugaad Cooking: Used 1 bowl of leftover toor dal as the kneading liquid for dough, eliminating waste while adding 14g plant protein!",
                    tadka=TadkaSpec(
                        oil_or_ghee="1 tsp Desi Ghee",
                        spices_in_sequence=["Hing (Asafoetida)", "Jeera (Cumin)", "Kashmiri Mirch"],
                        aromatics="Slit green chilli",
                        instructions="Heat ghee, sizzle jeera and hing, take off flame and stir in kashmiri mirch. Pour over cold whisked dahi."
                    ),
                    ingredients_from_pantry=["Leftover Yellow Toor Dal", "Curd / Dahi", "Green Chillies", "Ginger"],
                    missing_ingredients=[
                        QuickCommerceHelper.create_missing_ingredient(
                            name="Kasuri Methi",
                            hindi_name="कस्तूरी मेथी",
                            is_critical=False,
                            estimated_cost_inr=30.0
                        ),
                        QuickCommerceHelper.create_missing_ingredient(
                            name="Desi Ghee",
                            hindi_name="शुद्ध देसी घी",
                            is_critical=True,
                            estimated_cost_inr=95.0
                        )
                    ],
                    steps=[
                        "Take 1.5 cups atta (whole wheat flour). Add leftover cooked dal, chopped green chillies, grated ginger, salt, and ajwain.",
                        "Knead into a soft, pliable dough without adding water (the dal contains enough moisture). Rest for 5 minutes.",
                        "Roll into round parathas, brushing lightly with ghee inside for flaky layers.",
                        "Cook on a medium-hot tawa until golden-brown spots appear on both sides.",
                        "Serve piping hot with tempered curd (tadka dahi) and a knob of butter."
                    ],
                    chef_secret_tip="Kneading dough with cold dal makes the parathas stay soft for up to 12 hours—great for tiffins!",
                    estimated_protein_g=14.5,
                    estimated_calories=320.0
                )
            )

        # Recipe 2: Kadhai Paneer Shimla Mirch
        recipes.append(
            Recipe(
                title="Dhabha-Style Kadhai Paneer & Shimla Mirch",
                hindi_title="ढाबा स्टाइल कड़ाही पनीर एवं शिमला मिर्च",
                description="Succulent cubes of fresh paneer and crunchy capsicum tossed in a robust freshly-pounded spice masala.",
                dietary_type=DietaryType.PURE_VEG,
                region=CuisineRegion.NORTH_INDIAN,
                prep_time_minutes=10,
                cook_time_minutes=20,
                servings=2,
                is_leftover_repurposed=False,
                tadka=TadkaSpec(
                    oil_or_ghee="2 tbsp Mustard Oil or Ghee",
                    spices_in_sequence=["Jeera", "Crushed Coriander Seeds (Khada Dhania)", "Dry Red Chilli"],
                    aromatics="Julienned ginger, chopped tomatoes, slit green chillies",
                    instructions="Heat oil in a heavy cast-iron kadhai till smoking point. Coarsely crush coriander seeds and jeera, saute aromatics until oil separates from masala."
                ),
                ingredients_from_pantry=["Paneer (~200g)", "Tomatoes", "Capsicum / Shimla Mirch", "Ginger", "Green Chillies"],
                missing_ingredients=[
                    QuickCommerceHelper.create_missing_ingredient(
                        name="Fresh Coriander",
                        hindi_name="हरा धनिया",
                        is_critical=False,
                        estimated_cost_inr=15.0
                    )
                ],
                steps=[
                    "Dice paneer into cubes and dice capsicum into 1-inch squares.",
                    "Puree 3 tomatoes and finely chop ginger and green chillies.",
                    "Heat mustard oil in kadhai. Splutter crushed coriander seeds and jeera.",
                    "Add tomato puree, turmeric, red chilli powder, and salt. Cook on medium flame until oil leaves the sides (bhoon-na).",
                    "Toss in crunchy capsicum squares and saute for 3 minutes (retain crunch, do not overcook).",
                    "Gently fold in paneer cubes and 2 tbsp whisked curd. Simmer for 3 minutes on low flame.",
                    "Garnish with julienned ginger and fresh coriander leaves."
                ],
                chef_secret_tip="Never fry fresh paneer too long in oil or it turns chewy/rubbery. Add it raw directly into the warm masala for melt-in-mouth texture.",
                estimated_protein_g=22.0,
                estimated_calories=380.0
            )
        )

        return recipes
