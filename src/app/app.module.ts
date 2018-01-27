import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ElementsModule } from './elements/elements.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ElementsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
