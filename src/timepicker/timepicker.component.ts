import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';

import { TimeComponent } from './time.component';
import { TimeService } from './time.service';

@Component({
  selector: 'md-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss']
})
export class TimePickerComponent implements OnInit {

  private readonly dialog: MdDialog;
  private readonly timeService: TimeService;
  private timeVal: Date;

  formattedTime: string;

  @Output()
  timeChange = new EventEmitter<Date>();

  @Input()
  get time(): Date {
    return this.timeVal;
  };
  set time(val: Date) {
    this.timeVal = val;
    this.timeChange.emit(val);
    this.formattedTime = this.formatTime(val);
  }

  constructor(dialog: MdDialog, timeService: TimeService) {
    this.dialog = dialog;
    this.timeService = timeService;
  }

  private formatTime(time: Date): string {
    if (time === undefined) {
      return;
    }
    return this.timeService.getTime(time);
  }

  ngOnInit() {
    if (this.time === undefined) {
      this.time = new Date();
    }
  }

  openDialog() {
    let ref = this.dialog.open(TimeComponent);

    // Workaround to update style of dialog which sits outside of the component
    let containerDiv = (<any>ref)._overlayRef._pane.children[0];
    containerDiv.style['padding'] = '0';

    ref.componentInstance.submit.subscribe(result => {
      this.time = result;
      ref.close();
    });
    ref.componentInstance.cancel.subscribe(result => {
      ref.close();
    });
  }
}
