import { Component,
         ViewEncapsulation,
         OnInit,
         ViewChild,
         Input,
         HostListener } from '@angular/core';

import { ActivationFunction,
         CarmenPopovociuPN,
         ACTIVATION_FN_NAMES } from './carmen-popoviciu-p-n';

// standard deviations for gaussian weight initialization
const WEIGHTS_STDEV = 0.6;
const MAT_WIDTH = 30;

@Component({
  selector: 'app-neural-net-art',
  templateUrl: './neural-net-art.component.html',
  styleUrls: ['./neural-net-art.component.scss'],
  encapsulation: ViewEncapsulation.Native
})
export class NeuralNetArtComponent implements OnInit {
  private _carmen: CarmenPopovociuPN;
  private _activationFunctionNames: ActivationFunction[] = ACTIVATION_FN_NAMES;
  private _activationFN: ActivationFunction;
  private _numberLayers: string;
  private _z1Scale: string;
  private _z2Scale: string;

  currentStyles: {};


  @Input() canvasSize: string;
  @Input()
  set activationFunction(fn: ActivationFunction) {
    this._activationFN = fn;
    if (this._carmen && this._activationFunctionNames.includes(fn)) {
      this._carmen.setActivationFunction(fn);
    }
  }
  get activationFunction(): ActivationFunction {
    return this._activationFN;
  }

  @Input()
  set numberLayers(value: string) {
    this._numberLayers = value;
    if (this._carmen) {
      this._carmen.setNumberLayers(parseInt(value, 10));
    }
  }
  get numberLayers(): string {
    return this._numberLayers;
  }

  @Input()
  set z1Scale(value: string) {
    this._z1Scale = value;
    if (this._carmen) {
      this._carmen.setZ1Scale(this._convertZScale(parseInt(value, 10)));
    }
  }
  get z1Scale(): string {
    return this._z1Scale;
  }

  @Input()
  set z2Scale(value: string) {
    if (this._carmen) {
      this._carmen.setZ2Scale(this._convertZScale(parseInt(value, 10)));
    }
  }
  get z2Scale(): string {
    return this._z2Scale;
  }

  @ViewChild('canvas') canvas;

  @HostListener('document:keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.canvas.nativeElement.webkitRequestFullScreen();
    }
  }

  ngOnInit() {
    this.setCurrentStyles();
    this._carmen = new CarmenPopovociuPN(
      this.canvas.nativeElement,
      parseInt(this.canvasSize, 10)
    );
    this._carmen.setActivationFunction(this.activationFunction);
    this._carmen.setNumberLayers(parseInt(this.numberLayers, 10) || undefined);
    this._carmen.setZ1Scale(parseInt(this.z1Scale, 10) || undefined);
    this._carmen.setZ2Scale(parseInt(this.z2Scale, 10) || undefined);
    this._carmen.generateWeights(MAT_WIDTH, WEIGHTS_STDEV);
    this._carmen.start();
  }

  private _convertZScale(z: number): number {
    return 103 - z;
  }

  private setCurrentStyles() {
    this.currentStyles = {
      'width': '100%',
      'height': '100%'
    };
  }

}
