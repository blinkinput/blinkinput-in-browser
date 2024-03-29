/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */

import { CapturedFrame } from "../FrameCapture";

import
{
    RecognizerResultState,
    RecognizerRunner,
    WasmModuleProxy,
    WasmSDK,
    Recognizer
} from "../DataStructures";

import { MetadataCallbacks } from "../MetadataCallbacks";
import { ClearTimeoutCallback } from "../ClearTimeoutCallback";
import { WasmType } from "../WasmType";
import { SDKError } from "../SDKError";
import * as ErrorTypes from "../ErrorTypes";

// ============================================ /
// Local Proxy Implementation                   /
// ============================================ /

/* eslint-disable @typescript-eslint/no-unsafe-member-access,
                  @typescript-eslint/no-unsafe-call,
                  @typescript-eslint/no-explicit-any,
                  @typescript-eslint/no-unsafe-assignment */
class WasmLocalRecognizerRunner implements RecognizerRunner
{
    private nativeRecognizerRunner: any;

    constructor( nativeRecognizerRunner: any )
    {
        if ( !nativeRecognizerRunner )
        {
            throw new SDKError( ErrorTypes.localSdkErrors.runnerEmpty );
        }
        this.nativeRecognizerRunner = nativeRecognizerRunner;
    }

    processImage( image: CapturedFrame ): Promise< RecognizerResultState >
    {
        return new Promise
        (
            ( resolve, reject ) =>
            {
                if ( !this.nativeRecognizerRunner )
                {
                    reject( new SDKError( ErrorTypes.localSdkErrors.runnerMissing ) );
                    return;
                }
                const result: number = this.nativeRecognizerRunner.processImage( image );
                resolve( result );
            }
        );
    }

    reconfigureRecognizers( recognizers: Array< Recognizer >, allowMultipleResults: boolean ): Promise< void >
    {
        return new Promise
        (
            ( resolve, reject ) =>
            {
                if ( !this.nativeRecognizerRunner )
                {
                    reject( new SDKError( ErrorTypes.localSdkErrors.runnerMissing ) );
                    return;
                }
                try
                {
                    this.nativeRecognizerRunner.reconfigureRecognizers( recognizers, allowMultipleResults );
                    resolve();
                }
                catch( error )
                {
                    reject( error );
                }
            }
        );
    }

    setMetadataCallbacks( metadataCallbacks: MetadataCallbacks ): Promise< void >
    {
        return new Promise
        (
            ( resolve, reject ) =>
            {
                if ( !this.nativeRecognizerRunner )
                {
                    reject( new SDKError( ErrorTypes.localSdkErrors.runnerMissing ) );
                    return;
                }
                this.nativeRecognizerRunner.setJSDelegate( metadataCallbacks );
                resolve();
            }
        );
    }

    resetRecognizers( hardReset: boolean ): Promise< void >
    {
        return new Promise
        (
            ( resolve, reject ) =>
            {
                if ( !this.nativeRecognizerRunner )
                {
                    reject( new SDKError( ErrorTypes.localSdkErrors.runnerMissing ) );
                    return;
                }
                this.nativeRecognizerRunner.resetRecognizers( hardReset );
                resolve();
            }
        );
    }

    setDetectionOnlyMode( detectionOnly: boolean ): Promise< void >
    {
        return new Promise
        (
            ( resolve, reject ) =>
            {
                if ( !this.nativeRecognizerRunner )
                {
                    reject( new SDKError( ErrorTypes.localSdkErrors.runnerMissing ) );
                    return;
                }
                this.nativeRecognizerRunner.setDetectionOnlyMode( detectionOnly );
                resolve();
            }
        );
    }

    setClearTimeoutCallback( clearTimeoutCallback: ClearTimeoutCallback | null ): Promise< void >
    {
        return new Promise
        (
            ( resolve, reject ) =>
            {
                if ( !this.nativeRecognizerRunner )
                {
                    reject( new SDKError( ErrorTypes.localSdkErrors.runnerMissing ) );
                    return;
                }
                this.nativeRecognizerRunner.setClearTimeoutCallback( clearTimeoutCallback );
                resolve();
            }
        );
    }

    setCameraPreviewMirrored( mirrored: boolean ): Promise< void >
    {
        return new Promise
        (
            ( resolve, reject ) =>
            {
                if ( !this.nativeRecognizerRunner )
                {
                    reject( new SDKError( ErrorTypes.localSdkErrors.runnerMissing ) );
                    return;
                }
                this.nativeRecognizerRunner.setCameraPreviewMirrored( mirrored );
                resolve();
            }
        );
    }

    delete(): Promise< void >
    {
        return new Promise
        (
            ( resolve ) =>
            {
                this.nativeRecognizerRunner.delete();
                this.nativeRecognizerRunner = null;
                resolve();
            }
        );
    }
}

/* eslint-disable @typescript-eslint/no-unsafe-assignment,
                  @typescript-eslint/no-unsafe-call,
                  @typescript-eslint/no-unsafe-member-access,
                  @typescript-eslint/no-explicit-any */
class WasmModuleLocalProxy implements WasmModuleProxy
{
    private readonly realWasmModule: any;

    constructor( realWasmModule: any )
    {
        this.realWasmModule = realWasmModule;
    }

    newRecognizer( className: string, ...constructorArgs: any[] ): Promise< Recognizer >
    {
        const nativeRecognizer: Recognizer = new this.realWasmModule[ className ]( ...constructorArgs );
        ( nativeRecognizer as any ).recognizerName = className;
        return Promise.resolve( nativeRecognizer );
    }

    createRecognizerRunner
    (
        recognizers:            Array< Recognizer >,
        allowMultipleResults    = false,
        metadataCallbacks:      MetadataCallbacks = {}
    ): Promise< RecognizerRunner >
    {
        const nativeRecognizerRunner = new this.realWasmModule.RecognizerRunner
        (
            recognizers,
            allowMultipleResults,
            metadataCallbacks
        );
        return Promise.resolve( new WasmLocalRecognizerRunner( nativeRecognizerRunner ) );
    }
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment,
                 @typescript-eslint/no-unsafe-call,
                 @typescript-eslint/no-unsafe-member-access,
                 @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types,
                  @typescript-eslint/no-explicit-any */
export class WasmSDKLocal implements WasmSDK
{
    readonly mbWasmModule: WasmModuleProxy;

    readonly showOverlay: boolean;

    readonly loadedWasmType: WasmType;

    constructor( wasmModule: any, showOverlay: boolean, loadedWasmType: WasmType )
    {
        this.mbWasmModule = new WasmModuleLocalProxy( wasmModule );
        this.showOverlay = showOverlay;
        this.loadedWasmType = loadedWasmType;
    }

    delete()
    {
        console.info( "Cannot delete local SDK backend." );
    }
}
/* eslint-enable @typescript-eslint/explicit-module-boundary-types,
                 @typescript-eslint/no-explicit-any */
