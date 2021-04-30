# Release notes

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
