import { Injectable } from '@angular/core';

@Injectable()
export class TimeService {

    public getTime(date: Date): string {
        return `${this.getHour(date)}:${this.getMinute(date)}`;
    }

    public getHour(date: Date): string {
        return this.pad(date.getHours());
    }

    public getMinute(date: Date): string {
        return this.pad(date.getMinutes());
    }

    public getAMHours(): Array<string> {
        let hours = [
            '12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'
        ];
        return hours;
    }

    public getPMHours(): Array<string> {
        let hours = [
            '00', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
        ];
        return hours;
    }

    public getMinutes(steps: number = 1): Array<string> {
        let totalMinutesPerHour = 60;
        let minutes = [];
        for (let i=0; i < totalMinutesPerHour / steps; i++) {
            minutes.push(this.pad(i*steps));
        }
        return  minutes;
    }

    private pad(n: number): string {
        return (n < 10) ? ("0" + n) : n.toString();
    }
}
