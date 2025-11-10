# Design Guidelines: Johnnie Walker DJ Awards Voting Platform

## Design Approach

**Reference-Based with Neobrutalist Fusion**
Primary inspiration: Johnnie Walker's premium brand identity merged with neobrutalist aesthetics and electronic music culture. Drawing from:
- Johnnie Walker's sophisticated, angular logo and typography
- Neobrutalism's raw, unapologetic boldness (thick borders, stark contrasts, geometric brutality)
- Electronic music event aesthetics (Tomorrowland, Ultra)

## Core Design Principles

1. **Premium Brutality**: Luxury brand meets raw, unpolished design
2. **Bold Geometry**: Angular shapes echoing the Striding Man and neobrutalist forms
3. **High Impact Contrast**: No subtlety - every element commands attention
4. **Confident Typography**: Large, heavy, unmistakably bold

## Typography System

**Headings**: Ultra-bold sans-serif (900 weight), all-caps for main headlines
- Hero title: 4xl to 6xl on desktop, massive scale
- Category headers: 3xl to 4xl, thick and commanding
- Section titles: 2xl to 3xl

**Body Text**: Bold sans-serif (700 weight) for all body copy - neobrutalism demands weight
- Form labels: Base to lg, uppercase
- Descriptions: Base to lg, regular to semibold contrast
- Buttons: Lg to xl, uppercase, heavy weight

**Accent Typography**: Italicized bold for award category names, creating dynamic energy

## Layout System

**Spacing Primitives**: Tailwind units of 4, 8, 12, 16, 24
- Tight spacing (p-4, gap-4) for compact category cards
- Medium spacing (p-8, my-12) for section breathing room
- Large spacing (py-16, py-24) between major sections

**Grid Strategy**:
- Hero: Full-width with offset geometric elements
- Categories: 2-column grid on tablet, 3-column on desktop with thick borders
- Form: Single column, max-w-2xl, brutalist input styling

## Page Structure

### Hero Section (80vh)
Aggressive, angular hero with diagonal geometric overlays:
- Massive headline: "JOHNNIE WALKER DJ AWARDS 2024"
- Subheading with year and voting period
- Geometric accent shapes (triangles, thick lines) creating depth
- Bold CTA button with thick border (6px+)
- Background: Large hero image of DJ performing with dramatic lighting, overlaid with semi-transparent geometric shapes

### Category Voting Grid
Brutalist card grid showcasing DJ categories:
- Each card: Thick 4-6px border, sharp corners (no rounding)
- Card structure: Category name, artist dropdown/radio selection, artist images in grid
- 8-12 categories total (House, Techno, Progressive, Melodic Techno, Bass, Trance, Newcomer, DJ of the Year, Best Live Set, etc.)
- Hover state: Border thickness increase or offset shadow effect
- Selected state: Bold visual change (inverted treatment)

### Voter Registration Form
Centered, brutalist form section:
- Thick bordered form container with offset shadow
- Input fields with heavy borders (3-4px), sharp corners
- Labels: Uppercase, bold, positioned above inputs
- Fields: Nombre, RUT, Correo Electrónico, Teléfono
- Large submit button with maximum visual weight
- Form validation messages in bold, high-contrast

### Vote Summary Section
Before submission, display selected choices:
- Brutalist table/list with thick dividers
- Category + Selected Artist pairs
- Edit capability for each selection
- Confirmation checkbox with thick border

### Footer
Compact brutalist footer:
- Johnnie Walker branding and legal text
- Thick top border separator
- Social media links with bold icons
- "Keep Walking" tagline in italic bold

## Component Library

### Buttons
- Primary CTA: Thick 4-6px border, bold uppercase text, large padding (px-12 py-6)
- Secondary: Same structure, visual hierarchy through positioning
- No rounded corners, pure geometric forms
- Active state: Slight offset or border color change

### Cards (Category Selection)
- 4-6px solid border, sharp corners
- Padding: p-8
- Artist thumbnails: Square format, arranged in grid within card
- Selection indicator: Thick checkmark or border highlight

### Form Inputs
- 3-4px border on all inputs
- Large touch targets: py-4 px-6
- Focus state: Double border or thickness increase
- Dropdown: Custom styled with brutalist treatment

### Dividers
- Thick horizontal rules: 3-6px solid lines
- Used generously to create visual separation

## Animations

Minimal and purposeful:
- Hover scale on category cards: slight (1.02)
- Border pulse on form focus
- Geometric elements subtle parallax on scroll (hero only)

## Images

**Hero Image**: Full-width background showing energetic DJ performance, crowd with hands up, dramatic stage lighting with purple/blue tones. Image should be overlaid with semi-transparent geometric shapes creating depth and Johnnie Walker brand integration.

**Category Cards**: Square artist portrait photos for each DJ nominee, arranged 2x2 or 3x3 grid within each category card

**Brand Elements**: Johnnie Walker Striding Man silhouette as watermark or decorative element, used sparingly

## Accessibility

- Maintain WCAG AA contrast with bold typography
- Large, clear touch targets (min 44x44px)
- Clear form validation with bold error messages
- Keyboard navigation with thick focus indicators

## Brand Integration

- Johnnie Walker angular logo prominence in header
- Diagonal lines echoing whisky bottle facets
- Premium feel through spacing and intentional brutality
- "Keep Walking" philosophy reflected in forward-leaning geometric elements

This design creates an unforgettable voting experience that honors Johnnie Walker's premium heritage while embracing the raw energy of electronic music culture through neobrutalist boldness.