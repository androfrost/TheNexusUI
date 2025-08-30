export class IndividualPhoneNumber{
    individualPhoneNumberId: number = 0;
    individualId: number = 0;
    phoneNumberId: number = 0;

    constructor(individualId?: number, phoneNumberId?: number){
        this.individualId = individualId ?? 0;
        this.phoneNumberId = phoneNumberId ?? 0;
    }
}