import {
  Component,
  AfterViewInit,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
declare var $: any;
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HomeService } from '../services/home.service';
import { localImg } from '../ENV/envi';
import { ChangeDetectorRef } from '@angular/core';
import { IProduct } from '../interfaces/product';
import { AuthService } from '../services/auth.service';
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
    private _auth:AuthService
  ) {}

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

  colorsArray: any = [
    {
      id: 33897,
      imgSrc: 'https://pubcdn.ivymoda.com/ivy2/images/color/010.png',
      alt: '010',
    },
    {
      id: 33898,
      imgSrc: 'https://pubcdn.ivymoda.com/ivy2/images/color/013.png',
      alt: 'k50',
    },
    // Thêm các màu khác nếu cần
  ];

  imagesArray: any = [
    // {
    //   id: 33897,
    //   linkMoi1:
    //     'https://static.dchic.vn/uploads/media/2023/12/DTT_0674-640887878-576x768.JPG',
    //   linkMoi2:
    //     'https://static.dchic.vn/uploads/media/2023/12/DTT_1879-86230021-576x768.JPG',
    // },
    // {
    //   id: 33898,
    //   linkMoi1:
    //     'https://static.dchic.vn/uploads/media/2023/12/DTT_0103-878967200-576x768.JPG',
    //   linkMoi2:
    //     'https://static.dchic.vn/uploads/media/2023/12/DTT_8824-393382702-576x768.JPG',
    // },
    // {
    //   id: 33899,
    //   linkMoi1:
    //     'https://static.dchic.vn/uploads/media/2023/12/DTT_8073-101731660.JPG',
    //   linkMoi2:
    //     'https://static.dchic.vn/uploads/media/2023/12/DTT_0504-80096045-576x768.JPG',
    // },
    // {
    //   id: 33900,
    //   linkMoi1:
    //     'https://static.dchic.vn/uploads/media/2023/12/DTT_0884-93723949-576x768.JPG',
    //   linkMoi2:
    //     'https://static.dchic.vn/uploads/media/2023/12/DTT_9394-175234358-576x768.JPG',
    // },
    // Thêm các màu khác nếu cần
  ];

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
    this.apiProductHomePage();
    this.selectedColorId = this.colorsArray[0].id;
    // Khởi tạo mảng productStates với giá trị false cho mỗi sản phẩm
    this.productStates = Array(this.bannersArray.length).fill(false);
  }

  getLink(linkType: 'linkMoi1' | 'linkMoi2'): string {
    console.log(this.selectedColorId, '23');
    const selectedColor = this.imagesArray.find(
      (color: { id: number | null }) => color.id === this.selectedColorId
    );
    return selectedColor ? selectedColor[linkType] : '';
  }

  setHoveredState(isHovered: boolean): void {
    this.isHovered = isHovered;
  }

  itemsCart: any = [];
  addToCart(product: IProduct) {
    // Thực hiện các thao tác khi thêm vào giỏ hàng
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
          this.itemsCart[i].quantity = 1
          index =i;
          break;
        }
      }
      if(index ==-1){
        this.itemsCart.push(product);
        localStorage.setItem('localCart',JSON.stringify(this.itemsCart));
      } else{
        localStorage.setItem('localCart',JSON.stringify(this.itemsCart));

      }
      this.cartNumberFunc()
    }
    // Hiển thị popup
    this.showAddToCartPopup = true;

    // Tự động ẩn popup sau 2 giây
    setTimeout(() => {
      this.showAddToCartPopup = false;
    }, 2000);
  }
  cartNumber:number =0;
  cartNumberFunc(){
    const localCartString = localStorage.getItem('localCart');
      if (localCartString !== null) {
        var cartValue = JSON.parse(localCartString);
       this.cartNumber= cartValue.length 
       this._auth.cartSubject.next(this.cartNumber)
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
        this.convertToimagesArray();
        this.createArrSupportChangeImgFollowChangeColor()
        console.log(this.products, '123');
        console.log(this.imagesArray, '124443');
      },
      error: (err: any) => {
        this.errMessage = err;
      },
    });
  }
  convertToimagesArray() {
    this.products.forEach((productItem: any) => {
      productItem.variants.forEach((v: any) => {
        let a = {
          id: v._id,
          linkMoi1: `${localImg}/${v.images[0]}`, // Assuming you want the first image of the first variant
          linkMoi2: `${localImg}/${v.images[1]}`, // Assuming you want the second image of the first variant
        };
        this.imagesArray.push(a); // Use push instead of append
      });
    });
  }

  // Lấy ra dữ liệu mong muốn từ mỗi product item
  // changeColor(colorVariant: { idColor: string; slugproduct: string }) {
  //   const { idColor, slugproduct } = colorVariant;
  //   const thumbProduct = document.getElementById('thumbProduct'); // Assuming this element exists
  //   this.fetchImageToColor(idColor, slugproduct, thumbProduct);
  // }

  // fetchImageToColor(colorId: string, productSlug: string, thumbProduct: HTMLElement) {
  //   const apiUrl = `/product/api/ajaxImageToColor?productId=${colorId}&color=${productSlug}`;
  //   this.http.get<string[]>(apiUrl).subscribe(data => {
  //     thumbProduct.innerHTML = '';
  //     thumbProduct.innerHTML += `
  //       <a href="/product/product-detail/${productSlug}?color=${colorId}">
  //         <img id="ao" src="userImages/${data[0]}" alt="" imageCart="${data[0]}" class="imgage static">
  //         <img id="ao2" src="userImages/${data[1]}" alt="" class="imgage hover_img">
  //       </a>
  //     `;
  //   }, error => {
  //     console.error('Error fetching color data:', error);
  //   });
  // }


  changeColor(product: IProduct, colorId: string) {
    console.log( product._id,colorId)
    console.log(this.productsHaveModified)
    this.moveImgHomePageToFront(this.productsHaveModified, product._id,colorId )
    
  }

  moveImgHomePageToFront(productsHaveModified: any[], productId: string, variantId: string): any[] {
    for (const product of productsHaveModified) {
      if (product._id === productId) {
        const imgHomePageIndex = product.imgHomePage.findIndex((img:any) => img.variantID === variantId);
  
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
              variantID: variant._id,
              images: variant.images.slice(0, 2)
            };
          }),
        };
      });
    }
    
  
}
