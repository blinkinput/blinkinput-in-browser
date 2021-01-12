/**
 * BlinkInput In-browser SDK demo app which demonstrates how to:
 *
 * - Change default SDK settings
 * - Scan Automobile VIN barcode
 * - Provide visual feedback to the end-user during the scan
 */
import * as BlinkInputSDK from "@microblink/blinkinput-in-browser-sdk";

// General UI helpers
const initialMessageEl = document.getElementById( "msg" ) as HTMLHeadingElement;
const progressEl = document.getElementById( "load-progress" ) as HTMLProgressElement;

// UI elements for scanning feedback
const cameraFeed = document.getElementById( "camera-feed" ) as HTMLVideoElement;
const cameraFeedback = document.getElementById( "camera-feedback" ) as HTMLCanvasElement;
const drawContext = cameraFeedback.getContext( "2d" ) as CanvasRenderingContext2D;

/**
 * Initialize and load WASM SDK.
 */
function main()
{
    // Check if browser has proper support for WebAssembly
    if ( !BlinkInputSDK.isBrowserSupported() )
    {
        initialMessageEl.innerText = "This browser is not supported!";
        return;
    }

    // 1. It's possible to obtain a free trial license key on microblink.com
    let licenseKey = "sRwAAAYJbG9jYWxob3N0r/lOPso/w35CpCHVKSk4kBBEMlrbHMZwOjj9IPUHSL2Rwjp8hef/6d+Kf3culmRkMtIuRNLstWu60qfb2vywITcdVR1QPKHcVfB+Zc1PxKyAq0SeZ8J4+k8GOGxPH6X61jiV1/R6O4a5GM1Ur5PfpgG5q+UsyEWF6fofiPn6PtqUmUNvJi8HNTP9oo6qMw==";

    if ( window.location.hostname === "blinkinput.github.io" )
    {
        licenseKey = "sRwAAAYUYmxpbmtpbnB1dC5naXRodWIuaW+krJ01+7UhltWc6oJ4fJaX8BLc7s6iE9XLdi4C+1iG5yaQ0HP7943EZ6IT4mtUBN+CKUIN0qGkNaFrT7vWkvjTljEeacSUHgezbQQw52cjvwFmHazR1ADLZX83wFuBYSEVJcAb94MUwYKDVdfxIo1r1Z/hxUrx/eBmg4SDVNN86pP0UX+Xl/oMlM3DfPwj";
    }

    // 2. Create instance of SDK load settings with your license key
    const loadSettings = new BlinkInputSDK.WasmSDKLoadSettings( licenseKey );

    // [OPTIONAL] Change default settings

    // Show or hide hello message in browser console when WASM is successfully loaded
    loadSettings.allowHelloMessage = true;

    // In order to provide better UX, display progress bar while loading the SDK
    loadSettings.loadProgressCallback = ( progress: number ) => progressEl!.value = progress;

    // Set absolute location of the engine, i.e. WASM and support JS files
    loadSettings.engineLocation = window.location.origin + "/resources";

    // 3. Load SDK
    BlinkInputSDK.loadWasmModule( loadSettings ).then
    (
        ( sdk: BlinkInputSDK.WasmSDK ) =>
        {
            document.getElementById( "screen-initial" )?.classList.add( "hidden" );
            document.getElementById( "screen-start" )?.classList.remove( "hidden" );
            document.getElementById( "start-scan" )?.addEventListener( "click", ( ev: any ) =>
            {
                ev.preventDefault();
                startScan( sdk );
            });
        },
        ( error: any ) =>
        {
            initialMessageEl.innerText = "Failed to load SDK!";
            console.error( "Failed to load SDK!", error );
        }
    );
}

/**
 * Scan Automobile VIN barcode.
 */
async function startScan( sdk: BlinkInputSDK.WasmSDK )
{
    document.getElementById( "screen-start" )?.classList.add( "hidden" );
    document.getElementById( "screen-scanning" )?.classList.remove( "hidden" );

    // 1. Create a recognizer objects which will be used to recognize single image or stream of images.
    //
    // In this example, we create a VinRecognizer, which knows how to scan barcodes from automobile VIN plates
    // and extract payment information from them.
    const vinRecognizer = await BlinkInputSDK.createVinRecognizer( sdk );

    // [OPTIONAL] Create a callbacks object that will receive recognition events, such as detected object location etc.
    const callbacks = {
        onQuadDetection: ( quad: BlinkInputSDK.DisplayableQuad ) => drawQuad( quad )
    }

    // 2. Create a RecognizerRunner object which orchestrates the recognition with one or more
    //    recognizer objects.
    const recognizerRunner = await BlinkInputSDK.createRecognizerRunner
    (
        // SDK instance to use
        sdk,
        // List of recognizer objects that will be associated with created RecognizerRunner object
        [ vinRecognizer ],
        // [OPTIONAL] Should recognition pipeline stop as soon as first recognizer in chain finished recognition
        false,
        // [OPTIONAL] Callbacks object that will receive recognition events
        callbacks
    );

    // 3. Create a VideoRecognizer object and attach it to HTMLVideoElement that will be used for displaying the camera feed
    const videoRecognizer = await BlinkInputSDK.VideoRecognizer.createVideoRecognizerFromCameraStream
    (
        cameraFeed,
        recognizerRunner
    );

    // 4. Start the recognition and await for the results
    const processResult = await videoRecognizer.recognize();

    // 5. If recognition was successful, obtain the result and display it
    if ( processResult !== BlinkInputSDK.RecognizerResultState.Empty )
    {
        const vinResult = await vinRecognizer.getResult();
        if ( vinResult.state !== BlinkInputSDK.RecognizerResultState.Empty )
        {
            console.log( "VIN results", vinResult );
            alert
            (
                `Scanned Vehicle Identification number is ${vinResult.vin}!`
            );
        }
    }
    else
    {
        alert( "Could not extract information!" );
    }

    // 7. Release all resources allocated on the WebAssembly heap and associated with camera stream

    // Release browser resources associated with the camera stream
    videoRecognizer?.releaseVideoFeed();

    // Release memory on WebAssembly heap used by the RecognizerRunner
    recognizerRunner?.delete();

    // Release memory on WebAssembly heap used by the recognizer
    vinRecognizer?.delete();

    // Clear any leftovers drawn to canvas
    clearDrawCanvas();

    // Hide scanning screen and show scan button again
    document.getElementById( "screen-start" )?.classList.remove( "hidden" );
    document.getElementById( "screen-scanning" )?.classList.add( "hidden" );
}

/**
 * Utility functions for drawing detected quadrilateral onto canvas.
 */
function drawQuad( quad: BlinkInputSDK.DisplayableQuad )
{
    clearDrawCanvas();

    // Based on detection status, show appropriate color and message
    setupColor( quad );

    applyTransform( quad.transformMatrix );
    drawContext.beginPath();
    drawContext.moveTo( quad.topLeft    .x, quad.topLeft    .y );
    drawContext.lineTo( quad.topRight   .x, quad.topRight   .y );
    drawContext.lineTo( quad.bottomRight.x, quad.bottomRight.y );
    drawContext.lineTo( quad.bottomLeft .x, quad.bottomLeft .y );
    drawContext.closePath();
    drawContext.stroke();
}

/**
 * This function will make sure that coordinate system associated with detectionResult
 * canvas will match the coordinate system of the image being recognized.
 */
function applyTransform( transformMatrix: Float32Array )
{
    const canvasAR = cameraFeedback.width / cameraFeedback.height;
    const videoAR = cameraFeed.videoWidth / cameraFeed.videoHeight;

    let xOffset = 0;
    let yOffset = 0;
    let scaledVideoHeight = 0
    let scaledVideoWidth = 0

    if ( canvasAR > videoAR )
    {
        // pillarboxing: https://en.wikipedia.org/wiki/Pillarbox
        scaledVideoHeight = cameraFeedback.height;
        scaledVideoWidth = videoAR * scaledVideoHeight;
        xOffset = ( cameraFeedback.width - scaledVideoWidth ) / 2.0;
    }
    else
    {
        // letterboxing: https://en.wikipedia.org/wiki/Letterboxing_(filming)
        scaledVideoWidth = cameraFeedback.width;
        scaledVideoHeight = scaledVideoWidth / videoAR;
        yOffset = ( cameraFeedback.height - scaledVideoHeight ) / 2.0;
    }

    // first transform canvas for offset of video preview within the HTML video element (i.e. correct letterboxing or pillarboxing)
    drawContext.translate( xOffset, yOffset );
    // second, scale the canvas to fit the scaled video
    drawContext.scale
    (
        scaledVideoWidth / cameraFeed.videoWidth,
        scaledVideoHeight / cameraFeed.videoHeight
    );

    // finally, apply transformation from image coordinate system to
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform
    drawContext.transform
    (
        transformMatrix[0],
        transformMatrix[3],
        transformMatrix[1],
        transformMatrix[4],
        transformMatrix[2],
        transformMatrix[5]
    );
}

function clearDrawCanvas()
{
    cameraFeedback.width = cameraFeedback.clientWidth;
    cameraFeedback.height = cameraFeedback.clientHeight;

    drawContext.clearRect
    (
        0,
        0,
        cameraFeedback.width,
        cameraFeedback.height
    );
}

function setupColor( displayable: BlinkInputSDK.Displayable )
{
    let color = "#FFFF00FF";

    if ( displayable.detectionStatus === 0 )
    {
        color = "#FF0000FF";
    }
    else if ( displayable.detectionStatus === 1 )
    {
        color = "#00FF00FF";
    }

    drawContext.fillStyle = color;
    drawContext.strokeStyle = color;
    drawContext.lineWidth = 5;
}

// Run
main();
