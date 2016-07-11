import { Component, OnInit, Input} from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
@Component({
  selector: 'my-questions',
  templateUrl: './questions-display.component.html',
  directives: [QuestionsDisplayComponent, REACTIVE_FORM_DIRECTIVES],
})
export class QuestionsDisplayComponent implements OnInit {
  @Input() questions: any[];
  constructor() {
    // Do stuff
  }

  ngOnInit() {

  }

}
