/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */

import { newE2EPage } from '@stencil/core/testing';

describe('blinkinput-in-browser', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<blinkinput-in-browser></blinkinput-in-browser>');

    const element = await page.find('blinkinput-in-browser');
    expect(element).toHaveClass('hydrated');
  });
});
