import { Component, ViewEncapsulation, ElementRef, Renderer2, ViewChild, OnInit,ChangeDetectorRef } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../services/home.service';
import { IProduct } from '../interfaces/product';
import { AuthService } from '../services/auth.service';
import { CartComponent } from '../cart/cart.component';
import { CartService } from '../services/cart.service';
import { formatMoneyVietNam } from '../utils/utils';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailService } from '../services/product-detail.service';

declare var $: any;

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class ProductDetailComponent implements OnInit {
  @ViewChild('thumbnailsSlick') thumbnailsSlick!: SlickCarouselComponent;
  @ViewChild('productGallery') productGallery!: SlickCarouselComponent;

  formatMoneyVietNam = formatMoneyVietNam;
  productStates: boolean[] = [];
  i: number = 0;

  errMessage: any;
  currentColor = 0;
  userIdFromHeader: any;
  slug: any;
  product: IProduct | undefined;
  productIndex: any;


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

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private _authServer: AuthService,
    private _cartService: CartService,
    private _cartComponent: CartComponent,
    private route: ActivatedRoute,
    private _productDetailService: ProductDetailService
  ) {
    this._authServer.idUserSubject.subscribe((data) => {
      this.userIdFromHeader = data;
      console.log(data, '1111');
    });
  }

  slideConfig = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    cssEase: 'linear',
    asNavFor: '.product-single__gallery',
  };

  galleryConfig = {
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false, 
    asNavFor: '.thumbnails',
  };

  ngOnInit(): void {
    // this.initSlick();
    this.initOwlCarousel();
    this.slug = this.route.snapshot.params['slug'];
    this.getProductDetails(this.slug)    
  }
   getProductDetails(slug:any){
    this._productDetailService.getProductDetail(slug).subscribe((data)=>{
      this.products = [data]
      console.log(data)
       this.updateProductsHaveModified()
      console.log(this.productsHaveModified)
    })

  }

  bannersArray: any = [
    { imgName: '../assets/img/banner/banner-3.jpeg' }
  ];

  imagesArray: any = [
    { imgName: '../assets/img/product-test/8c1c0d53a3f74f2906372e48947ed6d7.jpg' },
    { imgName: '../assets/img/product-test/1d6bd56cd138f6d93caac04f0cf27398.jpg' },
    { imgName: '../assets/img/product-test/d509bfa3899e4ad2e2ec28a23834b42a.jpg' },
    { imgName: '../assets/img/product-test/3a7d85e1c80c815867df91fe676c5449.jpg' },
  ];

  selectedColorId: number | null = null;
  isHovered: boolean | undefined;
  products: any;
  productsHaveModified: any;

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
            images: variantImages,
            variantColor: sizeQuantityArray,
          };
        }),
      };
    });
    console.log(this.productsHaveModified);
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

  // thêm xo color-active
  selectedColorIndex: number[] = []; // Sử dụng một mảng để lưu trữ index cho từng sản phẩm

  initializeSelectedColorIndex(): void {
    this.selectedColorIndex = new Array(this.productsHaveModified.length).fill(0);
  }

  updateSelectedColorIndex(productIndex: number, colorI: number): void {
    this.selectedColorIndex[productIndex] = colorI;
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

  // Đóng mở popup thêm thành công sản phẩm vào giỏ hàng
  @ViewChild('popupContainer') popupContainer: ElementRef | undefined;
  addActiveCartPopupClass() {
    if (this.popupContainer) {
      const popupContainerElement = this.popupContainer.nativeElement;
      if (popupContainerElement) {
        this.renderer.addClass(popupContainerElement, 'active-cartpopup');

        // Sau 2 giây, xoá class "active-cartpopup"
        setTimeout(() => {
          this.renderer.removeClass(popupContainerElement, 'active-cartpopup');
        }, 2000);
      }
    }
  }

  itemsCart: any = [];

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
      // this._authServer.cartSubject.next(total_quantity);
    this._authServer.updateCart(total_quantity);
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

  initSlick() {
    const thumbnailsSlick = this.thumbnailsSlick;
    const productGallery = this.productGallery;

    // thumbnailsSlick.slickGoTo(0);

    const thumbnailsSlickElement = thumbnailsSlick.$instance.nativeElement;
    const productGalleryElement = productGallery.$instance.nativeElement;

    $(thumbnailsSlickElement).slick({
      infinite: true,
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      asNavFor: '.product-single__gallery',
      prevArrow: '<button class="slick-prev" aria-label="Previous"><img src="../assets/icon/SVG/arrow-down.svg" alt="Previous"></button>',
      nextArrow: '<button class="slick-next" aria-label="Next"><img src="../assets/icon/SVG/arrow-down.svg" alt="Next"></button>',
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });

    $(productGalleryElement).slick({
      infinite: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      asNavFor: '.thumbnails',
      responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
    });

    $(thumbnailsSlickElement).on('afterChange', () => {
      const imageWidth = thumbnailsSlickElement
        .querySelector('.slick-slide')
        .firstElementChild.querySelector('.image').offsetWidth;

      productGalleryElement
        .querySelector('.slick-slide')
        .querySelector('.image').style.width = imageWidth + 'px';
    });

    this.el.nativeElement.querySelectorAll('.thumb').forEach((thumb: HTMLElement) => {
      thumb.addEventListener('click', () => {
        const index = Array.from(thumb.parentElement!.children).indexOf(thumb);
        $(thumbnailsSlickElement).slick('slickGoTo', index);
      });
    });
  }

  quantity: number = 1; // Số lượng mặc định

  increaseQuantity(event: Event) {
    event.preventDefault(); // Ngăn chặn sự kiện mặc định của thẻ <a>
    if (this.quantity < 99) { // Giới hạn số lượng tối đa là 99
      this.quantity++;
    }
  }

  
  decreaseQuantity(event: Event) {
    event.preventDefault(); // Ngăn chặn sự kiện mặc định của thẻ <a>
    if (this.quantity > 1) { // Giới hạn số lượng tối thiểu là 1
      this.quantity--;
    }
  }
  featureUnderDevelopment() {
    alert('Chức năng đang được phát triển');
  }
}
