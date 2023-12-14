import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAddressPopupComponent } from './account-address-popup.component';

describe('AccountAddressPopupComponent', () => {
  let component: AccountAddressPopupComponent;
  let fixture: ComponentFixture<AccountAddressPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountAddressPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountAddressPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
