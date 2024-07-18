import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { UserService } from '../../services/user.service';

interface User {
  id: number;
  name: string;
  workouts: { type: string; minutes: number }[];
}


@Component({
  selector: 'app-workout-chart',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './workout-chart.component.html',
  styleUrl: './workout-chart.component.css'
})
export class WorkoutChartComponent implements OnInit {
  users: User[] = [];
  selectedUserId: number | null = null;
  chart: Chart | null = null;
  noWorkoutDataMessage = 'No workout data available for this user.';
  selectedUserName: string | null = null;

  constructor(private userService: UserService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.users = this.userService.getUsers();
  }

  onSelectUser(userId: number): void {
    this.selectedUserId = userId;
    this.selectedUserName = this.users.find(user => user.id === userId)?.name || null;
    this.updateChart();
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const selectedUser = this.users.find(user => user.id === this.selectedUserId);

    if (selectedUser && selectedUser.workouts.length > 0) {
      const ctx = document.getElementById('workoutChart') as HTMLCanvasElement;
      const workoutTypes = selectedUser.workouts.map(workout => workout.type);
      const workoutMinutes = selectedUser.workouts.map(workout => workout.minutes);

      this.chart = new Chart(ctx, {
        type: 'bar' as ChartType,
        data: {
          labels: workoutTypes, // Labels for each bar (workout type)
          datasets: [{
            label: 'Minutes', // Label for the dataset
            data: workoutMinutes, // Data for each bar (minutes)
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Minutes'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Workout Type'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: ` ${this.selectedUserName}`,
              font: {
                size: 16
              }
            }
          }
        }
      });
    } else {
      this.displayNoDataMessage();
    }
  }

  displayNoDataMessage(): void {
    const ctx = document.getElementById('workoutChart') as HTMLCanvasElement;
    const ctx2d = ctx.getContext('2d');
    if (ctx2d) {
      ctx2d.clearRect(0, 0, ctx.width, ctx.height);
      ctx2d.font = '24px Arial';
      ctx2d.fillStyle = 'black';
      ctx2d.textAlign = 'center';
      ctx2d.fillText(this.noWorkoutDataMessage, ctx.width / 2, ctx.height / 2);
    }
  }
}