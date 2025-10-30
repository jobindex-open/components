import { test, expect } from 'vitest';
import LoadingSpinner from '@src/components/util/LoadingSpinner.vue';
import { render } from 'vitest-browser-vue';

test('counter button increments the count', async () => {
    const { getByText } = render(LoadingSpinner, {
        props: {
            progress: 0.9,
        },
    });

    await expect.element(getByText('Loading: 90%')).toBeInTheDocument();
});
