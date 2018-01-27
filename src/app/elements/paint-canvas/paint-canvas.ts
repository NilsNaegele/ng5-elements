import { Component, ElementRef, ViewChild,
         NgZone, Renderer2, OnInit, EventEmitter, Output } from '@angular/core';

export interface MousePosition {
  x: number;
  y: number;
}

@Component({
  selector: 'app-paint-canvas',
  template: `
  <canvas #mnistCanvas width="280" height="280"
          (mousedown)="beginPaint($event)"
          (mouseup)="finishPaint($event)">
  </canvas>
  `
})
export class PaintCanvasComponent implements OnInit {
      private _painting = false;
      private _prevMousePos: MousePosition;
      context: CanvasRenderingContext2D;

      @Output() endPaint: EventEmitter<any> = new EventEmitter();

      @ViewChild('mnistCanvas') canvasRef: ElementRef;

      constructor(private _ngZone: NgZone, private _renderer: Renderer2) { }

      ngOnInit() {
        this.context = this.canvasRef.nativeElement.getContext('2d');
        // register mousemove listener outside ngzone so change detection is
        // not performed at every mouse move and performance suffers.

        this._ngZone.runOutsideAngular(() => {
          // carmen is not happy with this
          this._renderer.listen(this.canvasRef.nativeElement, 'mousemove', this.paint.bind(this));
        });
      }

      beginPaint(evt: MouseEvent): void {
        this._prevMousePos = this._getMousePosition(this.canvasRef.nativeElement, evt);
        this._painting = true;
      }

      paint(evt: MouseEvent): void {
        if (this._painting) {
          const mousePos = this._getMousePosition(this.canvasRef.nativeElement, evt);
          this._draw(this.context, mousePos, this._prevMousePos);
          this._prevMousePos = mousePos;
        }
      }




      private _getMousePosition(canvas: HTMLCanvasElement, evt: MouseEvent): MousePosition {
        const rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }

      private _draw(context: CanvasRenderingContext2D,
                    mousePosition: MousePosition,
                    prevMousePosition: MousePosition): void {
                      context.beginPath();
                      context.moveTo(prevMousePosition.x, prevMousePosition.y);
                      context.lineWidth = 10;
                      context.lineTo(mousePosition.x, mousePosition.y);
                      context.closePath();
                      context.stroke();
                    }


}
