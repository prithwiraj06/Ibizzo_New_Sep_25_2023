// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';
// Object path
import * as objectPath from 'object-path';
// Services
import { MenuConfigService } from './menu-config.service';
import { MinisiteService } from '../../../../../provider/minisite/minisite.service';

@Injectable()
export class MenuHorizontalService {
	// Public properties
	menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	isCheckMinisite: boolean = true;

	/**
	 * Service constructor
	 *
	 * @param menuConfigService: MenuConfigService
	 */
	constructor(private menuConfigService: MenuConfigService,
		private service: MinisiteService) {
		this.loadMenu();
		service.onEvent("HEADER").subscribe(() => {
			console.log("MENU");
			this.isCheckMinisite = false;
			this.loadMenu();
		})
	}

	/**
	 * Load menu list
	 */
	loadMenu() {
		// get menu list
		if (this.isCheckMinisite) {
			const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'header.items');
			this.menuList$.next(menuItems);
		} else {
			const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'minisiteHeader.items');
			this.menuList$.next(menuItems);
		}
	}

	checkUrl() {
		let arr = window.location.href.split("/");
		let list = arr[arr.length - 1].split('-');
		list[list.length - 1].includes('p')
		return list[list.length - 1].includes('p');
	}
}


