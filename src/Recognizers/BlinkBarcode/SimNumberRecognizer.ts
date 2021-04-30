/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */

import { Recognizer, RecognizerResult, RecognizerSettings, WasmSDK } from "../../MicroblinkSDK/DataStructures";

/**
 * A settings object that is used for configuring the SimNumberRecognizer.
 */
export class SimNumberRecognizerSettings implements RecognizerSettings
{}

/**
 * The result of image recognition when using the SimNumberRecognizer.
 */
export interface SimNumberRecognizerResult extends RecognizerResult
{
    /**
     *  The sim number
     */
    readonly simNumber: string;
}

/**
 * The Sim Number Recognizer is used for scanning Sim Number.
 */
export interface SimNumberRecognizer extends Recognizer
{
    /** Returns the currently applied SimNumberRecognizerSettings. */
    currentSettings(): Promise< SimNumberRecognizerSettings >

    /** Applies new settings to the recognizer. */
    updateSettings( newSettings: SimNumberRecognizerSettings ): Promise< void >;

    /** Returns the current result of the recognition. */
    getResult(): Promise< SimNumberRecognizerResult >;
}

/**
 * This function is used to create a new instance of `SimNumberRecognizer`.
 * @param wasmSDK Instance of WasmSDK which will be used to communicate with the WebAssembly module.
 */
export async function createSimNumberRecognizer( wasmSDK: WasmSDK ): Promise< SimNumberRecognizer >
{
    return wasmSDK.mbWasmModule.newRecognizer( "SimNumberRecognizer" ) as Promise< SimNumberRecognizer >;
}
