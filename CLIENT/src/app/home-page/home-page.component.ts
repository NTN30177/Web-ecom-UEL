import { Component, AfterViewInit, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
declare var $: any;
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomePageComponent implements AfterViewInit {
  productStates: boolean[] = [];
  i: number = 0;
  showAddToCartPopup: boolean = false;  // Thêm biến để kiểm soát hiển thị popup

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.initOwlCarousel();
  }

  private initOwlCarousel(): void {
    const owlSelector = '.exclusive-inner__list-products.owl-carousel';
    this.renderer.addClass(this.el.nativeElement.querySelector(owlSelector), 'owl-carousel');

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
          nav: false
        },
        740: {
          items: 3,
          margin: 30,
        },
        1025: {
          items: 5,
          margin: 30,
        }
      }
    });
  }

  // Size table homepage
  sizeTableArray: any = [
    { id: 1, sizes: ['S', 'M', 'L', 'XL'] },
    { id: 2, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
    // Thêm các size khác nếu cần
  ];

  getSizeTable(productIndex: number): any {
    return this.sizeTableArray.find((item: { id: number; }) => item.id === productIndex + 1) || { sizes: [] };
  }

  toggleSizeTable(productIndex: number): void {
    const sizeTableId = `sizeTable${productIndex}`;
    const sizeTable = this.el.nativeElement.querySelector(`#${sizeTableId}`);

    if (sizeTable && this.productStates && this.productStates[productIndex] !== undefined) {
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
    { id: 33897, imgSrc: 'https://pubcdn.ivymoda.com/ivy2/images/color/010.png', alt: '010' },
    { id: 33898, imgSrc: 'https://pubcdn.ivymoda.com/ivy2/images/color/013.png', alt: 'k50' }
    // Thêm các màu khác nếu cần
  ];

  imagesArray: any = [
    { id: 33897, linkMoi1: 'https://static.dchic.vn/uploads/media/2023/12/DTT_0674-640887878-576x768.JPG', linkMoi2: 'https://static.dchic.vn/uploads/media/2023/12/DTT_1879-86230021-576x768.JPG' },
    { id: 33898, linkMoi1: 'https://static.dchic.vn/uploads/media/2023/12/DTT_0103-878967200-576x768.JPG', linkMoi2: 'https://static.dchic.vn/uploads/media/2023/12/DTT_8824-393382702-576x768.JPG' },
    { id: 33899, linkMoi1: 'https://static.dchic.vn/uploads/media/2023/12/DTT_8073-101731660.JPG', linkMoi2: 'https://static.dchic.vn/uploads/media/2023/12/DTT_0504-80096045-576x768.JPG' },
    { id: 33900, linkMoi1: 'https://static.dchic.vn/uploads/media/2023/12/DTT_0884-93723949-576x768.JPG', linkMoi2: 'https://static.dchic.vn/uploads/media/2023/12/DTT_9394-175234358-576x768.JPG' },
    
    // Thêm các màu khác nếu cần
  ];

  bannersArray: any = [
    { imgName: "../assets/img/banner/banner-1.jpeg" },
    { imgName: "../assets/img/banner/banner-2.jpeg" },
    { imgName: "../assets/img/banner/banner-3.jpeg" },
    { imgName: "../assets/img/banner/banner-3.jpeg" },
    { imgName: "../assets/img/banner/banner-3.jpeg" },
    { imgName: "../assets/img/banner/banner-3.jpeg" },
  ];

  // Setting Carousel slider
  bannerOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="ti-arrow-left"></i>', '<i class="ti-arrow-right"></i>'],
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 1 },
      940: { items: 1 }
    },
    nav: true
  };

  // Setting new-prod homepage
  newprodOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['<i class="ti-arrow-left"></i>', '<i class="ti-arrow-right"></i>'],
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 1 },
      940: { items: 5 }
    },
    nav: true
  };

  isHovered: boolean | undefined;

  ngOnInit(): void {
    // Mặc định chọn màu đầu tiên
    this.selectedColorId = this.colorsArray[0].id;
    // Khởi tạo mảng productStates với giá trị false cho mỗi sản phẩm
    this.productStates = Array(this.bannersArray.length).fill(false);
  }

  changeColor(colorId: number): void {
    this.selectedColorId = colorId;
  }

  getLink(linkType: 'linkMoi1' | 'linkMoi2'): string {
    const selectedColor = this.imagesArray.find((color: { id: number | null; }) => color.id === this.selectedColorId);
    return selectedColor ? selectedColor[linkType] : '';
  }

  setHoveredState(isHovered: boolean): void {
    this.isHovered = isHovered;
  }

  addToCart() {
    // Thực hiện các thao tác khi thêm vào giỏ hàng

    // Hiển thị popup
    this.showAddToCartPopup = true;

    // Tự động ẩn popup sau 2 giây
    setTimeout(() => {
      this.showAddToCartPopup = false;
    }, 2000);
  }

  closePopup() {
    this.showAddToCartPopup = false;
  }
}
