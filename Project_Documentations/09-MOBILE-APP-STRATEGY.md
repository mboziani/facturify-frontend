# 📱 Mobile App Strategy & Implementation

## 1. Executive Summary

The **Facturify Mobile App** is a companion application designed to allow freelancers and small business owners to manage their invoicing and expenses on the go. Built with **React Native (Expo)**, it prioritizes a seamless user experience, offline capability, and code reusability with the existing web platform.

---

## 2. Technology Stack

### Core Framework
*   **Framework**: React Native (via Expo SDK 50+)
*   **Language**: TypeScript 5.3+
*   **Navigation**: Expo Router (File-based routing, similar to Next.js)

### State & Data Management
*   **Client State**: Zustand (Lightweight, hook-based global state)
*   **Server State**: React Query (TanStack Query) for caching, optimistic updates, and background syncing.
*   **Offline Data**: WatermelonDB (High-performance reactive database based on SQLite).

### UI/UX
*   **Component Library**: React Native Paper (Material Design 3 implementation).
*   **Styling**: Custom Design System matching the web platform's branding (Indigo/Purple gradients).
*   **Icons**: Material Community Icons.

### Integration
*   **API**: Axios with Interceptors (Sharing logic with Frontend).
*   **Push Notifications**: Firebase Cloud Messaging (FCM).

---

## 3. Architecture Overview

### Hybrid Code Sharing
While the UI is native, we maximize logic sharing between Web (Next.js) and Mobile (React Native):
1.  **Shared Types**: TypeScript interfaces for `User`, `Company`, `Invoice`, etc.
2.  **API Client Logic**: Unified Axios configuration and error handling strategies.
3.  **Business Logic Hooks**: Potential to extract common hooks (e.g., `useCalculateTotals`) into a shared package in the future.

### Offline-First Strategy
Crucial for mobile users who may have spotty connections:
1.  **Read**: App reads from local WatermelonDB primarily.
2.  **Write**: Actions (Create Invoice) write to local DB immediately (Optimistic UI).
3.  **Sync**: A background worker pushes local changes to the API and pulls updates using a "Last Pulled At" timestamp strategy.

---

## 4. Feature Roadmap

### Phase 1: Foundation (Current Status: 🚧 In Progress)
*   [x] Project Initialization (Expo + TypeScript)
*   [ ] Integration of libraries (Paper, Navigation, Query)
*   [ ] Authentication Flow (Login/Register/Forgot Password)
*   [ ] Basic Dashboard (Revenue Summary)

### Phase 2: Core Invoicing
*   [ ] Invoice List with Filtering
*   [ ] Create/Edit Invoice Form
*   [ ] PDF Generation & Sharing
*   [ ] Client Management

### Phase 3: Advanced Features
*   [ ] **Offline Mode**: Full synchronization engine.
*   [ ] **Expense Tracking**: Camera integration for receipt scanning (OCR).
*   [ ] **Push Notifications**: Overdue headers, payment received alerts.

---

## 5. Development Standards

1.  **Platform Adaptability**: UI should feel native on both iOS (Cupertino/Human Interface) and Android (Material You) where appropriate, handled largely by React Native Paper.
2.  **Performance**:
    *   Use `FlashList` for long lists (Invoices).
    *   Memoize heavy computations.
    *   Avoid bridge crossing for animations (Use Reanimated).
3.  **Testing**:
    *   Unit Tests: Jest + React Native Testing Library.
    *   E2E: Detox or Maestro.

---

## 6. Project Structure (`facturify-mobile`)

```bash
facturify-mobile/
├── app/                  # Expo Router pages
│   ├── (auth)/           # Auth stack
│   └── (tabs)/           # Main tab navigation
├── components/           # UI Components
├── lib/
│   ├── api/              # API Client
│   ├── db/               # WatermelonDB
│   └── theme.ts          # Design System
├── hooks/                # Custom React Hooks
└── stores/               # Zustand Stores
```
