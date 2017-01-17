import { animate, Component, EventEmitter, Input, keyframes, OnInit, Output, style, transition, trigger } from '@angular/core';

import { TimeService } from './time.service';

enum TimePart {
  Hours,
  Minutes
}

@Component({
  selector: 'md-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {

  private readonly timeService: TimeService;
  private activeTimePart: TimePart = TimePart.Hours;
  private timeVal: Date;
  private currentHours: string;
  private currentMinutes: string;
  private amHours: Array<string>;
  private pmHours: Array<string>;
  private steppedMinutes: Array<string>;
  private allMinutes: Array<string>;
  private minuteSteps: number = 5;

  @Output()
  timeChange = new EventEmitter<Date>();

  @Input()
  get time(): Date {
    return this.timeVal;
  };
  set time(val: Date) {
    this.timeVal = val;
    this.timeChange.emit(val);
    this.updateTime(val);
  }

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  submit = new EventEmitter<Date>();

  constructor(timeService: TimeService) {
    this.timeService = timeService;
  }

  ngOnInit() {
    this.time = new Date();
    this.amHours = this.timeService.getAMHours();
    this.pmHours = this.timeService.getPMHours();
    this.steppedMinutes = this.timeService.getMinutes(this.minuteSteps);
    this.allMinutes = this.timeService.getMinutes();
    console.log(this.amHours);
    console.log(this.pmHours);
    console.log(this.steppedMinutes);
  }

  private updateTime(time: Date) {
    this.currentHours = this.timeService.getHour(time);
    this.currentMinutes = this.timeService.getMinute(time);
  }

  isPartActive(part: number) {
    if (part === this.activeTimePart) {
      return 'active';
    }
  }

  switchActivePart(part: number) {
    if (this.activeTimePart !== part) {
      this.activeTimePart = part;
    }
  }

  onNow() {
    console.log('not implemented');
  }

  onCancel() {
    this.cancel.emit();
  }

  onOk() {
    this.submit.emit(this.time);
  }
}
