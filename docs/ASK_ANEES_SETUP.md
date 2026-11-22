# Ask Anees: free Cloudflare setup

Run from the portfolio root with Node 22+. Wrangler **4.166.0** is pinned as a development dependency. No local model, embedding library, vector database or paid provider is used.

1. Sign in to a Cloudflare account on **Workers Free**. Leave billing methods, Workers Paid and AI Gateway credits disabled. Both models share **10,000 Neurons/day**, resetting at **00:00 UTC**; capacity and platform limits still apply.
2. If dependencies are missing, run `npm install`, then authenticate:

   ```powershell
   npx --no-install wrangler login
   ```

3. The AI binding is already configured in `workers/ask-anees/wrangler.toml`. Deploy this initially unindexed Worker; its chat fails closed while its internal embedding endpoint can be configured:

   ```powershell
   npx --no-install wrangler deploy --config workers/ask-anees/wrangler.toml
   ```

4. Create two distinct random secrets of 32–256 characters in your password manager. Enter them through Wrangler's prompts:

   ```powershell
   npx --no-install wrangler secret put ASK_ANEES_WORKER_SECRET --config workers/ask-anees/wrangler.toml
   npx --no-install wrangler secret put ASK_ANEES_INDEX_SECRET --config workers/ask-anees/wrangler.toml
   ```

5. Review the allowlisted Markdown in `knowledge/ask-anees/`. Set the deployed Worker origin and index secret **in your shell**. For Windows PowerShell, a hidden prompt keeps the secret out of command history:

   ```powershell
   $env:ASK_ANEES_WORKER_URL = Read-Host 'HTTPS Worker origin (no path)'
   $askIndexSecret = Read-Host 'Index secret' -AsSecureString
   $env:ASK_ANEES_INDEX_SECRET = [Net.NetworkCredential]::new('', $askIndexSecret).Password
   npm run ask-anees:index -- --dry-run
   npm run ask-anees:index
   Remove-Item Env:ASK_ANEES_INDEX_SECRET
   ```

   The command generates real BGE-M3 vectors remotely, discovers their dimensions, validates hashes/metadata/vectors and atomically replaces the small server-only index. An error leaves the previous index intact. Unchanged chunk hashes reuse validated vectors. Chunking uses a UTF-8 token estimate, targeting 400 tokens with 70 overlap within sections; it does not download a model tokenizer. Empty sources warn; missing allowlisted files stop the run.

6. Redeploy the Worker with its generated index:

   ```powershell
   npx --no-install wrangler deploy --config workers/ask-anees/wrangler.toml
   ```

7. Copy `.env.example` to `.env.local` and privately set `ASK_ANEES_WORKER_URL` to that HTTPS origin and `ASK_ANEES_WORKER_SECRET` to the matching shared secret. The index secret is not required by Next.js. Run `npm run dev` and open `http://localhost:3200`.

8. Live smoke test: open Ask Anees and ask “Who is Anees?”, “Tell me about SportLynk”, “Is SportLynk launched?”, then “Which engineering decisions shaped that project?”. Check progressive text, truthful development status and working source links. Ask about CGPA, certificates, private details and tomorrow's weather. Stop a response; close/reopen; retry. Run `npm run test:ask` against a production build for deterministic mock regression checks. Mocks do not verify Gemma's live quality or BGE's actual retrieval calibration.

The portfolio proxies same-origin browser requests to the authenticated Worker. It uses a signed HttpOnly visitor cookie (6 requests/minute, 30/day) and a global 60/minute guard, per Next.js process. Cookies can be cleared and process counters reset; these are best-effort abuse controls, with Cloudflare's account-level free quota as the hard ceiling. Incoming IP headers are ignored. No wildcard CORS, prompt logging, inference key or automatic retry/fallback is configured.

`ASK_ANEES_PLAN=free` records deployment intent; Wrangler cannot select or verify the account's billing plan through this variable. Keep the account on Workers Free in the dashboard. Provider quota, capacity, authentication, paid-required and throttling errors fail closed. The application never changes billing or selects another provider/model.

No account has been authenticated or deployed by this implementation task. The checked-in index is explicitly **unindexed**, with zero vectors. Repeat indexing and redeployment after each owner-approved knowledge change. Fuller biography, academic details, internship tasks, team contributions, certificates, resume and LinkedIn remain owner inputs.
