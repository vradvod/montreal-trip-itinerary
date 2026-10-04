# Montréal Trip Itinerary

An editable, mobile-friendly itinerary for the Montréal trip, **Oct 15–20**, staying at **Hotel Saint Laurent**.

## Features
- Overview tab (lodging, arrivals on Oct 15, departures on Oct 20) plus one tab per day (Oct 15–20)
- Color-coded travelers (Vrad, Krysia, Walter, Dorothy, Tara, Ursula, Ania, Marian, Danuta) and a "Show" filter
- Overlapping flights shown side by side as cards; flight details for everyone except Vrad are editable placeholders (Krysia is assumed to match Vrad – confirm)
- Read-only itinerary with suggested Montréal activities marked "Suggestion"
- Montréal → Québec City bus tour on Oct 18 (7:00am–8:00pm)
- Print view

## Persistence
The website is read-only and does not save browser edits. To change the itinerary, update the source files in this GitHub repository and deploy the changes.

## Run locally
No build step. Serve the folder:
```sh
npx serve .
# or
python3 -m http.server 8000
```

## Deploy to Vercel
1. Push this repo to GitHub.
2. At [vercel.com/new](https://vercel.com/new) import `vradvod/montreal-trip-itinerary`.
3. Framework preset: **Other**; leave build command and output directory empty (static site served from the root).
4. Click **Deploy**. Every push to the default branch redeploys automatically.

Or with the CLI: `npx vercel --prod`.
