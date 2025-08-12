# Train Reservation System – Remaining Work & Suggested End-Points
_Last updated: 28 Jul 2025_

## ✅ Completed (Key)
### API
1. Search Trains – `GET /searchTrains`
2. Book Ticket – `POST /book`
3. Fetch Booking by PNR – `GET /booking/{pnr}`
4. Cancel Booking – `POST /cancel/{pnr}`
5. Seat Availability – `GET /availability`
6. Fare Calculation – `GET /fare`

### UI
1. Search page with date-picker validation
2. Search Results page (separate route)
3. Booking Confirmation page
4. PNR Status page + IRCTC-style PDF download
5. Cancel Booking page with improved UX
6. Global navigation bar & routing

---

## 🔴 High Priority
| Layer | Task | Notes |
|-------|------|-------|
| API   | **Authenticate & Authorise** (`POST /login`, JWT middleware) | Secure admin actions & customer history |
| API   | **Pagination / Filtering** on `GET /searchTrains` | Avoid large payloads; add `page`, `size`, `sort` |
| UI    | **Login / Protected Routes** | Header shows user state; redirect unauth users |
| UI    | **Error Boundary & Global Toasts** | Centralised feedback for 4xx/5xx & network errors |

---

## 🟡 Medium Priority
| Layer | Task | Notes |
|-------|------|-------|
| API   | **Update Booking** (`PUT /booking/{pnr}`) | Modify passenger details before chart preparation |
| API   | **Admin Dashboard End-points**<br/>`/stats/daily-bookings`, `/stats/revenue` | For operational metrics |
| UI    | **Responsive PDF on Confirmation Page** | Mirror PNR page download button |
| UI    | **Form Validation Messages (i18n ready)** | Centralise strings, prepare for localisation |

---

## 🟢 Low Priority / Nice-to-Have
| Layer | Task | Notes |
|-------|------|-------|
| API   | **Webhooks** for payment status | Notify on successful payment / refund |
| API   | **Station Autocomplete** (`GET /stations?query=`) | Enhance search UX |
| UI    | **Progressive Web App (PWA)** | Offline search cache & install prompt |
| UI    | **Dark Mode Toggle** | Save preference in localStorage |
| DevOps | **Docker Compose** for full stack | Simplify onboarding & CI |

---

## Next Steps
1. Finalise authentication flow (API + UI).
2. Add pagination parameters to `searchTrains` and update UI queries.
3. Implement global error/toast component.
4. Begin admin statistics endpoints once auth is stable.
