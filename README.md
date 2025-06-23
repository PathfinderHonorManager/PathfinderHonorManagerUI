# pathfinderHonorManagerUI

A Vue.js application for managing Pathfinder honors, built with Vite, TypeScript, and Pinia.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Project Setup

```sh
yarn install
```

## Development

### Start Development Server

The application uses Vite for fast development with hot module replacement:

```sh
yarn dev
```

This will start the development server at `http://localhost:3000` using the production API by default.

### Local API Development

To run the application against your local API development environment instead of the production API:

#### Option 1: Using VS Code Launch Configurations (Recommended)

Open the Run and Debug panel in VS Code (Ctrl+Shift+D / Cmd+Shift+D) and select:
- **"Launch Vite Dev (Local API)"** - Uses your local API at `https://localhost:5001`
- **"Launch Vite Dev (Production API)"** - Uses the production API

#### Option 2: Using Convenience Scripts

- **Local API**: `yarn dev:local` - Uses your local API at `https://localhost:5001`
- **Production API**: `yarn dev:prod` - Uses the production API
- **Default**: `yarn dev` - Uses the production API (same as `dev:prod`)

#### Option 3: Using Environment File

1. Copy the example environment file:
   ```sh
   cp env.local.example .env.local
   ```

2. Edit `.env.local` and configure your local API settings:
   ```env
   # Set to 'true' to use local API instead of production
   VITE_USE_LOCAL_API=true
   
   # Local API URL (defaults to https://localhost:5001 if not set)
   VITE_LOCAL_API_URL=https://localhost:5001
   ```

3. Start the development server:
   ```sh
   yarn dev
   ```

When running in development mode, the application will log the current API configuration to the browser console, showing whether it's using the local or production environment.

### Build for Production

```sh
yarn run build
```

### Preview Production Build

```sh
yarn run preview
```

## Testing

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
yarn run test:unit
```

### Run Tests in Watch Mode

```sh
yarn run test:unit:watch
```

### Run Store Tests Only

```sh
yarn run test:stores
```

## Code Quality

### Type Checking

```sh
yarn run typecheck
```

### Lint with [ESLint](https://eslint.org/)

```sh
yarn run lint
```

## Configuration

See [Vite Configuration Reference](https://vitejs.dev/config/) for more details about customizing the build process.
