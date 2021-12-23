/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */

import * as BlinkInputSDK from '../../../../../es/blinkinput-sdk';

function getSDKWasmType(wasmType: string): BlinkInputSDK.WasmType | null {
  switch (wasmType) {
    case 'BASIC':
      return BlinkInputSDK.WasmType.Basic;
    case 'ADVANCED':
      return BlinkInputSDK.WasmType.Advanced;
    case 'ADVANCED_WITH_THREADS':
      return BlinkInputSDK.WasmType.AdvancedWithThreads;
    default:
      return null;
  }
}

export { getSDKWasmType }
