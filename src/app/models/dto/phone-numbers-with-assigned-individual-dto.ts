import { PhoneNumber } from "../phone-number";

export class PhoneNumbersWithAssignedIndividualDto{
    individualPhoneNumberId: number = 0;
    individualId: number = 0;
    phoneNumberId: number = 0;
    phoneNumber: PhoneNumber[] = [];
    isAssigned: boolean = false;
}