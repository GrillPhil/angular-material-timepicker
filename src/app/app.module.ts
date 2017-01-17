import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { TimePickerModule } from './../timepicker/timepicker.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule.forRoot(),
    TimePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
