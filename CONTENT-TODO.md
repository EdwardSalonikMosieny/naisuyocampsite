# Content TODOs — confirm before launch

Every item below is marked in the HTML with `<!-- TODO: confirm with owner -->` at the relevant spot, so it's easy to find with a search for that string. Nothing on the live site currently states a fact I couldn't verify from your source material — these are the gaps.

## Resolved

- ~~WhatsApp number~~ — now `+254 743 409 175` everywhere (enquiry button, floating button, footer, `tel:`/`wa.me` links, JSON-LD `telephone`).
- ~~Email address~~ — now `naisuyocampsite@gmail.com` everywhere.
- ~~Rates~~ — published on `stay.html#rates` and referenced from `contact.html` and `experiences.html`, **shown in USD as the primary currency** per your request: cyclists ~$12.50/person/night, general tourists ~$37.50/person/night, tent hire ~$25/tent, guided game drives ~$30/person/day. KSh is kept as a secondary reference in the Stay page table only (useful for guests paying by M-Pesa) — approximate, converted at ~KSh 160/$1, labelled as such.
- ~~Meals~~ — breakfast and dinner available on request (`stay.html`).
- ~~Toilets/facilities~~ — replaced the generic placeholder with your actual amenities list: bonfire access, night lighting, security, tables and chairs, basic restroom facilities.
- ~~Enquiry form~~ — removed per your request. `contact.html` now has a single static "Book now on WhatsApp" button (a plain `wa.me` link with a starter message) instead of the multi-field form, since the site has no backend to submit a form to anyway. Works identically with or without JavaScript.

## Still open

1. **"Basic bush stay" tier (~$15.60/person, ~KSh 2,500).** You listed this as a separate line item labelled "alternative estimate" alongside the confirmed cyclist (~$12.50) and tourist (~$37.50) rates, but it's unclear what it actually is — a lower-cost option with fewer amenities? A rough estimate that's superseded by the two confirmed rates? It's currently published on `stay.html#rates` exactly as given, but flagged there with a TODO. Confirm what it covers, or remove it if it was just a draft estimate.
2. **Nearest town.** Every footer still reads "Nearest town: to be confirmed."
3. **Driving directions / GPS coordinates.** `contact.html` currently promises to send a location pin over WhatsApp once a stay is confirmed, rather than publishing exact coordinates on the page (this also avoids putting a precise public pin next to wildlife-adjacent land). The homepage JSON-LD has no `geo` field — add one once you're comfortable publishing coordinates.
4. **Number of tents, bedding/mattress details**, and whether guests can ever sleep inside a manyatta structure rather than a tent.
5. **Power, phone signal, and drinking water** arrangements — exact setup still generic ("confirm with us directly").
6. **What-to-bring list** — a sensible generic packing list for Laikipia camping, not verified against what Naisuyo specifically provides.
7. **A short, factual history** for the About page — when the campsite started, who founded it, how many households/families are involved. Nothing invented in its absence; the page just doesn't have a history section yet.
8. **Campfire photo.** The Relaxation/Campfires section has no supporting photo (see IMAGE-MAP.md gap list) — text-only for now.
9. **Reply-time wording** on the Contact page — confirm the current draft is accurate: "We're often out on game drives or hosting guests, and out of mobile signal for stretches of the day. We reply as soon as we're back at camp — usually the same day, sometimes the next."
10. **Instagram / Facebook.** You told me to hold off on these — none are currently linked anywhere on the site. Send handles whenever you have them.
11. **Black leopard sighting claim.** Added to the Game Drives description on `experiences.html` per your pricing message ("...elephants, lions, and the rare black leopard"). This is a striking, specific claim — worth double-checking it's something Naisuyo is comfortable standing behind publicly before launch, since it's a strong draw that visitors may specifically book a stay expecting to see.
