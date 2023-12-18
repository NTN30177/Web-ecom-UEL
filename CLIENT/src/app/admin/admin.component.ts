import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
} from '@angular/material/tree';

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
export class AdminComponent {
  title = 'material-responsive-sidenav';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile = true;
  isCollapsed = false;

  menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: 'dashboard', link: '' },
    {
      name: 'Sản phẩm',
      icon: 'shopping_basket',
      children: [
        {
          name: 'Quản lý sản phẩm',
          icon: 'bubble_chart',
          link: 'manage-product',
        },
        { name: 'Thêm sản phẩm', icon: 'library_add', link: 'add-product' },
      ],
    },
    {
      name: 'Người dùng',
      icon: 'person',
      children: [
        { name: 'Quản lý người dùng', icon: 'bubble_chart', link: '#' },
        { name: 'Thêm người dùng', icon: 'library_add', link: '#' },
      ],
    },
    {
      name: 'Đơn hàng',
      icon: 'shopping_cart',
      children: [
        { name: 'Quản lý đơn hàng', icon: 'bubble_chart', link: '#' },
        { name: 'Thêm đơn hàng', icon: 'library_add', link: '#' },
      ],
    },
    {
      name: 'Màu sắc',
      icon: 'palette',
      children: [
        { name: 'Quản lý màu sắc', icon: 'bubble_chart', link: 'view-color' },
        { name: 'Thêm màu sắc', icon: 'library_add', link: 'add-color' },
      ],
    },
    {
      name: 'Chiến dịch',
      icon: 'flag',
      children: [
        {
          name: 'Quản lý chiến dịch',
          icon: 'bubble_chart',
          link: 'manage-campaign',
        },
        {
          name: 'Thêm chiến dịch',
          icon: 'library_add',
          link: 'create-campaign',
        },
      ],
    },
    {
      name: 'Tin tức',
      icon: 'article',
      children: [
        { name: 'Quản lý tin tức', icon: 'bubble_chart', link: '#' },
        { name: 'Thêm tin tức', icon: 'library_add', link: '#' },
      ],
    },
    {
      name: 'Thông báo',
      icon: 'notifications',
      children: [
        { name: 'Quản lý thông báo', icon: 'bubble_chart', link: '#' },
        { name: 'Thêm thông báo', icon: 'library_add', link: '#' },
      ],
    },
  ];

  constructor(private observer: BreakpointObserver, private router: Router,
    private cdr: ChangeDetectorRef) {}

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
