import os
import urllib.parse
from PIL import Image
import streamlit as st

from kadhai_ai.schemas.ingredient import (
    FreshnessState,
    IndianFoodCategory,
    PantryScanResult,
)
from kadhai_ai.schemas.recipe import CuisineRegion, DietaryType
from kadhai_ai.vision.extractor import IndianKitchenVisionExtractor
from kadhai_ai.agents.state import ChefState
from kadhai_ai.agents.chef_graph import KadhaiChefAgent

# Page Configuration
st.set_page_config(
    page_title="kadhAI | The Indian Kitchen Agent",
    page_icon="🍲",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Styling for Indian Kitchen Theme
st.markdown(
    """
    <style>
    .main-header {
        font-size: 2.4rem;
        font-weight: 800;
        background: -webkit-linear-gradient(45deg, #FF6F00, #D84315, #C2185B);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0px;
    }
    .sub-header {
        font-size: 1.1rem;
        color: #555;
        margin-bottom: 20px;
    }
    .badge-tag {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-right: 6px;
        margin-bottom: 6px;
    }
    .badge-fresh { background-color: #E8F5E9; color: #2E7D32; border: 1px solid #A5D6A7; }
    .badge-wilting { background-color: #FFF3E0; color: #E65100; border: 1px solid #FFCC80; }
    .badge-leftover { background-color: #EDE7F6; color: #512DA8; border: 1px solid #D1C4E9; }
    .recipe-card {
        background-color: #FAFAFA;
        border: 1px solid #EEEEEE;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
    }
    .tadka-box {
        background-color: #FFF8E1;
        border-left: 4px solid #FFA000;
        padding: 12px;
        border-radius: 6px;
        margin: 12px 0px;
    }
    .tip-box {
        background-color: #E0F2F1;
        border-left: 4px solid #00897B;
        padding: 12px;
        border-radius: 6px;
        margin: 12px 0px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Sidebar Configuration
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80", caption="kadhAI - Ghar Ka Smart Chef")
    st.markdown("### ⚙️ Indian Kitchen Settings")

    dietary_pref = st.selectbox(
        "🥗 Dietary Preference",
        options=[
            DietaryType.PURE_VEG,
            DietaryType.JAIN,
            DietaryType.EGGETARIAN,
            DietaryType.NON_VEG,
            DietaryType.VRAT_FASTING,
        ],
        format_func=lambda x: {
            DietaryType.PURE_VEG: "🌱 Pure Vegetarian (No Meat/Egg)",
            DietaryType.JAIN: "🕊️ Jain (No Onion/Garlic/Roots)",
            DietaryType.EGGETARIAN: "🥚 Eggetarian",
            DietaryType.NON_VEG: "🍗 Non-Vegetarian",
            DietaryType.VRAT_FASTING: "🕉️ Vrat / Fasting (Navratri)",
        }[x],
        index=0,
    )

    cuisine_pref = st.selectbox(
        "🌶️ Regional Flavour Profile",
        options=[
            CuisineRegion.PAN_INDIAN,
            CuisineRegion.NORTH_INDIAN,
            CuisineRegion.SOUTH_INDIAN,
            CuisineRegion.MAHARASHTRIAN,
            CuisineRegion.BENGALI,
            CuisineRegion.GUJARATI,
        ],
        format_func=lambda x: {
            CuisineRegion.PAN_INDIAN: "🇮🇳 Pan-Indian (Everyday Ghar Ka Khana)",
            CuisineRegion.NORTH_INDIAN: "🥘 North Indian (Punjabi / Rich Tadka)",
            CuisineRegion.SOUTH_INDIAN: "🥥 South Indian (Coconut & Curry Leaves)",
            CuisineRegion.MAHARASHTRIAN: "🥜 Maharashtrian (Goda Masala & Peanuts)",
            CuisineRegion.BENGALI: "🐟 Bengali (Panch Phoron & Mustard Oil)",
            CuisineRegion.GUJARATI: "🍋 Gujarati (Sweet-Tangy & Khaman)",
        }[x],
        index=0,
    )

    spice_level = st.select_slider(
        "🔥 Spice Level (Mirch/Tikha)",
        options=["Mild (Kids Friendly)", "Medium Desi", "Tikha / Spicy 🔥"],
        value="Medium Desi",
    )

    max_cook_time = st.slider(
        "⏱️ Max Cooking Time",
        min_value=15,
        max_value=60,
        value=30,
        step=5,
        format="%d mins",
    )



# Main Interface Header
st.markdown('<div class="main-header">🍲 kadhAI</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-header">The Multi-Modal Agentic Chef for Indian Kitchens & Quick-Commerce Arbitrage</div>', unsafe_allow_html=True)

# Tabs for input modes
tab_upload, tab_camera, tab_demo = st.tabs([
    "📸 Upload Fridge Photo",
    "📱 Camera Snap (Mobile/Webcam)",
    "✨ Use Instant Sample Fridge"
])

image_to_process = None

with tab_upload:
    uploaded_file = st.file_uploader(
        "Upload a clear photo of your open fridge, vegetable basket (tokri), or pantry counter",
        type=["jpg", "jpeg", "png"],
    )
    if uploaded_file:
        image_to_process = Image.open(uploaded_file)
        st.image(image_to_process, caption="Uploaded Kitchen Photo", use_container_width=True)

with tab_camera:
    camera_pic = st.camera_input("Snap a live photo of your fridge shelf")
    if camera_pic:
        image_to_process = Image.open(camera_pic)

with tab_demo:
    st.markdown(
        """
        **Don't have a fridge photo handy?**
        Click the button below to test **kadhAI** with a realistic Indian fridge inventory snapshot
        (fresh paneer, desi tomatoes, capsicum, coriander, green chillies, and yesterday's leftover toor dal).
        """
    )
    if st.button("🚀 Load Sample Indian Fridge Demo", type="primary"):
        st.session_state["use_demo_sample"] = True

# Process when image is ready or demo selected
should_run = (image_to_process is not None) or st.session_state.get("use_demo_sample", False)

if should_run:
    with st.spinner("🔍 kadhAI Vision Engine scanning ingredients and detecting leftovers..."):
        extractor = IndianKitchenVisionExtractor()
        if image_to_process:
            scan_result = extractor.scan_pantry_image(image_to_process)
        else:
            scan_result = extractor._get_fallback_mock_scan()

    st.success("✅ Kitchen scan completed!")

    # Display Scan Inventory
    st.markdown("### 🛒 Detected Kitchen Inventory")
    st.info(f"**Chef's Observation:** {scan_result.summary}")

    col_inv, col_leftover = st.columns([2, 1])

    with col_inv:
        st.markdown("#### 🥕 Fresh Ingredients & Staples")
        for item in scan_result.ingredients:
            badge_class = "badge-fresh"
            if item.freshness == FreshnessState.WILTING:
                badge_class = "badge-wilting"
            st.markdown(
                f"""
                <span class="badge-tag {badge_class}">
                    {item.hindi_name} ({item.name}) • <b>{item.estimated_quantity}</b> • <i>{item.freshness.value.upper()}</i>
                </span>
                """,
                unsafe_allow_html=True,
            )

    with col_leftover:
        st.markdown("#### 🍛 Cooked Leftovers (Jugaad Opportunities)")
        if scan_result.leftovers_detected:
            for leftover in scan_result.leftovers_detected:
                st.markdown(
                    f"""
                    <div style="background-color: #EDE7F6; padding: 10px; border-radius: 8px; border-left: 3px solid #673AB7; margin-bottom: 8px;">
                        <b>{leftover.hindi_name}</b> ({leftover.name})<br/>
                        <small>Qty: {leftover.estimated_quantity} • <i>{leftover.notes}</i></small>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
        else:
            st.write("No cooked leftovers detected. Ready for a fresh start!")

    st.markdown("---")

    # Agent Chef Execution
    with st.spinner("👩‍🍳 kadhAI Chef Agent is formulating recipes, calculating tadka sequence, and mapping Blinkit links..."):
        agent = KadhaiChefAgent()
        state = ChefState(
            scan_result=scan_result,
            dietary_preference=dietary_pref,
            cuisine_preference=cuisine_pref,
            max_cooking_time_minutes=max_cook_time,
            spice_level=spice_level,
        )
        final_state = agent.run(state)

    st.markdown("## 🍲 Master Chef Recommendations")

    # Render Recipe Cards
    for idx, recipe in enumerate(final_state.generated_recipes):
        with st.expander(f"✨ Recipe {idx+1}: {recipe.title} ({recipe.hindi_title})", expanded=(idx == 0)):
            col_meta1, col_meta2, col_meta3, col_meta4 = st.columns(4)
            col_meta1.metric("⏱️ Total Time", f"{recipe.prep_time_minutes + recipe.cook_time_minutes} mins")
            col_meta2.metric("👥 Servings", f"{recipe.servings} people")
            col_meta3.metric("💪 Protein", f"{recipe.estimated_protein_g}g / serving")
            col_meta4.metric("🔥 Calories", f"{recipe.estimated_calories} kcal")

            st.markdown(f"**Description:** {recipe.description}")

            # Leftover Highlight
            if recipe.is_leftover_repurposed and recipe.leftover_story:
                st.markdown(
                    f"""
                    <div style="background-color: #E8F5E9; border-left: 4px solid #4CAF50; padding: 10px; border-radius: 4px; margin: 10px 0;">
                        ♻️ <b>Zero-Waste Jugaad Transformation:</b> {recipe.leftover_story}
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

            # The Sacred Tadka
            if recipe.tadka:
                st.markdown(
                    f"""
                    <div class="tadka-box">
                        <b>🔥 The Sacred Tadka / Chhonk Sequence:</b><br/>
                        <b>Base Fat:</b> {recipe.tadka.oil_or_ghee}<br/>
                        <b>Spice Splutter Order:</b> {' ➔ '.join(recipe.tadka.spices_in_sequence)}<br/>
                        <b>Aromatics:</b> {recipe.tadka.aromatics or 'None'}<br/>
                        <b>Execution Pro-Tip:</b> {recipe.tadka.instructions}
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

            col_pantry, col_missing = st.columns([1, 1])

            with col_pantry:
                st.markdown("##### ✅ Available from Pantry")
                for ing in recipe.ingredients_from_pantry:
                    st.write(f"- {ing}")

            with col_missing:
                st.markdown("##### 🛒 10-Minute Quick Commerce Missing Items")
                if recipe.missing_ingredients:
                    for missing in recipe.missing_ingredients:
                        st.markdown(
                            f"""
                            **{missing.name}** ({missing.hindi_name}) ~ ₹{int(missing.estimated_cost_inr)}
                            [⚡ Blinkit]({missing.blinkit_link}) | [🛵 Zepto]({missing.zepto_link}) | [🛍️ Instamart]({missing.instamart_link})
                            """
                        )
                else:
                    st.write("🎉 You have 100% of required ingredients!")

            st.markdown("##### 👩‍🍳 Step-by-Step Cooking Steps")
            for step_num, step in enumerate(recipe.steps, 1):
                st.markdown(f"**{step_num}.** {step}")

            # Chef Secret Tip
            st.markdown(
                f"""
                <div class="tip-box">
                    💡 <b>Grandmother's / Bawarchi Secret Tip:</b> {recipe.chef_secret_tip}
                </div>
                """,
                unsafe_allow_html=True,
            )

            # WhatsApp Share Formatter
            whatsapp_text = f"Hey! Cooking {recipe.title} tonight using kadhAI 🍲.\nPrep time: {recipe.cook_time_minutes} mins.\n"
            if recipe.missing_ingredients:
                whatsapp_text += "Can someone quick-order these from Blinkit/Zepto?\n"
                for m in recipe.missing_ingredients:
                    whatsapp_text += f"- {m.name} ({m.hindi_name})\n"
            encoded_wa = urllib.parse.quote(whatsapp_text)
            st.markdown(
                f'<a href="https://wa.me/?text={encoded_wa}" target="_blank" style="text-decoration:none;"><button style="background-color:#25D366;color:white;border:none;border-radius:6px;padding:8px 16px;cursor:pointer;font-weight:600;">📲 Share Recipe & Grocery Needs on WhatsApp</button></a>',
                unsafe_allow_html=True,
            )
