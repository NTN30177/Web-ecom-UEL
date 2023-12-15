import { Component, OnInit, Renderer2, ElementRef, HostListener } from '@angular/core';
import { SearchService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', './styles.css']
})
export class HeaderComponent {
  isSearchFormActive: boolean = false;
  isMainMenuOpen: boolean = false;
  submenuOpen: boolean = false; 

  constructor(private elRef: ElementRef) {}

  toggleSearchForm(): void {
    this.isSearchFormActive = !this.isSearchFormActive;
  }

  handleQuickSearchClick(event: Event): void {
    event.stopPropagation();
  }

  toggleMainMenu(): void {
    this.isMainMenuOpen = !this.isMainMenuOpen;
  }

  toggleSubmenu(): void {
    this.submenuOpen = !this.submenuOpen;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isSearchFormActive = false;
      this.isMainMenuOpen = false;
      this.submenuOpen = false; 
    }
  }
}
