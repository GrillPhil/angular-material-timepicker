import { animate, Component, ElementRef, ViewChild, EventEmitter, Input, keyframes, OnInit, Output, style, transition, trigger } from '@angular/core';

import { TimeService } from './time.service';

enum TimePart {
  Hours,
  Minutes
}

@Component({
  selector: 'md-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {

  private readonly timeService: TimeService;
  private activeTimePart: TimePart = TimePart.Hours;
  private timeVal: Date;
  private currentHours: string;
  private currentMinutes: string;
  private amHours: Array<string>;
  private pmHours: Array<string>;
  private steppedMinutes: Array<string>;
  private allMinutes: Array<string>;
  private minuteSteps: number = 5;
  private currentNodes: Array<any>;

  @Output()
  timeChange = new EventEmitter<Date>();

  @Input()
  get time(): Date {
    return this.timeVal;
  };
  set time(val: Date) {
    this.timeVal = val;
    this.timeChange.emit(val);
    this.updateTime(val);
  }

  @Output()
  cancel = new EventEmitter<void>();

  @Output()
  submit = new EventEmitter<Date>();

  @ViewChild('circleHost')
  circleHost: ElementRef;

  @ViewChild('marker')
  marker: ElementRef;

  constructor(timeService: TimeService) {
    this.timeService = timeService;
  }

  ngOnInit() {
    this.time = new Date();
    this.amHours = this.timeService.getAMHours();
    this.pmHours = this.timeService.getPMHours();
    this.steppedMinutes = this.timeService.getMinutes(this.minuteSteps);
    this.allMinutes = this.timeService.getMinutes();
  }

  private updateTime(time: Date) {
    this.currentHours = this.timeService.getHour(time);
    this.currentMinutes = this.timeService.getMinute(time);
    console.log('updateTime', time);
  }

  isPartActive(part: number) {
    if (part === this.activeTimePart) {
      return 'active';
    }
  }

  switchActivePart(part: number) {
    if (this.activeTimePart !== part) {
      this.activeTimePart = part;
      this.currentNodes = null;
    }
  }

  onNow() {
    console.log('not implemented');
  }

  onCancel() {
    this.cancel.emit();
  }

  onOk() {
    this.submit.emit(this.time);
  }

  onPointerMove(eventArgs) {
    this.findAndHighlightNearestCircle({ x: eventArgs.x, y: eventArgs.y});
  }

  private selectCircle(value: string) {
    if (this.activeTimePart === TimePart.Hours) {
      let num = parseInt(value);
      let time = this.time;
      time.setHours(num);
      this.time = time;
    }
  }

  private findAndHighlightNearestCircle(pointer: Point) {
    let selectedClass = ' selected';
    let unselectedClass= ' unselected';
    let host = this.circleHost.nativeElement;
    if (!this.currentNodes) {
      this.currentNodes = this.findNodes('circle-item', host, []);
    }
    for (let i = 0; i < this.currentNodes.length; i++) {
      let absoluteCenter = this.getAbsoluteCenter(this.currentNodes[i]);
      let node = this.currentNodes[i];
      node.absoluteCenter = absoluteCenter;
      node.pointerDistance = this.getDistance(pointer, absoluteCenter);
      node.className = node.className.replace(selectedClass, '');
      if (node.className.indexOf(unselectedClass) === -1) {
        node.className += unselectedClass;
      }
    }

    let closest = this.getMin(this.currentNodes, 'pointerDistance');
    closest.className = closest.className.replace(unselectedClass, '');
    closest.className += selectedClass;
    this.selectCircle(closest.innerHTML);
    this.updateMarker(closest.absoluteCenter);
  }

  private updateMarker(target: Point) {
    let ctx = this.marker.nativeElement.getContext('2d');
    let width = this.marker.nativeElement.width = this.marker.nativeElement.offsetWidth;
    let height = this.marker.nativeElement.height = this.marker.nativeElement.offsetHeight;
    let absolutePosition = this.getAbsoluteCenter(this.marker.nativeElement);
    let relativeTarget = {
      x: (width/2) + target.x - absolutePosition.x,
      y: (height/2) + target.y - absolutePosition.y 
    }
    let centerCircleRadius = 4;
    let color: 'red';

    ctx.beginPath();
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, centerCircleRadius, 0, 2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.lineWidth = 0;

    ctx.beginPath();
    ctx.moveTo(relativeTarget.x, relativeTarget.y);
    ctx.lineTo(width/2, height/2);
    ctx.stroke();

    console.log('updateMarker to target ', target, ' using ', absolutePosition);
    console.log(width / 2, height / 2);
  }

  private findNodes(className: string, container: any, nodes: Array<any>): Array<any> {
    for (let i = 0; i < container.children.length; i++) {
      let element = container.children[i];
      if (element.className.indexOf(className) !== -1) {
        nodes.push(element);
      }
      if (element.children.length > 0) {
        this.findNodes(className, element, nodes);
      }
    }
    return nodes;
  }

  private getAbsoluteCenter(el): Point {
    let rect = el.getBoundingClientRect();
    return {
      x: rect.left + (el.offsetWidth / 2),
      y: rect.top + (el.offsetHeight / 2)
    };
  }

  private getMin(array:Array<any>, propertyName: string): any {
    let min = array.reduce((a, b, i, array) => { 
      let distanceA = a[propertyName] || 999;
      let distanceB = b[propertyName] || 999;
      let min = Math.min(distanceA, distanceB);
      if (min == distanceA) return a;
      else return b;
    });
    return min;
  }

  private getDistance(point1: Point, point2: Point): number {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
  }
}

interface Point {
  x: number;
  y: number;
}