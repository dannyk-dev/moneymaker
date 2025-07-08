<a href="https://nextjs-supabase-stripe-update.vercel.app">
  <h1 align="center">MoneyMaker</h1>
</a>


## 🛠️ Local Setup

### 1. Clone the project

```bash
git clone <repo here>
```

### 2. Install dependencies

```bash
npm install
```

# or

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file based on the provided example:

```bash
cp .env.example .env.local
```

Fill in values from:

- [Supabase project settings](https://app.supabase.com/project/_/settings/api)

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 🧩 Tech Stack

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---
