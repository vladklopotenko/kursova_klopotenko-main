<p align="center">
  <img src="readme_header.avif" alt="Your Energy App Preview" width="100%">
</p>

<h1 align="center">Your Energy</h1>

<p align="center">
  <strong>Wellness & Fitness Tracker SPA</strong><br>
  <sub>Курсова робота · <a href="https://ref.goit.global/ac07ba13">Neoversity</a></sub>
</p>

<p align="center">
  <br>
  <a href="https://codenoob53.github.io/You_Energy_App/">
    <img src="https://img.shields.io/badge/Live_Demo-242424?style=for-the-badge" alt="Live Demo">
  </a>
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Vite_5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/MIT-green?style=for-the-badge" alt="License">
  <br><br>
</p>

---

## Overview

**Your Energy** is a high-performance Single Page Application for exploring fitness exercises, managing favorites, and staying motivated. Built with vanilla JavaScript and optimized for speed.

---

## Features

| Feature | Description |
|:--------|:------------|
| **Exercise Catalog** | Browse exercises by body parts, muscles, and equipment |
| **Smart Search** | Real-time keyword filtering |
| **Favorites** | Persistent storage via LocalStorage |
| **Rating System** | Rate and review exercises |
| **Daily Quote** | Motivational quotes from API |
| **Adaptive Design** | Partial responsive layout (320px, 768px, 1440px) |

---

## Tech Stack

| Category | Technologies |
|:---------|:-------------|
| **Build** | Vite 5.4, PostCSS |
| **Core** | Vanilla JavaScript (ES6+ modules) |
| **Styling** | CSS3, BEM methodology, CSS Custom Properties |
| **HTTP** | Axios with interceptors |
| **UI** | iziToast notifications |
| **Fonts** | DM Sans (self-hosted WOFF2) |
| **Images** | AVIF/WebP with `<picture>` fallbacks |

---

## Project Structure

```
You_Energy_App/
├── src/
│   ├── css/                    # Modular stylesheets
│   │   ├── base.css            # Reset & base styles
│   │   ├── variables.css       # CSS custom properties
│   │   ├── layout.css          # Grid & container system
│   │   ├── header.css          # Navigation styles
│   │   ├── hero.css            # Hero section
│   │   ├── categories.css      # Category cards
│   │   ├── exercises.css       # Exercise cards
│   │   ├── favorites.css       # Favorites page
│   │   ├── filters.css         # Filter tabs
│   │   ├── modal.css           # Modal dialogs
│   │   ├── pagination.css      # Pagination component
│   │   ├── quote.css           # Quote widget
│   │   ├── sidebar.css         # Sidebar styles
│   │   ├── skeleton.css        # Loading skeletons
│   │   ├── notify.css          # Notification styles
│   │   ├── responsive.css      # Media queries
│   │   └── main.css            # Entry point (imports)
│   │
│   ├── js/                     # JavaScript modules
│   │   ├── api.js              # Axios instance & API calls
│   │   ├── constants.js        # App constants & configuration
│   │   ├── dom.js              # DOM utilities & rendering
│   │   ├── exercise-controller.js # Exercise modal & rating orchestration
│   │   ├── favorites-service.js # Favorites storage (IDs only in LocalStorage)
│   │   ├── favorites.js        # Favorites page (fetches data from API)
│   │   ├── home.js             # Home page entry point
│   │   ├── modal.js            # Base modal management
│   │   ├── nav.js              # Navigation & mobile menu
│   │   ├── notify.js           # Notification system (iziToast wrapper)
│   │   ├── pagination.js       # Pagination logic
│   │   └── quote.js            # Daily quote logic
│   │
│   ├── partials/               # HTML components
│   │   ├── header.html         # Site header
│   │   ├── hero.html           # Hero section
│   │   ├── filters.html        # Filter tabs
│   │   ├── category-card.html  # Category card template
│   │   ├── exercise-card.html  # Exercise card template
│   │   ├── exercise-modal.html # Exercise detail modal
│   │   ├── rating-modal.html   # Rating form modal
│   │   ├── pagination.html     # Pagination controls
│   │   ├── quote.html          # Quote widget
│   │   ├── sidebar-image.html  # Sidebar images
│   │   ├── favorites-empty.html# Empty state
│   │   ├── footer.html         # Site footer
│   │   └── icons.html          # SVG sprite
│   │
│   ├── img/                    # Optimized images
│   │   ├── avif/               # AVIF format (primary)
│   │   └── *.jpg               # JPEG fallbacks
│   │
│   ├── fonts/                  # Self-hosted fonts
│   │   └── DMSans-*.woff2
│   │
│   ├── public/                 # Static assets
│   │   └── favicon-*.png
│   │
│   ├── index.html              # Home page
│   └── favorites.html          # Favorites page
│
├── dist/                       # Production build
├── vite.config.js              # Vite configuration
├── postcss.config.js           # PostCSS plugins
└── package.json
```

---

## Architecture Decisions

### Layered Architecture
JS logic is separated into specialized layers to follow the principle of single responsibility:
- **Services**: Pure data logic (e.g., `favorites-service.js` for LocalStorage) independent of the DOM.
- **Controllers**: Orchestration of events and UI flows (e.g., `exercise-controller.js` for complex modal interactions).
- **Page Modules**: Entry points that wire up specific page functionality.

### API Layer
Centralized Axios instance with response interceptors for unified error handling and toast notifications.

### Modular CSS
Each component has its own stylesheet. Entry point `main.css` imports all modules in correct order. CSS Custom Properties ensure consistent theming.

### SVG Sprite
All icons combined into a single SVG sprite (`icons.html`) for reduced HTTP requests. Icons optimized with [SVG Viewer](https://www.svgviewer.dev/).

### Image Optimization
- Raster images optimized with [Squoosh](https://squoosh.app/)
- AVIF as primary format with JPEG fallbacks
- Retina support: `@2x` and `@3x` variants via `srcset`
- Responsive `<picture>` elements with `sizes` attribute
- Preloaded critical hero images

### Skeleton Loaders
CSS-based skeleton screens displayed during data fetching for improved perceived performance.

### State Management
- URL-based state for filters and pagination
- LocalStorage stores only exercise IDs for favorites (not full objects)
- Favorites data fetched fresh from API on page load for up-to-date info
- No external state libraries

---

## Getting Started

```bash
# Clone
git clone https://github.com/codenoob53/You_Energy_App.git
cd You_Energy_App

# Install
npm install

# Development
npm run dev

# Production build
npm run build

# Preview build
npm run preview
```

---

## API Endpoints

| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/quote` | GET | Daily motivational quote |
| `/filters` | GET | Categories (body parts, muscles, equipment) |
| `/exercises` | GET | Exercise list with filters |
| `/exercises/:id` | GET | Single exercise details |
| `/exercises/:id/rating` | PATCH | Submit rating |
| `/subscription` | POST | Email subscription |

Base URL: `https://your-energy.b.goit.study/api`

---

## Performance (Lighthouse)

<table width="100%">
<tr>
<td valign="top">

**Mobile**
| Metric | Score |
|:-------|------:|
| Performance | 98 |
| Accessibility | 96 |
| Best Practices | 100 |

</td>
<td width="50"></td>
<td valign="top" align="right">

**Desktop**
| Metric | Score |
|:-------|------:|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |

</td>
</tr>
</table>

---

## Author

**Fedotov Oleksandr**
[GitHub](https://github.com/codenoob53) · [Email](mailto:o.fedotov@student.neoversity.com.ua)

---

## License

MIT
