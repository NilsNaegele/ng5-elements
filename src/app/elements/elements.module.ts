import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NeuralNetArtComponent } from './neural-net-art/neural-net-art.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  declarations: [ NeuralNetArtComponent ],
  entryComponents: [ NeuralNetArtComponent ],
  exports: [ NeuralNetArtComponent ]
})
export class ElementsModule {
  ngDoBootstrap() {}
}
