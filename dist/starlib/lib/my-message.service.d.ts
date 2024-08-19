import { EventEmitter } from '@angular/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import * as i0 from "@angular/core";
export declare class MyMessageService extends MessageService {
    languageChanged: EventEmitter<any>;
    set language(value: string);
    get language(): string;
    private localeId;
    private get messages();
    get(key: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyMessageService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MyMessageService>;
}
