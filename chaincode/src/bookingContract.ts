/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import { Context, Contract, Info, Transaction } from 'fabric-contract-api';
import { Booking } from './booking';

@Info({ title: 'BookingContract', description: 'Smart contract for recording travel bookings' })
export class BookingContract extends Contract {


    @Transaction()
    public async RecordBooking(
      ctx: Context,
      bookingID: string,
      userID: string,
      travelID: string,
      seatNumbers: string,  // Pass as comma-separated string
      totalPrice: string,
      transactionID: string,
      status: string,
      createdAt: string
    ): Promise<void> {
      const booking = new Booking();
      console.log('booking:', booking);
      booking.bookingID = bookingID;
      booking.userID = userID;
      booking.travelID = travelID;
      booking.seatNumbers = seatNumbers;
      booking.totalPrice = parseFloat(totalPrice);
      booking.transactionID = transactionID;
      booking.status = status;
      booking.createdAt = createdAt;
    
      const exists = await this.BookingExists(ctx, booking.bookingID);
      if (exists) {
        throw new Error(`Booking ${booking.bookingID} already exists`);
      }
    
      await ctx.stub.putState(
        booking.bookingID,
        Buffer.from(JSON.stringify(booking))
      );
    }
  @Transaction(false)
  public async ReadBooking(ctx: Context, bookingID: string): Promise<string> {
    const data = await ctx.stub.getState(bookingID);
    if (data.length === 0) {
      throw new Error(`Booking ${bookingID} does not exist`);
    }
    return data.toString();
  }

  @Transaction(false)
  public async BookingExists(ctx: Context, bookingID: string): Promise<boolean> {
    const data = await ctx.stub.getState(bookingID);
    return data.length > 0;
  }

  @Transaction(false)
  public async GetAllBookings(ctx: Context): Promise<string> {
    const iterator = await ctx.stub.getStateByRange('', '');
    const bookings = [];
  
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
      try {
        bookings.push(JSON.parse(strValue));
      } catch (e) {
        bookings.push(strValue);
      }
      result = await iterator.next();
    }
  
    await iterator.close();
    return JSON.stringify(bookings);
  }  
}
