let c: {
  firstName: string;
  lastName: string;
} = {
  firstName: 'john',
  lastName: 'Barrowman',
};

class Person {
  lastName: string;
  // public firstName: string은 lastName의 단축 속성이다.
  constructor(public firstName: string, lastName: string) {
    this.lastName = lastName;
  }
}

c = new Person('matt', 'smith');
