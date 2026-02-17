# Jobindex Components

This is a collection of frontend components and libraries, developed in house at Jobindex.

## Contents

### Apps

- [`playground`](/apps/playground): A vite based development app

### Packages

- [`pdf-viewer`](/packages/pdf-viewer): A `pdfjs` based PDF viewer for vue projects

#### Internal

- [`config-ts`](/packages/config-ts): Contains various tsconfig files
- [`common`](/packages/common): A utility library meant for common use for other packages.

## Structure

This repository is a monorepo, managed with turbo-repo.

There are two main places to place code:

- `apps/`: Contains standalone apps
- `packages/`: Contains libraries to be consumed by other apps

See [Contents](#contents) for what packages are currently available.

## Development

To get started you need yarn 1.22.22 installed on your system.

Clone the repo to your computer and run the following command to install dependencies

```sh
yarn
```

Avaliable commands using `yarn [command]`:

- `dev`: Start the playground app to get started developing
- `test`: Run the test suite
- `build`: Build the project
- `lint`: Run the linter
- `clean`: Removes build outputs
- `format`: Format project using prettier

### Creating new components

To create a new component just create a subfolder in `packages/` (or `/app` if creating a standalone app),
and initialize it like you would any other project.

For example to create a new vite project:

```sh
cd packages

yarn create vite my-vite-project --template vue-ts

cd my-vite-project
```

The project will automatically be picked up by yarn and turbo.

Make sure to add an entry in [Contents](#contents) in this README, linking to your new app or package.

#### Naming

Make sure to name the package in `package.json` the naming convention is to append `@jobindex/`
in front of the package name, for example: `@jobindex/my-vite-project`.

#### Targeting projects

To do things like installing dependencies or running scripts on your new project, you can specify
the workspace when running yarn. For example:

```sh
yarn workspace @jobindex/my-vite-project add [package]
```

#### Scripts

To make sure your project is being built, tested and linted correctly, make sure
the respective scripts are named correctly, for example:

```json
{
    ...

    "scripts": {
        "build": "vite build",
        "build:types": "vue-tsc --declaration --emitDeclarationOnly -p tsconfig.build.json",
        "lint": "eslint 'src/**/*.{ts,vue}'",
        "coverage": "vitest run --coverage",
        "test": "vitest run",
        "test:watch": "vitest",
        "clean": "rimraf ./dist ./coverage",
        "test:browser": "vitest run --config vitest.browser.config.ts --browser.headless",
        "test:browser-watch": "vitest --config vitest.browser.config.ts"
    },

    ...
}
```

These scripts enable automatic testing and building in the github actions, as turbo is configured to look
for certain script names.

Have a look at `turbo.json` to get an idea of what scripts are available.

#### Common configs

The repo provides some local packages specificly for configuration, such as `tsconfig.json` templates and
(WIP) eslint configurations.

Project templates for getting set up with a fully featured project is on the roadmap.

### Local dependencies

When adding local dependencies the version number is set to `*`.
For example to install the local `@jobindex/common` package add the following to the projects `package.json`:

```json
{
    ...
    "devDependencies": {
        "@jobindex/common": "*",
    }
}
```

The local package is now available in the project just like a normal dependency.

This pattern enables changes to the common code to instantly be available in the projects
that depend on them, which makes development of common libraries easy.

One pitfall to be wary of is that since the local packages aren't published anywhere,
they aren't versioned (beyond being part of the git repo) so there is currently
no easy way of a project to depend on an old version of a local package.

## Testing

This repo uses `vitest` for testing.

(WIP)

## Developing using Nix

A flake config provides a handy development shell that provides all needed dependencies,
as well as a few handy tools and automatic setup of git hooks.

To enter the shell use (requires nix-flakes and nix-command enabled):

```sh
nix develop
```

or if you have direnv installed you can allow this project using:

```sh
direnv allow
```

### Playwright browser tests

Playwright isn't supported on NixOS and getting it working was a headache, so this projects `flake.nix`
provides a docker based playwright server. It requires docker to be installed on the system.

When in a development shell the ENV variable `PW_TEST_CONNECT_WS_ENDPOINT` is set, informing vitest to
connect to the the provided playwright server. NB.: this overrides the normal behavior and wont allow
playwright to connect to servers run normally.

To run the playwright server, you can from inside a development shell run the following command:

```sh
sudo playwright-server
```

The running process can be terminated with `ctrl+c`.

## Contributing

Pull requests are welcome.
Please open an issue for larger changes.

Please make sure to format your code before committing by running `yarn format`, or set up a prettier git hook.

Consider following conventional commit message formatting ([https://www.conventionalcommits.org/en/v1.0.0/]).

## License

BSD 3-Clause License
