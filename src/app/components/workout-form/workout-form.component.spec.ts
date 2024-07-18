import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutFormComponent } from './workout-form.component';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('WorkoutFormComponent', () => {
  let component: WorkoutFormComponent;
  let fixture: ComponentFixture<WorkoutFormComponent>;
  let userService: UserService;

  beforeEach(async () => {
    const userServiceMock = {
      users$: of([]),
      addUser: jasmine.createSpy('addUser')
    };

    await TestBed.configureTestingModule({
      imports: [WorkoutFormComponent], // Import the standalone component here
      providers: [{ provide: UserService, useValue: userServiceMock }]
    }).compileComponents();

    userService = TestBed.inject(UserService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add new user and workout', () => {
    spyOn(localStorage, 'setItem');
    const newUser = {
      id: Date.now(),
      name: 'Test User',
      workouts: [{ type: 'Running', minutes: 30 }]
    };
    component.userName = newUser.name;
    component.workoutType = 'Running';
    component.workoutMinutes = 30;

    component.onSubmit();

    expect(userService.addUser).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Test User',
      workouts: [{ type: 'Running', minutes: 30 }]
    }));
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should add workout to existing user', () => {
    spyOn(localStorage, 'setItem');
    const existingUsers = [
      {
        id: 1,
        name: 'Existing User',
        workouts: [{ type: 'Cycling', minutes: 45 }]
      }
    ];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(existingUsers));
    component.userName = 'Existing User';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;

    component.onSubmit();

    expect(localStorage.setItem).toHaveBeenCalledWith('userData', jasmine.stringMatching(/"type":"Running","minutes":30/));
  });

  it('should show an alert if workout type already exists for the user', () => {
    spyOn(window, 'alert');
    const existingUsers = [
      {
        id: 1,
        name: 'Existing User',
        workouts: [{ type: 'Running', minutes: 30 }]
      }
    ];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(existingUsers));
    component.userName = 'Existing User';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith(`Workout type 'Running' already exists for Existing User.`);
  });

  it('should not submit if form fields are not properly filled out', () => {
    spyOn(console, 'error');
    component.userName = '';
    component.workoutType = '';
    component.workoutMinutes = null;

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Form fields are not properly filled out.');
  });

  it('should reset the form after successful submission', () => {
    spyOn(localStorage, 'setItem');
    component.userName = 'Test User';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;

    component.onSubmit();

    expect(component.userName).toBe('');
    expect(component.workoutType).toBe('');
    expect(component.workoutMinutes).toBeNull();
  });
});
