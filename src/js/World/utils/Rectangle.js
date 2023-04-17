export class Rectangle {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  width = () => {
    return this.x2 - this.x1;
  }

  height = () => {
    return this.y2 - this.y1;
  }

  center = () => {
    return {
      x: this.x1 + (this.x2 - this.x1) / 2,
      y: this.y1 + (this.y2 - this.y1) / 2
    }
  }

  area = () => {
    return this.width() * this.width();
  }
}