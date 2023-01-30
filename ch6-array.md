# 배열

- - -
1. [배열 타입](#1)
  1.1. [배열과 함수 타입](#1.1)
  1.2. [유니언 타입 배열](#1.2)
  1.3. [any 배열의 진화](#1.3)
  1.4. [any 배열의 진화](#1.4)
2. [배열 맴버](#2)
  2.1. [주의 불안정한 맴버](#2.1)
3. [스프레드와 나머지 매개변수](#3)
  3.1. [스프레드](#3.1)
  3.2. [나머지 매개변수 스프레드](#3.2)
4. [튜플](#4)
  4.1. [튜플 할당 가능성](#4.1)
  4.2. [튜플 추론](#4.2)

- - -

> 유연한 배열과 고정된 튜플

타입스크립트는 초기 배열에 어떤 데이터 타입이 있는지 기억하고, 배열이 해당 데이터 타입에서만 작동 하도록 제한한다.
이런 방식으로 배열의 데이터 타입을 하나로 유지 시킨다.

```ts
const warrios = ['artemisiz', 'boudica'];

warrios.push('zenobia');

warrios.push(true);
// Error...

```

## 배열 타입<a id="1" href="#1">#</a>

```ts
let array: number[];

array = [1,2,3,4];
```

### 배열과 함수 타입<a id="1.1" href="#1.1">#</a>
```ts

// string 배열을 반환하는 함수
let createString: () => string[];

// 각각의 string을 반환하는 함수 배열
let stringCreators: (() => string)[];
```



### 유니언 타입 배열<a id="1.2" href="#1.2">#</a>

```ts
// 타입은 string 또는 number[]
let stringOrArrayOfNumbers: string | number[];

// 각각 string | number인 요소의 배열
let arrayOfStringOrNumbers: (string | number)[];
```

타입스크립트는 배열의 선언에서 두 가지 이상의 요소 타입이 포함되는 경우 유니언 타입 배열임을 알게 된다. 즉, 배열의 요소 타입은 배열에 담긴 요소에 대한 모든 가능한 타입의 집합이다.

```ts

// 타입: (string | undefined)[]
const namesMaybe = [
  'aqual',
  'blend',
  undefined
];

```

### any 배열의 진화<a id="1.3" href="#1.3">#</a>
any 변수가 변경되는 것처럼 any[] 배열이 변경되는 것도 좋지 않다. 타입 애너테이션이 없는 빈 배열은 잠재적으로 잘못된 값 추가를 허용해 타입스크립트의 타입 검사기가 갖는 이점을 부분적으로 무력화한다.


### 다차원 배열<a id="1.4" href="#1.4">#</a>

```ts
let arrayOfAraysOfNumbers: number[][];
 arrayOfAraysOfNumbers = [
  [1,2,3],
  [4,5,6],
  [7,8,9],
 ];
```
number[][] 또는 (number[])[]로 나타낼 수 있다.


## 배열 맴버<a id="2" href="#2">#</a>
타입스크립트는 배열의 맴버를 찾아서 해당 배열의 타입 요소를 되돌려준다

```ts

const defenders = ['a', 'b'];

// string 타입
const defender = defenders[0];
```

유니언 타입으로 된 배열의 맴버는 그 자체로 동일한 유니언 타입이다.
```ts
const solidersOrDates = ['a', new Date()];

// string | Date 타입
const soliderOrDate = solidersOrDates[0];
```


### 주의 사항: 불안정한 맴버<a id="2.1" href="#2.1">#</a>
배열은 타입 시스템에서 불안정한 소스다.

```ts
function withElements(element: string[]) {
  log(element[9001].length); // 타입 오류 없음
  // undefined가 아니라 string 타입으로 간주 된다.
}

withElements(['a', '2']);

```

## 스프레드와 나머지 매개변수<a id="3" href="#3">#</a>

### 스프레드<a id="3.1" href="#3.1">#</a>

...스프레드 연산자를 사용해 배열을 결합한다. 타입스크립트는 입력된 배열 중 하나의 값이 결과 배열에 포함될 것임을 이해한다.

```ts
// type string
const string = ['a', 'b', 'c'];

// type number
const numbers = [1,2,3];

// type (string | number)[]
const join = [...string, ...numbers];
```

### 나머지 매개변수 스프레드<a id="3.2" href="#3.2">#</a>
나머지 매개변수를 위한 인수로 사용되는 배열은 나머지 매개변수와 동일한 배열 타입을 가져야 한다.

```ts
function logWarr(greeting: string, ...names: string[]) { ...  }

const warriors = ['a', 'b', 'c'];

logWarr('hello', ...warriors);

const nums = [1,2,3];
logWarr('born', ...nums);
// Error....
```

## 튜플<a id="4" href="#4">#</a>
고정된 크기의 배열

```ts
let year: [number, string];

year = [53, 'tomy']; // Ok

year = [fale, 'tomy']; // Error
```

### 튜플 할당 가능성<a id="4.1" href="#4.1">#</a>
가변 길이의 배열 타입은 튜틀 타입에 할당할 수 없다.

```ts
// type (boolean | number)[]
const pairLoose = [false, 123];

const pairTuple: [boolean, number] = pairLoose;
// Error ...
```
pairLoose가 [boolean, number] 자체로 선언되었을 경우 pairTuple에 대한 값 할당이 허용되었을 것이다. 하지만 타입스크립트는 튜플 타입의 튜플에 얼마나 많은 멤버가 있는지 알고 있기 때문에 길이가 다른 튜플은 서로 할당할 수 없다.

```ts
const tupleThree: [boolean, number, string] = [false, 1, 'hello'];

const tupleTwo: [boolean, number] = [tupleThree[0], tupleThree[1]];

const tupleTwoEx: [boolean, number] = tupleThree;
// Error
```
#### 나머지 매개변수로서의 튜플
...나머지 매개변수로 전달된 튜플에 정확한 타입 검사를 제공할 수 있다.

```ts
function logPair(name: string, value: number) {
    console.log(name, value);
}

const pairArray = ['Amage', 1];

logPair(...pairArray);
// Error.. (string | number)[]

const pairTupleIncorrect: [number, string] = [1, 'Ameage'];

logPair(...pairTupleIncorrect);
// Error [number, string]

const pairTupleCorrect: [string, number] = ['Ameage', 1];
logPair(...pairTupleCorrect); // Ok

```
나머지 매개변수 튜플을 사용하고 싶다면 여러 번 함수를 호출하는 인수 목록을 배열에 저장해 함께 사용할 수 있다.

```ts
function logTrio(name: string, value: [number, boolean]) {
    console.log(name, value);
}

const trios: [string, [number,boolean]][] = [
    ["Amanitore", [1, true]],
    ["the", [2, false]],
    ["Ann", [3, false]],
];

trios.forEach(trio => logTrio(...trio));

trios.forEach(logTrio); // Error 
// string, [number, boolean]에 [string, [number, boolean]]
```


### 튜플 추론<a id="4.2" href="#4.2">#</a>
타입스크립트는 생성된 배열을 튜블이 아닌 가변 길이의 배열로 취급한다.
배열이 변수의 초깃값 또는 함수에 대한 반환값으로 사용되는 경우, 고정된 크기의 튜플이 아니라 유연한 크기의 배열로 가정한다.

```ts
// type (string | number)[]
function firstCharAndSize(input: string) {
    return [input[0], input.length];
}

// firstChar: string | number
// size: string | number
const [firstChar, size] = firstCharAndSize('gudit');
console.log(firstChar, size);

```
#### 명시적 튜플 타입
함수가 튜플 타입을 반환한다고 선언되고, 배열 리터럴을 반환한다면 해당 배열 리터럴은 일반적인 가변 길이의 배열 대신 튜플로 간주된다.

```ts
// type: [string, number]
function firstCharAndSizeTuple(input: string): [string, number] {
    return [input[0], input.length];
}

// char: string
// size: number
const [char, size] = firstCharAndSizeTuple('Cataty hello');
```
#### const 어서션
const 어서션인 as const연산자를 사용하면 타입을 유추할 때 읽기 전용이 가능한 값 형식을 사용하도록 지시한다.

```ts
// (number | string)[]
const unionArr = [11, 'a'];

// readonly [11, 'a'];
const readOnly = [11, 'a'] as const;
```
const 어서션은 유연한 크기의 배열을 고정된 크기의 튜플로 전환하는 것을 넘어, 해당 튜플이 읽기 전용이고 값 수정이 예상되는 곳에서 사용할 수 없음을 나타낸다.

```ts
const pairMutable: [number, string] = [1157, 'tomeoe'];
pairMutable[0] = 1234; // Ok

const pairAlsoMutable: [number, string] = [1234, 'tttt'] as const;

const pairConst = [1234, 'hello'] as const;
pairConst[0] = 2222;
// Error...
// 읽기 전용으로 수정할 수 없다.

```

실제로 읽기 전용 튜플은 함수 반환에 편리하다. 튜플을 반환하는 함수로부터 반환된 값은 보통 즉시 구조화되지 않으므로 읽기 전용인 튜플은 함수를 사용하는 데 방해가 되지 않는다.
```ts
// 반환 타입 readonly [string, number]
function firstCharAndSizeAsConst(input: string) {
    return [input[0], input.length] as const;
}

// firstChar: string
// size2: number
const [firstChar, size2] = firstCharAndSizeAsConst('Ching shih');
```
