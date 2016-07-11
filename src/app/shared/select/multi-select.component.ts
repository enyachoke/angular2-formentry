/**
 * multi-select.component
 */

import {
Component,
Input,
Output,
ViewChild,
OnInit,
OnChanges,
EventEmitter,
ElementRef,
Renderer,
ChangeDetectionStrategy,
Provider, forwardRef
} from "@angular/core";
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {CORE_DIRECTIVES} from "@angular/common";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
const noop = () => { };

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = new Provider(
  NG_VALUE_ACCESSOR, {
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true
  });
@Component({
  moduleId: module.id,
  selector: 'yk-multi-select',
  templateUrl: 'multi-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [CORE_DIRECTIVES],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})

export class MultiSelectComponent implements OnInit, OnChanges, ControlValueAccessor {

  // determine whether to show the dropdown content
  private dropdown: boolean;

  // determine whether the mouse
  // is in this component area
  private mouseOnComponent: boolean;

  private newItem: string;

  private filteredItems: string[];
  @Input() items: Immutable.List<string>;
  @Input() selectedItems: Immutable.List<string>;
  @Output() onSelectItem = new EventEmitter<string>();
  @Output() onAddItem = new EventEmitter<string>();
  @Output() onDeselectItem = new EventEmitter<string>();
  @ViewChild('selectInput') input: ElementRef;

  get nonSelectedItems() {
    return _.difference(this.items.toArray(), this.selectedItems.toArray());
  }

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.dropdown = false;
    this.mouseOnComponent = false;
    this.newItem = '';
  }

  ngOnChanges() {
    this.search();
  }

  ngAfterViewInit() {
    // set the select text input inline style
    this.renderer.setElementStyle(this.input.nativeElement, 'position', 'relative');
    this.renderer.setElementStyle(this.input.nativeElement, 'width', '10px');
    this.renderer.setElementStyle(this.input.nativeElement, 'left', '0');
  }

  /*
   * Filter the items when we typing in the input text box
   *
   * */
  search() {
    if (this.newItem != '' && this.newItem != undefined) {
      // set the select text input width according to the width of the newItem string
      this.renderer.setElementStyle(this.input.nativeElement, 'width', (10 + this.newItem.length * 10).toLocaleString() + 'px');

      this.filteredItems = this.nonSelectedItems.filter((item: string) => item.toLocaleLowerCase().indexOf(this.newItem) !== -1)
    } else {
      this.filteredItems = this.nonSelectedItems;
    }
  }


  onSelectInputClick() {
    // the select text input set to be focus
    this.renderer.invokeElementMethod(this.input.nativeElement,
      'focus', []);
    // show the dropdown content
    this.dropdown = true;
  }


  onSelectInputBlur() {
    // when the select input is blur,
    // we check whether the mouse in the component area
    if (!this.mouseOnComponent) {
      // if the mouse is not in the component area,
      // that means we might click outside the component area
      // and the dropdown content should be hided
      this.dropdown = false;
    } else {
      // if the mouse is still in the component area,
      // that means we click inside the component area
      // and the dropdown content should be shown
      // and the input should set to be focus
      this.renderer.invokeElementMethod(this.input.nativeElement,
        'focus', []);
    }
  }

  onMouseEnter() {
    this.setMouseOnComponent(true);
  }

  onMouseLeave() {
    this.setMouseOnComponent(false);
  }

  /*
   * select an item in the dropdown content area
   * */
  select(item: string) {
    this.onSelectItem.emit(item);
    this.newItem = '';
  }

  /*
   * deselect an item
   * */
  deselect(item: string) {
    this.onDeselectItem.emit(item);
    this.newItem = '';
  }

  /*
   * add an new item
   * */
  addNewItem() {
    if (this.newItem) {
      this.onAddItem.emit(this.newItem);
      this.newItem = '';
    }
  }

  checkDropdownActive() {
    return this.dropdown && (this.nonSelectedItems.length > 0 || this.newItem);
  }

  private setMouseOnComponent(status: boolean) {
    this.mouseOnComponent = status;
  }
  //The internal data model
  private _value: any = '';

  //Placeholders for the callbacks
  private _onTouchedCallback: () => void = noop;

  private _onChangeCallback: (_: any) => void = noop;

  //get accessor
  get value(): any { return this._value; };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this._onChangeCallback(v);
    }
  }

  //Set touched on blur
  onTouched() {
    this._onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    this._value = value;
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }
}
