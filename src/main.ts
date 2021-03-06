import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerAsCustomElements } from '@angular/elements';

import { ElementsModule } from './app/elements/elements.module';

import { NeuralNetArtComponent } from './app/elements/neural-net-art/neural-net-art.component';
// import { NeuralNetMnistComponent } from './app/elements/neural-net-mnist/neural-net-mnist.component';

import { environment } from './environments/environment';


if (environment.production) {
  enableProdMode();
}

registerAsCustomElements([NeuralNetArtComponent ],
  () => platformBrowserDynamic().bootstrapModule(ElementsModule)
).catch(error => console.log(error));
