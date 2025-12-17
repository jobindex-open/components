import { watch, type Ref } from 'vue';

export const useIntersectionObserver = (
    target: HTMLElement,
    container: Ref<HTMLElement | undefined>,
    callback: IntersectionObserverCallback
) => {
    let _cleanup = () => {};
    watch(
        container,
        () => {
            _cleanup();
            if (!container.value) return;

            const observer = new IntersectionObserver(callback, {
                root: container.value,
            });

            observer.observe(target);

            _cleanup = () => {
                observer.disconnect();
                _cleanup = () => {};
            };
        },
        { immediate: true, flush: 'post' }
    );

    return { watch };
};
