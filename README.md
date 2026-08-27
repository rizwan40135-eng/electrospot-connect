# ElectroSpot Connect

Build a modern, responsive web application for an electrical supply and construction lead-sourcing platform named "ElectroSpot". The platform connects Homeowners, Spotters (Referrers), and Admin/Technicians into a single seamless portal. Use a clean, professional aesthetic with an electric blue and dark slate color scheme.

Include the following core pages and features:

1. Landing Page & Role Selection:

   - Hero section explaining the value proposition: "Direct-from-factory electrical packages for home construction + Earn rewards by spotting new builds."

   - Clear navigation to switch between three user views: Homeowner, Lead Spotter, and Site Inspector.

2. Lead Spotter Portal (Referral System):

   - A simple form to submit ongoing construction site leads: Upload site photo, drop pin/enter address, construction stage selector (Foundation, Framing, Wiring Stage), and owner contact info (optional).

   - "My Submissions" Dashboard: A status tracker pipeline showing leads moving through status badges: [Submitted] -> [Verified] -> [Site Inspected] -> [Deal Closed] -> [Cashback Paid].

   - Wallet card displaying "Total Earned" and "Pending Payouts".

3. Homeowner Package Portal:

   - Package Estimator Tool: Users select house size (e.g., 1000 sq ft, 1500 sq ft, 2000+ sq ft) and package tier (Economy, Standard, Smart Home).

   - Interactive Bill of Materials (BOM) breakdown displaying bundled items (wires, conduit pipes, DB boxes, modular switches) with retail price vs. ElectroSpot discounted price.

   - "Request Free On-Site Inspection" CTA button opening a date/time booking modal.

4. Inspector / Admin Dashboard:

   - Lead verification queue showing submitted site photos with geotags.

   - Quick Digital Quotation Form to calculate switch points, total wire bundles, and generate downloadable final package pricing for the homeowner.

Make the UI fully interactive with responsive layouts, smooth tab transitions, modern card components, and clear state indicators.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/02fbd6a1-dde0-43ab-8f21-a5edea7f291e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
