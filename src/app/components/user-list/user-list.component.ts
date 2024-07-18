import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  workouts: { type: string; minutes: number }[];
  workoutTypes: string[];
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: any[] = []; // Initialize with your user data from localStorage or elsewhere
  paginatedUsers: User[] = [];
  currentPage = 1;
  usersPerPage = 5;
  totalPages = 0;
  showPagination = false;
  showPrevNext = true;
  showDeleteDialog = false;
  selectedUser: User | null = null;
  searchUsername = '';
  workoutTypes: string[] = [];
  selectedWorkoutType: string = ''; // Define selectedWorkoutType property
  showNoResultsMessage: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.users$.subscribe(users => {
      this.users = users;
      // Optionally, update pagination or other logic here
    });
    this.loadWorkoutTypes(); // Make sure to load workout types if needed
    this.updatePagination(); // Initialize pagination
  }

  loadWorkoutTypes(): void {
    // Collect unique workout types
    let uniqueWorkoutTypes = new Set<string>();
    this.users.forEach(user => {
      user.workouts.forEach((workout: { type: string; }) => {
        uniqueWorkoutTypes.add(workout.type);
      });
    });

    // Convert Set to array for select field options
    this.workoutTypes = Array.from(uniqueWorkoutTypes);
  }

  updatePagination(): void {
    // Logic to update pagination based on current page and usersPerPage
    const startIndex = (this.currentPage - 1) * this.usersPerPage;
    this.paginatedUsers = this.users.slice(startIndex, startIndex + this.usersPerPage);

    // Calculate total pages
    this.totalPages = Math.ceil(this.users.length / this.usersPerPage);

    // Show pagination controls if there are more than 5 users
    this.showPagination = this.users.length > 5;

    // Hide previous and next buttons if there's only one page
    this.showPrevNext = this.totalPages > 1;
  }

  goToPage(page: number): void {
    // Change current page and update paginated users
    this.currentPage = page;
    this.updatePagination();
  }

  onUsersPerPageChange(event: Event): void {
    // Handle change in users per page selection
    const target = event.target as HTMLSelectElement;
    this.usersPerPage = +target.value;
    this.updatePagination();
  }

  openDeleteDialog(user: User): void {
    // Open delete confirmation dialog
    this.selectedUser = user;
    this.showDeleteDialog = true;
  }

  confirmDelete(): void {
    // Delete user from users array and update pagination
    if (this.selectedUser) {
      const index = this.users.findIndex(user => user.id === this.selectedUser!.id);
      if (index !== -1) {
        this.users.splice(index, 1);
        localStorage.setItem('userData', JSON.stringify(this.users));
        this.updatePagination(); // Update pagination after deletion
        this.loadWorkoutTypes(); // Reload workout types after deletion
      }
    }
    this.closeDeleteDialog();
  }

  cancelDelete(): void {
    // Close delete confirmation dialog
    this.closeDeleteDialog();
  }

  closeDeleteDialog(): void {
    // Close delete confirmation dialog
    this.showDeleteDialog = false;
    this.selectedUser = null;
  }

  formatWorkouts(workouts: { type: string; minutes: number }[]): string {
    // Format workouts for display
    return workouts.map(workout => workout.type).join(', ');
  }

  countUniqueWorkouts(workouts: { type: string; minutes: number }[]): number {
    // Count unique workout types
    const uniqueWorkouts = new Set(workouts.map(workout => workout.type));
    return uniqueWorkouts.size;
  }

  calculateTotalMinutes(workouts: { type: string; minutes: number }[]): number {
    // Calculate total minutes
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  getPageNumbers(): number[] {
    // Return an array of page numbers from 1 to totalPages
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  applyFilter(): void {
    // Filter based on searchUsername and selectedWorkoutType
    let filteredUsers = this.users;
  
    // Apply searchUsername filter
    if (this.searchUsername.trim() !== '') {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(this.searchUsername.trim().toLowerCase())
      );
    }
  
    // Apply selectedWorkoutType filter
    if (this.selectedWorkoutType !== '') {
      filteredUsers = filteredUsers.filter(user =>
        user.workouts.some((workout: { type: string; }) => workout.type === this.selectedWorkoutType)
      );
    }
  
    // Update paginatedUsers with filtered results
    this.paginatedUsers = filteredUsers.slice(0, this.usersPerPage);
  
    // Calculate total pages for pagination controls
    this.totalPages = Math.ceil(filteredUsers.length / this.usersPerPage);
  
    // Show pagination controls if there are more than 5 users
    this.showPagination = filteredUsers.length > 5;
  
    // Hide previous and next buttons if there's only one page
    this.showPrevNext = this.totalPages > 1;
  
    // Display message when no results match the filters
    if (filteredUsers.length === 0) {
      this.showNoResultsMessage = true;
    } else {
      this.showNoResultsMessage = false;
    }
  }
  

  onWorkoutTypeChange(event: Event): void {
    // Handle change in workout type selection
    const target = event.target as HTMLSelectElement;
    this.selectedWorkoutType = target.value;
    // Implement filtering logic based on selectedWorkoutType
    // Example: Filter users based on selectedWorkoutType
    if (this.selectedWorkoutType !== '') {
      this.paginatedUsers = this.users.filter(user =>
        user.workouts.some((workout: { type: string; }) => workout.type === this.selectedWorkoutType)
      );
    } else {
      this.updatePagination(); // Reset pagination if no filter is applied
    }
  }

}
