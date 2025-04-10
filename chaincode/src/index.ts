/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {type Contract} from 'fabric-contract-api';
import {BookingContract} from './bookingContract';

export const contracts: typeof Contract[] = [BookingContract];
