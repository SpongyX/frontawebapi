import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMedComponent } from './update-med.component';

describe('UpdateMedComponent', () => {
  let component: UpdateMedComponent;
  let fixture: ComponentFixture<UpdateMedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
