/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse } from '../models/ApiResponse';
import type { Pet } from '../models/Pet';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PetService {

    /**
     * Update an existing pet
     * @param requestBody Pet object that needs to be added to the store
     * @returns void
     * @throws ApiError
     */
    public static updatePet(
        requestBody: Pet,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/pet',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid ID supplied`,
                404: `Pet not found`,
                405: `Validation exception`,
            },
        });
    }

    /**
     * Add a new pet to the store
     * @param requestBody Pet object that needs to be added to the store
     * @returns void
     * @throws ApiError
     */
    public static addPet(
        requestBody: Pet,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pet',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                405: `Invalid input`,
            },
        });
    }

    /**
     * Finds Pets by status
     * Multiple status values can be provided with comma separated strings
     * @param status Status values that need to be considered for filter
     * @returns Pet successful operation
     * @throws ApiError
     */
    public static findPetsByStatus(
        status: Array<'available' | 'pending' | 'sold'>,
    ): CancelablePromise<Array<Pet>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pet/findByStatus',
            query: {
                'status': status,
            },
            errors: {
                400: `Invalid status value`,
            },
        });
    }

    /**
     * @deprecated
     * Finds Pets by tags
     * Muliple tags can be provided with comma separated strings. Use         tag1, tag2, tag3 for testing.
     * @param tags Tags to filter by
     * @returns Pet successful operation
     * @throws ApiError
     */
    public static findPetsByTags(
        tags: Array<string>,
    ): CancelablePromise<Array<Pet>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pet/findByTags',
            query: {
                'tags': tags,
            },
            errors: {
                400: `Invalid tag value`,
            },
        });
    }

    /**
     * Find pet by ID
     * Returns a single pet
     * @param petId ID of pet to return
     * @returns Pet successful operation
     * @throws ApiError
     */
    public static getPetById(
        petId: number,
    ): CancelablePromise<Pet> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/pet/{petId}',
            path: {
                'petId': petId,
            },
            errors: {
                400: `Invalid ID supplied`,
                404: `Pet not found`,
            },
        });
    }

    /**
     * Updates a pet in the store with form data
     * @param petId ID of pet that needs to be updated
     * @param formData
     * @returns void
     * @throws ApiError
     */
    public static updatePetWithForm(
        petId: number,
        formData?: any,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pet/{petId}',
            path: {
                'petId': petId,
            },
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                405: `Invalid input`,
            },
        });
    }

    /**
     * Deletes a pet
     * @param petId Pet id to delete
     * @param apiKey
     * @returns void
     * @throws ApiError
     */
    public static deletePet(
        petId: number,
        apiKey?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/pet/{petId}',
            path: {
                'petId': petId,
            },
            headers: {
                'api_key': apiKey,
            },
            errors: {
                400: `Invalid ID supplied`,
                404: `Pet not found`,
            },
        });
    }

    /**
     * uploads an image
     * @param petId ID of pet to update
     * @param formData
     * @returns ApiResponse successful operation
     * @throws ApiError
     */
    public static uploadFile(
        petId: number,
        formData?: any,
    ): CancelablePromise<ApiResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/pet/{petId}/uploadImage',
            path: {
                'petId': petId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }

}
