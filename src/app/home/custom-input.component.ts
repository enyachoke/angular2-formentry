import {Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {MultiSelectComponent} from "../shared/select/multi-select.component"
@Component({
  selector: 'custom-input',
  templateUrl: './custom-input.component.html',
  directives: [MultiSelectComponent],
})
export class CustomInputComponent implements OnInit {
  @Input() value: any;
  @Input() question: any;
  @Input() control: any;
  @Input() form: any;
  @Output() attachedInput = new EventEmitter();
  show = true;
  tags: Immutable.List<string> = Immutable.fromJS([]);
  selectedTags: Immutable.List<string> = Immutable.fromJS([]);
  ngOnInit() {
    if (this.question) {
      let self = this;
      console.log('Type', this.question.questionOptions.rendering);
      this.tags = Immutable.fromJS(this.question.questionOptions.answers);
      if (this.form) {
        this.form.valueChanges
          .subscribe((value) => {
          if (this.question.disableExpression) {
            let arrayContains = this.arrayContains;
            let isEmpty = this.isEmpty;
            for (let exp of this.question.disableExpression) {
              let questions = exp.questions.split(',');
              for (let q of questions) {
                window[q] = value[q];
              }
              self.show = eval(exp.disableWhenExpression);
              //console.log(self.show);
              //console.log('Evaluation', eval(exp.disableWhenExpression));
            }
            console.log(this.question.id, this.question.disableExpression);
          }
        });
      }
      if (this.question.questionOptions.rendering === 'multiCheckbox' && this.control) {
        this.control.updateValue(this.selectedTags);
      }
    }
  }
  onSelectTag(tag: string) {
    let index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags = this.selectedTags.push(tag);
    }
    this.control.updateValue(this.selectedTags);
  }

  onDeselectTag(tag: string) {
    let index = this.selectedTags.indexOf(tag);
    if (index > -1) {
      this.selectedTags = this.selectedTags.remove(index);
    }
    this.control.updateValue(this.selectedTags);
  }

  onAddTag(tag: string) {
    let indexOnTags = this.tags.indexOf(tag);
    if (indexOnTags === -1) {
      this.tags = this.tags.push(tag);
      this.onSelectTag(tag);
    } else {
      this.onSelectTag(tag);
    }
  }
  emitInput(input) {
    console.log(input);
  }
  isEmpty(val) {

    if (val === undefined || val === null || val === '' || val === 'null'
      || val === 'undefined') {
      return true;
    }
    if (Array.isArray(val) && val.length === 0) {
      return true;
    }
    return false;
  }

  arrayContains(array, members) {
    if (Array.isArray(members)) {
      if (members.length === 0) {
        return true;
      }
      var contains = true;
      _.each(members, function(val) {
        if (array.indexOf(val) === -1) {
          contains = false;
        }
      });
      return contains;
    }
    else {
      return array.indexOf(members) !== -1;
    }
  }
}
