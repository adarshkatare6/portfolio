# Implementation Plan - Developer Portfolio Website

We will build a premium, dark-themed developer portfolio for Adarsh Katare, based on the details extracted from their PDF resume (`ada_res5.4.pdf`) and the visual requirements provided.

## Design System & Themes

- **Background**: Pure black `#0a0a0a` with sub-sections in slightly lighter dark shades (`#0f0f0f` to `#141414`) for section definition.
- **Accent Color**: Electric blue `#3b82f6` as the main interactive accent, accompanied by a bright neon cyan `#06b6d4` for modern gradients and glowing borders.
- **Fonts**: 
  - Header & Titles: `Space Grotesk` (sans-serif, highly technical and modern).
  - Body & Details: `Inter` (clean, highly readable).
- **Icons**: Lucide Icons loaded via CDN for consistent, lightweight, and sharp rendering.
- **Micro-animations**: Smooth hover transitions, interactive card shifting, glowing border animations, and scroll-reveals.

---

## Proposed Changes

We will create a clean, modern three-file structure in the root of the project:
1. `index.html` (Semantic structure, SEO metadata, icons, and layout)
2. `style.css` (Premium design system, layouts, custom scrollbars, waves, fanning cards, and animations)
3. `script.js` (Dynamic logic, wave SVG manipulation, scroll animations, and page interactions)

### Portfolio Files

#### [NEW] [index.html](file:///d:/Desktop/adarsh_code/portfolio/index.html)
- Main HTML structure.
- **Header/Navbar**: Centered floating pill with active states, icons only (Home, About, Projects, Experience, Skills, Contact/Email, LinkedIn, GitHub), and a light/dark theme toggle icon (defaulting to dark mode, theme switchable).
- **Hero Section**:
  - All-caps title: "ML ENGINEER & FULL-STACK DEV"
  - Sub-tagline: "Building intelligent systems and scalable applications."
  - Stats: `3+ Internships`, `10+ Projects`, `IIIT Bhopal, ECE '27` (with stat counter animations).
  - Fast-link taglines (italic tags linking to projects and experience sections).
  - Glowing animated badge: "Learning. Building. Improving."
  - Right-hand side: abstract digital circuit / ML neural net visual generated with CSS/SVG.
- **Projects Section**:
  - Title: "RECENT PROJECTS"
  - Fanned/rotated UNO card layout with 4 cards:
    1. **HealthifyAI**: (Mistral-7B, Flask, React, MongoDB, JWT)
    2. **SHL Assessment Recommender**: (FastAPI, Gemini Flash, FAISS, conversational agent)
    3. **Skin Cancer Detection**: (PyTorch, CNNs, dermatology ML model)
    4. **Sign Language AI**: (OpenCV, TensorFlow, CNN-LSTM)
  - Cards feature colored top-left corner accents (Red, Blue, Green, Yellow UNO theme), hover animation to lift and rotate cards upright, lists of details, and clickable GitHub / Live Demo links.
- **Experience Section**:
  - Title: "EXPERIENCE"
  - Interactive scroll timeline with an SVG path that animates like a fluid wave (water rippling) as you scroll down.
  - Alternating cards for IIT BHU Research, HYPWEB solutions, and SPARK Club Lead.
- **Skills & Achievements Section**:
  - Interactive grid displaying core technical skills with custom SVG card hover glow.
  - Achievements grid summarizing SIH Runner-up, Leetcode Knight, Codechef 3-Star, Codeforces Specialist.
- **Contact Section**:
  - Sleek contact form alongside direct links to social profiles.

#### [NEW] [style.css](file:///d:/Desktop/adarsh_code/portfolio/style.css)
- Imports `Inter` and `Space Grotesk` fonts.
- Styling tokens for background, border-glows, text weights, and transitions.
- Floating pill navbar styles (frosted-glass backdrop filter, border-glow).
- Hero grids, keyframes for stat counts, glowing text pills.
- **UNO Card Deck Styling**:
  - Relative container mapping cards to overlapping positions with specific rotations (`rotate(-6deg)`, `rotate(-2deg)`, `rotate(2deg)`, `rotate(6deg)`).
  - Hover states that translate cards up, scale them, and set rotation to `0deg`, layering them above other cards using `z-index`.
- **Wavy Timeline Styling**:
  - Wavy timeline container with an absolute-positioned canvas or SVG that traces a bezier path down the center.
  - IntersectionObserver classes to toggle node glows and fade-ins.
- Responsive media queries for seamless mobile layout (mobile shifts cards into static grids and stacks the timeline).

#### [NEW] [script.js](file:///d:/Desktop/adarsh_code/portfolio/script.js)
- Smooth scroll navigation for the floating navbar links.
- Active state updates on scroll using a `ScrollSpy` script.
- Theme toggler functionality (switches light/dark themes by toggling variables on `:root` and swapping icons).
- Animated counters for Hero stats (counting up from 0 when the page loads).
- **Water Wave Timeline Animation**:
  - Draws and animates an SVG path running through the experience milestones.
  - Triggers a stroke-dashoffset animation based on window scroll to fill the wave line as the user reads down.
- Scroll reveal animations for sections using `IntersectionObserver`.

---

## Verification Plan

### Manual Verification
1. Open `index.html` in the browser.
2. Verify floating navbar visibility, hover effects on icons, active highlights, and smooth scroll anchors.
3. Test theme toggle (swapping between a dark `#0a0a0a` mode and a modern clean light mode).
4. Verify the UNO projects deck: cards should overlap slightly and rotate outwards; hovering over any card should lift it, straighten it (`rotate(0)`), and bring it to the foreground.
5. Scroll down to the Experience section and watch the SVG wave line fill/animate as you scroll.
6. Verify responsive views by checking mobile layout sizing.
