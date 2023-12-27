import {
  Component,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { IUser } from '../interfaces/user';
import { CartComponent } from '../cart/cart.component';
import { HomePageComponent } from '../home-page/home-page.component';
import { HomeService } from '../services/home.service';
import { Subscription, debounceTime, fromEvent, map } from 'rxjs';
import { HeaderService } from '../services/header.service';
import { formatMoneyVietNam, convertStringToNumbers } from '../utils/utils';
import { AccountInfoService } from '../services/account-info.service';

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
export class HeaderComponent implements OnInit {
  formatMoneyVietNam = formatMoneyVietNam;

  isSearchFormActive: boolean = false;
  isMainMenuOpen: boolean = false;
  submenuOpen: boolean = false;
  isSubActionVisible: boolean = false;
  quantityInputValue: number = 1;
  userId: any = false;
  cartNumberItem: number = 0;
  isMobileMenuOpen: boolean | undefined;
  types: any;
  dataLiveSearch: any;
  currentSubMenuIndex: null | undefined;
  @ViewChild('searchInput') searchInput: ElementRef | undefined;
  accountInfo: any;
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
    private _authService: AuthService,
    private _cartComponent: CartComponent,
    private _homeComponent: HomePageComponent,
    private _headerService: HeaderService,
    private _accountInfoService: AccountInfoService
  ) {}
  ngAfterViewInit() {
    // fromEvent(this.searchInput?.nativeElement, 'input')
    //   .pipe(
    //     debounceTime(1000),
    //     map((event: any) => event.target.value)
    //   )
    //   .subscribe((inputValue: string) => {
    //     this._headerService
    //       .liveSearch(inputValue, this.userId)
    //       .subscribe((data) => {
    //         this.dataLiveSearch = data.productsByCategory;
    //         this.getKeySearch();
    //         console.log(data.productsByCategory);
    //         console.log(this.dataLiveSearch);
    //       });
    //     console.log('Giá trị nhập liệu sau mỗi 1s:', inputValue);
    //   });
  }
  ngOnInit(): void {
    this.getDataFromService();
    this.getIsLogin();
    this.cartItemFunc();
    this.checkLogin();
    this.getKeySearch();
    this.getCategory();
  }
  getKeySearch() {
    if (this.userId) {
      this._accountInfoService
        .getUserAccountInfo(this.userId)
        .subscribe((data) => {
          this.accountInfo = data;
          this.keyDown()
          console.log(this.accountInfo.historySearch);
          console.log(data, 'datausser');
        });
    } else {
    }
  }
  keyDown(){
    fromEvent(this.searchInput?.nativeElement, 'input')
      .pipe(
        debounceTime(1000),
        map((event: any) => event.target.value)
      )
      .subscribe((inputValue: string) => {
        this._headerService
          .liveSearch(inputValue, this.userId)
          .subscribe((data) => {
            this.dataLiveSearch = data.productsByCategory;
            this.getKeySearch();
            console.log(data.productsByCategory);
            console.log(this.dataLiveSearch);
          });
        console.log('Giá trị nhập liệu sau mỗi 1s:', inputValue);
      });
  }


  getIsLogin() {
    this._authService.getIsLoginObservable().subscribe((data) => {
      this.isLogin = data;
      if (this.isLogin) {
        this.checkLogin();
      }
    });
  }
  getCategory() {
    this._headerService.getTypesPopulateSubtypes().subscribe((data) => {
      this.types = data.typePopulateSubType;
    });
  }
  getDataFromService() {
    this._authService.cartSubject.subscribe((data) => {
      this.cartNumberItem = data;
    });
    this._authService.isLoginSubject.subscribe((data) => {
      this.isLogin = data;
    });
    this._authService.idUserSubject.subscribe((data) => {
      this.userId = data;
    });
  }

  isLogin = false;
  async checkLogin() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parseUserData: IUser = JSON.parse(userData);
      this._authService.idUserSubject.next(parseUserData._id);
      this.userId = parseUserData._id;
      const cartList = await this._cartComponent.apiCartProduct(
        parseUserData._id
      );
      let total_quantity = this._homeComponent.totalCartItem(cartList);
      this.cartNumberItem = total_quantity;
      this.isLogin = true;
    } else {
      this._authService.idUserSubject.next(null);
      this.isLogin = false;
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
    const allSubChildElements =
      this.elRef.nativeElement.querySelectorAll('.child-sub');
    allSubChildElements.forEach(
      (
        element: {
          previousElementSibling: any;
          style: { display: string };
          classList: {
            remove: (arg0: string) => void;
            add: (arg0: string) => void;
          };
        },
        i: number
      ) => {
        element.style.display = 'none';
        element.classList.remove('open');

        // Đóng tất cả các mũi tên trong sub-menu-mb khác
        const allArrows = this.elRef.nativeElement.querySelectorAll(
          '.sub-menu-mb .arrows'
        );
        allArrows.forEach(
          (arrowElement: {
            classList: {
              remove: (arg0: string) => void;
              add: (arg0: string) => void;
            };
          }) => {
            arrowElement.classList.remove('open');
          }
        );

        // Nếu index của submenu trùng với index của thẻ được click, thì mở nó
        if (i === index) {
          const arrowsElement =
            element.previousElementSibling.querySelector('.arrows');
          arrowsElement.classList.add('open');
          element.style.display = 'block';
          element.classList.add('open');
        }
      }
    );
  }

  toggleSubMenu(): void {
    const subMenuMb = this.elRef.nativeElement.querySelector('.sub-menu-mb');
    const mainMenu = this.elRef.nativeElement.querySelector('.main-menu');

    if (!this.submenuOpen) {
      // Nếu submenu chưa mở, thì thêm class "open" vào cả sub-menu và main-menu
      this.renderer.setStyle(subMenuMb, 'display', 'block');
      this.renderer.addClass(subMenuMb, 'open');
      this.renderer.addClass(mainMenu, 'open');
    } else {
      // Nếu submenu đã mở, thì chỉ đóng sub-menu, không xoá class "open" của main-menu
      this.renderer.setStyle(subMenuMb, 'display', 'none');
      this.renderer.removeClass(subMenuMb, 'open');
    }

    this.submenuOpen = !this.submenuOpen;
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

  // toggleSearchForm(): void {
  //   this.isSearchFormActive = !this.isSearchFormActive;
  // }

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

  // đóng mở quick-search
  toggleSearchForm(event: Event): void {
    // Kiểm tra xem sự kiện là focus hay không
    const isFocusEvent = event instanceof FocusEvent;

    // Nếu là focus event và form đã được kích hoạt, không thực hiện toggle nữa
    if (isFocusEvent && this.isSearchFormActive) {
      return;
    }

    this.isSearchFormActive = !this.isSearchFormActive;
    const searchForm = this.elRef.nativeElement.querySelector('.search-form');

    if (this.isSearchFormActive) {
      this.renderer.addClass(searchForm, 'active');
    } else {
      this.renderer.removeClass(searchForm, 'active');
    }
  }

  isSearchInputActive: boolean = false;
  @HostListener('document:click', ['$event'])
  //đóng mở submenu
  handleClickOutsideSubMenu(event: Event): void {
    const allSubChildElements =
      this.elRef.nativeElement.querySelectorAll('.child-sub');
    allSubChildElements.forEach(
      (element: {
        style: { display: string };
        classList: { remove: (arg0: string) => void };
      }) => {
        element.style.display = 'none';
        element.classList.remove('open');
      }
    );

    this.currentSubMenuIndex = null;
  }
  closeSubMenu(): void {
    this.currentSubMenuIndex = null;
  }

  handleClickOutside(event: Event) {
    const searchForm = this.elRef.nativeElement.querySelector('.search-form');

    // Nếu không phải là sự kiện focus, thực hiện việc đóng form
    if (
      !(event instanceof FocusEvent) &&
      searchForm &&
      !searchForm.contains(event.target as Node)
    ) {
      this.isSearchFormActive = false;
      this.renderer.removeClass(searchForm, 'active');
    }
  }

  isClickInsideQuickSearch(event: Event): boolean {
    const quickSearch = this.elRef.nativeElement.querySelector(
      '.search-form__quick-search'
    );
    return quickSearch.contains(event.target);
  }

  //

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

  // đóng mở account
  toggleSubAction(): void {
    this.isSubActionVisible = !this.isSubActionVisible;

    const subAction = this.elRef.nativeElement.querySelector('.sub-action');

    if (this.isSubActionVisible) {
      this.renderer.addClass(subAction, 'account-open');
    } else {
      this.renderer.removeClass(subAction, 'account-open');
    }
  }

  // Đóng mở giỏ hàng
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
  //
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
