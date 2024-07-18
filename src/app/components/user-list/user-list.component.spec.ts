import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: UserService;

  beforeEach(async () => {
    const userServiceMock = {
      users$: of([]),
      getUsers: jasmine.createSpy('getUsers').and.returnValue([]),
      addUser: jasmine.createSpy('addUser'),
    };

    await TestBed.configureTestingModule({
      imports: [UserListComponent, FormsModule], // Import the standalone component and FormsModule here
      providers: [{ provide: UserService, useValue: userServiceMock }]
    }).compileComponents();

    userService = TestBed.inject(UserService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize users on ngOnInit', () => {
    component.ngOnInit();
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual([]);
  });

  it('should paginate users', () => {
    component.users = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      workouts: [],
      workoutTypes: []
    }));
    component.updatePagination();
    expect(component.paginatedUsers.length).toBe(component.usersPerPage);
  });

  it('should filter users by username', () => {
    component.users = [
      { id: 1, name: 'John', workouts: [], workoutTypes: [] },
      { id: 2, name: 'Jane', workouts: [], workoutTypes: [] }
    ];
    component.searchUsername = 'John';
    component.applyFilter();
    expect(component.paginatedUsers.length).toBe(1);
    expect(component.paginatedUsers[0].name).toBe('John');
  });

  it('should filter users by workout type', () => {
    component.users = [
      { id: 1, name: 'John', workouts: [{ type: 'Running', minutes: 30 }], workoutTypes: [] },
      { id: 2, name: 'Jane', workouts: [{ type: 'Cycling', minutes: 20 }], workoutTypes: [] }
    ];
    component.selectedWorkoutType = 'Running';
    component.applyFilter();
    expect(component.paginatedUsers.length).toBe(1);
    expect(component.paginatedUsers[0].name).toBe('John');
  });

  it('should reset pagination when filters are applied', () => {
    component.users = [
      { id: 1, name: 'John', workouts: [], workoutTypes: [] },
      { id: 2, name: 'Jane', workouts: [], workoutTypes: [] }
    ];
    component.searchUsername = 'John';
    component.applyFilter();
    expect(component.totalPages).toBe(1);
    expect(component.showPagination).toBeFalse();
  });

  it('should display no results message when no users match the filters', () => {
    component.users = [
      { id: 1, name: 'John', workouts: [], workoutTypes: [] },
      { id: 2, name: 'Jane', workouts: [], workoutTypes: [] }
    ];
    component.searchUsername = 'DoesNotExist';
    component.applyFilter();
    expect(component.showNoResultsMessage).toBeTrue();
  });

  it('should show delete confirmation dialog', () => {
    const user = { id: 1, name: 'John', workouts: [], workoutTypes: [] };
    component.openDeleteDialog(user);
    expect(component.showDeleteDialog).toBeTrue();
    expect(component.selectedUser).toBe(user);
  });

  it('should close delete confirmation dialog', () => {
    component.closeDeleteDialog();
    expect(component.showDeleteDialog).toBeFalse();
    expect(component.selectedUser).toBeNull();
  });

  it('should delete user and update pagination', () => {
    component.users = [
      { id: 1, name: 'John', workouts: [], workoutTypes: [] },
      { id: 2, name: 'Jane', workouts: [], workoutTypes: [] }
    ];
    component.openDeleteDialog(component.users[0]);
    component.confirmDelete();
    expect(component.users.length).toBe(1);
    expect(component.users[0].name).toBe('Jane');
  });
  
    // user-list.component.spec.ts
  it('should display correct title and greeting message', () => {
    const fixture = TestBed.createComponent(UserListComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('h1').textContent).toContain('HEALTH CHALLENGE TRACKER');
    expect(compiled.querySelector('p').textContent).toContain('Hello, fyle-assignment');
  });

});
