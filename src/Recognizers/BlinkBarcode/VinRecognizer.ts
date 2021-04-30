/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */

import { Recognizer, RecognizerResult, RecognizerSettings, WasmSDK } from "../../MicroblinkSDK/DataStructures";

/**
 * A settings object that is used for configuring the VinRecognizer.
 */
export class VinRecognizerSettings implements RecognizerSettings
{}

/**
 * The result of image recognition when using the VinRecognizer.
 */
export interface VinRecognizerResult extends RecognizerResult
{
    /**
     * The check digit of the Vehicle Identification Number
     */
    readonly checkDigit: string;

    /**
     * The identifier of the vehicle's manufacturer
     */
    readonly manufacturerIdentifier: string;

    /**
     * The year of the vehicle model
     */
    readonly modelYear: string;

    /**
     * Vehicle information number (original data)
     */
    readonly vin: string;

    /**
     * Region for which the vehicle is designed
     */
    readonly region: string;

    /**
     * The sequential number of the vehicle
     */
    readonly sequentialNumber: string;

    /**
     * The attributes of the vehicle
     */
    readonly vehicleAttributes: string;

    /**
     * The descriptor of the vehicle
     */
    readonly vehicleDescriptor: string;

    /**
     * The identifier of the vehicle
     */
    readonly vehicleIdentifier: string;

    /**
     * The globally unique manufacturer identifier
     */
    readonly worldManufacturerId: string;
}

/**
 * The Vin Recognizer is used for scanning Vin.
 */
export interface VinRecognizer extends Recognizer
{
    /** Returns the currently applied VinRecognizerSettings. */
    currentSettings(): Promise< VinRecognizerSettings >

    /** Applies new settings to the recognizer. */
    updateSettings( newSettings: VinRecognizerSettings ): Promise< void >;

    /** Returns the current result of the recognition. */
    getResult(): Promise< VinRecognizerResult >;
}

/**
 * This function is used to create a new instance of `VinRecognizer`.
 * @param wasmSDK Instance of WasmSDK which will be used to communicate with the WebAssembly module.
 */
export async function createVinRecognizer( wasmSDK: WasmSDK ): Promise< VinRecognizer >
{
    return wasmSDK.mbWasmModule.newRecognizer( "VinRecognizer" ) as Promise< VinRecognizer >;
}
