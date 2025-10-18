# 🧠 CVLetterAI

AI-powered CV and Letter Builder for UK & EU professionals — crafted for job seekers, tenants, and creators who need fast, professional documents powered by modern AI.

Built with **Next.js 15**, **TypeScript**, and **Stripe integration**, this platform delivers fully automated CVs, cover letters, and landlord letters using advanced AI templates and a clean, minimal UI.

---

## 🚀 Features

- ⚡ **AI-Driven Workflow** – Generate and edit CVs, letters, and messages instantly.  
- 💼 **Professional Templates** – Designed for recruiters, landlords, and business professionals.  
- 🧩 **Full App Router Architecture** – Modular pages for CV Builder, Letter Builder, Dashboard, Settings, Chat, etc.  
- 💳 **Stripe Integration** – One-time and subscription plans (£5.99 and £9.99) with secure test checkout links.  
- 🔒 **Secure Authentication** – Sign-in and session management with protected routes.  
- 🌙 **Modern Dark UI** – Built for accessibility and aesthetics across desktop and mobile.  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/docs/app) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | TailwindCSS + Custom Design System |
| **Payments** | Stripe Checkout Integration |
| **Hosting** | Vercel |
| **Linting & Type Checking** | ESLint, Prettier, TypeScript strict mode |
| **Version Control** | Git + GitHub |

---

## 🏗️ Project Structure

app/
├── (marketing)/page.tsx # Landing page
├── pricing/page.tsx # Pricing and plans
├── sign-in/page.tsx # Auth page
├── dashboard/page.tsx # User dashboard
├── cv-builder/page.tsx # CV builder
├── letter-builder/page.tsx # Letter builder
├── settings/page.tsx # User settings
├── chat/page.tsx # AI chat
├── layout.tsx # Root layout
└── globals.css # Global styles
