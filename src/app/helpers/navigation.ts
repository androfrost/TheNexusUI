export class Navigation {
    public static returnToPreviousPortal(allPortalNavigation: number[]): number {
        allPortalNavigation.pop();  // Remove current portal
        const returnPortal = allPortalNavigation[allPortalNavigation.length - 1];
        allPortalNavigation.pop();  // Remove previous portal so it can be readded once called
        return returnPortal;
    }
}