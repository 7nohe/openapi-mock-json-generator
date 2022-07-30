/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Order } from '../models/Order';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StoreService {

    /**
     * Returns pet inventories by status
     * Returns a map of status codes to quantities
     * @returns number successful operation
     * @throws ApiError
     */
    public static getInventory(): CancelablePromise<Record<string, number>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/store/inventory',
        });
    }

    /**
     * Place an order for a pet
     * @param requestBody order placed for purchasing the pet
     * @returns Order successful operation
     * @throws ApiError
     */
    public static placeOrder(
        requestBody: Order,
    ): CancelablePromise<Order> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/store/order',
            body: requestBody,
            mediaType: '*/*',
            errors: {
                400: `Invalid Order`,
            },
        });
    }

    /**
     * Find purchase order by ID
     * For valid response try integer IDs with value >= 1 and <= 10.         Other values will generated exceptions
     * @param orderId ID of pet that needs to be fetched
     * @returns Order successful operation
     * @throws ApiError
     */
    public static getOrderById(
        orderId: number,
    ): CancelablePromise<Order> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/store/order/{orderId}',
            path: {
                'orderId': orderId,
            },
            errors: {
                400: `Invalid ID supplied`,
                404: `Order not found`,
            },
        });
    }

    /**
     * Delete purchase order by ID
     * For valid response try integer IDs with positive integer value.         Negative or non-integer values will generate API errors
     * @param orderId ID of the order that needs to be deleted
     * @returns void
     * @throws ApiError
     */
    public static deleteOrder(
        orderId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/store/order/{orderId}',
            path: {
                'orderId': orderId,
            },
            errors: {
                400: `Invalid ID supplied`,
                404: `Order not found`,
            },
        });
    }

}
