# 클래스

## 8.1 클래스 메서드

타입스크립트는 독립 함수를 이해하는 것과 동일한 방식으로 메서드를 이해한다.
매개변수 타입에 타입이나 기본값을 지정하지 않으면 any 타입이 기본이다.
재귀 함수가 아니라면 대부분 반환 타입을 유추할 수 있다.

```ts
class Greeter {
  greet(name: string) {
    console.log(name);
  }
}

new Greeter().greet('hello');

new Greeter().greet();
// Expected 1 arguments, but got 0
```

클래스 생성자는 매개변수와 관련하여 전형적인 클래스 메서드처름 취급된다.
타입스크립트는 메서드 호출 시 올바른 타입의 인수가 올바른 수로 제공되는지 확인하기 위해 타입 검사를 수행한다.

## 8.2 클래스 속성

타입스크립트에서 클래스의 속성을 읽거나 쓰려면 클래스에 명시적으로 선언해야 한다.
클래스 속성은 인터페이스와 동일한 구문을 사용해 선언한다.
클래스 속성 이름 뒤에는 선택적으로 타입 애너테이션이 붙는다.
<br/>
타입스크립트는 생성자 내의 할당에 대해 그 맴버가 클래스에 존재하는 멤버인지 추론하려고 시도하지 않는다.

```ts
class FieldTrip {
  destination: string;

  constructor(destination: string) {
    this.destination = destination;

    this.nonexistent = destination;
    // any
    // Property 'nonexistent' does not exist on type 'FieldTrip'.
  }
}
```

클래스 속성을 명시적으로 선언하면 타입스크립트는 클래스 인스턴스에서 무엇이 허용되고 허용되지 않는지 빠르게 이해할 수 있다.

### 8.2.1 함수 속성

자바스크립트에는 클래스의 멤버를 호출 가능한 함수로 선언하는 두 가지 구문이 있다

- 멤버 이름 뒤에 괄호를 붙이는 메서드 접근 방식
  - 함수를 클래스 프로토타입에 할당하므로 모든 클래스 인스턴스는 동일한 함수 정의를 사용한다.
- 값이 함수인 속성을 선언하는 방식
  - 이렇게 하면 클래스의 인스턴스당 새로운 함수가 생성되며, 항상 클래스 인스턴스를 가리켜야 하는 화살표 함수에서 this 스코프를 사용하면 클래스 인스턴스당 새로운 함수를 생성하는 시간과 메모리 비용 측면에서 유용할 수 있다

함수 속성은 클래스 메서드와 독립 함수의 동일한 구문을 사용해 매개변수와 반환 타입을 지정할 수 있다. 결국 함수 속성은 클래스 멤버로 할당된 값이고 그 값은 함수다.

### 8.2.2 초기화 검사

엄격한 컴파일러 설정이 활성화된 상태에서 타입스크립트는 undefined 타입으로 선언된 각 속성이 생성자에서 할당되었는지 확인한다.
이와 같은 엄격한 초기화 검사는 클래스 속성에 값을 할당하지 않는 실수를 예방할 수 있어 유용하다.

```ts
class WithValue {
  immediate = 0;
  later: number;
  mayBeUndefined: number | undefined; // undefined가 되는 것이 허용됨
  unused: number;
  // Property 'unused' has no initializer and is not definitely assigned in the constructor.

  constructor() {
    this.later = 1;
  }
}
```

**확실하게 할당된 속성**
클래스 생성자 다음에 클래스 속성을 의도적으로 할당하지 않는 경우가 있다.
엄격한 초기화 검사를 적용하면 안되는 속성인 경우에는 이름 뒤에 ! 을 추가해 검사를 비활성화하도록 설정한다.
이렇게 하면 타입스크립트에 속성이 처음 사용되기 전에 undefined 값이 할당된다.

```ts
class Activities {
  pending!: string[];

  initialize(pending: string[]) {
    this.pending = pending;
  }

  next() {
    return this.pending.pop();
  }
}

const activity = new Activities();

activity.initialize(['eat', 'sleep']);
activity.next();
```

> 클래스 속성에 대해 엄격한 초기화 검사를 비활성화하는 것은 종종 타입 검사에는 적합하지 않은 방식으로 코드가 설정된다는 신호다
> ! 어서션을 추가하고 속성에 대한 타입 안정성을 줄이는 대신 클래스를 리팩터링해서 더 이상 필요하지 않도록 해라

### 8.2.3 선택적 속성

속성 이름 뒤에 ?를 추가해 속성을 옵션으로 선언 한다. 선택적 속성은 | undefined를 포함하는 유니언 타입과 거의 동일하게 작동합니다.

```ts
class Missing {
  property?: string;
}

new Missing().property?.length;
new Missing().property.length;
// Error: string | undefined
```

### 8.2.4 읽기 전용 속성

속성 이름 앞에 readonly 키워드 추가
readonly로 선언된 속성은 선언된 위치 또는 생성자에서 초깃값만 할당할 수 있다.
클래스 내의 메서드를 포함한 다른 모든 위치에서 속성은 읽을 수만 있고, 쓸 수는 없다.

```ts
class Quote {
  readonly text: string;

  constructor(text: string) {
    this.text = text;
  }

  emphasize() {
    this.text += '!';
    // Cannot assign to 'text' because it is a read-only property.
  }
}
```

> 진정한 읽기 전용 보호가 필요하다면 # private 필드나 get() 함수 속성 사용을 고려해라

원시 타입의 초깃값을 갖는 readonly로 선언된 속성은 다른 속성과 조금 다르다.
이런 속성은 더 넓은 원싯값이 아니라 값의 타입이 가능한 한 좁혀진 리터럴 타입으로 유추된다.

## 8.3 타입으로서의 클래스

타입 스스템에서의 클래스는 클래스 선언이 런타임 값(클래스 자체)과 타입 애너테이션에서 사용할 수 있는 타입을 모두 생성한다는 점에서 상대적으로 독특하다.

```ts
class Teacher {
  sayHello() {
    console.log('hello');
  }
}

let teacher: Teacher;

teacher = new Teacher();

teacher = 'wat';
// Type 'string' is not assignable to type 'Teacher'.
```

타입스크립트는 클래스의 동일한 멤버를 모두 포함하는 모든 객체 타입을 클래스에 할당할 수 있는 것으로 간주한다.
타입스크립트의 구조적 타이핑이 선언되는 방식이 아니라 객체의 형태만 고려하기 때문이다.

```ts
class SchoolBus {
  getAbilities() {
    return ['magic', 'shapes'];
  }
}

function withSchoolBus(bus: SchoolBus) {
  console.log(bus.getAbilities());
}

withSchoolBus(new SchoolBus());

withSchoolBus({
  getAbilities: () => ['transform'],
});

withSchoolBus({
  getAbilities: () => 123,
});
// Type 'number' is not assignable to type 'string[]'.
```

8.4 클래스와 인터페이스
타입스크립트는 클래스 이름 뒤에 implements 키워드와 인터페이스 이름을 추가함으로써 클래스의 해당 인스턴스가 인터페이스를 준수한다고 선언할 수 있다.
이렇게 하면 클래스를 각 인터페이스에 할당할 수 있어야 함을 타입스크립트에 나타낸다. 타입 검사기에 의해 모든 불일치에 대해서 타입 오류가 발생한다.

```ts
interface Learner {
  name: string;
  study(hours: number): void;
}

class Student implements Learner {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  study(hours: number) {
    for (let i = 0; i < hours; i += 1) {
      console.log('studying');
    }
  }
}

class Slacker implements Learner {}
// Class 'Slacker' incorrectly implements interface 'Learner'.
// Type 'Slacker' is missing the following properties from type 'Learner': name, study
```

타입스크립트는 인터페이스에서 클래스의 메서드 또는 속성 타입을 유추하지 않는다.

인터페이스를 구현하는 것은 순전히 안정성 검사를 위해서다.
모든 인터페이스 멤버를 클래스 정의로 복사하지 않는다.
대신 인터페이스를 구현하면 클래스 인스턴스가 사용되는 곳에서 나중에 타입 검사기로 신호를 보내고 클래스 정의에서 표면적인 타입 오류가 발생한다.
변수에 초깃값이 있더라도 타입 애너테이션을 추가하는 것과 용도가 비슷하다.

### 8.4.1 다중 인터페이스 구현

클래스에 구현된 인터페이스 목록은 인터페이스 이름 사이에 쉼표를 넣고 개수 제한 없이 인터페이스를 사용할 수 있다

```ts
interface Graded {
  grades: number[];
}

interface Reporter {
  report: () => string;
}

class ReportCard implements Graded, Reporter {
  grades: number[];

  constructor(grades: number[]) {
    this.grades = grades;
  }

  report() {
    return 'hello';
  }
}
```

실제로 클래스가 한 번에 두 인터페이스를 구현할 수 없도록 정의하는 인터페이스가 있을 수 있다.
두 개의 충돌하는 인터페이스를 구현하는 클래스를 선언하고 하면 클래스에 하나 이상의 타입 오류가 발생한다.

```ts
interface AgeIsANumber {
  age: number;
}

interface AgeIsNotANumber {
  age: () => string;
}

class AsNumber implements AgeIsANumber, AgeIsNotANumber {
  age = 0;
  // Property 'age' in type 'AsNumber' is not assignable to the same property in base type 'AgeIsNotANumber'.
  // Type 'number' is not assignable to type '() => string'.
}
```

## 8.5 클래스 확장

```ts
class Teacher {
  teach() {
    console.log('hello');
  }
}

class StudentTeacher extends Teacher {
  learn() {
    console.log('learn');
  }
}

const teacher = new StudentTeacher();

teacher.teach();
teacher.learn();

teacher.other();
// error
```

### 8.5.1 할당 가능성 확장

하위 클래스의 인스턴스는 기본 클래스의 모든 멤버를 가지므로 기본 클래스의 인스턴스가 필요한 모든 곳에서 사용할 수 있다.
만양 기본 클래스에 하위 클래스가 가지고 있는 모든 멤버가 없으면 더 구체적인 하위 클래스가 필요할 때 사용할 수 없다.

```ts
class Lesson {
  subject: string;

  constructor(subject: string) {
    this.subject = subject;
  }
}

class OnlineLesson extends Lesson {
  url: string;

  constructor(subject: string, url: string) {
    super(subject);
    this.url = url;
  }
}

let lesson: Lesson;
lesson = new Lesson('coding');
lesson = new OnlineLesson('coding', 'oreilly.com');

let online: OnlineLesson;
online = new OnlineLesson('coding', 'oreilly.com');
online = new Lesson('coding');
// Property 'url' is missing in type 'Lesson' but required in type 'OnlineLesson'.(2741)
```

타입스크립트의 구조적 타입에 따라 하위 클래스의 모든 멤버가 동일한 타입의 기본 클래스에 이미 존재하는 경우 기본 클래스의 인스턴스를 하위 클래스 대신 사용할 수 있다.

### 8.5.2 재정의된 생성자

바닐라 자바스크립트와 마잔가지로 타입스크립트에서 하위 클래스는 자체 생성자를 정의할 필요가 없다. 자체 생성자가 없는 하위 클래스는 암묵적으로 기본 클래스의 생서자를 사용한다.
자바스크립트에서 하위 클래스가 자체 생성자를 선언하면 super키워드를 통해 기본 클래스 생성자를 호출해야 한다.

### 8.5.3 재정의된 메서드

하위 클래스의 메서드가 기본 클래스의 메서드에 할당될 수 있는 한 하위 클래스는 기본 클래스와 동일한 이름으로 새 메서드를 다시 선언할 수 있다.

```ts
class GradeCounter {
  counterGrades(grades: string[], letter: string) {
    return grades.filter((grade) => grade === letter).length;
  }
}

class FailureCounter extends GradeCounter {
  counterGrades(grades: string[]) {
    return super.counterGrades(grades, 'F');
  }
}

class AnyFailureChecker extends GradeCounter {
  counterGrades(grades: string[]) {
    //
    // Property 'counterGrades' in type 'AnyFailureChecker' is not assignable to the same property in base type 'GradeCounter'.
    // Type '(grades: string[]) => boolean' is not assignable to type '(grades: string[], letter: string) => number'.
    // Type 'boolean' is not assignable to type 'number'.
    return super.counterGrades(grades, 'f') !== 0;
  }
}

const counter: GradeCounter = new AnyFailureChecker();

const count = counter.counterGrades(['a', 'b']);
```

### 8.5.4 재정의된 속성

하위 클래스는 새 타입을 기본 클래스의 타입에 할당할 수 있는 한 동일한 이름으로 기본 클래스의 속성을 명시적으로 다시 선언할 수 있다.
<br/>
속성을 다시 선언하는 대부분의 하위 클래스는 해당 속성을 유니언 타입으의 더 구체적인 하위 집합으로 만들거나 기본 클래스 속성 타입에서 확장되는 타입으로 만든다.

```ts
class Assignment {
  grade?: number;
}

class GradeAssignment extends Assignment {
  grade: number;

  constructor(grade: number) {
    super();
    this.grade = grade;
  }
}
```

## 8.6 추상 클래스

추상화하려는 클래스 이름과 메서드 앞에 타입스크립트의 abstract 키워드를 추가한다.

```ts
abstract class School {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract getStudentTypes(): string[];
}

class Preschool extends School {
  getStudentTypes() {
    return ['hello'];
  }
}

class Absence extends School {}
```

## 8.7 멤버 접근성

- public
- protected
- private

접근성 제한자는 readonly와 함께 표시할 수 있다.
readonly와 명시적 접근성 키워드로 멤버를 선언하려면 접근성 키워드를 먼저 적어야 한다.

```ts
class TwoKeywords {
  private readonly name: string;

  constructor() {
    this.name = 'hello';
  }

  log() {
    console.log(this.name);
  }
}

const two = new TwoKeywords();

two.name = 'test';
// Error>
```

타입스크립트의 이전 멤버 접근성 크워드를 자바스크립트의 # private 필드와 함께 사용할 수 없다는 점을 기억해야 한다.

### 8.7.1 정적 플드 제한다

자바스크립트는 static 키워드를 사용해 클래스 자체에서 멤버를 선언한다.
static 키워드를 단독으로 사용하거나 readonly와 접근성 키웓를 함께 사용할 수 있도록 지원한다.
함꼐 사용할 경우 접근성 키워드를 먼저 작성하고 그 다음 static, readonly 키워드가 온다

```ts
class Question {
  protected static readonly answer: 'bash';
  protected static readonly prompt = 'what';
}
```
