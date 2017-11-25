import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoCropperComponent } from './photo-cropper.component';

describe('PhotoCropperComponent', () => {
  let component: PhotoCropperComponent;
  let fixture: ComponentFixture<PhotoCropperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoCropperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
