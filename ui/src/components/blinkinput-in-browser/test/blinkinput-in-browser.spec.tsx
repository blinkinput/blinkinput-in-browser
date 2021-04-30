/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */

import { newSpecPage } from '@stencil/core/testing';
import { BlinkinputInBrowser } from '../blinkinput-in-browser';

describe('blinkinput-in-browser', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BlinkinputInBrowser],
      html: `<blinkinput-in-browser></blinkinput-in-browser>`,
    });
    expect(page.root).toEqualHtml(`
      <blinkinput-in-browser>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </blinkinput-in-browser>
    `);
  });
});
