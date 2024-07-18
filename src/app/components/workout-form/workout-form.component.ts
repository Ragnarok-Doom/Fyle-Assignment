import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

interface Workout {
  type: string;
  minutes: number;
}

interface User {
  id: number;
  name: string;
  workouts: Workout[];
}

@Component({
  selector: 'app-workout-form',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './workout-form.component.html',
  styleUrl: './workout-form.component.css'
})
export class WorkoutFormComponent{

  userName: string = '';
  workoutType: string = '';
  workoutMinutes: number | null = null;
  workoutTypes: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga'];

  constructor(private userService: UserService) {}

  onSubmit() {
    if (!this.userName || !this.workoutType || this.workoutMinutes === null) {
      console.error('Form fields are not properly filled out.');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('userData') || '[]');
    const existingUser = users.find(user => user.name === this.userName);

    if (existingUser) {
      const existingWorkout = existingUser.workouts.find(workout => workout.type === this.workoutType);

      if (existingWorkout) {
        alert(`Workout type '${this.workoutType}' already exists for ${this.userName}.`);
      } else {
        existingUser.workouts.push({ type: this.workoutType, minutes: Number(this.workoutMinutes) });
        localStorage.setItem('userData', JSON.stringify(users));
        alert(`Workout added successfully for ${this.userName}.`);
      }
    } else {
      const newUser: User = {
        id: Date.now(),
        name: this.userName,
        workouts: [{ type: this.workoutType, minutes: Number(this.workoutMinutes) }]
      };
      this.userService.addUser(newUser);

      users.push(newUser);
      localStorage.setItem('userData', JSON.stringify(users));
      alert(`New user and workout added successfully for ${this.userName}.`);
    }

    // Reset form
    this.userName = '';
    this.workoutType = '';
    this.workoutMinutes = null;
  }
}
