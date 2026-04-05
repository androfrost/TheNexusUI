export class DataFormatting {

    public static formatForInput(value: string | Date | undefined | null): string {
        if (!value) return "";
        const d = new Date(value);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    }    

    public static formatPhoneNumber(value: string): string {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');
        
        // Format as (XXX) XXX-XXXX
        if (digits.length <= 3) {
        return digits;
        } else if (digits.length <= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  }
}