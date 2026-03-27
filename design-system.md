# PromptVault Design System
# Place this file in ~/promptvault/design-system.md
# OpenCode reads this before every UI task.

## Identity
PromptVault is a **Git-for-prompts SaaS** — version control for AI prompts.
Target users: developers, AI engineers, indie builders.
Aesthetic: **dark premium** — Linear, Vercel, Raycast energy.
This is a developer tool. It should feel like one.

---

## Color Tokens

Add to frontend/src/app/globals.css:

```css
:root {
  /* Backgrounds */
  --bg-base:        #09090B;   /* page — true near-black */
  --bg-surface:     #0F0F12;   /* cards, panels */
  --bg-elevated:    #18181C;   /* modals, dropdowns */
  --bg-subtle:      #1F1F26;   /* inputs, code blocks */
  --bg-hover:       #242429;   /* hover state surfaces */

  /* Borders */
  --border-default: #27272A;   /* standard border — zinc-800 */
  --border-strong:  #3F3F46;   /* active, focused — zinc-700 */
  --border-glow:    rgba(245, 158, 11, 0.25);

  /* Amber Accent */
  --accent:         #F59E0B;   /* primary amber */
  --accent-hover:   #FBBF24;   /* hover */
  --accent-muted:   rgba(245, 158, 11, 0.12);
  --accent-glow:    0 0 24px rgba(245, 158, 11, 0.2);

  /* Text */
  --text-primary:   #FAFAFA;   /* zinc-50 */
  --text-secondary: #A1A1AA;   /* zinc-400 */
  --text-muted:     #52525B;   /* zinc-600 */
  --text-accent:    #F59E0B;

  /* Semantic */
  --success:  #10B981;
  --error:    #EF4444;
  --warning:  #F59E0B;
  --info:     #6366F1;

  /* Shadcn overrides — wire to our tokens */
  --background:    var(--bg-base);
  --foreground:    var(--text-primary);
  --card:          var(--bg-surface);
  --card-foreground: var(--text-primary);
  --border:        var(--border-default);
  --input:         var(--bg-subtle);
  --primary:       var(--accent);
  --primary-foreground: #09090B;
  --muted:         var(--bg-subtle);
  --muted-foreground: var(--text-secondary);
  --ring:          var(--accent);
}
```

---

## Typography

```
Display/Headings: "Geist" (Next.js native, already installed via Vercel)
Body:             "Geist" regular weight
Mono/Code:        "Geist Mono" — for ALL prompt content, version hashes, tags
```

Import in layout.tsx:
```tsx
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
```

Scale:
```
text-xs   11px  → badges, timestamps, meta
text-sm   13px  → secondary labels, nav, table cells
text-base 15px  → body
text-lg   18px  → subheadings
text-xl   20px  → section titles
text-2xl  24px  → page titles
text-3xl  30px  → hero text
text-4xl  36px  → landing display
```

Rules:
- Headings: `font-semibold tracking-tight`
- Prompt content/code: ALWAYS `font-mono` — never sans-serif
- Version hashes: `font-mono text-xs text-muted`
- Never use Inter, Roboto, or system-ui

---

## Spacing
Base: 4px. Always multiples.
```
gap-1  4px   → icon gaps
gap-2  8px   → tight inline
gap-3  12px  → small component padding
gap-4  16px  → standard
gap-6  24px  → card padding
gap-8  32px  → between components
gap-12 48px  → section padding
gap-16 64px  → page section breaks
```

---

## Component Specs

### Cards
```tsx
// Standard card — use shadcn Card with overrides
className="bg-[var(--bg-surface)] border border-[var(--border-default)] 
           rounded-lg p-6 
           hover:border-[var(--border-strong)] 
           hover:shadow-[var(--accent-glow)]
           transition-all duration-200"
```

### Buttons
```tsx
// Primary — amber
className="bg-[var(--accent)] text-[#09090B] font-medium text-sm
           px-4 py-2 rounded-md
           hover:bg-[var(--accent-hover)] 
           hover:shadow-[0_0_16px_rgba(245,158,11,0.4)]
           transition-all duration-150"

// Ghost
className="border border-[var(--border-default)] text-[var(--text-secondary)]
           hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]
           hover:bg-[var(--bg-elevated)]
           px-4 py-2 rounded-md text-sm transition-all duration-150"

// Destructive  
className="border border-red-900/50 text-red-400
           hover:bg-red-950/30 hover:border-red-700
           px-4 py-2 rounded-md text-sm transition-all duration-150"
```

### Inputs
```tsx
className="bg-[var(--bg-subtle)] border border-[var(--border-default)]
           text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
           rounded-md px-3 py-2 text-sm font-mono
           focus:outline-none focus:border-[var(--accent)] 
           focus:ring-2 focus:ring-[var(--accent-muted)]
           transition-all duration-150"
```

### Code/Prompt Blocks
```tsx
// The most important component in PromptVault
className="bg-[var(--bg-subtle)] border border-[var(--border-default)]
           rounded-md p-4 font-mono text-sm text-[var(--text-primary)]
           leading-relaxed overflow-x-auto
           border-l-2 border-l-[var(--accent)]"
```

### Version Badge (like git commit hash)
```tsx
className="font-mono text-xs bg-[var(--accent-muted)] 
           text-[var(--accent)] border border-[var(--border-glow)]
           px-2 py-0.5 rounded"
// Example: v3 · a1b2c3d
```

### Sidebar Nav
```tsx
// Container
className="w-60 bg-[var(--bg-surface)] border-r border-[var(--border-default)] h-screen"

// Nav item default
className="flex items-center gap-3 px-3 py-2 rounded-md text-sm
           text-[var(--text-secondary)] hover:text-[var(--text-primary)]
           hover:bg-[var(--bg-hover)] transition-all duration-150"

// Active
className="flex items-center gap-3 px-3 py-2 rounded-md text-sm
           text-[var(--accent)] bg-[var(--accent-muted)]
           border-l-2 border-[var(--accent)] font-medium"
```

---

## Layout
- Max width: `1200px` centered
- Sidebar + main: `240px | 1fr`
- App shell: sidebar left, topbar, main content area
- Dashboard grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Left-aligned layouts — no centered hero columns in the app

---

## Background Texture
Apply to body in globals.css:
```css
body {
  background-color: var(--bg-base);
  background-image: 
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,158,11,0.06), transparent);
}
```
Subtle amber radial glow at top of page — barely visible, adds depth.

---

## Motion
```css
/* Standard */
transition-all duration-200 ease-in-out

/* Hover lift */
hover:-translate-y-px

/* Page load stagger — apply via Tailwind animate or framer-motion */
initial: { opacity: 0, y: 6 }
animate: { opacity: 1, y: 0 }
transition: { delay: index * 0.05 }
```
Rules: 150–200ms only. No bounce. No spring. Developer tool = professional feel.

---

## BANNED — Never in PromptVault
```
Fonts:    Inter, system-ui, Roboto, Space Grotesk
Colors:   indigo/violet/blue as primary, white backgrounds, gray-900 bg
Radius:   rounded-2xl or rounded-full on cards
Shadows:  large diffuse box-shadows
Patterns: centered hero with gradient blob
          identical card grid with shadow-lg
          indigo CTA button
          emoji as nav icons (use lucide-react only)
```

---

## PromptVault UI Checklist
- [ ] Background is #09090B — not gray-900 or zinc-900
- [ ] Accent is amber #F59E0B — not indigo or violet
- [ ] Font is Geist / Geist Mono — not Inter
- [ ] Prompt content always in font-mono
- [ ] Version hashes always in font-mono text-xs
- [ ] Card radius is rounded-lg (8px) — not rounded-2xl
- [ ] Hover shows amber glow on interactive cards
- [ ] Icons from lucide-react only — no emoji in nav
- [ ] Subtle amber radial gradient on body bg
- [ ] All colors reference CSS variables — no hardcoded hex inline
