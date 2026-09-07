---
name: Home App
description: A self-hosted cooking and nutrition workspace that unifies recipes with nutritional detail.
colors:
  pantry-night: "#121212"
  ledger-blue: "#90caf9"
  ledger-blue-deep: "#42a5f5"
  on-ledger-blue: "rgba(0, 0, 0, 0.87)"
  text-primary: "#fff"
  text-secondary: "rgba(255, 255, 255, 0.7)"
  divider: "rgba(255, 255, 255, 0.12)"
  action-hover: "rgba(255, 255, 255, 0.08)"
  action-selected: "rgba(255, 255, 255, 0.16)"
  warning-amber: "#ffa726"
  error-red: "#f44336"
typography:
  title:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.334
    letterSpacing: "0em"
  body:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.00938em"
  label:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.66
    letterSpacing: "0.03333em"
  button:
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.75
    letterSpacing: "0.02857em"
rounded:
  base: "12px"
  detail-cell: "24px"
spacing:
  compact: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.ledger-blue}"
    textColor: "{colors.on-ledger-blue}"
    typography: "{typography.button}"
    rounded: "{rounded.base}"
    padding: "6px 16px"
  input-search:
    backgroundColor: "{colors.pantry-night}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.base}"
    padding: "8px 14px"
  card-outlined:
    backgroundColor: "{colors.pantry-night}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.base}"
    padding: "16px"
---

# Design System: Home App

## Overview

**Creative North Star: "The Pantry Ledger"**

The current interface is a sleek, professional dark workspace for keeping cooking information orderly and easy to scan. Its visual language is built from a near-black canvas, cool blue interaction signals, outlined containers, and compact factual grids. The system stays simple and usable: structure, typography, and state changes do the work instead of decoration.

The interface should look sleek and professional, but also be very easily usable. Controls should be quietly precise: clear labels, compact layouts, predictable states, and easy scanning. Cards and fields should support organization without competing for attention.

**Key Characteristics:**

- Dark, high-contrast work surface with a restrained cool-blue action signal.
- Roboto-led typography with bold values and quieter secondary labels.
- Rounded outlined containers, tonal headers, and compact two-column information grids.
- Strong responsive shell: permanent navigation on larger screens and a temporary drawer on mobile.
- No excessive decoration or unnecessary visual complexity.

## Colors

The palette is the default MUI dark scheme, documented as a quiet ledger surface with blue reserved for interactive emphasis and amber/red for warnings and destructive states.

### Primary

- **Cool Ledger Blue** (#90caf9): Primary interaction and focus color for contained actions and active controls.
- **Cool Ledger Blue Deep** (#42a5f5): Darker blue state used by the MUI palette for stronger interaction emphasis.

### Neutral

- **Pantry Night** (#121212): The shared application canvas and paper surface.
- **Ledger White** (#fff): Primary text and active icon color.
- **Ledger Secondary** (rgba(255, 255, 255, 0.7)): Supporting labels, metadata, and quiet controls.
- **Divider Mist** (rgba(255, 255, 255, 0.12)): Outlines and separators between related regions.
- **Hover Veil** (rgba(255, 255, 255, 0.08)): Tonal hover treatment and card header surface.
- **Selected Veil** (rgba(255, 255, 255, 0.16)): Selected navigation and active surface treatment.

### Named Rules

**The Signal Rule.** Cool Ledger Blue is reserved for interaction and focus; the dark canvas remains the dominant field.

## Typography

**Display Font:** None; no separate display face is defined.
**Body Font:** Roboto (with Helvetica, Arial, sans-serif fallbacks)
**Label/Mono Font:** None; labels use the same Roboto family.

**Character:** Roboto keeps the interface neutral, legible, and operational. Hierarchy comes from size, weight, and contrast rather than expressive font changes; labels recede while values and actions stay easy to find.

### Hierarchy

- **Title** (700, 1rem mobile / 1.5rem desktop, approximately 1.334 line-height): Ingredient and surface titles in card headers; titles truncate when compact.
- **Body** (400, 1rem, 1.5 line-height): Main form content, dialog copy, and nutrition values before bold emphasis.
- **Label** (400, 0.75rem, 1.66 line-height, 0.03333em tracking): Nutrition labels, metadata, menu groups, and supporting copy.
- **Button** (500, 0.875rem, 1.75 line-height, 0.02857em tracking): MUI action text, conventionally uppercase.

### Named Rules

**The Ledger Clarity Rule.** Use Roboto consistently and make labels secondary while values carry weight.

## Layout

The application uses a fixed app bar plus a navigation drawer and a flexible content region. The app bar is 56px high on extra-small screens and 64px from the `sm` breakpoint upward. The drawer is 240px wide, permanent on desktop, and temporary behind a menu button on mobile; the responsive transition is 600px.

Main content uses 24px padding and preserves a centered reading measure for focused surfaces. Ingredient detail and edit screens cap their content at 640px. Ingredient cards use a responsive grid of `repeat(auto-fill, minmax(280px, 1fr))` with a 16px gap. Search and add controls sit in a sticky bar, centered within a 480px measure on larger screens. Detail and nutrition values use equal two-column grids; compact overview grids use 4px row and 8px column gaps.

The spacing rhythm is based on the MUI 8px unit: 4px for compact control gaps, 8px for close relationships, 16px for standard padding and section gaps, and 24px for major stack spacing.

## Elevation & Depth

This is a tonal-layered system with restrained lift. Outlined cards and translucent white surfaces establish everyday grouping; shadows appear when a layer needs to sit above the workflow, such as the permanent drawer, sticky form actions, dialogs, and the mobile drawer. The default card surface remains visually quiet against the same dark application canvas.

### Shadow Vocabulary

- **Navigation lift** (`0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)`): MUI elevation 3 for the desktop drawer.
- **Sticky action lift** (`0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)`): MUI elevation 6 for persistent edit actions.
- **Dialog lift** (`0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)`): MUI elevation 24 for modal surfaces.

### Named Rules

**The Tonal Layer Rule.** Use tonal changes and dividers for everyday grouping; reserve stronger shadow for persistent or transient layers.

## Shapes

The base MUI shape radius is 12px. Cards use the base radius with a 1px divider outline and clipped content. Detail cells, serving controls, and form-field shells use the MUI system's `borderRadius: 2`, which resolves to a 24px radius with this theme. Corners are rounded but not decorative; consistent silhouettes make dense factual content easier to scan.

## Components

### Buttons

- **Shape:** Rounded base radius (12px), inherited from the MUI theme.
- **Primary:** Contained actions use Cool Ledger Blue with dark contrast text and the standard MUI `6px 16px` padding.
- **Hover / Focus:** Use the MUI primary state and visible focus treatment; preserve the blue signal without adding ornamental effects.
- **Secondary / Ghost / Tertiary:** Text actions and icon actions remain quiet, using inherited text or secondary color. Icon-only actions must retain an accessible label and tooltip where needed.

### Chips

- **Style:** MUI dark-scheme chip styling with a compact, rounded silhouette.
- **State:** Used for simple status communication, such as the current under-construction placeholder; do not turn chips into decorative badges.

### Cards / Containers

- **Corner Style:** 12px base radius; card content is clipped to the rounded outline.
- **Background:** Pantry Night, with action-hover tonal headers where a card needs a distinct title band.
- **Shadow Strategy:** Outlined cards are flat at rest; elevation is reserved for navigation, sticky actions, and dialogs.
- **Border:** 1px Divider Mist outline and Divider Mist separators.
- **Internal Padding:** 16px standard; responsive headers and detail content expand to 20-24px on larger screens.

### Inputs / Fields

- **Style:** MUI outlined search and dialog inputs use the dark canvas with rounded 12px framing. Edit forms wrap standard, underline-free fields inside 24px outlined field shells.
- **Focus:** Use the MUI primary blue focus state and preserve the control's existing label association.
- **Error / Disabled:** Use outlined red or amber alerts and helper text for validation and data warnings; disabled controls retain their layout while reducing emphasis.

### Navigation

- **Style:** A fixed MUI AppBar anchors the product name; the 240px drawer holds the primary Recipes and Ingredients destinations.
- **Default / Active:** Navigation rows use icons, labels, and a translucent selected veil. The active area follows the current route.
- **Mobile Treatment:** The drawer becomes temporary and is opened with a labeled menu button; it stays mounted for responsive performance.

### Nutrition Detail Grid

The signature content pattern is a two-column factual grid. Supporting labels use secondary text; values use bold primary text. Serving is a bordered interactive tile when conversion is possible, while nutrition facts remain quiet bordered cells beside it.

## Do's and Don'ts

### Do:

- **Do** keep Pantry Night as the dominant surface and Cool Ledger Blue as a scarce interaction signal.
- **Do** make important values bold and keep supporting labels visually secondary.
- **Do** use outlined cards, dividers, and tonal headers to organize information.
- **Do** preserve the 240px desktop drawer / temporary mobile drawer behavior.
- **Do** keep content centered and bounded on focused detail and edit surfaces.

### Don't:

- **Don't** add excessive decoration, illustration, texture, or ornamental background treatment.
- **Don't** introduce a second display font or an unrelated color world without an explicit redesign decision.
- **Don't** replace compact factual grids with visually noisy compositions.
- **Don't** use unlabeled icon-only actions where the existing tooltip and accessible-label pattern is required.
- **Don't** make every surface elevated; everyday grouping belongs to tonal layers and dividers.
