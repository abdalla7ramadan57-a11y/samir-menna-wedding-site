# Samir & Menna — Wedding Website

Mobile-first bilingual wedding invitation for Friday, 23 October 2026.

## Current flow
1. Sealed burgundy envelope with wax-seal interaction
2. Editorial portrait, music card and invitation letter
3. Save-the-date calendar and working countdown
4. Ceremony details, itinerary, dress code and gift note
5. RSVP envelope, local reply form and closing stationery

## Files
- `index.html` — markup and content
- `styles.css` — responsive luxury styling + animation
- `wedding.config.js` — centralized wedding details and editable copy
- `assets/invitation.jpg` — Samir & Menna invitation artwork
- `assets/wedding-song.m4a` — current wedding music
- `assets/decor/` — floral artwork

## Important before final publishing
RSVP replies currently use browser localStorage. Connect the form to Supabase/Firebase/Google Sheets before production if submissions need to be visible across devices and available to the couple in an admin dashboard.

Venue photos shown in the venue section reference the exact Romanica Hall / Egypt View listing online, rather than generic wedding-hall images. The Google Maps block is an embedded live map and its directions button opens the supplied Google Maps link.
