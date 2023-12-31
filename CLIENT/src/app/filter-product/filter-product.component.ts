import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,ChangeDetectorRef
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../services/home.service';
import { IProduct } from '../interfaces/product';
import { AuthService } from '../services/auth.service';
import { CartComponent } from '../cart/cart.component';
import { CartService } from '../services/cart.service';
import { formatMoneyVietNam } from '../utils/utils';
import { take } from 'rxjs';
import { Options, LabelType } from '@angular-slider/ngx-slider';
import { SortPaginationService } from '../services/sort-pagination.service';
import { ActivatedRoute } from '@angular/router';
import { localProductImg, localColorImg } from '../ENV/envi';

@Component({
  selector: 'app-filter-product',
  templateUrl: './filter-product.component.html',
  styleUrl: './filter-product.component.css',
})
export class FilterProductComponent implements AfterViewInit {
  formatMoneyVietNam = formatMoneyVietNam;
  localProductImg=localProductImg
  localColorImg=localColorImg
  productStates: boolean[] = [];
  i: number = 0;
  errMessage: any;
  currentColor = 0;
  bannersArray: any;
  listColor: any = false;
  selectedColorsId: any[] | undefined;
  totalProduct: any;
  slug: any;
  selectedValue = 'latest';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _homeService: HomeService,
    private _authServer: AuthService,
    private _cartService: CartService,
    private _cartComponent: CartComponent,
    private _sortPaginationService: SortPaginationService,
    private route: ActivatedRoute,
  ) {
    this._authServer.idUserSubject.subscribe((data) => {
      this.userIdFromHeader = data;
    });
    this.slug = this.route.snapshot.params['slug'];
  }


  async ngOnInit(): Promise<void> {
    this.getColor();
    this.route.params.subscribe(params => {
      this.slug=params['slug']
      this.sortFilter();
      
    });
    await this.setupUserIdSubscription();
    // this.productStates = Array(this.bannersArray.length).fill(false);
  }


  ngAfterViewInit(): void {
    // this.initOwlCarousel();
  }


  // initOwlCarousel() {
  //   throw new Error('Method not implemented.');
  // }

  getColor() {
    this._sortPaginationService.getColor().subscribe((data) => {
      this.listColor = data;
      console.log(data, 'data');
    });
  }

  toggleSizeTable(productIndex: number): void {
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
  imagesArray: any = [];
  filterprodOptions: OwlOptions = {
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
        items: 4,
        margin: 30,
      },
    },
    nav: true,
  };

  isHovered: boolean | undefined;
  products: any;



  private async setupUserIdSubscription(): Promise<void> {
    return new Promise<void>((resolve) => {
      this._authServer.idUserSubject
        .pipe(take(1))
        .subscribe((data) => {
          this.userIdFromHeader = data;
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
      let total_quantity = await this.totalCartItem(cartList);
      this._authServer.cartSubject.next(total_quantity);
    }
  }

  cartNumber: number = 0;
  cartNumberFunc() {
    const localCartString = localStorage.getItem('localCart');
    if (localCartString !== null) {
      var cartValue = JSON.parse(localCartString);
      this.cartNumber = cartValue.length;
    }
  }

  apiProductHomePage() {
    this._homeService.getProductHomePage().subscribe({
      next: (data: any) => {
        this.products = data.products;
        this.updateProductsHaveModified();
        this.initializeSelectedColorIndex();
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }

  changeColor(product: IProduct, colorId: string) {
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

  productsHaveModified: any
  updateProductsHaveModified() {
    this.productsHaveModified = this.products.map((product: any) => {
      return {
        ...product,
        imgHomePage: product.variants.map((variant: any) => {
          const { _id: colorID } = variant.color;
          const { images: variantImages, variantColor: sizes } = variant;

          // Create an array of objects for each size with quantity
          const sizeQuantityArray = sizes.map((sizeInfo: any) => {
            const { size, quantity } = sizeInfo;
            return { size, quantity };
          });
          // Return the object for a variant with variantColor
          return {
            colorID,
            images: variantImages.slice(0, 2),
            variantColor: sizeQuantityArray,
          };
        }),
      };
    });
    console.log(this.productsHaveModified);
  }

  // Đóng mở popup thêm thành công sản phẩm vào giỏ hàng
  @ViewChild('popupContainer') popupContainer: ElementRef | undefined;
  addActiveCartPopupClass() {
    if (this.popupContainer) {
      const popupContainerElement = this.popupContainer.nativeElement;
      if (popupContainerElement) {
        this.renderer.addClass(popupContainerElement, 'active-cartpopup');
        setTimeout(() => {
          this.renderer.removeClass(popupContainerElement, 'active-cartpopup');
        }, 2000);
      }
    }
  }

  // thêm xo color-active
  selectedColorIndex: number[] = [];
  initializeSelectedColorIndex(): void {
    this.selectedColorIndex = new Array(this.productsHaveModified.length).fill(
      0
    );
  }

  updateSelectedColorIndex(productIndex: number, colorI: number): void {
    this.selectedColorIndex[productIndex] = colorI;
  }

  ///sort
  sizes: string[] = ['S', 'M', 'L', 'XL', 'XXL', 'FreeSize'];
  isActive: boolean[] = [false, false, false, false, false]; 

  toggleSizeActive(index: number) {
    this.isActive[index] = !this.isActive[index];
    this.getSelectedValues();
  }

  selectedColors: string[] = [];
  toggleActive(color: string) {
    const index = this.selectedColors.indexOf(color);
    if (index !== -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }
    this.getSelectedValues(); 
  }

  minValue: number = 0;
  maxValue: number = 500;
  options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min price:</b> $' + formatMoneyVietNam(value);
        case LabelType.High:
          return '<b>Max price:</b> $' + formatMoneyVietNam(value);
        default:
          return '$' + value;
      }
    },
  };

  sizesChoose: string[] | undefined;
  getSelectedValues() {
    this.selectedColors = this.listColor.filter((color: string) =>
      this.selectedColors.includes(color)
    );
    this.selectedColorsId = this.selectedColors.map((color: any) => color._id);
    this.sizesChoose = this.sizes.filter((size, i) => this.isActive[i]);
    this.currentPage = 1;
    this.sortFilter();
  }

  selectedSorting: string = 'latest';

  onSortingChange(event: any): void {
    this.selectedSorting = event.value;
    this.currentPage = 1;
    this.sortFilter();
  }

  productsPerPage: any;
  currentPage = 1;
  sortFilter() {
    this.productsPerPage = 8;
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    setTimeout(() => {
      console.log(
        this.selectedColorsId,
        this.sizesChoose,
        this.minValue,
        this.maxValue * 1000000,
        this.selectedSorting,
        this.slug,
        startIndex,
        this.productsPerPage,
        this.currentPage
      );
      this._sortPaginationService
        .sort(
          this.selectedColorsId,
          this.sizesChoose,
          this.minValue,
          this.maxValue * 100000,
          this.selectedSorting,
          this.slug,
          this.productsPerPage,
          this.currentPage
        )
        .subscribe((data) => {
          this.products = data.productsByCategory;
          this.totalProduct = data.totalProducts;
          console.log(this.products);
          this.updateProductsHaveModified();
          this.initializeSelectedColorIndex();
        });
    }, 100);
  }
  viewMore() {
    this.currentPage += 1;
    this.sortFilter();
  }

}
