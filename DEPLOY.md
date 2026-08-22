# Deploying Naisuyo Campsite to GitHub Pages

This site is pure static HTML/CSS/JS — there is no build step. GitHub Pages serves the repository root directly.

## 1. Push the code

Once you've told me the GitHub username and repository name, the commands look like this (replace the placeholders):

```bash
git remote add origin https://github.com/[[GITHUB_USER]]/[[REPO_NAME]].git
git branch -M main
git push -u origin main
```

If the repository doesn't exist yet on GitHub, create it first (empty, no README/license/gitignore) at github.com/new, then run the commands above.

## 2. Turn on GitHub Pages

1. On GitHub, go to the repository → **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Set **Branch** to `main` and folder to `/ (root)`. Save.
4. GitHub will build and serve the site at `https://[[GITHUB_USER]].github.io/[[REPO_NAME]]/` within a minute or two — check this works before moving to the custom domain.
5. Still on the Pages settings screen, under **Custom domain**, enter `naisuyocampsite.co.ke` and save. This writes to the `CNAME` file in the repo (already present at the root of this project, containing exactly `naisuyocampsite.co.ke` — don't delete it).

## 3. DNS records — Hostpinnacle (cPanel)

You mentioned your domain is with **Hostpinnacle**. Hostpinnacle uses standard cPanel with a **DNS Zone Editor**, which supports both apex (root) A records and CNAME records directly — no workaround should be needed. Steps:

1. Log into your Hostpinnacle client area → **cPanel** for `naisuyocampsite.co.ke`.
2. Find **Zone Editor** under the Domains section.
3. Add four **A Records** at the root (leave "Name" as the bare domain, or `@`):

   | Type | Name | Value |
   |---|---|---|
   | A | @ (or naisuyocampsite.co.ke) | 185.199.108.153 |
   | A | @ (or naisuyocampsite.co.ke) | 185.199.109.153 |
   | A | @ (or naisuyocampsite.co.ke) | 185.199.110.153 |
   | A | @ (or naisuyocampsite.co.ke) | 185.199.111.153 |

4. Add one **CNAME Record** for the `www` subdomain:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | www | `[[GITHUB_USER]].github.io.` |

   (Note the trailing dot on the CNAME target — cPanel's zone editor is usually fine with or without it, but include it if the field complains.)

5. Remove or don't create any pre-existing "parked domain" A record or default cPanel placeholder page for this domain — it will conflict with the four A records above.

**If the root/apex won't accept four A records** (some simplified control panels only allow one, or block editing the root entry): make `www.naisuyocampsite.co.ke` the canonical host instead. Set only the CNAME for `www` → `[[GITHUB_USER]].github.io`, then in cPanel's redirect tool (or a `.htaccess` if you have one active outside GitHub Pages) forward the bare apex to `https://www.naisuyocampsite.co.ke`. In that case also update the repository's `CNAME` file to contain `www.naisuyocampsite.co.ke` instead of the apex, and swap the GitHub Pages custom domain setting to match.

DNS propagation for Hostpinnacle is typically **12–24 hours** — don't panic if it's not instant.

## 4. HTTPS

Back in GitHub → Settings → Pages, once DNS has propagated and GitHub has detected the custom domain, an **"Enforce HTTPS"** checkbox will become available. It's greyed out until GitHub finishes issuing a Let's Encrypt certificate for the domain, which can take **up to an hour** after DNS first resolves correctly. Don't force anything — just check back.

## 5. Troubleshooting

**"404" while DNS is still propagating.** Perfectly normal for the first several hours (occasionally up to 24–48h with some registrars). Confirm propagation with:

```bash
dig naisuyocampsite.co.ke +short
dig www.naisuyocampsite.co.ke +short
```

The first should return the four `185.199.10x.153` IPs; the second should resolve to `[[GITHUB_USER]].github.io`. If neither shows up after 24 hours, double-check the Zone Editor entries in cPanel for typos.

**The `CNAME` file gets wiped after a later deploy.** This happens if you ever push a change from a local checkout that doesn't have the `CNAME` file (e.g. you regenerated the repo, or an old branch overwrote main). GitHub Pages reads the custom domain from that file on every deploy, so if it's missing, your custom domain setting silently reverts to blank/GitHub's default. Fix: confirm `CNAME` exists at the repo root and contains exactly `naisuyocampsite.co.ke`, commit it, and re-push. It's a plain text file with no extension — easy to lose if a build tool or `.gitignore` change ever excludes it, so if you ever add a `.gitignore`, make sure it doesn't match `CNAME`.

## 6. Other required root files

Already present in this repository and required for correct GitHub Pages behaviour:
- `.nojekyll` — tells GitHub Pages not to run Jekyll processing (which would otherwise ignore files/folders starting with `_` and can interfere with plain static sites).
- `robots.txt`, `sitemap.xml` — for search engines.
- `CNAME` — the custom domain, as above.
