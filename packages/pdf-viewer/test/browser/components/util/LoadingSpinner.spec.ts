import { test, expect } from 'vitest';
import LoadingSpinner from '@src/components/util/LoadingSpinner.vue';
import { mount } from '@vue/test-utils';

test('counter button increments the count', () => {
    const wrapper = mount(LoadingSpinner, {
        props: {
            progress: 0.9,
        },
    });

    const label = wrapper.get('p');
    expect(label.text()).toBe('Loading: 90%');
});
