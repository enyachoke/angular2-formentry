import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomInputComponent } from './custom-input.component';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
const form = JSON.parse(require('./editor'));
import {Tabs} from './tabs';
import {Tab} from './tab';
@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  directives: [REACTIVE_FORM_DIRECTIVES, CustomInputComponent, Tabs, Tab],
  pipes: [],
  providers: [FormBuilder]
})
export class HomeComponent implements OnInit {
  formSchema: any;
  questions: any[];
  formGroup = {};
  fieldMap = {};
  repeatingControls = {};
  registerForm: FormGroup;
  repeatingMap = {};
  art: any;
  constructor(private formBuilder: FormBuilder, private ref: ChangeDetectorRef) {
    // Do stuff
  }

  ngOnInit() {
    this.formSchema = form;
    for (let page of this.formSchema.pages) {
      for (let section of page.sections) {
        this.createFormGroup(section.questions, false, this.formGroup);
      }
    }
    this.registerForm = this.formBuilder.group(this.formGroup);
  }
  createFormGroup(questions, isGroup, formGroup) {
    for (let question of questions) {
      let obsObject = {};
      let fieldObject = {};
      if (isGroup === false) {
        fieldObject[question.id] = question;
        Object.assign(this.fieldMap, fieldObject);
      }
      switch (question.type) {
        case 'obs':
          obsObject[question.id] = this.createFormControl(question);
          Object.assign(formGroup, obsObject);
          break;
        case 'obsGroup':
          let nestedformGroup = this.createFormGroup(question.questions, true, {});
          if (question.questionOptions.rendering === 'repeating') {
            let repeatingControl = {};
            this.repeatingControls[question.id] = nestedformGroup;
            this.repeatingMap[question.id] = new FormArray([]);
            obsObject[question.id] = this.repeatingMap[question.id];
          } else {
            obsObject[question.id] = nestedformGroup;
          }
          Object.assign(formGroup, obsObject);
          break;
        case 'encounterProvider':
          obsObject[question.id] = this.createFormControl(question);
          Object.assign(formGroup, obsObject);
          break;
        case 'encounterLocation':
          obsObject[question.id] = this.createFormControl(question);
          Object.assign(formGroup, obsObject);
          break;
        case 'encounterDatetime':
          obsObject[question.id] = this.createFormControl(question);
          Object.assign(formGroup, obsObject);
          break;
        case 'personAttribute':
          obsObject[question.id] = this.createFormControl(question);
          Object.assign(formGroup, obsObject);
          break;
        default:
          obsObject[question.id] = this.createFormControl(question);
          Object.assign(formGroup, obsObject);
      }
    }
    return new FormGroup(formGroup);
  }
  createFormControl(question) {
    return new FormControl();
  }
  addRepeating(questionid) {
    this.repeatingMap[questionid].push(this.repeatingControls[questionid]);
  }
  removeRepeating(questionid, index) {
    this.repeatingMap[questionid].removeAt(index);
  }
  multiSelect(values, input) {
  }
  submitForms() {
    console.log(this.registerForm.value);
  }
}
