import { Location } from '../location';

export class IndividualLocationsDto{
    individualLocationId: number = 0;
    individualId: number = 0;
    locationId: number = 0;
    location: Location[] = [];
}