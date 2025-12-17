# PDF Viewer

A Vue 3 PDF viewer component using Mozillas [pdf.js](https://github.com/mozilla/pdf.js).

## Install

Npm:

```sh
npm i pdfjs-dist @jobindex/pdf-viewer
```

Yarn:

```sh
yarn add pdfjs-dist @jobindex/pdf-viewer
```

Pnpm:

```sh
pnpm i pdfjs-dist @jobindex/pdf-viewer
```

## Usage

Basic usage:

```vue
<script setup>
import { PDFViewer } from '@jobindex/pdf-viewer';
import '@jobindex/pdf-viewer/style.css';
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
