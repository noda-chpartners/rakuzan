// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  integrations: [
    icon({
      include: {
        lucide: [
          'menu',
          'x',
          'phone',
          'map-pin',
          'train-front',
          'clock',
          'users',
          'calendar-days',
          'chevron-down',
          'leaf',
          'utensils',
          'wine',
          'navigation',
        ],
      },
    }),
  ],
});
