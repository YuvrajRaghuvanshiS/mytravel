/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Object, Property } from "fabric-contract-api";

@Object()
export class Booking {
  @Property()
  public bookingID: string = "First Booking";

  @Property()
  public userID: string = "First User";

  @Property()
  public isUserAnonymous: boolean = true;

  @Property()
  public userName: string = "User name";

  @Property()
  public userEmail: string = "user@user.com";

  @Property()
  public travelID: string = "First Travel";

  @Property()
  public seatNumbers: string = "1A,1B";

  @Property()
  public totalPrice: number = 100;

  @Property()
  public transactionID: string = "First Transaction";

  @Property()
  public status: string = "Confirmed";

  @Property()
  public createdAt: string = new Date().toISOString();

  @Property()
  public hyperledgerTxId: string = "";
}
