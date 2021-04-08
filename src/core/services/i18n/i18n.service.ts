import { registerLocaleData } from '@angular/common';
import ngEn from '@angular/common/locales/en';
import ngSe from '@angular/common/locales/se';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface LangData {
    text: string;
    ng: any;
}

const DEFAULT = 'en';
const LANGS: { [key: string]: LangData } = {
    en: {
        text: 'English',
        ng: ngEn,
    },
    es: {
        text: 'Swedish',
        ng: ngSe,
    },
};

@Injectable({ providedIn: 'root' })
export class I18NService {
    private default = DEFAULT;

    private langs = Object.keys(LANGS).map((code) => {
        const item = LANGS[code];
        return { code, text: item.text };
    });

    constructor(private translate: TranslateService) {
        const lans = this.langs.map((item) => item.code);
        translate.addLangs(lans);

        const defaultLan = this.getDefaultLang();
        if (lans.includes(defaultLan)) {
            this.default = defaultLan;
            localStorage.setItem('locale', this.default);
        }

        this.updateLangData(this.default);
    }

    private getDefaultLang(): string | undefined {
        let browserLang;
        if (localStorage.getItem('locale')) {
            browserLang = localStorage.getItem('locale');
            this.translate.use(browserLang);
        } else {
            browserLang = this.translate.getBrowserLang();
            this.translate.use(browserLang);
            localStorage.setItem('locale', browserLang);
        }
        return browserLang;
    }

    private updateLangData(lang: string) {
        const item = LANGS[lang];
        registerLocaleData(item.ng);
    }

    use(lang: string): void {
        lang = lang || this.translate.getDefaultLang();
        if (this.currentLang === lang) {
            return;
        }
        this.updateLangData(lang);
        localStorage.setItem('locale', lang);
        this.translate.use(lang);
    }

    getLangs() {
        return this.langs;
    }

    get defaultLang() {
        return this.default;
    }

    get currentLang() {
        return this.translate.currentLang || this.translate.getDefaultLang() || this.default;
    }
}
