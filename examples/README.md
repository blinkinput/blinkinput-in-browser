# Examples

Provided examples should help you with integration of this SDK with your app.

Deployment:

* When accessing examples via web browser always use `localhost` instead of `127.0.0.1`.
* Examples should be served via HTTPS.
    * We recommend usage of NPM package [https-localhost](https://www.npmjs.com/package/https-localhost) for simple local deployment.

## TypeScript Example

To run TypeScript example:

1. Install example dependencies and build an application:
    ```
    # Make sure you're in the 'examples/typescript' folder

    # Install dependencies
    npm install

    # Build an application in folder 'dist/'
    npm run build
    ```
2. Copy WASM and WebWorker resources which are loaded during runtime.
    * Copy folder `node_modules/@microblink/blinkinput-in-browser-sdk/resources/` to folder `dist/`.
3. Serve `dist/` folder, e.g. `serve dist/`.

## ES Bundle

To run ES bundle example:

1. Serve `es-module/` folder, e.g. `serve es-module/`.
    * WASM and WebWorker resources are already placed in the `es-module/` folder.

## UMD Bundle

To run UMD bundle example (standard browser integration):

1. Serve `umd/` folder, e.g. `serve umd/`.
    * WASM and WebWorker resources are already placed in the `umd/` folder.
