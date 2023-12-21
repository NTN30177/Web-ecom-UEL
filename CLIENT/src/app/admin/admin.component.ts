import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

interface MenuItem {
  name: string;
  icon: string;
  link?: string;
  children?: MenuItem[];
  isOpen?: boolean; // Thêm trường để theo dõi trạng thái mở của submenu
  isSelected?: boolean; // Thêm trường để theo dõi trạng thái chọn
}

interface FlatMenuItem {
  expandable: boolean;
  name: string;
  icon: string;
  link?: string;
  level: number;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit, AfterViewInit {
  title = 'material-responsive-sidenav';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  isCollapsed = false;

  menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: 'fas fa-tachometer-alt', link: '' },
    {
      name: 'Sản phẩm',
      icon: 'fas fa-shopping-basket',
      children: [
        {
          name: 'Quản lý sản phẩm',
          icon: 'fas fa-list-alt',
          link: 'manage-product',
        },
        { name: 'Thêm sản phẩm', icon: 'fas fa-plus-square', link: 'add-product' },
      ],
    },
    {
      name: 'Người dùng',
      icon: 'fas fa-user',
      children: [
        { name: 'Quản lý người dùng', icon: 'fas fa-list-alt', link: '#' },
        { name: 'Thêm người dùng', icon: 'fas fa-plus-square', link: '#' },
      ],
    },
    {
      name: 'Đơn hàng',
      icon: 'fas fa-shopping-cart',
      children: [
        { name: 'Quản lý đơn hàng', icon: 'fas fa-list-alt', link: 'manage-order' },
        { name: 'Thêm đơn hàng', icon: 'fas fa-plus-square', link: '#' },
      ],
    },
    {
      name: 'Màu sắc',
      icon: 'fas fa-palette',
      children: [
        { name: 'Quản lý màu sắc', icon: 'fas fa-list-alt', link: 'view-color' },
        { name: 'Thêm màu sắc', icon: 'fas fa-plus-square', link: 'add-color' },
      ],
    },
    {
      name: 'Chiến dịch',
      icon: 'fas fa-flag',
      children: [
        {
          name: 'Quản lý chiến dịch',
          icon: 'fas fa-list-alt',
          link: 'manage-campaign',
        },
        {
          name: 'Thêm chiến dịch',
          icon: 'fas fa-plus-square',
          link: 'create-campaign',
        },
      ],
    },
    {
      name: 'Tin tức',
      icon: 'fas fa-newspaper',
      children: [
        { name: 'Quản lý tin tức', icon: 'fas fa-list-alt', link: '#' },
        { name: 'Thêm tin tức', icon: 'fas fa-plus-square', link: '#' },
      ],
    },
    {
      name: 'Thông báo',
      icon: 'fas fa-bell',
      children: [
        { name: 'Quản lý thông báo', icon: 'fas fa-list-alt', link: '#' },
        { name: 'Thêm thông báo', icon: 'fas fa-plus-square', link: '#' },
      ],
    },
  ];

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // console.log('AdminComponent initialized');
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      this.isMobile = screenSize.matches;
      if (!this.isMobile) {
        this.sidenav.open();
      }
    });

    this.cdr.detectChanges();
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.isCollapsed = false;
    }
  }

  toggleSubMenu(menuItem: MenuItem) {
    this.menuItems.forEach((item) => {
      if (item !== menuItem) {
        item.isOpen = false;
      }
    });
    menuItem.isOpen = !menuItem.isOpen;
  }

  selectMenuItem(menuItem: MenuItem) {
    this.menuItems.forEach((item) => {
      item.isSelected = false;
    });
    menuItem.isSelected = true;
  }
}
