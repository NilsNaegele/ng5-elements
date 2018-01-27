import * as deeplearn from 'deeplearn';
import * as nn_art_util from './neural-net-art-utilities';

const MAX_LAYERS = 10;
const math = deeplearn.ENV.math;
const NUM_IMAGE_SPACE_VARIABLES = 3; // x, y, r
const NUM_LATENT_VARIABLES = 2;


export type ActivationFunction = 'tanh' | 'sin' | 'relu' | 'step';

export const ACTIVATION_FN_NAMES: ActivationFunction[] = [
  'tanh',
  'sin',
  'relu',
  'step'
];

const activationFunctionMap: {
  [activationFunction in ActivationFunction]: (
    ndarray: deeplearn.Array2D
  ) => deeplearn.Array2D
} = {
 tanh: (x: deeplearn.Array2D) => math.tanh(x),
 sin: (x: deeplearn.Array2D) => math.sin(x),
 relu: (x: deeplearn.Array2D) => math.relu(x),
 step: (x: deeplearn.Array2D) => math.step(x)
};

export class CarmenPopovociuPN {
  private _inputAtlas: deeplearn.Array2D;
  private _ones: deeplearn.Array2D<'float32'>;

  private _firstLayerWeights: deeplearn.Array2D;
  private _intermediateWeights: deeplearn.Array2D[] = []; // empty
  private _lastLayerWeights: deeplearn.Array2D;

  private _z1Counter = 0;
  private _z2Counter = 0;
  private _z1Scale: number;
  private _z2Scale: number;
  private _numberLayers: number;
  private _activationFunction: ActivationFunction;

  private _isInferring = false;

  constructor(private canvas: HTMLCanvasElement, private canvasSize: number) {
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;

    this._inputAtlas = nn_art_util.createInputAtlas(
                      canvasSize,
                      NUM_IMAGE_SPACE_VARIABLES,
                      NUM_LATENT_VARIABLES);
    this._ones = deeplearn.Array2D.ones([this._inputAtlas.shape[0], 1]);
  }

  generateWeights(neuronsPerLayer: number, weightsStdev: number) {
    for (let i = 0; i < this._intermediateWeights.length; i++) {
      this._intermediateWeights[i].dispose();
    }
    this._intermediateWeights = [];
    if (this._firstLayerWeights != null) {
      this._firstLayerWeights.dispose();
    }
    if (this._lastLayerWeights != null) {
      this._lastLayerWeights.dispose();
    }

    this._firstLayerWeights = deeplearn.Array2D.randTruncatedNormal(
      [NUM_IMAGE_SPACE_VARIABLES + NUM_LATENT_VARIABLES, neuronsPerLayer],
      0,
      weightsStdev
    );
    for (let i = 0; i < MAX_LAYERS; i++) {
      this._intermediateWeights.push(deeplearn.Array2D
                                    .randTruncatedNormal(
                                      [neuronsPerLayer, neuronsPerLayer],
                                      0,
                                      weightsStdev));
    }
    this._lastLayerWeights = deeplearn.Array2D.randTruncatedNormal(
              [neuronsPerLayer, 3 /** max output channels **/],
              0,
              weightsStdev
    );
  }

  setActivationFunction(activationFunction: ActivationFunction = 'tanh') {
    this._activationFunction = activationFunction;
  }

  setNumberLayers(numberLayers: number = 3): void {
    this._numberLayers = numberLayers;
  }

  setZ1Scale(z1Scale: number = 100): void {
    this._z1Scale = z1Scale;
  }

  setZ2Scale(z2Scale: number = 100): void {
    this._z2Scale = z2Scale;
  }

  start() {
    this._isInferring = true;
    this.runInferenceLoop();
  }

  private async runInferenceLoop() {
    if (!this._isInferring) {
      return;
    }

    this._z1Counter += 1 / this._z1Scale;
    this._z2Counter += 1 / this._z2Scale;

    const lastOutput = math.scope(() => {
        const z1 = deeplearn.Scalar.new(Math.sin(this._z1Counter));
        const z2 = deeplearn.Scalar.new(Math.cos(this._z2Counter));

        const concatAxis = 1;
        const latentVars = math.concat2D(
              math.multiply(z1, this._ones) as deeplearn.Array2D,
              math.multiply(z2, this._ones) as deeplearn.Array2D,
              concatAxis
        );
        const activation = (x: deeplearn.Array2D) =>
          activationFunctionMap[this._activationFunction](x);

        let _lastOutput: deeplearn.NDArray = math.concat2D(
          this._inputAtlas,
          latentVars,
          concatAxis
        );
        _lastOutput = activation(math.matMul(_lastOutput as deeplearn.Array2D,
                                            this._firstLayerWeights));
        for (let i = 0; i < this._numberLayers; i++) {
          const matMulResult = math.matMul(
            _lastOutput as deeplearn.Array2D,
            this._intermediateWeights[1]
          );

          _lastOutput = activation(matMulResult);
        }

        return math
              .sigmoid(math.matMul(_lastOutput as deeplearn.Array2D, this._lastLayerWeights))
              .reshape([this.canvas.height, this.canvas.width, 3]);
    });

    await renderToCanvas(lastOutput as deeplearn.Array3D, this.canvas);
    await deeplearn.util.nextFrame();
    this.runInferenceLoop();
  }

  stopInferenceLoop() {
    this._isInferring = false;
  }

}

async function renderToCanvas(a: deeplearn.Array3D, canvas: HTMLCanvasElement) {
  const [height, width] = a.shape;
  const context = canvas.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = await a.data();
  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    const k = i * 3;
    imageData.data[j + 0] = Math.round(255 * data[k + 0]);
    imageData.data[j + 1] = Math.round(255 * data[k + 1]);
    imageData.data[j + 2] = Math.round(255 * data[k + 2]);
    imageData.data[j + 3] = 255;
  }
  context.putImageData(imageData, 0, 0);
}


/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
