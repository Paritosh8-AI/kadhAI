import pytest
from kadhai_ai.schemas.ingredient import (
    FreshnessState,
    IndianFoodCategory,
    IngredientItem,
    PantryScanResult,
)
from kadhai_ai.schemas.recipe import (
    CuisineRegion,
    DietaryType,
    Recipe,
    TadkaSpec,
)
from kadhai_ai.tools.quick_commerce import QuickCommerceHelper
from kadhai_ai.agents.state import ChefState
from kadhai_ai.agents.chef_graph import KadhaiChefAgent


def test_quick_commerce_links():
    item = QuickCommerceHelper.create_missing_ingredient(
        name="Kasuri Methi",
        hindi_name="कसूरी मेथी",
        is_critical=False,
        estimated_cost_inr=35.0
    )
    assert "blinkit.com/s/?q=Kasuri+Methi" in item.blinkit_link
    assert "zeptonow.com/search?query=Kasuri+Methi" in item.zepto_link
    assert "swiggy.com/instamart/search?query=Kasuri+Methi" in item.instamart_link
    assert item.estimated_cost_inr == 35.0


def test_pantry_scan_schema():
    scan = PantryScanResult(
        confidence_score=0.95,
        summary="Test scan of fridge",
        ingredients=[
            IngredientItem(
                name="Bhindi",
                hindi_name="भिंडी",
                category=IndianFoodCategory.VEGETABLE,
                estimated_quantity="500g",
                freshness=FreshnessState.FRESH
            )
        ],
        leftovers_detected=[]
    )
    json_data = scan.model_dump_json()
    reconstructed = PantryScanResult.model_validate_json(json_data)
    assert len(reconstructed.ingredients) == 1
    assert reconstructed.ingredients[0].name == "Bhindi"
    assert reconstructed.ingredients[0].category == IndianFoodCategory.VEGETABLE


def test_jain_filtering_agent():
    # Setup scan with onion and garlic
    scan = PantryScanResult(
        confidence_score=0.95,
        summary="Scan with aromatics and vegetables",
        ingredients=[
            IngredientItem(
                name="Onion",
                hindi_name="प्याज़",
                category=IndianFoodCategory.AROMATIC,
                estimated_quantity="3 pcs",
                freshness=FreshnessState.FRESH
            ),
            IngredientItem(
                name="Paneer",
                hindi_name="पनीर",
                category=IndianFoodCategory.DAIRY,
                estimated_quantity="200g",
                freshness=FreshnessState.FRESH
            ),
            IngredientItem(
                name="Garlic",
                hindi_name="लहसुन",
                category=IndianFoodCategory.AROMATIC,
                estimated_quantity="1 bulb",
                freshness=FreshnessState.FRESH
            )
        ],
        leftovers_detected=[]
    )

    agent = KadhaiChefAgent()
    state = ChefState(
        scan_result=scan,
        dietary_preference=DietaryType.JAIN
    )

    result_state = agent.run(state)
    # Check that onion and garlic were stripped from available ingredients
    available = " ".join(result_state.available_ingredient_names).lower()
    assert "onion" not in available
    assert "garlic" not in available
    assert "paneer" in available
    assert len(result_state.generated_recipes) > 0
