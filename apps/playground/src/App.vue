<script setup lang="ts">
import { PDFViewer, usePDF, useViewController } from '@jobindex/pdf-viewer';
import '@jobindex/pdf-viewer/style.css';

const controller = useViewController({
    scale: {
        factor: 1.5,
        step: 0.1,
        min: 0.1,
        max: 2,
    },
});

const customPdfLoader = usePDF('/example.pdf');
const workerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.js`;
</script>

<template>
    <div class="container mx-auto my-5 px-2">
        <h1 class="text-4xl mb-4">PDFjs Vue</h1>
        <h2 class="text-xl mb-2">Complete viewer</h2>
        <PDFViewer
            :style="{
                width: '100%',
                height: '900px',
            }"
            :pdf="customPdfLoader"
            :pdfjsWorker="workerUrl"
        />

        <h2 class="text-xl mt-4 mb-2">Custom toolbar</h2>
        <PDFViewer
            :style="{
                width: '100%',
                height: '900px',
            }"
            :controller="controller"
            pdf="/example2.pdf"
        >
            <template v-slot:toolbar>
                <div
                    class="w-full h-12 bg-purple-500 flex gap-4 items-center justify-between px-4"
                >
                    <div>
                        <button @click="controller.zoomIn()">Zoom in</button>
                        <button @click="controller.zoomOut()">Zoom out</button>
                    </div>

                    <div>
                        Page {{ controller.state.currentPage }} of
                        {{ controller.pageCount }}
                    </div>
                </div>
            </template>
        </PDFViewer>
    </div>

    <div
        class="container mx-auto mb-5 px-2 flex flex-col justify-center items-center"
    ></div>

    <div class="container mx-auto mb-5 px-2 flex justify-center">
        <div>
            <p>External controls:</p>
            <button @click="controller.goToPreviousPage()">
                Previous page
            </button>
            <button @click="controller.goToNextPage()">Next page</button>
        </div>
    </div>
</template>

<style>
.pdf-viewer {
    overflow: hidden;
    border-radius: 8px;
}
</style>

<style scoped>
.page-container {
    position: relative;
}
</style>
