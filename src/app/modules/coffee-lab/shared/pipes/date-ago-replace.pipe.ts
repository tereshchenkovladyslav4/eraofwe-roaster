import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
    name: 'dateAgoReplace',
})
export class DateAgoReplacePipe implements PipeTransform {
    constructor(private translator: TranslateService) {}
    transform(value: string, omitSuffix?: boolean): string {
        if (!value) {
            return '';
        }
        const [amount, unit] = value.split(' ');
        let suffix = amount;
        if (isNaN(+amount)) {
            suffix = this.translator.instant(amount);
        }
        return `${suffix ?? amount} ${this.translator.instant(unit)} ${
            !omitSuffix ? this.translator.instant('ago') : ''
        }`;
    }
}
