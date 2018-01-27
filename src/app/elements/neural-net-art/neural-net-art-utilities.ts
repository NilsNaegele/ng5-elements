import * as deeplearn from 'deeplearn';

export function createInputAtlas(imageSize: number,
                                 inputNumDimensions: number,
                                 numLatentVariables: number) {
                const coords = new Float32Array(imageSize * imageSize * inputNumDimensions);
                let dst = 0;
                for (let i = 0; i < imageSize * imageSize; i++) {
                  for (let d = 0; d < inputNumDimensions; d++) {
                    const x = i % imageSize;
                    const y = Math.floor(i / imageSize);
                    const coord = imagePixelToNormalizeCoord(
                      x,
                      y,
                      imageSize,
                      imageSize,
                      numLatentVariables
                    );
                    coords[dst++] = coord[d];
                  }
                }
                return deeplearn.Array2D.new([imageSize * imageSize, inputNumDimensions], coords);
}

// normalize x, y to -.5 <=> +.5, adds a radius term, and pads zeros with
// number of z parameters that will get added by the add z shader
export function imagePixelToNormalizeCoord(x: number,
                                           y: number,
                                           imageWidth: number,
                                           imageHeight: number,
                                           zSize: number): Array<number> {
                    const halfWidth = imageWidth * 0.5;
                    const halfHeight = imageHeight * 0.5;
                    const normX = (x - halfWidth) / imageWidth;
                    const normY = (y - halfHeight) / imageHeight;
                    const root = Math.sqrt(normX * normY + normY * normY);
                    const result = [normX, normY, root];

                    return result;
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
