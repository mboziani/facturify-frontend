# FRONTEND-ONLY DEMO MODE IMPLEMENTATION

**Feature:** Standalone Demo Account Access
**Status:** Implemented ✅

---

## OVERVIEW

We have implemented a frontend-only demo mode that allows users to explore the full Facturify platform without requiring a backend server connection or database. This ensures:
- Zero-latency experience
- No server costs for demo users
- High reliability (no database connection errors)
- Instant access for potential clients

## IMPLEMENTATION DETAILS

### 1. Mock Data Integration
**File:** `src/lib/mock-data.ts`
Contains static JSON data for:
- User Profile
- Dashboard Statistics
- Invoices
- Clients
- Expenses
- Company Details

### 2. API Interception
**File:** `src/lib/api/client.ts`
Authentication-aware Mock Adapter:
- Checks `localStorage.getItem('isDemoMode')`
- If active, intercepts API calls and returns mock data from `mock-data.ts`
- Simulates network latency (600ms) for realism
- Falls back to real API for normal users (zero impact on production)

### 3. Login Bypass
**File:** `src/contexts/AuthContext.tsx`
Updated login logic:
- Detects credentials: `demo@facturify.com` / `demo123`
- Sets `isDemoMode = 'true'` in localStorage
- Skips actual backend authentication
- Initializes session with mock user

---

## HOW TO TEST

1. Go to the Landing Page.
2. Click **"Try Demo Account"**.
3. On the login page, click authentication banner or manually enter:
   - **Email:** `demo@facturify.com`
   - **Password:** `demo123`
4. Click **Sign in**.
5. You will see the Dashboard populated with mocked statistics, revenue charts, and recent activity.
6. Navigate to **Invoices** or **Clients** to see the list of mock records.

---

## DEV NOTES

- To reset/exit demo mode, simply **Log Out**. The `isDemoMode` flag will be cleared.
- The mock adapter is designed to be extensible. To mock new features, add data to `mock-data.ts` and routes to `mockAdapter` in `client.ts`.
