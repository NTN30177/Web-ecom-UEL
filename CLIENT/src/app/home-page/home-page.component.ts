import { Component, AfterViewInit, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
declare var $: any;
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomePageComponent implements AfterViewInit{
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngAfterViewInit(): void {
    this.initOwlCarousel();
  }
  private initOwlCarousel(): void {
    const owlSelector = '.exclusive-inner__list-products.owl-carousel';

    // Sử dụng Renderer2 để thêm class vào ElementRef
    this.renderer.addClass(this.el.nativeElement.querySelector(owlSelector), 'owl-carousel');

    // Thực hiện khởi tạo Owl Carousel
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






  selectedColorId: number | null = null;

  colorsArray: any = [
    { id: 33897, imgSrc: 'https://pubcdn.ivymoda.com/ivy2/images/color/010.png', alt: '010' },
    { id: 33898, imgSrc: 'https://pubcdn.ivymoda.com/ivy2/images/color/013.png', alt: 'k50' }
    // Thêm các màu khác nếu cần
  ];

  imagesArray: any = [
    { id: 33897, linkMoi1: 'https://pubcdn.ivymoda.com/files/product/thumab/400/2023/12/18/2e82705d564178f429ea592ea8073cb9.jpg', linkMoi2: 'https://pubcdn.ivymoda.com/files/product/thumab/400/2023/10/09/e8d12f10fc80c4b0a08dd8f5ba95ba53.JPG' },
    { id: 33898, linkMoi1: 'https://pubcdn.ivymoda.com/files/product/thumab/400/2023/09/16/37b7de980197e7def0aa42c7ba7642ce.JPG', linkMoi2: 'https://pubcdn.ivymoda.com/files/product/thumab/400/2023/09/16/773efd6ec6bcedad685513c1977f4613.JPG' }
    // Thêm các màu khác nếu cần
  ];

  bannersArray: any = [
    { imgName: "../assets/img/banner/banner-1.jpeg" },
    { imgName: "../assets/img/banner/banner-2.jpeg" },
    { imgName: "../assets/img/banner/banner-3.jpeg" }
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
}
