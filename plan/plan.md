# Seyon IT Solutions — Cinematic 3D Multi-Page Portfolio + Admin

A premium, dark-themed (deep navy / royal blue / cyan), scroll-driven 3D website for
Seyon IT Solutions Pvt Ltd (Coimbatore, Tamil Nadu), now built as a **multi-page app**
with a **full admin area**. Live 3D hero, smooth scrolling, cursor- and scroll-reactive
motion, glassmorphism, and award-agency feel throughout. All content is
**database-driven**, so admin edits appear live on the public site.

## Public pages
1. **Home** — live 3D hero (glowing particle globe + orbiting connected-node network over
   an animated shader gradient), word-by-word headline reveal, scroll indicator that
   zooms/dissolves into the next section; animated stats counters; featured projects;
   services teaser; client/partner logo band; testimonials; and a CTA.
2. **About** — company story, mission / vision / values, an animated milestone timeline,
   "why choose us", a team section, and a Coimbatore location block (map placeholder).
3. **Services** — service cards (government platforms, municipal systems, web apps, mobile
   apps, e-commerce, UI/UX), an animated "our process" step flow, and a tech-stack showcase.
4. **Work / Projects** — filter tabs (All, Government, Healthcare, E-commerce, Mobile Apps),
   search, glassmorphism cards with cursor-following 3D tilt and category-coloured glow,
   staggered scroll-in, plus a desktop draggable rotating **3D carousel ring** toggle.
5. **Project Detail** — its own page per project: name, category, client, full description,
   animated feature tiles with icons, a screenshot gallery placeholder with a 3D
   perspective slider, Next/Previous navigation, and a "Discuss a similar project" button
   that goes to Contact. No external website links shown.
6. **Contact** — animated headline, form (name, organisation, phone, email, message) with a
   glowing magnetic submit button, an FAQ block, and the footer (company name, Coimbatore
   address placeholder, copyright).

Extra polish across public pages: custom glowing cursor, magnetic buttons, animated page
transitions, newsletter sign-up in the footer, and mobile / low-power / reduce-motion
fallbacks (fewer particles, heavy 3D and cursor effects off, plain card grid).

## The 7 projects
All seven from the brief with full details and feature lists: CCMC Dialysis Care
(Healthcare), CCMC Audit (Government), Mathi Products / Magalir Marketplace (E-commerce),
Water Bodies Management System (Government), District CSR Portal (Government), Wooden
Calculator App (Mobile App), Plantation Management App (Mobile App). Seeded into the
database at start; more can be added anytime from the admin.

## Admin area (behind login) — as full-featured as possible
7. **Admin Login** — email + password.
8. **Admin Dashboard** — overview with counts and simple charts (projects by category,
   recent messages, submissions over time), quick links.
- **Projects manager** — add / edit / delete projects, set category, client, tagline,
   description, feature list, thumbnail/gallery placeholders, featured flag, ordering.
- **Services manager** — add / edit / delete services shown on the Services page.
- **Testimonials manager** — add / edit / delete testimonials shown on the site.
- **Stats & company info** — edit the counter numbers and company details (address,
   contact info) that appear on the public site.
- **Messages** — view contact submissions, mark read/unread, delete, and export to CSV.
- **Settings** — change the admin password.

## Claude AI (Anthropic) integration
Powered by the official Anthropic API using **claude-sonnet-5**, via your own
**ANTHROPIC_API_KEY**. Four AI features:
- **Public "Ask Seyon AI" chatbot** — a floating widget on the public site that answers
  visitor questions about the company, services, and projects (grounded in your site's
  project/service data).
- **Contact form assist** — helps a visitor phrase/polish their project enquiry before
  sending.
- **Admin AI project writer** — generates or polishes project descriptions, taglines, and
  feature lists while adding/editing a project.
- **Admin smart message replies** — summarises a contact submission and drafts a suggested
  reply the admin can copy/edit.

All Claude calls run server-side only; the API key is never exposed to the browser.
**I'll need your ANTHROPIC_API_KEY before building the AI features** (the rest of the site
can be built first without it).

## Decisions made for you (push back if any are wrong)
- **Admin login**: simple email + password stored in the database (no third-party
  sign-in). Default seeded credentials: **admin@seyonit.com** / **Seyon@2025** — change the
  password from Admin - Settings after first login.
- **Contact submissions**: stored in the database and viewable/exportable in the admin.
  **No email/SMS delivery** (that needs a paid service + key). Tell me if you want emailing.
- **Placeholder stats** (editable in admin): Projects Delivered 40+, Government Clients 12,
  Districts Served 8, Mobile Apps 15.
- **Thumbnails & galleries** use styled placeholders (no real screenshots yet); you can add
  real images later.
- **Fonts**: bold display font for headings + Inter for body.
- Everything public reads from the database so admin edits show live.

## Not included
- Real project screenshots (you add later), multi-language content, email/SMS notifications,
  public user accounts, payments, and any external website links in project details.
