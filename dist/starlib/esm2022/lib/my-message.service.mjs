import { EventEmitter, Injectable } from '@angular/core';
import { MessageService } from '@progress/kendo-angular-l10n';
import * as i0 from "@angular/core";
//https://www.telerik.com/kendo-angular-ui/components/globalization/localization/messages/
const data = {
    "he": {
        rtl: true,
        messages: {
        // 'kendo.grid.noRecords': 'אין רשומות זמינות.'
        }
    },
    "es": {
        rtl: false,
        messages: {
        //'kendo.grid.noRecords': 'No hay datos disponibles.'
        }
    },
    "ar": {
        rtl: true,
        messages: {
            'kendo.grid.noRecords': 'لا توجد بيانات'
        }
    },
    "en": {
        rtl: false,
        messages: {
            'kendo.grid.noRecords': 'no records'
        }
    }
};
export class MyMessageService extends MessageService {
    constructor() {
        super(...arguments);
        this.languageChanged = new EventEmitter();
        this.localeId = 'en';
    }
    set language(value) {
        //console.log("lang: value:", value);
        const lang = data[value];
        if (lang) {
            this.localeId = value;
            this.notify(lang.rtl);
        }
    }
    get language() {
        return this.localeId;
    }
    get messages() {
        const lang = data[this.localeId];
        if (lang) {
            return lang.messages;
        }
    }
    get(key) {
        //console.log("lang: key:", key, " this.messages:", this.messages)
        return this.messages[key];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.4", ngImport: i0, type: MyMessageService, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.4", ngImport: i0, type: MyMessageService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.4", ngImport: i0, type: MyMessageService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXktbWVzc2FnZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvc3RhcmxpYi9zcmMvbGliL215LW1lc3NhZ2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFDLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sOEJBQThCLENBQUM7O0FBQzlELDBGQUEwRjtBQUMxRixNQUFNLElBQUksR0FBRztJQUNYLElBQUksRUFBRTtRQUNKLEdBQUcsRUFBRSxJQUFJO1FBQ1QsUUFBUSxFQUFFO1FBQ1QsK0NBQStDO1NBQy9DO0tBQ0Y7SUFDRCxJQUFJLEVBQUU7UUFDSixHQUFHLEVBQUUsS0FBSztRQUNWLFFBQVEsRUFBRTtRQUNSLHFEQUFxRDtTQUN0RDtLQUNGO0lBRUMsSUFBSSxFQUFFO1FBQ0osR0FBRyxFQUFFLElBQUk7UUFDVCxRQUFRLEVBQUU7WUFDUixzQkFBc0IsRUFBRSxnQkFBZ0I7U0FDekM7S0FDRjtJQUNELElBQUksRUFBRTtRQUNKLEdBQUcsRUFBRSxLQUFLO1FBQ1YsUUFBUSxFQUFFO1lBQ1Isc0JBQXNCLEVBQUUsWUFBWTtTQUNyQztLQUNGO0NBRUosQ0FBQztBQUVGLE1BQU0sT0FBTyxnQkFBaUIsU0FBUSxjQUFjO0lBRHBEOztRQUVTLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQTtRQWN4QyxhQUFRLEdBQUcsSUFBSSxDQUFDO0tBYXpCO0lBMUJDLElBQVcsUUFBUSxDQUFDLEtBQWE7UUFDL0IscUNBQXFDO1FBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUEwQixDQUFDLENBQUM7UUFDOUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNULElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBRUQsSUFBVyxRQUFRO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBR0QsSUFBWSxRQUFRO1FBQ2xCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBNkIsQ0FBQyxDQUFDO1FBRXRELElBQUksSUFBSSxFQUFFLENBQUM7WUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQztJQUNILENBQUM7SUFFZSxHQUFHLENBQUMsR0FBVztRQUM3QixrRUFBa0U7UUFDbEUsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7OEdBM0JVLGdCQUFnQjtrSEFBaEIsZ0JBQWdCOzsyRkFBaEIsZ0JBQWdCO2tCQUQ1QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTWVzc2FnZVNlcnZpY2UgfSBmcm9tICdAcHJvZ3Jlc3Mva2VuZG8tYW5ndWxhci1sMTBuJztcclxuLy9odHRwczovL3d3dy50ZWxlcmlrLmNvbS9rZW5kby1hbmd1bGFyLXVpL2NvbXBvbmVudHMvZ2xvYmFsaXphdGlvbi9sb2NhbGl6YXRpb24vbWVzc2FnZXMvXHJcbmNvbnN0IGRhdGEgPSB7XHJcbiAgXCJoZVwiOiB7XHJcbiAgICBydGw6IHRydWUsXHJcbiAgICBtZXNzYWdlczoge1xyXG4gICAgIC8vICdrZW5kby5ncmlkLm5vUmVjb3Jkcyc6ICfXkNeZ158g16jXqdeV157XldeqINeW157Xmdeg15XXqi4nXHJcbiAgICB9XHJcbiAgfSxcclxuICBcImVzXCI6IHtcclxuICAgIHJ0bDogZmFsc2UsXHJcbiAgICBtZXNzYWdlczoge1xyXG4gICAgICAvLydrZW5kby5ncmlkLm5vUmVjb3Jkcyc6ICdObyBoYXkgZGF0b3MgZGlzcG9uaWJsZXMuJ1xyXG4gICAgfVxyXG4gIH1cclxuICAgICxcclxuICAgIFwiYXJcIjoge1xyXG4gICAgICBydGw6IHRydWUsXHJcbiAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgJ2tlbmRvLmdyaWQubm9SZWNvcmRzJzogJ9mE2Kcg2KrZiNis2K8g2KjZitin2YbYp9iqJ1xyXG4gICAgICB9XHJcbiAgICB9LCAgIFxyXG4gICAgXCJlblwiOiB7XHJcbiAgICAgIHJ0bDogZmFsc2UsXHJcbiAgICAgIG1lc3NhZ2VzOiB7XHJcbiAgICAgICAgJ2tlbmRvLmdyaWQubm9SZWNvcmRzJzogJ25vIHJlY29yZHMnXHJcbiAgICAgIH1cclxuICAgIH0gICBcclxuICBcclxufTtcclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTXlNZXNzYWdlU2VydmljZSBleHRlbmRzIE1lc3NhZ2VTZXJ2aWNlIHtcclxuICBwdWJsaWMgbGFuZ3VhZ2VDaGFuZ2VkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KClcclxuICBwdWJsaWMgc2V0IGxhbmd1YWdlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJsYW5nOiB2YWx1ZTpcIiwgdmFsdWUpO1xyXG4gICAgY29uc3QgbGFuZyA9IGRhdGFbdmFsdWUgYXMga2V5b2YgdHlwZW9mIGRhdGFdO1xyXG4gICAgaWYgKGxhbmcpIHtcclxuICAgICAgdGhpcy5sb2NhbGVJZCA9IHZhbHVlO1xyXG4gICAgICB0aGlzLm5vdGlmeShsYW5nLnJ0bCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IGxhbmd1YWdlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5sb2NhbGVJZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbG9jYWxlSWQgPSAnZW4nO1xyXG4gIHByaXZhdGUgZ2V0IG1lc3NhZ2VzKCk6IGFueSB7XHJcbiAgICBjb25zdCBsYW5nID0gZGF0YVt0aGlzLmxvY2FsZUlkIGFzIGtleW9mIHR5cGVvZiBkYXRhXTtcclxuXHJcbiAgICBpZiAobGFuZykge1xyXG4gICAgICByZXR1cm4gbGFuZy5tZXNzYWdlcztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvdmVycmlkZSBnZXQoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgLy9jb25zb2xlLmxvZyhcImxhbmc6IGtleTpcIiwga2V5LCBcIiB0aGlzLm1lc3NhZ2VzOlwiLCB0aGlzLm1lc3NhZ2VzKVxyXG4gICAgcmV0dXJuIHRoaXMubWVzc2FnZXNba2V5XTtcclxuICB9XHJcbn1cclxuXHJcbi8qXHJcbiAgICBtZXNzYWdlcy5jb21tYW5kc1xyXG4gICAgbWVzc2FnZXMuY29tbWFuZHMuY2FuY2VsXHJcbiAgICBtZXNzYWdlcy5jb21tYW5kcy5jYW5jZWxlZGl0XHJcbiAgICBtZXNzYWdlcy5jb21tYW5kcy5jcmVhdGVcclxuICAgIG1lc3NhZ2VzLmNvbW1hbmRzLmRlc3Ryb3lcclxuICAgIG1lc3NhZ2VzLmNvbW1hbmRzLmVkaXRcclxuICAgIG1lc3NhZ2VzLmNvbW1hbmRzLmV4Y2VsXHJcbiAgICBtZXNzYWdlcy5jb21tYW5kcy5zYXZlXHJcbiAgICBtZXNzYWdlcy5jb21tYW5kcy5zZWFyY2hcclxuICAgIG1lc3NhZ2VzLmNvbW1hbmRzLnVwZGF0ZVxyXG4gICAgbWVzc2FnZXMubm9SZWNvcmRzXHJcbiAgICBtZXNzYWdlcy5leHBhbmRDb2xsYXBzZUNvbHVtbkhlYWRlclxyXG4qLyJdfQ==