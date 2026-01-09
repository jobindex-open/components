# Jobindex Components

## What is it?

This repo contains a library of frontend components and libraries created by Jobindex.

## Motivation

wip

## Structure

This repo is a monorepo using turborepo.

There are two main places to place code:

- `apps/`: Contains standalone apps
- `packages/`: Contains libraries to be consumed by other apps

### Apps

- [`playground`](/apps/playground): A vite based development app

### Packages

- [`pdf-viewer`](/packages/pdf-viewer): A `pdfjs` based PDF viewer for vue projects

#### Internal

- [`config-ts`](/packages/config-ts): Contains various tsconfig files
- [`common`](/packages/common): A utility library meant for common use for other packages.

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

### Developing using Nix

A flake config provides a handy development shell that provides all needed dependencies,
as well as a few handy tools and automatic setup of git hooks.

To enter the shell use (requires nix-flakes and nix-command enabled):

```
nix develop
```

or if you have direnv installed you can allow this project using:

```
direnv allow
```

### Writing tests

This repo uses `vitest` for testing.

## Contributing

Pull requests are welcome.
Please open an issue for larger changes.

Please make sure to format your code before committing by running `yarn format`, or set up a prettier git hook.

## License

BSD 3-Clause License
