import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { local, localProductImg } from '../ENV/envi';
declare var $: any;
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../services/home.service';
import { IProduct } from '../interfaces/product';
import { AuthService } from '../services/auth.service';
import { CartComponent } from '../cart/cart.component';
import { CartService } from '../services/cart.service';
import { formatMoneyVietNam } from '../utils/utils';
import { take } from 'rxjs';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent implements AfterViewInit {
  formatMoneyVietNam = formatMoneyVietNam;
  localProductImg = localProductImg;
  productStates: boolean[] = [];
  i: number = 0;

  // products: any;
  errMessage: any;
  currentColor = 0;
  // currentColor: any;
  local = local;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _homeService: HomeService,
    private _authService: AuthService,
    private _cartService: CartService,
    private _cartComponent: CartComponent
  ) {
    this._authService.idUserSubject.subscribe((data) => {
      this.userIdFromHeader = data;
    });
  }

  ngAfterViewInit(): void {
    this.initOwlCarousel();
  }

  // Size table homepage

  private initOwlCarousel(): void {
    const owlSelector = '.exclusive-inner__list-products.owl-carousel';
    const owlElement = this.el.nativeElement.querySelector(owlSelector);

    if (owlElement) {
      this.renderer.addClass(owlElement, 'owl-carousel');

      const owlOptions: OwlOptions = {
        dots: false,
        nav: true,
        autoplay: false,
        loop: false,
        autoWidth: false,
        responsive: {
          0: { items: 2, margin: 20, nav: false },
          740: { items: 3, margin: 30 },
          1025: { items: 5, margin: 30 },
        },
      };

      $(owlElement).owlCarousel(owlOptions);
    }
  }

  toggleSizeTable(productIndex: number): void {
    // đóng mở các sizetable khác
    for (let i = 0; i < this.productStates.length; i++) {
      const otherSizeTableId = `sizeTable${i}`;
      const otherSizeTable = this.el.nativeElement.querySelector(
        `#${otherSizeTableId}`
      );
      if (otherSizeTable) {
        this.renderer.removeClass(otherSizeTable, 'open');
      }
    }

    const sizeTableId = `sizeTable${productIndex}`;
    const sizeTable = this.el.nativeElement.querySelector(`#${sizeTableId}`);
    if (
      sizeTable &&
      this.productStates &&
      this.productStates[productIndex] !== undefined
    ) {
      this.productStates[productIndex] = !this.productStates[productIndex];

      if (this.productStates[productIndex]) {
        this.renderer.addClass(sizeTable, 'open');
      } else {
        this.renderer.removeClass(sizeTable, 'open');
      }
    }
  }

  selectedColorId: number | null = null;

  bannersArray: any = [
    { imgName: '../assets/img/banner/banner-1.jpeg' },
    { imgName: '../assets/img/banner/banner-2.jpeg' },
    { imgName: '../assets/img/banner/banner-3.jpeg' },
  ];

  // Setting Carousel slider
  bannerOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: [
      '<i class="ti-arrow-left"></i>',
      '<i class="ti-arrow-right"></i>',
    ],
    responsive: {
      0: { items: 0 },
      400: { items: 1 },
      740: { items: 1 },
      940: { items: 1 },
    },
    nav: true,
  };

  // Setting new-prod homepage
  newprodOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="ti-arrow-left"></i>',
      '<i class="ti-arrow-right"></i>',
    ],
    responsive: {
      0: {
        items: 2,
        margin: 20,
        nav: false,
      },
      740: {
        items: 3,
        margin: 30,
      },
      1025: {
        items: 5,
        margin: 30,
      },
    },
    nav: true,
  };

  isHovered: boolean | undefined;
  products: any;

  async ngOnInit(): Promise<void> {
    await this.setupUserIdSubscription();
    await this.apiProductHomePage();

    // Khởi tạo mảng productStates với giá trị false cho mỗi sản phẩm
    this.productStates = Array(this.bannersArray.length).fill(false);
  }

  private async setupUserIdSubscription(): Promise<void> {
    return new Promise<void>((resolve) => {
      const subscription = this._authService.idUserSubject
        .pipe(take(1))
        .subscribe((data) => {
          this.userIdFromHeader = data;
          console.log(data, 'UserIdFromHeader in CartComponent');
          resolve();
        });
    });
  }

  setHoveredState(isHovered: boolean): void {
    this.isHovered = isHovered;
  }

  async apiChangeQuantityProductItem(data: object) {
    try {
      const responseData = await this._cartService.putProductItemCart(data);
    } catch (err) {
      this.errMessage = err;
    }
  }

  total_quantity: number = 0;

  totalCartItem(productsCart: any): number {
    this.total_quantity = 0;
    productsCart.forEach((product: any) => {
      product.variants.forEach((variant: any) => {
        variant.variantColor.forEach((variantColor: any) => {
          this.total_quantity += variantColor.quantity;
          console.log(variantColor.quantity, 'qt');
        });
      });
    });

    return this.total_quantity;
  }

  itemsCart: any = [];
  userIdFromHeader: any;

  async addToCart(
    colorID: any,
    product_Id: any,
    sizeLIST: any,
    quantityACTION: number
  ) {
    if (this.userIdFromHeader) {
      const data = {
        colorId: colorID,
        productId: product_Id,
        size: sizeLIST,
        quantityAction: quantityACTION,
        userId: this.userIdFromHeader,
      };
      this._cartService.putProductItemCart(data).subscribe(
        (result) => {
          console.log('API call successful', result);
        },
        (error) => {
          console.error('API call failed', error);
        }
      );
      const cartList = await this._cartComponent.apiCartProduct(
        this.userIdFromHeader
      );
      //
      this._cartService.updateCartItems(cartList);
      let total_quantity = await this.totalCartItem(cartList);
      this._authService.updateCart(total_quantity);
    }
  }

  cartNumber: number = 0;
  cartNumberFunc() {
    const localCartString = localStorage.getItem('localCart');
    if (localCartString !== null) {
      var cartValue = JSON.parse(localCartString);
      this.cartNumber = cartValue.length;
      //  this._authService.cartSubject.next(this.cartNumber)
    }
  }

  apiProductHomePage() {
    console.log('1235');
    this._homeService.getProductHomePage().subscribe({
      next: (data: any) => {
        this.products = data.products;

        this.updateProductsHaveModified();
        this.initializeSelectedColorIndex();
        console.log(this.products, '123');
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }

  changeColor(product: IProduct, colorId: string) {
    console.log(product._id, colorId);
    console.log(this.productsHaveModified);
    this.moveImgHomePageToFront(
      this.productsHaveModified,
      product._id,
      colorId
    );
  }

  moveImgHomePageToFront(
    productsHaveModified: any[],
    productId: string,
    colorId: string
  ): any[] {
    for (const product of productsHaveModified) {
      if (product._id === productId) {
        const imgHomePageIndex = product.imgHomePage.findIndex(
          (img: any) => img.colorID === colorId
        );

        if (imgHomePageIndex !== -1) {
          const movedItem = product.imgHomePage.splice(imgHomePageIndex, 1)[0];
          product.imgHomePage.unshift(movedItem);
        }
        break; // Dừng vòng lặp sau khi xử lý sản phẩm
      }
    }

    return productsHaveModified;
  }

  productsHaveModified: any;

  updateProductsHaveModified() {
    this.productsHaveModified = this.products.map((product: any) => {
      return {
        ...product,
        imgHomePage: product.variants.map((variant: any) => {
          const { _id: colorID } = variant.color;
          const { nameColor: nameColor } = variant.color;
          const { images: variantImages, variantColor: sizes } = variant;

          // Create an array of objects for each size with quantity
          const sizeQuantityArray = sizes.map((sizeInfo: any) => {
            const { size, quantity } = sizeInfo;
            return { size, quantity };
          });
          // Return the object for a variant with variantColor
          return {
            colorID,
            nameColor,
            images: variantImages.slice(0, 2),
            variantColor: sizeQuantityArray,
          };
        }),
      };
    });
    console.log(this.productsHaveModified);
  }
  productPopUp: any = false;
  // Đóng mở popup thêm thành công sản phẩm vào giỏ hàng
  @ViewChild('popupContainer') popupContainer: ElementRef | undefined;
  addActiveCartPopupClass(
    title: any,
    price: any,
    color: any,
    size: any,
    img: any
  ) {
    // addActiveCartPopupClass() {
    console.log(title, price, color, size, img);
    this.productPopUp = { title, price, color, size, img };

    if (this.popupContainer) {
      const popupContainerElement = this.popupContainer.nativeElement;

      if (popupContainerElement) {
        this.renderer.addClass(popupContainerElement, 'active-cartpopup');

        // After 2 seconds, remove the 'active-cartpopup' class
        setTimeout(() => {
          this.renderer.removeClass(popupContainerElement, 'active-cartpopup');
        }, 2000);
      }
    }
  }

  // thêm xo color-active
  selectedColorIndex: number[] = []; // Sử dụng một mảng để lưu trữ index cho từng sản phẩm

  initializeSelectedColorIndex(): void {
    this.selectedColorIndex = new Array(this.productsHaveModified.length).fill(
      0
    );
  }

  updateSelectedColorIndex(productIndex: number, colorI: number): void {
    this.selectedColorIndex[productIndex] = colorI;
  }
}
