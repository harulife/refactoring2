class Person {
  constructor(name){
    this.name = name;
    this.courses = [];
  }
  get name() { return this.name; }
  set name(name) { this.name = name; }
  get courses() { return this.courses.slice(); }
  set courses(aList) { this.courses = aList.slice(); }
  addCourse(aCourse) {
    this.courses.push(aCourse);
  }
  removeCourse(aCourse, fnIfAbsent = () => { throw new RangeError() }){
    const index = this.courses.indexOf(aCourse);
    if(index === -1) fnIfAbsent();
    else this.courses.splice(index, 1);
  }
}

class Course{
  constructor(name, isAdvanced) {
    this.name = name;
    this.isAdvanced = isAdvanced;
  }

  get name() { return this.name; }
  set name(name) { this.name = name; }
  get isAdvanced() { return this.isAdvanced; }
  set isAdvanced(isAdvanced) { this.isAdvanced = isAdvanced; }
}
