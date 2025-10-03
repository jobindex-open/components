<script setup lang="ts">
import { type ViewController } from '../../composables/use-view-controller';
import ZoomSelector from './ZoomSelector.vue';
import PageSelector from './PageSelector.vue';

const { controller } = defineProps<{
    controller: ViewController;
}>();
</script>

<template>
    <div class="pdf-viewer-toolbar">
        <div class="toolbar-area">
            <button
                class="toolbar-button"
                title="Toggle Fullscreen"
                @click="controller.toggleFullscreen"
            >
                <svg
                    v-if="!controller.state.isFullscreen"
                    width="18px"
                    height="18px"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#FFFFFF"
                >
                    <path
                        d="M9 9L4 4M4 4V8M4 4H8"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                    <path
                        d="M15 9L20 4M20 4V8M20 4H16"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                    <path
                        d="M9 15L4 20M4 20V16M4 20H8"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                    <path
                        d="M15 15L20 20M20 20V16M20 20H16"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                </svg>
                <svg
                    v-else
                    width="18px"
                    height="18px"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#FFFFFF"
                >
                    <path
                        d="M20 20L15 15M15 15V19M15 15H19"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                    <path
                        d="M4 20L9 15M9 15V19M9 15H5"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                    <path
                        d="M20 4L15 9M15 9V5M15 9H19"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                    <path
                        d="M4 4L9 9M9 9V5M9 9H5"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                </svg>
            </button>
        </div>
        <div class="toolbar-area toolbar-option-group">
            <button
                class="toolbar-button toolbar-button--mobile-hidden"
                title="Previous Page"
                @click="
                    () => {
                        controller.goToPreviousPage();
                    }
                "
            >
                <svg
                    width="18px"
                    height="18px"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#FFFFFF"
                >
                    <path
                        d="M15 6L9 12L15 18"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                </svg>
            </button>
            <PageSelector
                :current-page="controller.state.currentPage"
                :page-count="controller.pageCount.value"
                @change="
                    (page) => {
                        controller.goToPage(page);
                    }
                "
            />

            <button
                class="toolbar-button toolbar-button--mobile-hidden"
                title="Next Page"
                @click="
                    () => {
                        controller.goToNextPage();
                    }
                "
            >
                <svg
                    width="18px"
                    height="18px"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#FFFFFF"
                >
                    <path
                        d="M9 6L15 12L9 18"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                </svg>
            </button>
        </div>

        <div class="toolbar-area toolbar-option-group">
            <ZoomSelector
                :current="controller.state.scale"
                :options="controller.zoomOptions.value"
                @change="
                    (opt) => {
                        controller.setScale(opt);
                    }
                "
            />
            <button
                class="toolbar-button toolbar-button--mobile-hidden"
                title="Zoom Out"
                @click="
                    () => {
                        controller.zoomOut();
                    }
                "
            >
                <svg
                    width="18px"
                    height="18px"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#FFFFFF"
                >
                    <path
                        d="M6 12H18"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                </svg>
            </button>
            <button
                class="toolbar-button toolbar-button--mobile-hidden"
                title="Zoom In"
                @click="
                    () => {
                        controller.zoomIn();
                    }
                "
            >
                <svg
                    width="18px"
                    height="18px"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#FFFFFF"
                >
                    <path
                        d="M6 12H12M18 12H12M12 12V6M12 12V18"
                        stroke="#FFFFFF"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<style>
.pdf-viewer-toolbar {
    background-color: rgb(60, 60, 60);

    display: flex;
    justify-content: space-between;

    .toolbar-area {
        flex: 1;
        padding: 6px;

        display: flex;
        align-items: center;
        gap: 0.5em;
        justify-content: center;

        &:first-child {
            padding-left: 16px;
            justify-content: left;
        }

        &:last-child {
            padding-right: 16px;
            justify-content: right;
        }
    }

    .toolbar-option-group {
        display: flex;
        gap: 0.5em;
        align-items: center;
    }

    select,
    input,
    .toolbar-button {
        border-radius: 5px;
        box-sizing: border-box;

        cursor: pointer;

        transition: background-color 0.15s ease-in;

        &:focus {
            outline: auto;
        }

        &.toolbar-button--mobile-hidden {
            display: none;

            @media screen and (min-width: 480px) {
                display: inline-block;
            }
        }
    }

    select,
    input {
        display: inline-block;
        padding: 0.2rem;
        border: 1px solid rgb(25, 25, 25);
        background-color: rgb(50, 50, 50);
    }

    .toolbar-button {
        padding: 0.2em 0.5em;
        height: 2em;

        &:hover {
            background-color: rgb(100, 100, 100);
        }
    }
}
</style>
