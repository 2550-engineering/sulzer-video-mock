SULZER PUMP REPLACEMENT GUIDE — DEMO
====================================

This folder is a self-contained static site. To publish it:

NETLIFY (drag & drop)
---------------------
1. Go to https://app.netlify.com/drop
2. Drag this entire "sulzer-demo" folder onto the page.
3. Netlify gives you a live URL in a few seconds. Done.

(Or: Netlify dashboard → Add new site → Deploy manually → drop the folder.)

NOTES
-----
- index.html is the entry point.
- An internet connection is required on first load (the app pulls the
  React runtime from a CDN).
- All pump data, the brand/model + part-number/RSK search, the energy
  calculator, and the Download PDF action run entirely in the browser —
  no server or build step needed.
- Pump and hero images are stored in image-slots.state.json. Keep that
  file alongside index.html.

FILES
-----
index.html                 The guide
support.js                 UI runtime
pump-data.js               Catalog + replacement-matching logic
image-slot.js              Image handling
image-slots.state.json     Embedded hero + pump images
uploads/                   Hero background image
