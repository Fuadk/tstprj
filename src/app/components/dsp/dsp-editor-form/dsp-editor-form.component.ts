import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import {  componentConfigDef} from '@modeldir/model';
import { starServices } from 'starlib';

declare function getParamConfig():any;


@Component({
  selector: 'app-dsp-editor-form',
  templateUrl: './dsp-editor-form.component.html',
  styleUrls: ['./dsp-editor-form.component.css']
})
export class DspEditorFormComponent implements OnInit {
@Output() saveCompletedOutput: EventEmitter<any> = new EventEmitter();
  constructor(public starServices: starServices) { 
    this.componentConfig = new componentConfigDef(); 
    this.paramConfig = getParamConfig();
  }

  ngOnInit(): void {
  }
public componentConfig: componentConfigDef;
public editorType ="";
public editorValue ="hello";
public enableHtmlEditor: boolean = false;
public enableTextEditor: boolean = false;
public paramConfig;

public events: string[] = [];
public  NewValue;
public value = `
        <p>
            The Kendo UI Angular Editor allows your users to edit HTML in a familiar, user-friendly way.<br />
            In this version, the Editor provides the core HTML editing engine which includes basic text formatting, hyperlinks, and lists.
            The widget <strong>outputs identical HTML</strong> across all major browsers, follows
            accessibility standards, and provides API for content manipulation.
        </p>
        <p>Features include:</p>
        <ul>
            <li>Text formatting</li>
            <li>Bulleted and numbered lists</li>
            <li>Hyperlinks</li>
            <li>Cross-browser support</li>
            <li>Identical HTML output across browsers</li>
        </ul>
    `;
public title ="";
public submit(): void {
	this.saveCompletedOutput.emit(this.NewValue);  
}
public valueChange(value: any): void {
  this.NewValue = value;
  if (this.paramConfig.DEBUG_FLAG) console.log("this.NewValue:", this.NewValue)
}

private log(event: string, arg: any): void {
  this.events.push(`${event} ${arg || ''}`);
}

@Input() public set setComponentConfig_Input(ComponentConfig: componentConfigDef) {
  if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:",ComponentConfig);
  if (typeof ComponentConfig !== "undefined"){
    if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig:",ComponentConfig);

    this.componentConfig = this.starServices.setComponentConfig(ComponentConfig, this.componentConfig  );

    if ( ComponentConfig.masterSaved != null)
    {
      /*var jsonData =[];
      jsonData.push(this.form.value);

      var rec ={
        "pageNo" : this.pageNo,
        "areaNo" : this.areaNo,
        "data" : jsonData
      
      }*/
      
      this.saveCompletedOutput.emit(this.value);
    }
    
    if (ComponentConfig.title != null) {
      this.title = ComponentConfig.title;
   }

    if (ComponentConfig.masterParams != null) {
      if (this.paramConfig.DEBUG_FLAG) console.log("ComponentConfig.masterParams:", ComponentConfig.masterParams);
      this.value = ComponentConfig.masterParams.val;
      this.NewValue = this.value;
      this.editorType = ComponentConfig.masterParams.editorType;
      this.enableHtmlEditor = false;
      this.enableTextEditor = false;

      if (this.editorType == "HTML"){
        this.enableHtmlEditor = true;
      }
      else if (this.editorType == "TEXT_AREA"){
        this.enableTextEditor = true;
      }
   
    }


  }
}

}


