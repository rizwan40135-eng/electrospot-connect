# Brand catalog and quotation enquiries

`src/lib/brand-catalog.ts` defines separate product entries for each brand. Each entry has a stable ID, model/range, specification, unit and official manufacturer reference. The initial catalog has three entries per brand. These references do not establish ElectroSpot stock or selling prices. Prices remain **on request**, and existing illustrations are clearly identified as representative. Replace them with approved SKU photos and confirm final variants, stock and prices with the business before promising availability.

## Business contact

Copy `.env.example` to `.env.local` and set one or both public business contacts:

- `VITE_QUOTE_WHATSAPP`: international WhatsApp number with country code, digits only (optional leading `+`).
- `VITE_QUOTE_EMAIL`: business enquiry email address.

Restart the development server after changes. Production hosting must set these values **before building**; rebuild to change them. They are public browser configuration, not secrets. Blank or invalid values hide the corresponding delivery action. Without either destination, customers can still review and download their enquiry; the UI explicitly says online enquiries are not available.

## Customer flow

Select a brand, add specific items, open the quotation basket from any page, edit quantities, and enter name, phone, site/location and optional requirements. Review creates an exact text preview. WhatsApp/email actions open a draft addressed to the configured business; the customer must complete sending in the external app. No success notification falsely claims receipt. Download produces the same text as a portable fallback.

Only product IDs and quantities are stored in browser local storage (`electrospot-quote-v1`). Saved values are validated against the current catalog; malformed IDs/quantities are discarded, duplicates coalesced, and quantities capped at 999. Customer contact details stay in component memory and are not persisted. There is no backend enquiry database or delivery confirmation in this implementation.

The generic house-size estimator is separate from this brand catalog. Existing sample inspection/spotter workflows remain demos and are not a quotation submission channel.

## Verification

- Initial homepage contains no product cards until a brand is selected.
- GM Modular shows Zurico/Zicono entries, Havells shows Life Line Plus S3 wires, and other brands have their own catalog entries.
- Add different brands, change quantities, refresh, and verify basket contents survive.
- Verify missing/invalid contact fields cannot generate an enquiry.
- Review preserves each item's brand, model, unit and quantity.
- With contacts configured, inspect the recipient and decoded draft without sending a test message to the business.
- Without contacts configured, no delivery link is shown and download remains available.
