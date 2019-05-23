import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLightComponent } from './post-light.component';

describe('PostLightComponent', () => {
  let component: PostLightComponent;
  let fixture: ComponentFixture<PostLightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostLightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostLightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
