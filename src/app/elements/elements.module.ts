import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NeuralNetArtComponent } from './neural-net-art/neural-net-art.component';
// import { NeuralNetMnistComponent } from './neural-net-mnist/neural-net-mnist.component';
// import { PaintCanvasComponent } from './paint-canvas/paint-canvas';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  declarations: [ NeuralNetArtComponent ],
  entryComponents: [ NeuralNetArtComponent ]
})
export class ElementsModule {
  ngDoBootstrap() {}
}
