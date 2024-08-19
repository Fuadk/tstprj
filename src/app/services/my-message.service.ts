import { EventEmitter,Injectable } from '@angular/core';
import { MessageService } from '@progress/kendo-angular-l10n';
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
  }
    ,
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
@Injectable()
export class MyMessageService extends MessageService {
  public languageChanged = new EventEmitter<any>()
  public set language(value: string) {
    //console.log("lang: value:", value);
    const lang = data[value as keyof typeof data];
    if (lang) {
      this.localeId = value;
      this.notify(lang.rtl);
    }
  }

  public get language(): string {
    return this.localeId;
  }

  private localeId = 'en';
  private get messages(): any {
    const lang = data[this.localeId as keyof typeof data];

    if (lang) {
      return lang.messages;
    }
  }

  public override get(key: string): string {
    //console.log("lang: key:", key, " this.messages:", this.messages)
    return this.messages[key];
  }
}

/*
    messages.commands
    messages.commands.cancel
    messages.commands.canceledit
    messages.commands.create
    messages.commands.destroy
    messages.commands.edit
    messages.commands.excel
    messages.commands.save
    messages.commands.search
    messages.commands.update
    messages.noRecords
    messages.expandCollapseColumnHeader
*/