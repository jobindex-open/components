import { onMounted, onUnmounted, watch, type Ref } from 'vue';

export const useIntersectionObserver = (
    target: Ref<HTMLElement | undefined>,
    container: Ref<HTMLElement | undefined>,
    callback: IntersectionObserverCallback
) => {
    let observer: IntersectionObserver | null = null;

    const createObserver = () => {
        if (!target.value || !container.value) return;

        observer = new IntersectionObserver(callback, {
            root: container.value,
        });

        observer.observe(target.value);
    };

    const cleanup = () => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    };

    onMounted(() => {
        createObserver();
    });

    onUnmounted(() => {
        cleanup();
    });

    watch(container, () => {
        cleanup();
        createObserver();
    });

    return { cleanup };
};
