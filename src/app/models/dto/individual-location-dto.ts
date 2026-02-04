import { Location } from '../../models/location';

export class IndividualLocationDto{
    individualLocationId: number = 0;
    individualId: number = 0;
    locationId: number = 0;
    location: Location[] = [];
}