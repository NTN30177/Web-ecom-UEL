import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
declare var $: any;
import { take } from 'rxjs/operators';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../services/home.service';
import { localImg } from '../ENV/envi';
import { ChangeDetectorRef } from '@angular/core';
import { IProduct } from '../interfaces/product';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { IUser } from '../interfaces/user';
import { CartComponent } from '../cart/cart.component';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent implements AfterViewInit {
  productStates: boolean[] = [];
  i: number = 0;
  showAddToCartPopup: boolean = false; // Thêm biến để kiểm soát hiển thị popup

  products: any;
  productsHaveModified: any;
  errMessage: any;
  currentColor = 0;
  // currentColor: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _homeService: HomeService,
    private changeDetectorRef: ChangeDetectorRef,
    private _authServer: AuthService,
    private _cartService: CartService,
    private _cartComponent: CartComponent
  ) {
    this._authServer.idUserSubject.subscribe((data) => {
      this.userIdFromHeader = data;
      console.log(data, '1111');
    });
  }

  ngAfterViewInit(): void {
    this.initOwlCarousel();
  }

  private initOwlCarousel(): void {
    const owlSelector = '.exclusive-inner__list-products.owl-carousel';
    this.renderer.addClass(
      this.el.nativeElement.querySelector(owlSelector),
      'owl-carousel'
    );

    $(owlSelector).owlCarousel({
      dots: false,
      nav: true,
      autoplay: false,
      loop: false,
      autoWidth: false,
      responsiveClass: true,
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
    });
  }

  // Size table homepage
  sizeTableArray: any = [
    { id: 1, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 2, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    // Thêm các size khác nếu cần
  ];
  getSizeTable(productIndex: number): any {
    return (
      this.sizeTableArray.find(
        (item: { id: number }) => item.id === productIndex + 1
      ) || { sizes: [] }
    );
  }

  toggleSizeTable(productIndex: number): void {
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
      0: { items: 1 },
      400: { items: 2 },
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
    dots: true,
    navSpeed: 700,
    navText: [
      '<i class="ti-arrow-left"></i>',
      '<i class="ti-arrow-right"></i>',
    ],
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 1 },
      940: { items: 5 },
    },
    nav: true,
  };

  isHovered: boolean | undefined;

  ngOnInit(): void {
    // Mặc định chọn màu đầu tiên
    this.setupUserIdSubscription()
      .then(() => {
        console.log(this.userIdFromHeader, '123');
        return this.apiProductHomePage();
      })
      .then(() => {
        // Khởi tạo mảng productStates với giá trị false cho mỗi sản phẩm
        this.productStates = Array(this.bannersArray.length).fill(false);
      });
  }
  

private async setupUserIdSubscription(): Promise<void> {
  return new Promise<void>((resolve) => {
    const subscription = this._authServer.idUserSubject.pipe(take(1)).subscribe((data) => {
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
    console.log(data, '55555');
    try {
      const responseData = await this._cartService.putProductItemCart(data);
      console.log(responseData, 'dataput');
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
          console.log(variantColor.quantity,'qt')
        });
      });
    });
  
    return this.total_quantity;
  }
  

  itemsCart: any = [];
  userIdFromHeader: any;

  async addToCart(
    colorID: any,
    product: IProduct,
    sizeLIST: any,
    quantityACTION: number
  ) {
    if (this.userIdFromHeader) {
      const data = {
        colorId: colorID,
        productId: product._id,
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
      const cartList = await this._cartComponent.apiCartProduct(this.userIdFromHeader);
      let total_quantity = await this.totalCartItem(cartList);
      this._authServer.cartSubject.next(total_quantity);
    }

    let cartDataNull = localStorage.getItem('localCart');
    if (cartDataNull == null) {
      let storeDataGet: any = [];
      storeDataGet.push(product);
      localStorage.setItem('localCart', JSON.stringify(storeDataGet));
    } else {
      var id = product._id;
      let index: number = -1;
      const localCartString = localStorage.getItem('localCart');
      if (localCartString !== null) {
        this.itemsCart = JSON.parse(localCartString);
      }
      for (let i = 0; i < this.itemsCart.length; i++) {
        if (id == this.itemsCart[i]._id) {
          this.itemsCart[i].quantity = 1;
          index = i;
          break;
        }
      }
      if (index == -1) {
        this.itemsCart.push(product);
        localStorage.setItem('localCart', JSON.stringify(this.itemsCart));
      } else {
        localStorage.setItem('localCart', JSON.stringify(this.itemsCart));
      }
      this.cartNumberFunc();
    }
    // Hiển thị popup
    this.showAddToCartPopup = true;

    // Tự động ẩn popup sau 2 giây
    setTimeout(() => {
      this.showAddToCartPopup = false;
    }, 2000);
  }

  cartNumber: number = 0;
  cartNumberFunc() {
    const localCartString = localStorage.getItem('localCart');
    if (localCartString !== null) {
      var cartValue = JSON.parse(localCartString);
      this.cartNumber = cartValue.length;
      //  this._authServer.cartSubject.next(this.cartNumber)
    }
  }

  closePopup() {
    this.showAddToCartPopup = false;
  }
  apiProductHomePage() {
    console.log('1235');
    this._homeService.getProductHomePage().subscribe({
      next: (data: any) => {
        this.products = data.products;

        this.createArrSupportChangeImgFollowChangeColor();
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

  createArrSupportChangeImgFollowChangeColor() {
    this.productsHaveModified = this.products.map((product: any) => {
      return {
        ...product,
        imgHomePage: product.variants.map((variant: any) => {
          return {
            colorID: variant.color._id,
            images: variant.images.slice(0, 2),
          };
        }),
      };
    });
  }
}
