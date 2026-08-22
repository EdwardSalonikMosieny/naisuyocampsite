# Content TODOs — confirm before launch

Every item below is marked in the HTML with `<!-- TODO: confirm with owner -->` at the relevant spot, so it's easy to find with a search for that string. Nothing on the live site currently states a fact I couldn't verify from your source material — these are the gaps.

## Blocking — must fix before the site actually works

1. **WhatsApp number.** Every page currently uses the placeholder `+254 700 000 000` (`wa.me/254700000000`). This is not a real number — the enquiry button, floating WhatsApp button, footer, and JSON-LD `telephone` field all need your real number, in full international format with no spaces (e.g. `254712345678`).
2. **Email address.** Every page uses `info@naisuyocampsite.co.ke` as a placeholder. Confirm this inbox actually exists and is monitored, or give me the real one.
3. **Rates.** Currently states "Rates on request" everywhere, per your instruction — confirm this is really how you want to handle pricing, or give me numbers.

Because the same placeholder is repeated verbatim across all seven HTML files and `main.js`, updating it is a single find-and-replace for the phone number (`254700000000`) and one for the email (`info@naisuyocampsite.co.ke`) — see README.md for the exact steps.

## Location

4. **Nearest town.** Every footer currently reads "Nearest town: to be confirmed." Location copy elsewhere correctly states "Laikipia County, Kenya, on the Ewaso Nyiro River" (from your source material), but nothing more specific is published anywhere.
5. **Driving directions / GPS coordinates.** `contact.html` currently promises to send a location pin over WhatsApp once a stay is confirmed, rather than publishing exact coordinates on the page (also avoids putting a precise pin next to wildlife-adjacent land on a public page). The homepage JSON-LD (`index.html`) has no `geo` field at all right now — add one once you're comfortable publishing coordinates.

## Stay page

6. **Number of tents, bedding/mattress details**, and whether guests can ever sleep inside a manyatta structure rather than a tent.
7. **Toilets and washing** — what's actually on site (long-drop vs flush, bucket shower vs plumbed, shared vs private).
8. **Meals** — whether included, who cooks, what dietary accommodation is realistic.
9. **Power, phone signal, and drinking water** arrangements.
10. **What-to-bring list** — the current list is a sensible generic packing list for Laikipia camping, not verified against what Naisuyo specifically provides (e.g., if you supply sleeping bags, no need to tell guests to bring one).

## About page

11. **A short, factual history** — when the campsite started, who founded it, how many households/families are involved. Nothing has been invented in its absence; the page currently just doesn't have a history section.

## Experiences page

12. **Campfire photo.** The Relaxation/Campfires section has no supporting photo (see IMAGE-MAP.md gap list) — text-only for now.

## Contact page

13. **Reply-time wording.** Currently: "We're often out on game drives or hosting guests, and out of mobile signal for stretches of the day. We reply as soon as we're back at camp — usually the same day, sometimes the next." Confirm this is accurate or adjust it.

## Social links

14. **Instagram / Facebook.** You told me to hold off on these details — none are currently linked anywhere on the site (footer, homepage JSON-LD `sameAs`). Send handles whenever you have them and I'll wire them in.

## Deployment (you said you'd guide this separately)

15. **GitHub username and repository name** — needed for the exact `git remote add` command and for the `www` CNAME target in DNS (`<username>.github.io`). See DEPLOY.md.
