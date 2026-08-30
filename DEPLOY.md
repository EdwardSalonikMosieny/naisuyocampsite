# Deploying Naisuyo Campsite to GitHub Pages

This site is pure static HTML/CSS/JS — there is no build step. GitHub Pages serves the repository root directly.

## 1. Push the code

Already done — the site is pushed to `https://github.com/EdwardSalonikMosieny/naisuyocampsite`. For reference, this is what set it up:

```bash
git remote add origin https://github.com/EdwardSalonikMosieny/naisuyocampsite.git
git branch -M main
git push -u origin main
```

Future changes just need `git add`, `git commit`, `git push`.

## 2. Turn on GitHub Pages

1. On GitHub, go to the repository → **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The workflow at `.github/workflows/pages.yml` publishes the static site from `main`.
4. GitHub will build and serve the site at `https://EdwardSalonikMosieny.github.io/naisuyocampsite/` within a minute or two — check this works before moving to the custom domain.
5. Still on the Pages settings screen, under **Custom domain**, enter `www.naisuyo.co.ke` and save. This writes to the `CNAME` file in the repo (already present at the root of this project, containing exactly `www.naisuyo.co.ke` — don't delete it).

## 3. DNS records — Hostpinnacle (cPanel)

You mentioned your domain is with **Hostpinnacle**. Hostpinnacle uses standard cPanel with a **DNS Zone Editor**, which supports both apex (root) A records and CNAME records directly — no workaround should be needed. Steps:

1. Log into your Hostpinnacle client area → **cPanel** for `naisuyo.co.ke`.
2. Find **Zone Editor** under the Domains section.
3. Add four **A Records** at the root (leave "Name" as the bare domain, or `@`):

   | Type | Name | Value |
   |---|---|---|
   | A | @ (or naisuyo.co.ke) | 185.199.108.153 |
   | A | @ (or naisuyo.co.ke) | 185.199.109.153 |
   | A | @ (or naisuyo.co.ke) | 185.199.110.153 |
   | A | @ (or naisuyo.co.ke) | 185.199.111.153 |

4. Add one **CNAME Record** for the `www` subdomain:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | www | `EdwardSalonikMosieny.github.io.` |

   **The trailing dot on the CNAME target is required, not optional, on this Hostpinnacle cPanel instance.** We hit this directly: entering `EdwardSalonikMosieny.github.io` without the trailing dot caused cPanel to silently treat it as a relative hostname and append the zone's own domain to it, producing the broken value `EdwardSalonikMosieny.github.io.naisuyo.co.ke` — which resolves to nothing and is exactly what triggers GitHub's "Domain's DNS record could not be retrieved (InvalidDNSError)" for the www/alternate name. If you ever have to re-enter this record, always include the trailing dot and verify afterwards with:
   ```bash
   curl -s "https://cloudflare-dns.com/dns-query?name=www.naisuyo.co.ke&type=CNAME" -H "accept: application/dns-json"
   ```
   The `data` field must read exactly `EdwardSalonikMosieny.github.io.` — if anything is appended after `.github.io.`, the record is broken the same way.

5. Remove or don't create any pre-existing "parked domain" A record or default cPanel placeholder page for this domain — it will conflict with the four A records above.

Current public DNS check on 2026-08-29 showed the root `naisuyo.co.ke` pointing to `196.96.239.162`, `41.80.117.102`, and `102.0.5.208`, not GitHub Pages. That is why the naked domain refused or timed out. Replace those root records with the four GitHub Pages A records above if the naked domain must work.

**If the root/apex won't accept four A records** (some simplified control panels only allow one, or block editing the root entry): make `www.naisuyo.co.ke` the canonical host instead. Set only the CNAME for `www` → `EdwardSalonikMosieny.github.io`, then in cPanel's redirect tool (or a `.htaccess` if you have one active outside GitHub Pages) forward the bare apex to `https://www.naisuyo.co.ke`. In that case also update the repository's `CNAME` file to contain `www.naisuyo.co.ke` instead of the apex, and swap the GitHub Pages custom domain setting to match.

DNS propagation for Hostpinnacle is typically **12–24 hours** — don't panic if it's not instant.

## 4. HTTPS

Back in GitHub → Settings → Pages, once DNS has propagated and GitHub has detected the custom domain, an **"Enforce HTTPS"** checkbox will become available. It's greyed out until GitHub finishes issuing a Let's Encrypt certificate for the domain, which can take **up to an hour** after DNS first resolves correctly. Don't force anything — just check back.

## 5. Troubleshooting

**"404" while DNS is still propagating.** Perfectly normal for the first several hours (occasionally up to 24–48h with some registrars). Confirm propagation with:

```bash
dig naisuyo.co.ke +short
dig www.naisuyo.co.ke +short
```

The first should return the four `185.199.10x.153` IPs if the naked domain is configured for GitHub Pages; the second should resolve to `EdwardSalonikMosieny.github.io`. If neither shows up after 24 hours, double-check the Zone Editor entries in cPanel for typos.

**The `CNAME` file gets wiped after a later deploy.** This happens if you ever push a change from a local checkout that doesn't have the `CNAME` file (e.g. you regenerated the repo, or an old branch overwrote main). GitHub Pages reads the custom domain from that file on every deploy, so if it's missing, your custom domain setting silently reverts to blank/GitHub's default. Fix: confirm `CNAME` exists at the repo root and contains exactly `www.naisuyo.co.ke`, commit it, and re-push. It's a plain text file with no extension — easy to lose if a build tool or `.gitignore` change ever excludes it, so if you ever add a `.gitignore`, make sure it doesn't match `CNAME`.

## 6. Other required root files

Already present in this repository and required for correct GitHub Pages behaviour:
- `.nojekyll` — tells GitHub Pages not to run Jekyll processing (which would otherwise ignore files/folders starting with `_` and can interfere with plain static sites).
- `robots.txt`, `sitemap.xml` — for search engines.
- `CNAME` — the custom domain, as above.
