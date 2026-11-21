import urllib.parse
from typing import List
from kadhai_ai.schemas.recipe import MissingIngredient


class QuickCommerceHelper:
    """
    Generates dynamic search and cart deep-links for major Indian Quick Commerce platforms:
    - Blinkit (formerly Grofers)
    - Zepto
    - Swiggy Instamart
    """

    BLINKIT_SEARCH_URL = "https://blinkit.com/s/?q="
    ZEPTO_SEARCH_URL = "https://www.zeptonow.com/search?query="
    INSTAMART_SEARCH_URL = "https://www.swiggy.com/instamart/search?query="

    @classmethod
    def build_links(cls, query: str):
        encoded = urllib.parse.quote_plus(query)
        return {
            "blinkit": f"{cls.BLINKIT_SEARCH_URL}{encoded}",
            "zepto": f"{cls.ZEPTO_SEARCH_URL}{encoded}",
            "instamart": f"{cls.INSTAMART_SEARCH_URL}{encoded}",
        }

    @classmethod
    def create_missing_ingredient(
        cls,
        name: str,
        hindi_name: str,
        is_critical: bool = False,
        estimated_cost_inr: float = 25.0,
        search_suffix: str = ""
    ) -> MissingIngredient:
        search_query = f"{name} {search_suffix}".strip()
        links = cls.build_links(search_query)

        return MissingIngredient(
            name=name,
            hindi_name=hindi_name,
            is_critical=is_critical,
            estimated_cost_inr=estimated_cost_inr,
            quick_commerce_query=search_query,
            blinkit_link=links["blinkit"],
            zepto_link=links["zepto"],
            instamart_link=links["instamart"]
        )

    @classmethod
    def calculate_basket_roi(cls, missing_items: List[MissingIngredient]) -> dict:
        """
        Calculates total quick-commerce investment required to unlock dishes.
        """
        total_cost = sum(item.estimated_cost_inr for item in missing_items)
        critical_count = sum(1 for item in missing_items if item.is_critical)
        optional_count = len(missing_items) - critical_count

        return {
            "total_estimated_inr": total_cost,
            "critical_items_count": critical_count,
            "optional_flavour_enhancers": optional_count,
            "delivery_eta_minutes": 10
        }
