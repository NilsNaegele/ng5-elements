import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuralNetMnistComponent } from './neural-net-mnist.component';

describe('NeuralNetMnistComponent', () => {
  let component: NeuralNetMnistComponent;
  let fixture: ComponentFixture<NeuralNetMnistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeuralNetMnistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuralNetMnistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
