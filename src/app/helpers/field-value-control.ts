export class FieldValueControl{
    static getChosenFieldValue<T>(element: string, fieldOption: keyof T) : number{
        const chosenElement = document.getElementById(element) as HTMLSelectElement;
        (this as any)[fieldOption] = chosenElement.selectedIndex;
        return (this as any)[fieldOption];
    }
    
    static setChosenFieldValue(element: string, typeId: number) : void{
        const chosenElement = document.getElementById(element) as HTMLSelectElement;
        chosenElement.selectedIndex = typeId;
    }

    static setChosenFieldValueWithArray<T extends Array<any>>(element: string, valueT: T, typeId: number) : void{
        const chosenElement = document.getElementById(element) as HTMLSelectElement;
        chosenElement.selectedIndex = this.findArrayIndex(valueT, typeId);
    }

    static setChosenOption<T, U extends { id: number }>(typeId: number, fieldOption: keyof T, arrayOption: U[]) : number{
        const foundIndex = arrayOption.findIndex(f => f.id === typeId);
        (this as any)[fieldOption] = foundIndex >= 0 ? foundIndex : 0;
        return (this as any)[fieldOption];
    }

    // General function to find id in any array of objects based on index, returns 0 if not found
    static findArrayId<T extends Array<any>>(array: T, index: number) : number{
        return array[index]?.id || 0;
    }

    // General function to find index in any array of objects based on id, returns 0 if not found
    static findArrayIndex<T extends Array<any>>(array: T, typeId: number) : number{
        const foundIndex = array.findIndex(l => l.id === typeId);
        return foundIndex >= 0 ? foundIndex : 0;
    }
}