import { Component, ElementRef, Renderer2, ViewEncapsulation, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/user';
import { CartComponent } from '../cart/cart.component';
import { HomePageComponent } from '../home-page/home-page.component';
// import{formatMoneyVietNam} from '../home-page/home-page.component';
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
export class HeaderComponent implements OnInit{
  isSearchFormActive: boolean = false;
  isMainMenuOpen: boolean = false;
  submenuOpen: boolean = false;
  isSubActionVisible: boolean = false;
  quantityInputValue: number = 1;
  userId=1;  // Sử dụng string hoặc null tùy thuộc vào loại dữ liệu của user ID


  cartNumberItem: number = 0;
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private snackBar: MatSnackBar, // Thêm MatSnackBar vào constructor
    private _authService: AuthService,
    private _cartComponent:CartComponent,
    private _homeComponent:HomePageComponent
  ) {
    // this._authService.cartSubject.subscribe((data) => {
    //   this.cartNumberItem = data;
    // });
    this._authService.isLoginSubject.subscribe((data) => {
      this.isLogin = data;
      console.log(this.isLogin, '...')
    });
  }
  ngOnInit(): void {
    this._authService.getIsLoginObservable().subscribe((data) => {
      this.isLogin = data;
      if (this.isLogin) {
        this.checkLogin()
      }
    });
    this.cartItemFunc();
    this.checkLogin()
  }
  isLogin = false;
  async checkLogin() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parseUserData: IUser = JSON.parse(userData);
      // Assuming idUserSubject is an Observable<number> or similar
       this._authService.idUserSubject.next(parseUserData._id);
       console.log(parseUserData._id,'UID')
      const cartList = await this._cartComponent.apiCartProduct(parseUserData._id);
      console.log(cartList, 'cl')
      let total_quantity = this._homeComponent.totalCartItem(cartList);
      this.cartNumberItem =total_quantity
      console.log(total_quantity, 'ttq')
      this.isLogin = true;
      console.log(this.isLogin, '...')
    } else {
      // Ensure that idUserSubject is set to a default value or handle the case when there's no user data
      this._authService.idUserSubject.next(null);
      this.isLogin = false;
    }
  }
  logout() {
    window.localStorage.getItem('userData');
    window.localStorage.removeItem('userData');
    this.isLogin = false;
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

    if (
      targetElement.classList.contains('ti-close') ||
      targetElement.closest('.ti-close')
    ) {
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