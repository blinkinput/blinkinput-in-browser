/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */

// Import typings for UI component
import "@microblink/blinkinput-in-browser-sdk/ui";

// Import typings for custom events
import
{
    EventFatalError,
    EventScanError,
    EventScanSuccess
} from "@microblink/blinkinput-in-browser-sdk/ui/dist/types/utils/data-structures";

function initializeUiComponent()
{
    const blinkInput = document.querySelector( "blinkinput-in-browser" ) as HTMLBlinkinputInBrowserElement;

    if ( !blinkInput )
    {
        throw "Could not find UI component!";
    }

    blinkInput.licenseKey = "sRwAAAYJbG9jYWxob3N0r/lOPgo/w35CpCHVK3E6YDX3zcxX/6UEbyceRrEl21dNHd0b83IUe+xvVBMc3yRIPZYSZf6ffXQpy0+zYD79HSxpheV6Xit2HMJcHqQFM9xrt+UWpWHV+0vk99LxyJyvlL3Sf8+R+kbdRBHmewj/Io+7uZ01w0CDGXxfQussi5Tpvk+t/spwy5BBD0wrspsvHw==";
    blinkInput.engineLocation = window.location.origin;
    blinkInput.recognizers = [ "BarcodeRecognizer" ];

    /* [TEMPORARY FIX]
     * Use basic WebAssembly builds since most performant option requires server setup and unpkg.com, which is used
     * for examples, doesn't support COOP and COEP headers.
     *
     * For more information see "Integration" section in the official documentation.
     */
    blinkInput.wasmType = "BASIC";
    
    blinkInput.recognizerOptions = {
        'BarcodeRecognizer': {
            shouldScanInverse: true,
            slowerThoroughScan: true,
            nullQuietZoneAllowed: false,
            uncertainDecodingAllowed: false,
            useAutoScale: true,
            readCode39AsExtendedData: true,
            scanAztec: true,
            scanCode128: true,
            scanCode39: true,
            scanDataMatrix: true,
            scanEAN13: true,
            scanEAN8: false,
            scanITF: false,
            scanPDF417: true,
            scanQRCode: true,
            scanUPCA: false,
            scanUPCE: false
        }
    };

    blinkInput.addEventListener( "fatalError", ( ev: CustomEventInit< EventFatalError > ) =>
    {
        const fatalError = ev.detail;
        console.log( "Could not load UI component", fatalError );
    });

    blinkInput.addEventListener( "scanError", ( ev: CustomEventInit< EventScanError > ) =>
    {
        const scanError = ev.detail;
        console.log( "Could not scan a document", scanError );
    });

    blinkInput.addEventListener( "scanSuccess", ( ev: CustomEventInit< EventScanSuccess > ) =>
    {
        const scanResults = ev.detail;
        console.log( "Scan results", scanResults );
    });
}

window.addEventListener( "DOMContentLoaded", () => initializeUiComponent() );
