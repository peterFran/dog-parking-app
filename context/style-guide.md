# Dog Parking Style Guide

This style guide establishes the visual identity and design system for the Dog Parking platform, inspired by BarkBox's playful yet trustworthy approach to dog-focused branding.

## Brand Identity

### Voice & Tone
- **Playful yet Professional**: Balance fun, dog-loving personality with reliability for premium services
- **Trustworthy & Caring**: Emphasize safety, expertise, and genuine care for dogs
- **Welcoming & Inclusive**: Make all dog owners feel welcome regardless of breed or experience level
- **Enthusiastic**: Share the joy and excitement that comes with dog ownership

### Brand Values
- Premium care and attention to detail
- Safety and security first
- Community of dog lovers
- Professional expertise with personal touch
- Convenience without compromising quality

## Color Palette

### Primary Colors
```css
/* Deep Blue - Trust, reliability, professional services */
--primary-blue: #1a4e8a;
--primary-blue-rgb: 26, 78, 138;

/* Clean White - Cleanliness, premium service, clarity */
--primary-white: #ffffff;
--primary-white-rgb: 255, 255, 255;

/* Rich Black - Text, sophistication, contrast */
--primary-black: #000000;
--primary-black-rgb: 0, 0, 0;
```

### Secondary Colors
```css
/* Warm Orange - Energy, playfulness, warmth */
--accent-orange: #ff6900;
--accent-orange-rgb: 255, 105, 0;

/* Light Blue - Calm, cleanliness, trust */
--accent-light-blue: #e6f3ff;
--accent-light-blue-rgb: 230, 243, 255;

/* Soft Gray - Neutral backgrounds, subtle text */
--neutral-gray: #f5f5f5;
--neutral-gray-rgb: 245, 245, 245;

/* Medium Gray - Secondary text, borders */
--text-gray: #666666;
--text-gray-rgb: 102, 102, 102;
```

### Usage Guidelines
- **Primary Blue**: Main CTAs, headers, navigation, trust indicators
- **Orange**: Accent color for highlights, success states, playful elements
- **Light Blue**: Background tints, hover states, info sections
- **White**: Backgrounds, cards, clean spaces
- **Gray tones**: Supporting text, subtle borders, inactive states

## Typography

### Primary Fonts
```css
/* Headers - Bold, friendly display font */
--font-heading: 'Pancho', 'Arial Black', sans-serif;

/* Body - Clean, readable sans-serif */
--font-body: 'Apercu', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', sans-serif;

/* Buttons - Bold, confident */
--font-button: 'Apercu Bold', 'Inter Bold', sans-serif;
```

### Font Sizes & Hierarchy
```css
/* Desktop */
--text-5xl: 48px; /* Main headlines */
--text-4xl: 36px; /* Section headers */
--text-3xl: 28px; /* Subsection headers */
--text-2xl: 24px; /* Card titles */
--text-xl: 20px;  /* Large body text */
--text-lg: 18px;  /* Body text */
--text-base: 16px; /* Default text */
--text-sm: 14px;  /* Secondary text */
--text-xs: 12px;  /* Fine print */

/* Mobile adjustments */
--text-5xl-mobile: 36px;
--text-4xl-mobile: 28px;
--text-3xl-mobile: 24px;
```

### Font Weights
```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;
```

## Buttons & Interactive Elements

### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #1a4e8a 0%, #2460a0 100%);
  color: #ffffff;
  font-family: var(--font-button);
  font-size: 16px;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #15437a 0%, #1f5690 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 78, 138, 0.3);
}
```

### Secondary Button
```css
.btn-secondary {
  background: #ffffff;
  color: #1a4e8a;
  border: 2px solid #1a4e8a;
  font-family: var(--font-button);
  font-size: 16px;
  font-weight: 700;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #e6f3ff;
  transform: translateY(-1px);
}
```

### Button Sizes
```css
.btn-sm { padding: 8px 16px; font-size: 14px; }
.btn-md { padding: 12px 24px; font-size: 16px; }
.btn-lg { padding: 16px 32px; font-size: 18px; }
.btn-xl { padding: 20px 40px; font-size: 20px; }
```

## Layout & Spacing

### Container Widths
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Spacing Scale
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

## Cards & Components

### Standard Card
```css
.card {
  background: #ffffff;
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: var(--space-6);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

### Feature Card
```css
.feature-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #e6f3ff;
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  text-align: center;
}
```

## Icons & Graphics

### Icon Style
- Use outline/stroke icons for primary navigation
- Fill icons for accent elements and status indicators
- Consistent 24px size for standard icons, 32px for featured icons
- Primary blue for navigation icons, orange for accent/action icons

### Emoji Usage
Dog-related emojis are encouraged for personality:
- 🐕 Primary dog icon
- 🎾 Play/activities
- 🏠 Daycare/boarding
- ✨ Premium/quality
- 💛 Love/care
- 🚗 Parking/location
- 📅 Scheduling
- 👥 Community

## Animation & Transitions

### Standard Timing
```css
--timing-fast: 0.1s;
--timing-normal: 0.2s;
--timing-slow: 0.3s;
--timing-extra-slow: 0.5s;
```

### Easing Functions
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Standard Animations
- Hover states: `transform: translateY(-2px)` with `0.2s ease`
- Loading states: Subtle pulse or skeleton animations
- Page transitions: Smooth fade-ins
- Micro-interactions: Scale transforms for click feedback

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Primary blue on white: 8.35:1 ✓
- Gray text on white: 4.54:1 ✓
- White text on primary blue: 8.35:1 ✓

### Focus States
```css
.focus-visible {
  outline: 2px solid #ff6900;
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

### Interactive Elements
- Minimum touch target: 44px × 44px
- Clear hover and focus states
- Descriptive alt text for all images
- Semantic HTML structure

## Mobile Responsiveness

### Breakpoints
```css
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--large: 1280px;
```

### Mobile-First Approach
- Start with mobile design and scale up
- Touch-friendly button sizes (minimum 44px)
- Readable font sizes (minimum 16px base)
- Adequate spacing for touch interactions

## Usage Examples

### Hero Section
```css
.hero {
  background: linear-gradient(135deg, #e6f3ff 0%, #ffffff 100%);
  padding: var(--space-24) var(--space-6);
  text-align: center;
}

.hero h1 {
  font-family: var(--font-heading);
  font-size: var(--text-5xl);
  color: var(--primary-blue);
  margin-bottom: var(--space-4);
}
```

### Service Cards
```css
.service-card {
  background: #ffffff;
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  box-shadow: 0 4px 16px rgba(26, 78, 138, 0.1);
  transition: all var(--timing-normal) var(--ease-out);
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(26, 78, 138, 0.2);
}
```

### Call-to-Action Sections
```css
.cta-section {
  background: linear-gradient(135deg, #1a4e8a 0%, #ff6900 100%);
  padding: var(--space-20);
  border-radius: var(--radius-2xl);
  color: #ffffff;
  text-align: center;
}
```

This style guide ensures consistency across the Dog Parking platform while maintaining the playful, trustworthy character that appeals to dog owners seeking premium care services.