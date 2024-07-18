import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkoutFormComponent } from "./components/workout-form/workout-form.component";
import { UserListComponent } from "./components/user-list/user-list.component";
import { WorkoutChartComponent } from "./components/workout-chart/workout-chart.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WorkoutFormComponent, UserListComponent, WorkoutChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'fyle-assignment';
}
