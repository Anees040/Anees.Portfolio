# Editing approved knowledge

Only the 13 Markdown files explicitly listed in `lib/ask-anees/sources.ts` are read. This README is not indexed. Source content is adapted from approved `lib/profile-content.ts`, `lib/case-studies.ts`, `lib/portfolio-content.ts` and the owner's Phase 6 factual boundaries. No repository crawl occurs.

Edit the relevant file after approving the information for public use. Keep implemented/planned, personal/team and verified/unavailable distinctions explicit. Never paste secrets, private notes, unapproved CV details or conversations here. A new category needs a registered source and an explicit allowlist entry.

Run `npm run ask-anees:index -- --dry-run` to inspect chunk counts without inference. After configuring the internal endpoint, run `npm run ask-anees:index`, then redeploy the Worker. Unchanged chunk hashes reuse validated real embeddings. Editing source text does not update the live Worker until this process succeeds.

Awaiting owner input: fuller biography; academic dates/results/coursework; actual internship tasks; detailed project/team contributions and outcomes; certificates and verification links; approved resume/LinkedIn. Missing fields stay unavailable rather than becoming invented filler.
