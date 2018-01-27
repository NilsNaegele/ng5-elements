import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuralNetArtComponent } from './neural-net-art.component';

describe('NeuralNetArtComponent', () => {
  let component: NeuralNetArtComponent;
  let fixture: ComponentFixture<NeuralNetArtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeuralNetArtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuralNetArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
