---
name: "COPPER ATELIER"
description: "Premium editorial composition, technical craftsmanship, original art, and mature restraint."
colors:
  alabaster: "#F4F0E8"
  graphite: "#252421"
  copper: "#A85D3F"
  antique-gold: "#C29A55"
  dusty-clay: "#D7B9A5"
  espresso: "#302B27"
  linen: "#E7E0D5"
  mushroom: "#746D64"
  copper-readable: "#A2573A"
  mushroom-readable: "#716A61"
  image-outline: "rgb(0 0 0 / 10%)"
typography:
  display:
    fontFamily: "Instrument Serif, serif"
    fontSize: "clamp(3.15rem, 5.6vw, 5.25rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Instrument Serif, serif"
    fontSize: "clamp(2.75rem, 4.4vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  subheading:
    fontFamily: "Instrument Serif, serif"
    fontSize: "clamp(2rem, 3vw, 2.8rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 500
    lineHeight: 1.65
    letterSpacing: "-0.04em"
  lead:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "clamp(1.2rem, 1.6vw, 1.4rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  small:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.65
  caption:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.65
  metadata:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  control: "0.25rem"
  media: "0.75rem"
  round: "50%"
spacing:
  space-1: "0.25rem"
  space-2: "0.5rem"
  space-3: "0.75rem"
  space-4: "1rem"
  space-5: "1.5rem"
  space-6: "2rem"
  space-7: "3rem"
  space-8: "4rem"
  space-9: "6rem"
  space-10: "8rem"
  page-gutter: "clamp(1.25rem, 5vw, 5rem)"
  section-space: "clamp(4rem, 7.5vw, 7rem)"
components:
  button-primary:
    backgroundColor: "{colors.copper-readable}"
    textColor: "{colors.alabaster}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.8rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.alabaster}"
  button-text:
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0.8rem 0"
  text-link:
    textColor: "{colors.graphite}"
    typography: "{typography.label}"
  text-link-inverse:
    textColor: "{colors.alabaster}"
    typography: "{typography.label}"
  navigation:
    backgroundColor: "{colors.alabaster}"
    textColor: "{colors.graphite}"
    typography: "{typography.small}"
  navigation-active:
    textColor: "{colors.copper-readable}"
  mobile-navigation:
    backgroundColor: "{colors.alabaster}"
    textColor: "{colors.graphite}"
    padding: "1rem clamp(1.25rem, 5vw, 5rem) 1.5rem"
  ask-link:
    textColor: "{colors.graphite}"
    typography: "{typography.small}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
  product-focus-tag:
    backgroundColor: "{colors.linen}"
    textColor: "{colors.espresso}"
    typography: "{typography.caption}"
    rounded: "{rounded.control}"
    padding: "0.3rem 0.7rem"
  planned-badge:
    textColor: "{colors.dusty-clay}"
    typography: "{typography.caption}"
    rounded: "{rounded.control}"
    padding: "0.15rem 0.4rem"
  project-media:
    backgroundColor: "{colors.linen}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.media}"
    padding: "1.2rem 1.4rem 2.4rem"
    height: "340px"
  project-media-subtle:
    backgroundColor: "{colors.dusty-clay}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.media}"
  concept-media:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.alabaster}"
    rounded: "{rounded.media}"
    padding: "2rem"
  atelier-study:
    backgroundColor: "{colors.linen}"
    textColor: "{colors.espresso}"
    padding: "1.5rem 0 2rem"
  contact-orbit:
    textColor: "{colors.alabaster}"
    typography: "{typography.small}"
    rounded: "{rounded.round}"
    width: "140px"
    height: "140px"
  ask-preview:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.alabaster}"
    padding: "2rem 0"
---

# Design System: COPPER ATELIER

## Overview

**Creative North Star: "COPPER ATELIER"**

COPPER ATELIER expresses premium editorial composition and technical craftsmanship through warm paper tones, precise geometric art, and mature restraint. Expressive serif statements sit within generous whitespace; DM Sans carries practical reading and navigation, while IBM Plex Mono identifies technology.

Original art and authentic project evidence provide visual character. Flat surfaces, quiet rules, and restrained Motion keep the interface deliberate. This document records the implemented Phase 1 system; the current abstract portrait study, introductory sections, and planned Ask Anees note retain their stated scope.

**Key Characteristics:**

- Warm Alabaster, Graphite, and Copper, with restrained supporting tones.
- Instrument Serif display, DM Sans interface, and IBM Plex Mono technology metadata.
- Editorial whitespace, flat surfaces, and precise geometric artwork.
- Native navigation, visible focus, and content available without JavaScript.
- Brief transform and opacity motion that respects the visitor's preferences.

The frontmatter is the machine-readable extraction; [app/tokens.css](app/tokens.css) remains the implementation authority. [app/portfolio.css](app/portfolio.css) supplies component and responsive styles; [app/globals.css](app/globals.css) imports the shared system and Tailwind CSS 4; [app/layout.tsx](app/layout.tsx) loads the fonts through `next/font`. The source artifact is [app/page.tsx](app/page.tsx), composed from [components/portfolio](components/portfolio/).

Approved direction and supporting evidence: [PRODUCT.md](PRODUCT.md), [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md), [docs/HOMEPAGE_BRIEF.md](docs/HOMEPAGE_BRIEF.md), and the [homepage surface contract](.impeccable/surfaces/app-page-tsx.md). The supplied [desktop](.impeccable/review/desktop.png) and [mobile](.impeccable/review/mobile.png) captures were inspected while extracting this record. Verification results and limits belong to [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md).

## Colors

The palette combines warm paper, deep charcoal, and earthen copper; Gold appears in small geometric details and focus on dark surfaces.

### Primary

- **Copper:** the original brand accent for geometric artwork and focus outlines on light surfaces.
- **Copper Readable:** the accessible derivative used for small accent text, the wordmark, filled primary actions, active navigation, and status dots.

### Secondary

- **Antique Gold:** small artwork highlights and the focus outline within the dark contact section. It is a supporting detail, not a normal-text color on Alabaster.

### Neutral

- **Alabaster:** the page and header background; inverse text and primary-action text.
- **Graphite:** primary prose, headings, and default navigation text.
- **Dusty Clay:** the secondary artwork disc, Sukoon preview surface, and supporting text on Espresso.
- **Espresso:** contact and SportLynk concept backgrounds, text on tinted surfaces, and primary-action hover fill.
- **Linen:** project media and portrait-study surfaces; subtle separators on the page.
- **Mushroom:** stronger outlines and rules; the original supporting neutral remains intact.
- **Mushroom Readable:** accessible supporting prose and captions on the page.
- **Image Outline:** a neutral translucent edge for authentic application screenshots; it is a utility color, not a brand primitive.

Components use semantic CSS roles, including `--color-bg-page`, `--color-bg-surface`, `--color-bg-inverse`, `--color-text-primary`, `--color-text-secondary`, and `--color-accent-solid`. Tailwind's inline theme points to these same variables. Primitive references in the frontmatter describe their resolved roles; they do not authorize hard-coded literals in components.

**The Approved Palette Rule.** Preserve all eight exact approved primitives. Use the documented readable derivatives for their assigned text and action roles; never alter a primitive to conceal a contrast failure.

The existing WCAG sRGB measurements are recorded in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md): original Copper against Alabaster is 4.29:1 and original Mushroom against Alabaster is 4.49:1. Their readable derivatives reach 4.66:1 and 4.69:1 respectively by lowering OKLab lightness while retaining a/b before sRGB conversion. Graphite against Alabaster is 13.66:1; Alabaster against Espresso is 12.31:1. Authentic project screenshots retain their product colors as documentary content, with provenance in [docs/CONTENT_SOURCES.md](docs/CONTENT_SOURCES.md).

**The Panel Metadata Rule.** Tonal ramps in .impeccable/design.json are synthesized display metadata only. They are not approved brand colors, production CSS tokens, or implementation guidance.

## Typography

**Display Font:** Instrument Serif, with a generic serif fallback; normal and italic at weight 400.

**Body Font:** DM Sans, with a generic sans-serif fallback; variable weights supply body, navigation, and project titles.

**Technology Font:** IBM Plex Mono, with a generic monospace fallback; weight 400.

The serif contributes editorial character while the sans-serif keeps longer reading direct. Italic display phrases receive selective accent color. The hierarchy is deliberately fluid rather than a single fixed modular ratio.

### Hierarchy

- **Display:** the hero headline uses the extracted display role, a short measure of 13.5ch, and balanced wrapping. Its responsive sizes are documented below.
- **Headline:** section headings use the headline role. About and Contact have observed surface-specific fluid sizes rather than new global type tokens.
- **Subheading:** engineering statements use the subheading role. The featured-project statement shares the size token with a tighter line height (1.12) and tracking (-0.01em).
- **Title:** public project names use the DM Sans title role; featured-project naming is smaller on desktop (1.3rem, weight 550).
- **Lead:** introductory About copy uses the lead role with a comfortable line height.
- **Body and small:** ordinary prose uses body; descriptions and compact interface text use small. The hero introduction uses a line height of 1.75 and a 52ch maximum measure; About body copy reaches 60ch.
- **Label and caption:** action labels use medium-weight DM Sans. Captions, factual status, and compact metadata use the caption size. Small uppercase inscriptions inside the artwork are decorative, not a general label pattern.
- **Metadata:** project technology lists use the mono role, wrap naturally, and remain visually distinct from ordinary prose.

At widths below 64rem, the hero uses `clamp(3rem, 6.2vw, 4rem)`; below 48rem it uses `clamp(3.2rem, 9.5vw, 4.6rem)`; at 22rem and below it uses 3rem. Mobile introductory prose is 0.9375rem. Essential text wraps instead of truncating; heading balance, pretty paragraph wrapping, and overflow wrapping protect narrow or enlarged layouts.

**The Type with Purpose Rule.** Use Instrument Serif for display statements, DM Sans for prose and interface labels, and IBM Plex Mono for actual technology metadata.

## Layout

The shared shell centers content within 80rem and subtracts two fluid page gutters from the viewport. Logical inline and block properties carry most spacing and alignment. The ten-step spacing scale ranges from a small detail gap to large editorial separation; section padding follows the fluid section-space token.

The observed homepage uses an asymmetric hero (1.18fr / 1fr), a featured project (1.28fr / 1fr), a three-column public-project row, and paired About/Engineering columns. The ratios are evidence of this homepage's composition, not mandatory templates for future surfaces. The solid sticky header and scroll padding preserve anchor destinations.

| Implemented condition | Current behavior |
| --- | --- |
| Up to 79.99rem | Hero and introductory-section gaps tighten; the Ask Anees note becomes two columns. |
| Up to 63.99rem | The header is 5rem tall; native mobile disclosure replaces desktop navigation. Hero and feature ratios tighten; project thumbnails become smaller. |
| Up to 47.99rem | The header is 4.5rem tall; page gutters are 24px. Hero, selected work, About, Engineering, and the Ask Anees note become one column. The separate header Ask Anees link moves into the disclosure. |
| Up to 22rem | Page gutters become 18px; action spacing, display sizes, and the engineering definition list adapt to the narrowest layout. |
| From 64rem in navigation enhancement | Any open mobile disclosure closes as desktop navigation returns. |

The declared CSS queries retain their exact rem values; the 64rem JavaScript media query lives in [site-header.tsx](components/portfolio/site-header.tsx). Default desktop header height is 6rem. Mobile preserves document reading order and allows action rows, tags, metadata, and footer links to wrap. The target verification widths are 320, 375, 390, 414, 768, 1024, 1280, 1440, and 1920px; the test and device limitations remain in the project status.

## Elevation & Depth

The implemented system has no decorative shadows, gradients, glass, or blur. Depth comes from flat tonal fields, editorial overlap in the abstract study, fine rules, and the scale relationship between type and artwork. The sticky header stays opaque. Authentic screenshot edges use the existing neutral outline rather than a decorative shadow.

**The Flat Surfaces Rule.** Establish hierarchy with spacing, type, tonal surfaces, and fine borders; do not add decorative elevation.

## Shapes

Controls and static tags have restrained corners using the control radius. Project media use the media radius; screenshot crops have the observed top corners (10px 10px 0 0). Circular motifs use the round radius: small status dots, repository-arrow surrounds, the portrait-study seal, the journey symbol, and the contact action. The artwork panel itself stays rectangular.

Fine geometric paths, arch and disc forms, and an original MA monogram provide identity. The monogram uses square line caps and miter joins. Lucide arrows and message icons use explicit thin strokes and native SVG shapes. The abstract study and labeled sports court remain flat authored vector geometry.

## Components

### Primary and secondary actions

Refined, direct link actions use the shared control shape and medium DM Sans label. The primary action has an accessible Copper fill and Alabaster text, a 52px minimum block size, and a small arrow separated by the normal action gap. The text variant keeps the same action rhythm, removes horizontal padding, and uses an underline with a 0.4em offset.

On a fine hover-capable pointer, the primary fill becomes Espresso and the text variant becomes accessible Copper. The shared focus outline is 2px with a 5px offset. With no reduced-motion preference, pointer press scales the primary link to 0.96 over 150ms and release uses 100ms; keyboard focus suppresses the press transform. At the narrowest breakpoint, labels and primary horizontal padding shrink, while the secondary action keeps a 44px minimum block size. Source: [hero.tsx](components/portfolio/hero.tsx).

### Text links

Underlined text and a northeast arrow share a flexible gap and a minimum 44px block size. The text can wrap without losing the arrow or destination. Light-surface hover uses accessible Copper; contact links retain inverse text and Dusty Clay underline/hover treatment. These are anchors, including repository and email destinations. Source: [text-link.tsx](components/portfolio/text-link.tsx).

### Navigation

The solid header combines the original MA monogram, Anees wordmark, five section anchors, and an outlined Ask Anees entry. Desktop anchor targets are at least 44px tall. Active location uses accessible Copper plus an underline; hover reveals the same underline on a fine pointer.

The mobile menu is a native `details`/`summary` disclosure with a solid, scrollable panel and 52px anchor rows. It works without JavaScript. The client enhancement updates current location, closes on Escape with summary focus restoration, closes on outside interaction, and focuses anchor destinations. Keyboard menu changes are immediate. Source: [site-header.tsx](components/portfolio/site-header.tsx).

### Project previews and static labels

Project cards use an image surface above open editorial copy, rather than a border around every item. Their default media dimensions and padding are extracted in the frontmatter; tablet media are 280px high and mobile media are 330px high. Public-project images are authentic screenshots with a caption and repository destination. On an eligible pointer, hover underlines the category, tints the repository-arrow surround, and translates the screenshot upward by 4px over 150ms.

The featured SportLynk surface uses Espresso, Alabaster, Dusty Clay linework, and a small Gold ball. Its visible and accessible labels identify a concept illustration. Minimum desktop media height is 440px, tablet 410px, and mobile 330px. The two product-focus tags are noninteractive Linen labels with Espresso text; they have no selected or filter state. Source: [selected-work.tsx](components/portfolio/selected-work.tsx).

### Atelier study

A precise rectangular artwork field contains the arch, offset disc, baseline, fine construction marks, and a small circular MA seal. The semantic figure caption explicitly describes an abstract study awaiting a portrait. Decorative geometry is hidden from assistive technology. This records the present placeholder; it does not define a likeness or character system. Source: [atelier-study.tsx](components/portfolio/atelier-study.tsx).

### Contact and planned Ask Anees note

The dark contact section uses Alabaster headlines, Dusty Clay supporting copy, Mushroom rules, and a Gold focus outline. The circular email action scales from 140px to 58px on mobile and 44px at the narrowest breakpoint; its text label gives way to an accessible icon-only presentation. The email address wraps when necessary.

Ask Anees is a bordered editorial row with a static Coming soon badge and a working email link. Its badge is not an interactive chip. There are no implemented text fields, chat controls, or contact forms in this system. Source: [contact.tsx](components/portfolio/contact.tsx).

### Motion behavior

Motion for React receives server-rendered children. Hero groups enter once with a 12px vertical translation and opacity over 600ms, staggered by 80ms; project media reveal on intersection. Both read the shared CSS easing (`cubic-bezier(0.23, 1, 0.32, 1)`) and timing tokens rather than define a separate system.

Reduced motion uses a 200ms opacity-only transition with no stagger. Preference changes stop existing animations and clear inline transform/opacity before the effect restarts. CSS hover movement also requires a fine hover-capable pointer and no reduced-motion preference. No essential content depends on a hidden CSS base state, hydration, or motion to appear. Source: [motion.tsx](components/portfolio/motion.tsx) and [app/portfolio.css](app/portfolio.css).

## Do's and Don'ts

### Do:

- Do preserve the eight approved primitives and use semantic roles with the documented readability derivatives.
- Do use Instrument Serif for display, DM Sans for reading and navigation, and IBM Plex Mono for technology metadata.
- Do build hierarchy with editorial whitespace, flat tonal surfaces, fine rules, and precise geometric art.
- Do preserve authentic project screenshots and clearly label concept illustrations and planned features.
- Do keep navigation native, focus visible, content available without JavaScript, and motion responsive to preference changes.

### Don't:

- Don't add new brand colors, decorative gradients, neon, glow, particles, or random stock imagery.
- Don't replace the approved color primitives to make a failing text-contrast pair appear compliant.
- Don't treat synthesized panel tonal ramps as production tokens or approved palette additions.
- Don't hide important content behind hover, animation, or client hydration.
- Don't add loops, parallax, magnetic controls, custom cursors, or layout-triggering animation to Phase 1.
- Don't present the abstract placeholder as a portrait or imply that AI chat, detailed case studies, or later-phase sections are implemented.
