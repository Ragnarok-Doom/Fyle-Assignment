import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  afterEach(() => {
    // Clean up localStorage after each test
    localStorage.removeItem('userData');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with initial data if localStorage is empty', () => {
    localStorage.removeItem('userData');
    service = new UserService();
    expect(service.getUsers().length).toBeGreaterThan(0);
  });

  it('should initialize with existing data if localStorage is not empty', () => {
    const existingData = [
      { id: 1, name: 'Existing User', workouts: [{ type: 'Running', minutes: 30 }] }
    ];
    localStorage.setItem('userData', JSON.stringify(existingData));
    service = new UserService();
    expect(service.getUsers()).toEqual(existingData);
  });

  it('should add a new user', () => {
    const newUser = { id: 4, name: 'New User', workouts: [{ type: 'Yoga', minutes: 40 }] };
    service.addUser(newUser);
    const users = service.getUsers();
    expect(users.length).toBe(4);
    expect(users.find(user => user.name === 'New User')).toEqual(newUser);
  });

  it('should update existing user workouts', () => {
    const existingUser = { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] };
    const newUserWorkout = { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 20 }] };
    service.addUser(newUserWorkout);
    const users = service.getUsers();
    const updatedUser = users.find(user => user.name === 'John Doe');
    expect(updatedUser?.workouts.length).toBe(1);
    expect(updatedUser?.workouts[0].minutes).toBe(50); // 30 + 20
  });

  it('should add a new workout type to existing user', () => {
    const existingUser = { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }] };
    const newUserWorkout = { id: 1, name: 'John Doe', workouts: [{ type: 'Yoga', minutes: 20 }] };
    service.addUser(newUserWorkout);
    const users = service.getUsers();
    const updatedUser = users.find(user => user.name === 'John Doe');
    expect(updatedUser?.workouts.length).toBe(2);
  });

  it('should delete a user', () => {
    const userIdToDelete = 1;
    service.deleteUser(userIdToDelete);
    const users = service.getUsers();
    expect(users.find(user => user.id === userIdToDelete)).toBeUndefined();
  });

  it('should emit changes when user is added', (done) => {
    const newUser = { id: 4, name: 'New User', workouts: [{ type: 'Yoga', minutes: 40 }] };
    service.users$.subscribe(users => {
      if (users.length === 4) {
        expect(users.find(user => user.name === 'New User')).toEqual(newUser);
        done();
      }
    });
    service.addUser(newUser);
  });

  it('should emit changes when user is deleted', (done) => {
    const userIdToDelete = 1;
    service.users$.subscribe(users => {
      if (users.length === 2) {
        expect(users.find(user => user.id === userIdToDelete)).toBeUndefined();
        done();
      }
    });
    service.deleteUser(userIdToDelete);
  });
});
