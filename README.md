# PDFjs Vue

A Vue 3 PDF viewer component using Mozillas [pdf.js](https://github.com/mozilla/pdf.js).

## Install

Npm:

```sh
npm i pdfjs-dist <package-name-here>
```

Yarn:

```sh
yarn add pdfjs-dist pdfjs-vue@https://github.com/jobindex-open/pdfjs-vue/releases/download/v0.1.1/dist.tar.gz
```

Pnpm:

```sh
pnpm i pdfjs-dist <package-name-here>
```

## Usage

Basic usage:

```vue
<script setup>
import { PDFViewer } from 'pdfjs-vue';
import 'pdfjs-vue/style.css';
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

## Credits:

- PDF engine: [pdf.js](https://github.com/mozilla/pdf.js)
- Icons used: [Iconoir](https://iconoir.com/)

## Simmilar projects:

- [vue-pdf by TaTo30](https://github.com/TaTo30/vue-pdf)

## TODO:

- Add tests using vitest
- Redo build process, either using tsdown or vite
- Prettier playground with more examples
- Add more configuration options
- Improve pinch zoom, to zoom to midpoint between touches instead of middle of page
