export interface UserDto {
  id: string;
  user_name: string;
  is_active: boolean;
}

export interface ListRequest {
  pageNumber: number;
  search: string;
  itemsPerPage: 5 | 10 | 20;
}

export interface UserListResponseDto {
  total_count: number;
  items: UserDto[];
}