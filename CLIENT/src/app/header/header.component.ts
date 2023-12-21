import { Component, ElementRef, Renderer2, ViewEncapsulation, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  // Thêm các trường khác nếu cần
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./styles.css', './header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  isSearchFormActive: boolean = false;
  isMainMenuOpen: boolean = false;
  submenuOpen: boolean = false;
  isSubActionVisible: boolean = false;
  quantityInputValue: number = 1;

  cartItems: CartItem[] = [
    { id: 1, name: 'Zuýp 2 lớp xếp ly bản lớn', quantity: 1, price: 595000 },
    // Thêm các sản phẩm khác nếu có
  ];

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private snackBar: MatSnackBar // Thêm MatSnackBar vào constructor
  ) {}

  toggleSearchForm(): void {
    this.isSearchFormActive = !this.isSearchFormActive;
  }

  handleQuickSearchClick(event: Event): void {
    event.stopPropagation();
  }

  toggleMainMenu(): void {
    this.isMainMenuOpen = !this.isMainMenuOpen;
    const mainMenu = this.elRef.nativeElement.querySelector('.main-menu');

    if (this.isMainMenuOpen) {
      this.renderer.addClass(mainMenu, 'open');
    } else {
      this.renderer.removeClass(mainMenu, 'open');
    }
  }

  isClickInsideMenu(event: Event): boolean {
    const mainMenu = this.elRef.nativeElement.querySelector('.main-menu');
    return mainMenu.contains(event.target);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event): void {
    if (!this.isClickInsideMenu(event)) {
      this.isMainMenuOpen = false;
      const mainMenu = this.elRef.nativeElement.querySelector('.main-menu');
      this.renderer.removeClass(mainMenu, 'open');
    }
  }

  closeMainMenu(event: Event): void {
    const targetElement = event.target as HTMLElement;

    if (targetElement.classList.contains('ti-close') || targetElement.closest('.ti-close')) {
      event.stopPropagation();
      this.isMainMenuOpen = false;
      const mainMenu = this.elRef.nativeElement.querySelector('.main-menu');
      this.renderer.removeClass(mainMenu, 'open');
    }
  }

  toggleSubAction(): void {
    this.isSubActionVisible = !this.isSubActionVisible;

    const subAction = this.elRef.nativeElement.querySelector('.sub-action');

    if (this.isSubActionVisible) {
      this.renderer.addClass(subAction, 'account-open');
    } else {
      this.renderer.removeClass(subAction, 'account-open');
    }
  }

  toggleCart(): void {
    this.isSubActionVisible = !this.isSubActionVisible;

    const subActionCart = this.elRef.nativeElement.querySelector('.sub-action-cart');

    if (this.isSubActionVisible) {
      this.renderer.addClass(subActionCart, 'active');
    } else {
      this.renderer.removeClass(subActionCart, 'active');
    }
  }

  closeCart(event: Event): void {
    const subActionCart = this.elRef.nativeElement.querySelector('.sub-action-cart');
    this.renderer.removeClass(subActionCart, 'active');
  }

  updateQuantity(action: string): void {
    if (action === 'minus' && this.quantityInputValue > 0) {
      this.quantityInputValue -= 1;
    } else if (action === 'plus') {
      this.quantityInputValue += 1;
    }

    if (this.quantityInputValue === 0) {
      this.removeItemFromCart();
    }
  }

  removeItemFromCart(): void {
    // Lọc ra những sản phẩm có quantity khác 0 và tạo mảng mới
    this.cartItems = this.cartItems.filter(item => item.quantity !== 0);

    // Hiển thị thông báo
    this.openSnackBar('Đã xoá sản phẩm!');
  }

  private openSnackBar(message: string): void {
    this.snackBar.open(message, 'Đóng', {
      duration: 2000, // Thời gian hiển thị thông báo (2 giây)
      panelClass: ['custom-snackbar'], // Thêm class CSS tùy chỉnh
    });
  }
}
