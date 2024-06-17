import { Component, OnInit, inject, signal } from '@angular/core';
import { ListRequest, UserDto, UserListResponseDto, UsersApi } from '../../../data/users.api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{
  profileService = inject(UsersApi);
    userList!: UserDto[];
    totalUsers!: number;
    isLoading: boolean = true;
    filteredUsers: UserDto[]= [];
    search = '';
    isCardVisible = signal<boolean>(false);
    
  ngOnInit() {

    const request: ListRequest = {
      search: '',
      pageNumber: 0,
      itemsPerPage: 5,
    };
    

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
    
  }
