
def match_sponsors(player_profile):
    # Real version would query brands/algorithms
    offers = []
    if "Pro" in (player_profile.skill_level or ""):
        offers.append({
            "sponsor_name": "Nike Golf",
            "offer_text": "Exclusive gear deal for rising pros!",
            "url": "https://nike.com/golf",
            "amount": "$500 gift card"
        })
    if "Charity Events" in (player_profile.interests or []):
        offers.append({
            "sponsor_name": "Golf4Good",
            "offer_text": "Become an ambassador for our next charity scramble.",
            "url": "https://golf4good.org"
        })
    return offers
