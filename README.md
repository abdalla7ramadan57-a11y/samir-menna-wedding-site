# Samir & Menna — Wedding Website

Mobile-first bilingual wedding invitation for Friday, 23 October 2026.

## Current flow
1. Guest wish form
2. Fully closed envelope
3. Tap seal → natural flap opening
6. Main invitation / story / countdown / wedding details
7. Romanica Hall gallery + Google Maps preview and directions
8. Photo gallery / RSVP / guestbook / final screen

## Files
- `index.html` — markup and content
- `styles.css` — responsive luxury styling + animation
- `assets/invitation.jpg` — Samir & Menna invitation artwork
- `assets/wedding-song.m4a` — current wedding music
- `assets/decor/` — floral artwork

## Important before final publishing
RSVP and guest wishes currently use browser localStorage for the prototype. Connect them to Supabase/Firebase/Google Sheets before production if submissions need to be visible across devices and available to the couple in an admin dashboard.

Venue photos shown in the venue section reference the exact Romanica Hall / Egypt View listing online, rather than generic wedding-hall images. The Google Maps block is an embedded live map and its directions button opens the supplied Google Maps link.
