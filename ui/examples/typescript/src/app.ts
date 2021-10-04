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

    blinkInput.licenseKey = "sRwAAAYJbG9jYWxob3N0r/lOPmg/w35CpCHVK8ETze7K6Sabx+JpkJta2XZrNcZecjiVK3kNhHD1+35RKWAHd+6wyWq/SMxSdmrbjG88//CGYKnIsJogOU7RMDWsngkZMJkJ+/2ddBCG4tMBuXGDjgvrO/Vu6exbHucwPGkTnkvpIL0OnwX1EW5LakQhDqEJDs8WxHZV+2zFN6tDXtR2d4UsRKINubo7zN/NxbwppMoaWuDwRlYy9t2c0idCSAU9kg+e";
    blinkInput.engineLocation = window.location.origin;
    blinkInput.recognizers = [ "BarcodeRecognizer" ];

    blinkInput.recognizerOptions = {
        "BarcodeRecognizer": {
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
