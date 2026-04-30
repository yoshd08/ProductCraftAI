# ProductCraft - AI Case Study Analysis Tool

ProductCraft is an application for analyzing case studies using product management frameworks with the help of AI. It's built with NextJS and Genkit for AI integration.
Absolutely — here’s a simple **starter kit** to begin using your project.

# ProductCraftAI starter kit

## 1) What this project is

This project is a web app built with:

* **Next.js**
* **React**
* **Tailwind CSS**
* **Firebase**
* **Genkit / Google AI** 

So think of it like this:

* **UI pages** → Next.js + React
* **Styling** → Tailwind
* **AI features** → Genkit
* **Possible backend/cloud config** → Firebase

---

## 2) What you need before starting

Install these on your laptop:

* **Node.js**
* **npm**
* A code editor like **VS Code**

Then open the project folder.

---

## 3) First commands to run

In the project folder, run:

```bash
npm install
npm run dev
```

That starts the local development server because `dev` is set to `next dev -p 3000`. 

Then open:

```bash
http://localhost:3000
```

---

## 4) Main commands cheat sheet

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

What they do:

* `npm install` → installs project packages
* `npm run dev` → runs locally
* `npm run build` → creates production build
* `npm run start` → runs production version
* `npm run lint` → checks code style
* `npm run typecheck` → checks TypeScript types 

---

## 5) Where to start reading the code

The README says to start with:

```bash
src/app/page.tsx
```

That is likely your main homepage / entry screen. 

After that, check:

* `src/app/`
* `src/components/`
* `src/lib/`
* `src/ai/`

Your config also shows alias paths like `@/components`, `@/lib`, and `@/hooks`, so those folders are part of the app structure.

---

## 6) Likely folder mental model

A good beginner way to understand this project:

* `src/app` → pages and routes
* `src/components` → reusable UI pieces
* `src/lib` → helper functions
* `src/hooks` → custom React hooks
* `src/ai` → AI-related logic
* `public` → static files like images
* root config files → project settings

The aliases confirm this structure.

---

## 7) Important setup note

This project probably uses environment variables for Firebase and AI keys. You should **not** upload `.env` publicly, but you may need one locally for the app to work fully.

So if something fails after `npm run dev`, it is very likely because:

* an API key is missing
* Firebase config is missing
* Genkit env setup is missing

---

## 8) Genkit commands

Your project also has these:

```bash
npm run genkit:dev
npm run genkit:watch
```

Those are for local AI workflow development. 

So if the app has AI features and they are not working with only `npm run dev`, try a second terminal:

```bash
npm run genkit:dev
```

or

```bash
npm run genkit:watch
```

---

## 9) Build test before deployment

Before putting it online, run:

```bash
npm run build
```

That checks whether the app can compile for production. Your Next config ignores TypeScript and ESLint build errors, which can make builds more forgiving, but it is still good to test. 

---

## 10) Very short beginner workflow

Use this every time:

```bash
npm install
npm run dev
```

Then:

1. Open `src/app/page.tsx`
2. Make a small text change
3. Save
4. Refresh browser
5. Explore components and AI files

---

## 11) Minimum `.gitignore`

If you are keeping this on GitHub, make sure `.gitignore` includes:

```gitignore
node_modules
.next
.env
```

---

## 12) Best “first 30 minutes” plan

Do these in order:

1. Run `npm install`
2. Run `npm run dev`
3. Open `localhost:3000`
4. Read `src/app/page.tsx`
5. Find where the main UI is rendered
6. Make one safe text edit
7. Run `npm run build`
8. If AI is involved, try `npm run genkit:dev`

---

## 13) Copy-paste quick start

Here’s the smallest setup block:

```bash
npm install
npm run dev
```

Then visit:

```bash
http://localhost:3000
```

If AI features are not working:

```bash
npm run genkit:dev
```

Start with these 5 places, in this order:

1. `README.md` — quick purpose of the app. It says this is **ProductCraft**, an AI case study analysis tool, and tells you to begin with `src/app/page.tsx`. 

2. `package.json` — see how to run it and what it uses. The main scripts are `npm run dev`, `npm run build`, `npm run start`, plus `genkit:dev` and `genkit:watch`. It uses Next.js, Firebase, Genkit, Tailwind, React, and more. 

3. `src/app/page.tsx` — this is the best first code file to read, because the README points there as the starting point. 

4. `next.config.js` — this shows project-level behavior like the `@` alias pointing to `./src`, allowed image host config, and a copied `pdf.worker.js`. 

5. `components.json` and `tsconfig.json` — these explain aliases like `@/components`, `@/lib`, `@/hooks`, and confirm the app’s structure.

Then use this mini routine:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, then make one tiny text change in `src/app/page.tsx` and refresh. That’s the fastest way to understand where the main UI begins. The dev script runs Next on port 3000. 

A simple way to explore the project is:

* `src/app` = pages
* `src/components` = UI pieces
* `src/lib` = helpers
* `src/hooks` = hooks
* `src/ai` = AI logic

That folder pattern is supported by the alias config in the project files.

If something does not work right away, it may need environment variables for Firebase or AI features, since the project includes Firebase and Genkit packages. 

Next message, send me either:
`show me the exact first edits to make`
or
`explain the project structure simply`



