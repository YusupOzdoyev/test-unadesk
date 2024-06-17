import { CommonModule } from '@angular/common';
import { UsersApi } from '../../data/users.api';
import { Component, OnInit, inject, signal } from '@angular/core';
import { UserDto, ListRequest, UserListResponseDto } from '../../data/users.interface';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})

export class UserListComponent implements OnInit {
  isCardVisible = signal<boolean>(false);
  profileService = inject(UsersApi);
  search = '';
  itemsPerPage = 5;
  totalUsers!: number;
  userList!: UserDto[];
  currentPage: number = 1;
  isLoading: boolean = true;
  filteredUsers!: UserDto[];
  itemsPerPageOptions = [5, 10, 20];

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

  protected filterUsers(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.filteredUsers = this.userList.filter(user =>
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    this.totalUsers = this.filteredUsers.length;
    this.isLoading = false;
  }

  protected deleteUser(id: string): void {
    this.profileService.remove(id).subscribe(() => {
      this.userList = this.filteredUsers.filter(user => user.id !== id)
      this.filteredUsers = this.userList;
      this.totalUsers = this.filteredUsers.length;
    });
  }

  protected changeItemsPerPage(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.itemsPerPage = +value as 5 | 10 | 20;
    this.currentPage = 1;
  }

  protected previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  protected nextPage(): void {
    if (this.currentPage < Math.ceil(this.userList.length / this.itemsPerPage)) {
      this.currentPage++;
    }
  }

}
