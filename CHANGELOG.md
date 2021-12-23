# Release notes

## 4.4.4

### Platform-related SDK changes

* We've added methods for programmatically starting camera and image scan when using the UI component.
    * It's possible to call `startCameraScan()` and `startImageScan(File)` methods on the custom web element.
* We've standardized error structures returned from the WebAssembly library and the UI component.
    * See [SDKError.ts](src/MicroblinkSDK/SDKError.ts) and [ErrorTypes.ts](src/MicroblinkSDK/ErrorTypes.ts) for a complete list of possible error codes.
* We've completed support for `part::` selector and added [an example](ui/README.md#customization-ui-css-part).
* We've simplified integration of the UI component with Angular and React frameworks.
    * [Integration guide for Angular](ui/README.md#installation-angular)
    * [Integration guide for React](ui/README.md#installation-react)

### Bug fixes

* We've ensured that all SDK errors can be visible from `fatalError` and `scanError` events in the UI component.
* We've fixed a bug where a user couldn't upload an image after the camera scan failed to start.
* We've fixed a bug where the video feed wasn't released in the scenario where the UI component was removed from the DOM.
* We've improved memory management during the initialization of the UI component to avoid the creation of unnecessary web workers.

## 4.4.3

### Platform-related SDK changes

* We've improved the performance of the SDK by adding support for WebAssembly SIMD.
    * This increases the scanning performance on compatible browsers up to 77% and up to 94% in cases when WebAssembly threads are also supported.
    * Keep in mind that this feature requires a compatible browser (Chrome 91 and Firefox 90 or newer versions). Only `advanced` and `advanced-threads` binaries are using SIMD. In case that the browser doesn't support this feature, `basic` binary will be used.
* We've reduced the memory fragmentation during video processing, resulting in a smaller memory footprint.
* We've added a camera management UI module for the selection of connected cameras
    * We've added `VideoRecognizer.changeCameraDevice` method that can be used to change the active camera device during the scanning session
* We've improved accessibility of the UI component by changing background contrasts and increasing default font sizes
* We've added a mechanism to automatically delete an instance of worker script in case of unsuccessful SDK initialization.
    * New method `WasmSDK.delete()` was added for this purpose and is available on every instance of the SDK.
* We've changed improper error handling in the `VideoRecognizer` class.
    * From now on, it's possible to catch all errors that happen during the video recognition.

### Bug fixes

* We've optimised memory usage of the SDK by fixing a problem where every refresh of the UI component would result in a new instance of web worker

## 4.4.2

* We’ve temporarily unlisted Aztec 2D and Data Matrix 2D from supported barcodes.

## 4.4.1

### UI component

* We added a UI component in the format of a custom web element to use BlinkInput on your web in an effortless way.
* Check out the [README file](README.md) for instructions on how to use UI component, or check the [ui directory](/ui) for complete source code.

### Performance improvements

* We've added three different flavors of WebAssembly builds to the SDK, to provide better performance across all browsers
    * Unless defined otherwise, the SDK will load the best possible bundle during initialization:
        * `Basic` Same as the existing WebAssembly build, most compatible, but least performant.
        * `Advanced` WebAssembly build that provides better performance but requires a browser with advanced features.
        * `AdvancedWithThreads` Most performant WebAssembly build which requires a proper setup of COOP and COEP headers on the server-side.
    * For more information about different WebAssembly builds and how to use them properly, check out the [relevant section](README.md/#deploymentGuidelines) in our official documentation

### SDK changes

* We've exposed a couple of functions that are used by the SDK to determine which WebAssembly bundle to load and from which location
    * Function `detectWasmType()` returns the best possible WebAssembly bundle based on the browser features.
    * Function `wasmFolder( WasmType )` returns the name of the resources subfolder of the provided WebAssembly bundle type.
    * For more information about the declaration of mentioned functions, see [`WasmLoadUtils.ts`](src/MicroblinkSDK/WasmLoadUtils.ts) file.

* Added support to flip camera view.
    * Method `flipCamera` has been added to [`VideoRecognizer` class](src/MicroblinkSDK/VideoRecognizer.ts).
* Added support to set desired camera ID when scanning from camera.
    * Method `createVideoRecognizerFromCameraStream` has been extended in [`VideoRecognizer` class](src/MicroblinkSDK/VideoRecognizer.ts).

## 4.4.0

- initial release of the BlinkInput In-browser SDK
- supported recognizers:
    - generic barcode recognizer
    - SIM number barcode recognizer
    - VIN barcode recognizer
