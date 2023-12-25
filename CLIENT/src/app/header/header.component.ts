import {
  Component,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

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
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  isMobileMenuOpen: boolean = false;
  isSearchFormActive: boolean = false;
  isMainMenuOpen: boolean = false;
  submenuOpen: boolean = false;
  isSubActionVisible: boolean = false;
  quantityInputValue: number = 1;

  cartNumberItem: number = 0;
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private snackBar: MatSnackBar, // Thêm MatSnackBar vào constructor
    private _authServer: AuthService
  ) {
    this._authServer.cartSubject.subscribe((data) => {
      this.cartNumberItem = data;
    });
    this._authServer.isLoginSubject.subscribe((data) => {
      this.isLogin = data;
    });
  }
  ngOnInit(): void {
    this.cartItemFunc();
  }
  isLogin = false;
  checkLogin() {
    const localCartString = localStorage.getItem('userData');
    if (localCartString) {
      this.isLogin = true;
    }
  }
  logout() {
    window.localStorage.getItem('userData');
    window.localStorage.removeItem('userData');
    this.isLogin = false;
  }

  // sub-menu-mobile
  // Thêm open vào main-menu
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    const mainMenu = this.elRef.nativeElement.querySelector('.main-menu');

    if (this.isMobileMenuOpen) {
      this.renderer.addClass(mainMenu, 'open');
    } else {
      this.renderer.removeClass(mainMenu, 'open');
    }
  }
  // Xoá open ra main-menu
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    const mainMenu = this.elRef.nativeElement.querySelector('.main-menu');
    this.renderer.removeClass(mainMenu, 'open');
  }

  // Data sub-menu
  menuItems = [
    {
      label: 'áo',
      subItems: [
        { label: 'Áo sơ mi' },
        { label: 'Áo kiểu' },
        { label: 'Áo len' },
      ],
    },
    {
      label: 'áo khoác',
      subItems: [
        { label: 'Áo sơ mi' },
        { label: 'Áo kiểu' },
        { label: 'Áo len' },
      ],
    },
    {
      label: 'quần & Jumpsuit',
      subItems: [
        { label: 'Áo sơ mi' },
        { label: 'Áo kiểu' },
        { label: 'Áo len' },
      ],
    },
    {
      label: 'phụ kiện',
      subItems: [
        { label: 'Áo sơ mi' },
        { label: 'Áo kiểu' },
        { label: 'Áo len' },
      ],
    },
    {
      label: 'chân váy',
      subItems: [
        { label: 'Áo sơ mi' },
        { label: 'Áo kiểu' },
        { label: 'Áo len' },
      ],
    },
    {
      label: 'đầm',
      subItems: [
        { label: 'Áo sơ mi' },
        { label: 'Áo kiểu' },
        { label: 'Áo len' },
      ],
    },
  ];

  toggleSubMenuChild(event: Event, index: number): void {
    event.stopPropagation();

    // Đóng tất cả các submenu khác
    const allSubChildElements = this.elRef.nativeElement.querySelectorAll('.child-sub');
    allSubChildElements.forEach((element: {
      previousElementSibling: any; style: { display: string; }; classList: { remove: (arg0: string) => void; add: (arg0: string) => void; }; 
}, i: number) => {
      element.style.display = 'none';
      element.classList.remove('open');
  
      // Đóng tất cả các mũi tên trong sub-menu-mb khác
      const allArrows = this.elRef.nativeElement.querySelectorAll('.sub-menu-mb .arrows');
      allArrows.forEach((arrowElement: { classList: { remove: (arg0: string) => void; add: (arg0: string) => void; }; }) => {
        arrowElement.classList.remove('open');
      });
  
      // Nếu index của submenu trùng với index của thẻ được click, thì mở nó
      if (i === index) {
        const arrowsElement = element.previousElementSibling.querySelector('.arrows');
        arrowsElement.classList.add('open');
        element.style.display = 'block';
        element.classList.add('open');
      }
    });
  }






  toggleSubMenu(): void {
    this.submenuOpen = !this.submenuOpen;

    const subMenuMb = this.elRef.nativeElement.querySelector('.sub-menu-mb');

    if (this.submenuOpen) {
      this.renderer.setStyle(subMenuMb, 'display', 'block');
    } else {
      this.renderer.setStyle(subMenuMb, 'display', 'none');
    }
  }





  cartItemFunc() {
    const localCartString = localStorage.getItem('localCart');

    if (localCartString !== null) {
      var cartCount = JSON.parse(localCartString);
      this.cartNumberItem = cartCount.length;
    }
  }
  cartItems: CartItem[] = [
    { id: 1, name: 'Zuýp 2 lớp xếp ly bản lớn', quantity: 1, price: 595000 },
    // Thêm các sản phẩm khác nếu có
  ];

  toggleSearchForm(): void {
    this.isSearchFormActive = !this.isSearchFormActive;
  }

  handleQuickSearchClick(event: Event): void {
    event.stopPropagation();
  }





  @HostListener('document:click', ['$event'])




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

    const subActionCart =
      this.elRef.nativeElement.querySelector('.sub-action-cart');

    if (this.isSubActionVisible) {
      this.renderer.addClass(subActionCart, 'active');
    } else {
      this.renderer.removeClass(subActionCart, 'active');
    }
  }

  closeCart(event: Event): void {
    const subActionCart =
      this.elRef.nativeElement.querySelector('.sub-action-cart');
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
    this.cartItems = this.cartItems.filter((item) => item.quantity !== 0);

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
