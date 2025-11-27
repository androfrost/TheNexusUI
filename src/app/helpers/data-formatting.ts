export class DataFormatting {

    public static formatForInput(value: string | Date | undefined | null): string {
        if (!value) return "";
        const d = new Date(value);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    }    
}