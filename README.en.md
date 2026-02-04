## AS-Offline-Registry

### 💡 What is AS-Offline-Registry?

**AS-Offline-Registry** is a helper tool for building an **offline registry** for the Vue ecosystem.  
It bundles the official registries of **shadcn-vue** and **ai-elements-vue** into static assets, so that you can deploy them to an internal or completely offline environment.

After building, you can run `npx shadcn-vue add` and `npx ai-elements-vue` in an offline network by pointing them to your own registry server.

---

### ✨ Key Features

- **Multi-registry integration**: builds registry assets for both `shadcn-vue` and `ai-elements-vue` in one command.
- **Offline-first**: output is optimized for offline or private deployments.
- **Cross-platform**: implemented with Node.js standard APIs, runs on Windows / macOS / Linux.
- **No shell tricks**: does not require bash or POSIX shell features; Node is enough.

---

### 🧱 Project Layout & Flow

- `repos/shadcn-vue`: embedded `shadcn-vue` repository.
- `repos/ai-elements-vue`: embedded `ai-elements-vue` repository.
- `scripts/build.js`: main build script coordinating installation, build and copy.
- `dist/`: final offline registry assets.
  - `dist/s`: registry assets from `shadcn-vue`.
  - `dist/a`: registry assets from `ai-elements-vue`.

**Build flow** (`scripts/build.js`):

1. Clean and recreate `dist/` at repo root.
2. In `repos/shadcn-vue`:
   - run `pnpm install`
   - run `pnpm registry:build-only`
3. In `repos/ai-elements-vue`:
   - run `pnpm install`
   - run `pnpm build:registry`
4. Copy the generated registry assets from both repos into `dist/` as `dist/s` and `dist/a`.

---

### ✅ Requirements

- Node.js (recommended 18+)
- `pnpm` (the repo uses `pnpm@10.x`)
- Git (for fetching submodules if you use them)

---

### 🔧 Setup

1. Clone this repo:

```bash
git clone <your-repo-url> as-offline-registry
cd as-offline-registry
```

2. Initialize submodules (if you use git submodules):

```bash
git submodule update --init --recursive
```

3. Install root dependencies:

```bash
pnpm install
```

---

### 🏗 Build Offline Registry

Run the build command at repo root:

```bash
pnpm run build:registry
```

This will:

- clean and recreate `dist/`
- build registry assets from `repos/shadcn-vue` and `repos/ai-elements-vue`
- copy outputs to `dist/s` and `dist/a`

After a successful build, you should see:

- `dist/s` – registry assets from shadcn-vue
- `dist/a` – registry assets from ai-elements-vue

---

### 👀 Preview Locally

You can preview the built registry with a simple static server:

```bash
pnpm run start:registry
```

This uses `http-server` to serve `./dist` at `http://localhost:4873`.

---

### 📴 Use in Offline / Internal Network

1. Build `dist/` in an online environment.
2. Copy the `dist/` directory to your offline or internal server.
3. Expose it via any static server (e.g. `http-server`, Nginx, etc.). Example:

```bash
cd /path/to/dist
npx http-server . -p 4873
```

4. Configure `shadcn-vue` and `ai-elements-vue` CLIs to use your registry URLs, e.g.:

- `http://your-internal-host:4873/s` for shadcn-vue
- `http://your-internal-host:4873/a` for ai-elements-vue

Then you can run:

```bash
npx shadcn-vue add
npx ai-elements-vue
```

with their registry endpoints pointing to your offline server (details depend on each project’s official configuration options).

---

### Notes

This README describes how to build and host the offline registry.  
For CLI flags or environment variables to override registry URLs, please refer to the official docs of `shadcn-vue` and `ai-elements-vue`.

