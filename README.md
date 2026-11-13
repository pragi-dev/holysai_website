# Holy Sai School — Website

A static, responsive school website. No build step — open `index.html` in a browser.

## Structure

```
holy-sai-school/
├── index.html          # Home
├── about.html          # About Us — vision, mission, leadership, journey
├── academics.html      # Kindergarten – Grade IX, co-scholastic activities
├── facilities.html     # Campus facilities, safety & security
├── admissions.html     # Admission steps + enquiry form
├── events.html         # Month-by-month events
├── gallery.html        # Photo gallery with lightbox
├── faq.html            # Frequently asked questions
├── blog.html           # Blog: latest article + cards with photos
├── blog/               # 21 full article pages (one .html per post)
├── career.html         # Jobs / apply
├── contact.html        # Address, phone, map
├── css/styles.css      # All styles (brand colours at the top)
├── js/main.js          # Menu, dropdown, animations, gallery, form
└── assets/images/      # Logo and photos (gallery/ = event albums, blog/ = article photos)
```

The header, menu and footer are repeated in every page. If you change one
(for example a phone number or a menu item), change it in all 11 pages and the 21
articles in `blog/` — a find-and-replace across the whole folder is the easiest way.

## Customising

Content comes from the current school site — see `CONTENT.md`. Still to do:

- Check the Google Maps pin in the Contact section points at the campus

### Design (v3)
The look follows the UI designs in `D:\ui` (About, Academics, News & Events, Home): EB Garamond serif headings,
Montserrat body text, maroon / crimson / gold colours, a dark top bar and footer, and square uppercase buttons.
Only the style was taken from those designs — all text, contact details and photos are Holy Sai Preparatory School's own.
The theme lives in the `THEME v3` block and the `v3 ·` page blocks at the end of `css/styles.css`.

### Holy Sai Assistant (chat)
The chat bubble on every page is added by `js/main.js` (search for `Holy Sai Assistant`). It is scripted and works
offline: quick-reply buttons and simple keyword matching answer from the site's own details (admissions, grades,
events, visiting, facilities, transport & safety, office contacts). Nothing is sent anywhere. Edit the `TOPICS` list
to change the answers.

### News & Events filters
The category chips and search box on `events.html` filter the cards and monthly lists. Each item's category is its
`data-cat` attribute (celebration, showcase, trip, activity, exam, holiday, notice).

### Photos

- `assets/images/gallery/` holds 108 event photos from the school's albums, named
  `<album>-<number>.jpg` (e.g. `onam-3.jpg`), resized to 600×450 JPG.
- **Add a photo to the gallery:** put the file in `assets/images/gallery/`, then copy one
  `<button class="tile" …>` line in `gallery.html` and change `data-album`, `data-caption` and `src`.
- **Add a new album:** also add a filter button (`<button class="chip" data-filter="my-album">`)
  in the `gallery-filters` row. Link straight to an album with `gallery.html#my-album`.
- **Banner photo of a page:** the `data-bg="…"` on that page's `<section class="page-hero">`.
- **Home slideshow:** the `<img>` list inside `<div class="hero-slides">` in `index.html`
  (higher-resolution photos look sharper there).

### Blog

21 articles copied from the old site, each with its photo. `blog.html` lists them; each
article lives in `blog/<name>.html` (links there start with `../`).
**Add an article:** copy an existing file in `blog/`, change the title, date, photo
(`data-bg` and `post-cover`) and the text inside `<div class="post-body">`, then add a
card for it at the top of the grid in `blog.html`.

### Scrolling effects

Home banner slideshow, endless photo rows (`.marquee`), parallax photo bands (`data-parallax`),
photo page banners, a reading-progress bar and scroll-in animations. All are switched off
automatically for visitors whose device is set to reduce motion.

Brand colors live in `:root` at the top of `css/styles.css`.

## Enquiry form

The admission enquiry form on `admissions.html` is **not connected to email yet**.
It checks what the parent typed, then shows: "Online enquiries will be available soon.
Please call us on +91 99404 30003". Nothing is sent and nothing is stored.

### Connecting it later

The sending code is already in `js/main.js` — it only needs an address:

1. Choose a service. The simplest is [FormSubmit](https://formsubmit.co) (free, no account).
2. In `js/main.js`, set `FORM_ENDPOINT`, for example
   `const FORM_ENDPOINT = "https://formsubmit.co/ajax/<school-email>";`
3. With FormSubmit, the first enquiry triggers an **activation email** to that inbox —
   click the link in it, and enquiries arrive from then on.

Once connected, parents see "Sending…", then a thank-you message, or an error with the
phone number if sending fails. A hidden "honeypot" field drops spam-bot submissions.

## Running locally

Open `index.html` directly, or serve the folder:

```bash
npx serve .
```
