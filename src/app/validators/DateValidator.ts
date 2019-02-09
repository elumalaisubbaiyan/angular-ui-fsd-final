import { FormControl, AbstractControl, ValidatorFn } from '@angular/forms';

export class DateValidator {

    static toDateInputValue(date: Date) {
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toJSON().slice(0, 10);
    };

    static ptDate(control: FormControl): { [key: string]: any } {
        let ptDatePattern = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;

        alert("control.value " + control.value);
        if (!control.value.match(ptDatePattern))
            return { "ptDate": true };

        return null;
    }

    static usDate(control: FormControl): { [key: string]: any } {
        let usDatePattern = /^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/;

        if (!control.value.match(usDatePattern))
            return { "usDate": true };

        return null;
    }

    static dateLessThan(dateField1: string, dateField2: string,
        validatorField: { [key: string]: boolean }): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {
            const date1 = c.get(dateField1).value;
            const date2 = c.get(dateField2).value;
            if ((date1 !== null && date2 !== null) && date1 < date2) {
                return validatorField;
            }
            return null;
        };
    }
}