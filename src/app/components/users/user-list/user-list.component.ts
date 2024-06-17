import { Component, OnInit, inject, signal } from '@angular/core';
import { UsersApi } from '../../../data/users.api';
import { CommonModule } from '@angular/common';
import { UserDto, ListRequest, UserListResponseDto } from '../../../data/users.interface';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  profileService = inject(UsersApi);
  userList!: UserDto[];
  totalUsers!: number;
  isLoading: boolean = true;
  filteredUsers!: UserDto[];
  search = '';
  itemsPerPage: 5 | 10 | 20 = 5;
  currentPage: number = 1;
  isCardVisible = signal<boolean>(false);

  ngOnInit() {
    const request: ListRequest = {
      search: '',
      pageNumber: 1,
      itemsPerPage: 5,
    };

    this.profileService.userList$.subscribe(users => {
      this.userList = users;
    });

    this.profileService.getList(request).subscribe((response: UserListResponseDto) => {
      this.userList = response.items;
      this.isLoading = false;
      this.totalUsers = response.total_count;
      this.filteredUsers = this.userList;
    });
  }

  filterUsers(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.filteredUsers = this.userList.filter(user =>
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    this.totalUsers = this.filteredUsers.length;
    this.isLoading = false;
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  changeItemsPerPage(value: 5 | 10 | 20): void {
    this.itemsPerPage = value;
    this.currentPage = 1;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < Math.ceil(this.userList.length / this.itemsPerPage)) {
      this.currentPage++;
    }
  }

  deleteUser(id: string): void {
    this.profileService.remove(id).subscribe((val) => {
      this.userList = this.filteredUsers.filter(user => user.id !== id)
      this.filteredUsers = this.userList;
      this.totalUsers = this.filteredUsers.length;
    });
  }

}
