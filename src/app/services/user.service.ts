import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<any[]>(this.getUsers());
  users$ = this.usersSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    const existingData = localStorage.getItem('userData');
    if (!existingData) {
      const initialData = this.getInitialData();
      localStorage.setItem('userData', JSON.stringify(initialData));
    }
    this.usersSubject.next(this.getUsers());
  }

  private getInitialData(): any[] {
    return [
      { id: 1, name: 'John Doe', workouts: [{ type: 'Running', minutes: 30 }, { type: 'Cycling', minutes: 45 }] },
      { id: 2, name: 'Jane Smith', workouts: [{ type: 'Swimming', minutes: 60 }, { type: 'Running', minutes: 20 }] },
      { id: 3, name: 'Mike Johnson', workouts: [{ type: 'Yoga', minutes: 50 }, { type: 'Cycling', minutes: 40 }] }
    ];
  }

  getUsers(): any[] {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : [];
  }

  addUser(user: any) {
    const users = this.getUsers();
    const existingUserIndex = users.findIndex(u => u.name === user.name);

    if (existingUserIndex > -1) {
      // Update existing user with new workouts
      const existingUser = users[existingUserIndex];
      user.workouts.forEach((newWorkout: { type: any; minutes: any; }) => {
        const workoutIndex = existingUser.workouts.findIndex((w: { type: any; }) => w.type === newWorkout.type);
        if (workoutIndex > -1) {
          // Update existing workout minutes
          existingUser.workouts[workoutIndex].minutes += newWorkout.minutes;
        } else {
          // Add new workout type
          existingUser.workouts.push(newWorkout);
        }
      });
    } else {
      // Add new user
      users.push(user);
    }

    // Update localStorage and notify observers
    localStorage.setItem('userData', JSON.stringify(users));
    this.usersSubject.next(users); // Emit changes
  }

  deleteUser(userId: number): void {
    let users = this.getUsers();
    users = users.filter(user => user.id !== userId);
    localStorage.setItem('userData', JSON.stringify(users));
    this.usersSubject.next(users); // Emit changes
  }
}
