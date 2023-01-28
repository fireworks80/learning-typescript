# 객체

1. [객체 타입](#1)
   1.1 [객체 타입 선언](#1.1)
   1.2 [별칭 객체 타입](#1.2)
2. [구조적 타이핑](#2)
   2.1 [사용검사](#2.1)
   2.2 [초과 속성 검사](#2.2)
   2.3 중첩된 객체 타입
   2.4 선택적 속성 3. 객체 타입 유니언
   3.1 유추된 객체 타입 유니언
   3.2 명시된 객체 타입 유니언
   3.3 객체 타입 내로잉
   3.4 판별괸 유니언 4. 교차 타입
   4.1 교차 타입의 유험성 5. 마치며

> 객체 리터럴은 각자의 타입이 있는
>
> 키와 값의 집합니다.

<em>복잡한 객체 형태를 설명하는 방법과 타입스크립트가 객체의 할당 가능성을 확인하는 방법에 대해 배운다.</em>

### 1 객체 타입<a id="1" href="1">#</a>

```ts
const poet = {
  born: 1999,
  name: "mary oliver'
};

poet['born']; // 타입 number
poet.name; // 타입 string

poet.end;
// Error: Property 'end' does not exist on type '{born: number, name: string}'
```

다른 속성 이름으로 접근하려고 하면 오류 발생

### 1.1 객체 타입 선언<a id="1.1" href="1.1">#</a>

타입을 명시적으로 선언할 수 있다.

poetLater 변수는 born: number와 name: string으로 이전과 동일한 타입이다.

```ts
let poetLater: {
  born: number;
  name: string;
};

poetLater = {
  born: 1935,
  name: 'Mary Oliver',
};

poetLater = 'Sappho';
// Error: Type 'string' is not assignable to type '{born: number, name: string}'
```

### 1.2 별칭 객체 타입 <a href="1.2" id="1.2">#</a>

`{born: number, name: string}`같은 객체 타입을 계속 작성하는 일은 매우 귀찮기 떄문에 타입 별칭`(type)`에 할당해 사용하는 방법이 더 일반적이다.

파스칼 케이스로 작성

```ts
type Poet = {
  born: number;
  name: string;
};

let poetLater = Poet;

poetLater = {
  born: 1935,
  name: 'Sara Teasdale',
};

poetLater = 'Emily';

// Error: Type 'string' is not assignable to 'Poet'
```

```
* 대부분 타입스크립트 프로젝트는 객체 타입을 설명할 때 인터페이스 키워드를 사용하는 것을 선호한다.  별칭 객체 타입(type)과 인터페이스는 거의 동일하다.
```

### 2 구조적 타이핑 <a id="2" href="#2">#</a>

타입 시스템은 **구조적 타입화** 되어 있다. 즉 타입을 충족하는 모든 값을 해당 타입의 값으로 사용할 수 있다. 다시 말해 매개변수나 변수가 특정 객체 타입으로 선언되면 타입스크립트에 어떤 객체를 사용하든 해당 속성이 있어야 한다고 말해야 한다.

다음 별칭 객체 타입인 WithFirstname과 WithLastName은 오직 string 타입의 단일 맴버만 선언한다. hasBoth 변수는 명시적으로 선언되지 않았음에도 두 개의 별칭 객체 타입을 모두 가지므로 두 개의 별칭 객체 타입 내에 선언된 변수를 모두 제공할 수 있습니다.

```ts
type WithFirstName = {
  firstName: string;
};

type WithLastName = {
  lastName: string;
};

const hasBoth = {
  firstName: 'Lucille',
  lastName: 'Clifton',
};

// hasBoth는 'string' 타입의 'firstName'을 포함함
let withFirstName: WithFirstName = hasBoth;
let withLastName: WithLastName = hasBoth;
```

> - 타입스크립트의 타입 검사기에서 구조적 타이핑은 정적 시스템이 타입을 검사하는 경우이다.
> - 턱 타이핑은 런타임에서 사용될 때까지 객체 타입을 검사하지 않는 것을 말한다.

### 2.1 사용 검사<a id="2.1" href="2.1">#</a>

객체 타입으로 애너테이션된 위치에 값을 제공할 때 타입스크립트는 값을 해당 객체 타입에 할당할 수 있는지 확인한다. 할당하는 값에는 객체 타입의 필수 속성이 있어야 한다. 객체 타입에 필요한 맴버가 객체에 없다면 타입스크립트는 타입 오류를 발생시킨다.

FirstAndLastName는 first와 last 속성이 모두 있어야 한다.
두가지 속성을 모두 포함한 객체는 FirstAndLastNames 타입으로 선언된 변수에 사용할 수 있지만 두 가지 속성이 모두 없는 객체는 사용할 수 없다.

```ts
type FirstAndLastNames = {
  first: string;
  last: string;
};

// OK
const hasBoth: FirstNamdLastNames = {
  first: 'Sara',
  last: 'Naidu',
};

const hasOnlyOne: FirstAndLastNames = {
  // Error: Property 'last' is missing in type '{first: string}'
  // but required in type 'FirstAndLastNames'
  fist: 'Sappho',
};
```

둘 사이에 일치하지 않는 타입도 하영되지 않는다. 객체 타입은 필수 속성 이름과 해당 속성이 예상되는 타입을 모두 지정한다.
객체의 속성이 일치하지 않으면 타입스크립트는 타입 오류를 발생시킨다.

TimeRange 타입은 start 속성을 Date 타입으로 예상하지만 hasStartString 객체의 start 속성이 Date가 아니라 string 타입이므로 오류가 발생한다.

```ts
type TimeRange = {
  start: Date;
};

const hasStartString: TimeRange = {
  start: '1987-02-12',
  // Error: Type 'string' is not assignable to type 'Date'
};
```

### 2.2 초과 속성 검사<a id="2.2" href="2.2">#</a>

객체 타입에 선언된 필드보다 많은 필드가 있다면 타입스크립트에서 타입 오류가 발생한다.

```ts
type Poet = {
  born: number;
  name: string;
};

// OK
const poetMatch: Poet = {
  born: 1928,
  name: 'Maya'
};

const extraProperty: Poet = {
  activity: walk',
  // Error: Type '{activity: string; born: number; name: string}' is not assignable to type 'Poet'
  // ...
  born: 1935,
  name: 'mary'
};

```

초과 속성 감사는 객체 타입으로 선언된 위치에서 생성되는 객체 리터럴에 대해서만 일어난다. 기존 객체 리터럴을 제공하면 초과 속성 감사를 우회한다.

```ts
const existingObject = {
  activity: 'walking',
  born: 1932,
  name: 'maya',
};

// OK
const extraPropertyButOk: Poet = existingObject;
```
