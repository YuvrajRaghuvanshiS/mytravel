/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Object, Property } from "fabric-contract-api";

@Object()
export class Booking {
  @Property()
  public bookingID: string = "book_1745430810..._vxcx98...";

  @Property()
  public createdAt: string = new Date().toISOString();

  @Property()
  public updatedAt: string = new Date().toISOString();

  @Property()
  public cancelledAt: string = "";

  @Property()
  public userHash: string = "7b2952e91329ff....";

  @Property()
  public isUserAnonymous: boolean = true;

  @Property()
  public userID: string = "yuvrajRaghuvanshiS";

  @Property()
  public agencyID: string = "yrs";

  @Property()
  public travelID: number = 1;

  @Property()
  public seatNumbers: string = "1A,1B";

  @Property()
  public totalPrice: number = 100;

  @Property()
  public transactionID: string = "txn_1745430810..._e4sorr...";

  @Property()
  public status: string = "Confirmed";

  @Property()
  public refundAmount: number = 0;

  @Property()
  public penalty: number = 0;

  @Property()
  public hyperledgerTxId: string =
    "8a0f66758c9ece3154d68fa173f9403de42ba6955f1e690e3de5df5f031c2...";
}
