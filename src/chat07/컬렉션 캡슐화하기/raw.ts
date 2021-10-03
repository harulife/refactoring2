class Person {
  constructor(name){
    this.name = name;
    this.courses = [];
  }

  get name() { return this.name; }
  set name(name) { this.name = name }
  get courses() { return this.courses; }
  set courses(aList) { this.courses = aList; }
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
