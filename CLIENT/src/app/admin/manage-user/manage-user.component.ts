import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { IUser } from '../../interfaces/user';
import { ManageUserService } from '../../services/manage-user.service';
import { formatMoneyVietNam } from '../../utils/utils';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ManageUserComponent implements OnInit, AfterViewInit, OnDestroy {
  formatMoneyVietNam = formatMoneyVietNam;
  allUser: IUser[] = [];

  constructor(
    private fb: FormBuilder,
    private manageUserService: ManageUserService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      searching: true,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Vietnamese.json',
      },
    };
    this.getAllUserData();

  }

  ngAfterViewInit(): void {
    // Khởi tạo DataTables trong hàm này để đảm bảo rằng DOM đã được tạo xong
    $('#example').DataTable({
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Vietnamese.json',
      },
    });
  }

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  ngOnDestroy(): void {
    if (this.dtElement && this.dtElement.dtInstance) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
  }

  getAllUserData() {
    this.manageUserService.getAllUserData().subscribe(
      (data) => {
        this.allUser = data;
        console.log("all user:", this.allUser)
        this.dtTrigger.next(null);

      },

      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }
  getAdminUsers(): IUser[] {
    return this.allUser.filter((user) => user.is_admin === 1);
  }
  getCustomer() {
    return this.allUser.filter((user) => user.is_admin === 0);
  }

  onAdminChange(user: IUser) {
    // console.log(`User ${user.first_name} ${user.last_name} changed to ${user.is_admin === 1 ? 'Admin' : 'Customer'}`);

    // // Create a new user object with only the updated is_admin property
    // const updatedUser: IUser = { _id: user._id, is_admin: user.is_admin };

    // this.userService.updateUser(updatedUser).subscribe(
    //   () => {
    //     console.log('User is_admin updated successfully');
    //   },
    //   (error) => {
    //     console.error('Error updating user is_admin:', error);
    //   }
    // );
  }
}
