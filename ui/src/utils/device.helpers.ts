/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */

import * as BlinkInputSDK from "../../../es/blinkinput-sdk";

export function hasVideoDevices(): Promise<boolean> {
  return new Promise((resolve) => {
    if (
      !window.navigator ||
      !window.navigator.mediaDevices ||
      typeof window.navigator.mediaDevices.enumerateDevices !== 'function'
    ) {
      resolve(false);
      return;
    }

    window.navigator.mediaDevices.enumerateDevices().then((devices) => {
      devices = devices || [];

      for (const device of devices) {
        if (device && device.kind === 'videoinput') {
          resolve(true);
          return;
        }
      }

      resolve(false);
    });
  });
}

export function isWasmSupported(): Promise<boolean> {
  return new Promise((resolve) => {
    const wasmSupport = BlinkInputSDK.isBrowserSupported();

    resolve(wasmSupport);
  });
}

export async function checkMandatoryCapabilites(): Promise<boolean> {
  const wasmSupport = await isWasmSupported();

  return wasmSupport;
}
