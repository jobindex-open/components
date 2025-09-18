# PDFjs Vue

A Vue 3 PDF viewer component using Mozillas [pdf.js](https://github.com/mozilla/pdf.js).

## Install

Npm:

```sh
npm i <package-name-here>
```

Yarn:

```sh
yarn add <package-name-here>
```

Pnpm:

```sh
pnpm i <package-name-here>
```

## Usage

Basic usage:

```vue
<script setup>
import { PDFViewer } from 'pdfjs-vue-viewer';
</script>

<template>
    <PDFViewer
        :style="{
            width: '100%',
            height: '900px',
        }"
        pdf="/document.pdf"
    />
</template>
```

## TODO:

- Add tests using vitest
- Redo build process, either using tsdown or vite
- Prettier playground with more examples
- Add more configuration options
- Improve pinch zoom, to zoom to midpoint between touches instead of middle of page
