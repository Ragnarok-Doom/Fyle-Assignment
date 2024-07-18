import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutChartComponent } from './workout-chart.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { Chart } from 'chart.js';

interface User {
  id: number;
  name: string;
  workouts: { type: string; minutes: number }[];
}

describe('WorkoutChartComponent', () => {
  let component: WorkoutChartComponent;
  let fixture: ComponentFixture<WorkoutChartComponent>;
  let userService: UserService;

  const mockUsers: User[] = [
    { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }] },
    { id: 2, name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }, { type: 'Running', minutes: 20 }] },
    { id: 3, name: 'Mike Johnson', workouts: [{ type: 'Yoga', minutes: 50 }, { type: 'Cycling', minutes: 40 }] }
  ];

  beforeEach(async () => {
    const userServiceMock = {
      getUsers: jasmine.createSpy('getUsers').and.returnValue(mockUsers)
    };

    await TestBed.configureTestingModule({
      imports: [WorkoutChartComponent], // Import the standalone component here
      providers: [{ provide: UserService, useValue: userServiceMock }]
    }).compileComponents();

    userService = TestBed.inject(UserService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    component.ngOnInit();
    expect(component.users.length).toBe(3);
    expect(component.users).toEqual(mockUsers);
  });

  it('should select a user and update the chart', () => {
    spyOn(component, 'updateChart').and.callThrough();
    component.onSelectUser(1);
    expect(component.selectedUserId).toBe(1);
    expect(component.selectedUserName).toBe('John Doe');
    expect(component.updateChart).toHaveBeenCalled();
  });

  it('should display chart with correct data for selected user', () => {
    const canvas = document.createElement('canvas');
    spyOn(document, 'getElementById').and.returnValue(canvas);
    component.selectedUserId = 1;
    component.selectedUserName = 'John Doe';
    component.updateChart();

    expect(component.chart).toBeTruthy();
    expect(component.chart!.data.labels).toEqual(['Running', 'Cycling']);
    expect(component.chart!.data.datasets[0].data).toEqual([30, 45]);
  });

  it('should display no data message when selected user has no workouts', () => {
    const canvas = document.createElement('canvas');
    spyOn(document, 'getElementById').and.returnValue(canvas);
    spyOn(component, 'displayNoDataMessage').and.callThrough();

    component.selectedUserId = 4;
    component.updateChart();

    expect(component.chart).toBeNull();
    expect(component.displayNoDataMessage).toHaveBeenCalled();
  });

  it('should clear and display no data message on the canvas', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    spyOn(document, 'getElementById').and.returnValue(canvas);
    component.noWorkoutDataMessage = 'No workout data available for this user.';
    component.displayNoDataMessage();

    const ctx2d = canvas.getContext('2d')!;
    spyOn(ctx2d, 'clearRect').and.callThrough();
    spyOn(ctx2d, 'fillText').and.callThrough();

    component.displayNoDataMessage();

    expect(ctx2d.clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    expect(ctx2d.fillText).toHaveBeenCalledWith('No workout data available for this user.', canvas.width / 2, canvas.height / 2);
  });
});
