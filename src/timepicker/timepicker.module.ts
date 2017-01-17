import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { TimePickerComponent } from './timepicker.component';
import { TimeComponent } from './time.component';
import { TimeService } from './time.service';

@NgModule({
  declarations: [
    TimePickerComponent,
    TimeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule.forRoot()
  ],
  providers: [
    TimeService
  ],
  exports: [
    TimePickerComponent
  ],
  entryComponents: [
    TimeComponent
  ]
})
export class TimePickerModule { }
