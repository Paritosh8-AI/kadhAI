"""
Indian Culinary Taxonomy & Intelligence Base for KadhaiAI.
Captures authentic regional bases, spice rules, and leftover repurposing traditions.
"""

# Common Indian Leftover Transformations (The 'Jugaad Cooking' Matrix)
LEFTOVER_TRANSFORMATIONS = {
    "cooked_dal": [
        {
            "dish_name": "Dal Missi Paratha",
            "hindi_name": "दाल मिस्सी पराठा",
            "method": "Knead leftover dal directly into atta flour with ajwain, chopped onions, green chillies, and Kasuri methi. Roll and roast on tawa with desi ghee.",
            "staples_needed": ["atta", "ajwain", "ghee"]
        },
        {
            "dish_name": "Dal Palak Shorba / Dhokli",
            "hindi_name": "दाल पालक शोरबा / ढोकली",
            "method": "Simmer leftover dal with shredded spinach and spiced whole-wheat dumplings (dhokli) with a fresh hing-jeera tadka.",
            "staples_needed": ["palak", "atta", "jeera", "hing"]
        }
    ],
    "boiled_rice": [
        {
            "dish_name": "Phodnicha Bhaat / Tadka Chawal",
            "hindi_name": "फोडणीचा भात",
            "method": "Heat oil, crackle mustard seeds, jeera, curry leaves, green chillies, peanuts, and turmeric. Toss cold leftover rice until aromatic and yellow.",
            "staples_needed": ["rai", "jeera", "curry leaves", "peanuts", "haldi"]
        },
        {
            "dish_name": "Dahi Bhaat / South Indian Curd Rice",
            "hindi_name": "दही भात (तड़का)",
            "method": "Mash cooked rice with fresh curd and milk. Temper with mustard seeds, urad dal, curry leaves, ginger, and green chillies.",
            "staples_needed": ["dahi", "rai", "urad dal", "curry leaves"]
        }
    ],
    "stale_roti": [
        {
            "dish_name": "Vaghareli Roti / Roti Tadka",
            "hindi_name": "वघारेली रोटी",
            "method": "Tear dry rotis into bite-sized pieces. Temper mustard seeds, garlic, and green chillies, add whisked curd with turmeric and amchur, drop roti pieces and simmer 2 mins.",
            "staples_needed": ["dahi", "rai", "lehsun", "haldi"]
        },
        {
            "dish_name": "Crispy Roti Chivda / Poha",
            "hindi_name": "रोटी चिवड़ा",
            "method": "Pulse or shred leftover rotis finely. Saute like poha with mustard seeds, turmeric, peanuts, onions, and lemon juice.",
            "staples_needed": ["rai", "peanuts", "lemon", "haldi"]
        }
    ],
    "sour_curd": [
        {
            "dish_name": "Traditional Punjabi Kadhi Pakora",
            "hindi_name": "पंजाबी कढ़ी पकोड़ा",
            "method": "Whisk sour curd with besan, water, haldi, and red chilli. Simmer on low heat with methi dana, ginger-garlic, and crown with double hing-kashmiri mirch tadka.",
            "staples_needed": ["besan", "methi dana", "hing", "kashmiri mirch"]
        },
        {
            "dish_name": "South Indian Mor Kuzhambu",
            "hindi_name": "मोर कुझम्बु",
            "method": "Blend sour curd with soaked toor dal, coconut, cumin, and green chillies. Simmer gently with ash gourd or bhindi and temper with coconut oil.",
            "staples_needed": ["coconut", "jeera", "curry leaves", "rai"]
        }
    ]
}

# Regional Gravy & Flavor Foundations
GRAVY_BASES = {
    "north_indian_classic": {
        "name": "Onion-Tomato-Adrak-Lehsun Gravy",
        "aromatics": ["onion", "tomato", "ginger", "garlic", "green chilli"],
        "whole_spices": ["jeera", "tej patta", "dalchini", "laung"],
        "powdered_spices": ["haldi", "degi mirch", "dhania powder", "garam masala", "kasuri methi"]
    },
    "south_indian_coastal": {
        "name": "Coconut-Mustard-Curry Leaf Base",
        "aromatics": ["curry leaves", "green chillies", "shallots/sambar onions", "ginger"],
        "whole_spices": ["rai (mustard seeds)", "urad dal", "chana dal", "dry red chilli", "hing"],
        "powdered_spices": ["sambar powder", "haldi"]
    },
    "jain_sattvic": {
        "name": "Jain Sattvic Base (No Onion, No Garlic, No Root Veg)",
        "aromatics": ["ginger", "green chilli", "fresh tomato", "lemon"],
        "whole_spices": ["jeera", "hing (asafoetida)", "saunf (fennel)", "methi dana"],
        "powdered_spices": ["haldi", "dhania powder", "kashmiri red chilli", "amchur (dry mango)"]
    },
    "maharashtrian_goda": {
        "name": "Goda Masala & Peanut Base",
        "aromatics": ["curry leaves", "ginger", "garlic", "fresh coconut"],
        "whole_spices": ["rai", "jeera", "hing"],
        "powdered_spices": ["goda masala / kala masala", "roasted peanut powder", "haldi"]
    }
}

# Smart Indian Substitutions
INDIAN_SUBSTITUTIONS = {
    "tamatar": ["amchur powder (dry mango)", "dahi (curd)", "imli (tamarind paste)", "kokum"],
    "dahi": ["lemon juice + small milk", "malai / fresh cream with amchur"],
    "kasuri_methi": ["fresh methi lightly roasted", "coriander stems finely minced"],
    "ginger_garlic_paste": ["fresh crushed adrak and chopped lehsun", "dry ginger powder (sonth) + garlic flakes"],
    "paneer": ["tofu (pressed)", "boiled soya chunks", "fresh homemade chenna from milk + lemon"]
}
