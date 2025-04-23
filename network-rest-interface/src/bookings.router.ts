/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * This sample is intended to work with the basic asset transfer
 * chaincode which imposes some constraints on what is possible here.
 *
 * For example,
 *  - There is no validation for Asset IDs
 *  - There are no error codes from the chaincode
 *
 * To avoid timeouts, long running tasks should be decoupled from HTTP request
 * processing
 *
 * Submit transactions can potentially be very long running, especially if the
 * transaction fails and needs to be retried one or more times
 *
 * To allow requests to respond quickly enough, this sample queues submit
 * requests for processing asynchronously and immediately returns 202 Accepted
 */

import express, { Request, Response } from 'express';
import { body, validationResult, param } from 'express-validator';
import { Contract } from 'fabric-network';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Queue } from 'bullmq';
import { AssetNotFoundError } from './errors';
import { evatuateTransaction, getBlockHeight } from './fabric';
import { addSubmitTransactionJob } from './jobs';
import { logger } from './logger';
import { common } from 'fabric-protos';

const { ACCEPTED, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } =
    StatusCodes;

export const bookingsRouter = express.Router();

bookingsRouter.get('/', async (req: Request, res: Response) => {
    logger.debug('Get all bookings request received');
    try {
        const mspId = req.user as string;
        const contract = req.app.locals[mspId]?.assetContract as Contract;

        const data = await evatuateTransaction(contract, 'GetAllBookings');
        let bookings = [];
        if (data.length > 0) {
            bookings = JSON.parse(data.toString());
        }

        return res.status(OK).json(bookings);
    } catch (err) {
        logger.error({ err }, 'Error processing get all bookings request');
        return res.status(INTERNAL_SERVER_ERROR).json({
            status: getReasonPhrase(INTERNAL_SERVER_ERROR),
            timestamp: new Date().toISOString(),
        });
    }
});

bookingsRouter.get(
    '/:bookingID',
    param('bookingID', 'must be a string').notEmpty(),
    async (req: Request, res: Response) => {
        logger.debug('Get booking by bookingID request received');
        try {
            const mspId = req.user as string;
            const contract = req.app.locals[mspId]?.assetContract as Contract;

            const data = await evatuateTransaction(
                contract,
                'ReadBooking',
                req.params.bookingID
            );
            let booking = JSON.parse(data.toString());

            return res.status(OK).json(booking);
        } catch (err) {
            logger.error(
                { err },
                'Error processing get booking by bookingID request'
            );
            return res.status(INTERNAL_SERVER_ERROR).json({
                status: getReasonPhrase(INTERNAL_SERVER_ERROR),
                timestamp: new Date().toISOString(),
            });
        }
    }
);

bookingsRouter.post(
    '/',
    body().isObject().withMessage('body must contain a booking object'),
    body('bookingID', 'must be a string').notEmpty(),
    body('userID', 'must be a string').notEmpty(),
    body('isUserAnonymous', 'must be a boolean').notEmpty().isBoolean(),
    body('userName', 'must be a string').isString(),
    body('userEmail', 'must be a string').isString(),
    body('travelID', 'must be a string').notEmpty(),
    body('seatNumbers', 'must be a string').notEmpty(),
    body('totalPrice', 'must be a number').isNumeric(),
    body('transactionID', 'must be a string').notEmpty(),
    body('status', 'must be a string').notEmpty(),
    body('createdAt', 'must be a string').notEmpty(),
    async (req: Request, res: Response) => {
        logger.debug(req.body, 'Create booking request received');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({
                status: getReasonPhrase(BAD_REQUEST),
                reason: 'VALIDATION_ERROR',
                message: 'Invalid request body',
                timestamp: new Date().toISOString(),
                errors: errors.array(),
            });
        }

        const mspId = req.user as string;
        const bookingID = req.body.bookingID;

        try {
            const submitQueue = req.app.locals.jobq as Queue;
            const jobId = await addSubmitTransactionJob(
                submitQueue,
                mspId,
                'RecordBooking',
                bookingID,
                req.body.userID,
                req.body.isUserAnonymous,
                req.body.userName,
                req.body.userEmail,
                req.body.travelID,
                req.body.seatNumbers,
                req.body.totalPrice,
                req.body.transactionID,
                req.body.status,
                req.body.createdAt
            );

            return res.status(ACCEPTED).json({
                status: getReasonPhrase(ACCEPTED),
                jobId: jobId,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            logger.error(
                { err },
                'Error processing create asset request for asset ID %s',
                bookingID
            );

            return res.status(INTERNAL_SERVER_ERROR).json({
                status: getReasonPhrase(INTERNAL_SERVER_ERROR),
                timestamp: new Date().toISOString(),
            });
        }
    }
);

bookingsRouter.delete(
    '/:bookingID',
    param('bookingID', 'must be a string').notEmpty(),
    async (req: Request, res: Response) => {
        logger.debug(req.body, 'Delete booking request received');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({
                status: getReasonPhrase(BAD_REQUEST),
                reason: 'VALIDATION_ERROR',
                message: 'Invalid request body',
                timestamp: new Date().toISOString(),
                errors: errors.array(),
            });
        }

        const mspId = req.user as string;
        const bookingID = req.params.bookingID;

        try {
            const submitQueue = req.app.locals.jobq as Queue;
            const jobId = await addSubmitTransactionJob(
                submitQueue,
                mspId,
                'DeleteBooking',
                bookingID,
            );

            return res.status(ACCEPTED).json({
                status: getReasonPhrase(ACCEPTED),
                jobId: jobId,
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            logger.error(
                { err },
                'Error deleting booking %s',
                bookingID
            );

            return res.status(INTERNAL_SERVER_ERROR).json({
                status: getReasonPhrase(INTERNAL_SERVER_ERROR),
                timestamp: new Date().toISOString(),
            });
        }
    }
);

bookingsRouter.get(
    '/:hyperledgerTxId/blockheight',
    param('hyperledgerTxId', 'must be a string').notEmpty(),
    async (req: Request, res: Response) => {
        logger.debug('Get booking block height request received');

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(BAD_REQUEST).json({
                status: getReasonPhrase(BAD_REQUEST),
                reason: 'VALIDATION_ERROR',
                message: 'Invalid request parameters',
                timestamp: new Date().toISOString(),
                errors: errors.array(),
            });
        }

        const mspId = req.user as string;
        const hyperledgerTxId = req.params.hyperledgerTxId;

        try {
            const contract = req.app.locals[mspId]?.qsccContract as Contract;

            const blockBytes = await contract.evaluateTransaction(
                'GetBlockByTxID',
                'mychannel',
                hyperledgerTxId
            );

            // Decode protobuf block
            const block = common.Block.decode(blockBytes);

            if (!block.header || !block.header.number) {
                throw new Error('Invalid block structure received');
            }

            const blockchainHeight = await getBlockHeight(contract);

            return res.status(OK).json({
                hyperledgerTxId: hyperledgerTxId,
                blockHeight: block.header.number.toString(),
                blockchainHeight: blockchainHeight.toString(),
                timestamp: new Date().toISOString(),
            });
        } catch (err) {
            logger.error(
                { err },
                'Error getting block height for hyperledger transaction ID %s',
                hyperledgerTxId
            );

            return res.status(INTERNAL_SERVER_ERROR).json({
                status: getReasonPhrase(INTERNAL_SERVER_ERROR),
                message: err,
                timestamp: new Date().toISOString(),
            });
        }
    }
);
