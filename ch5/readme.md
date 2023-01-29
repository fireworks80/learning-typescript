# 함수

> 한쪽 끝에는 함수 인수가 있고
> 다른 쪽 끝에는 반환 타입이 있습니다.

- - -
1. [함수 매개변수](#1)
  1.1 [필수 매개변수](#1.1)
  1.2 [선택적 매개변수](#1.2)
  1.3 [선택적 매개변수](#1.3)
  1.4 [선택적 매개변수](#1.4)
2. [반환 타입](#2)
  2.1. [명시적 반환 타입](#2.1)
3. [함수 타입](#3)
  3.1. [함수 타입](#3.1)
  3.2. [매개변수 타입 추론](#3.2)
  3.3. [함수 타입 별칭](#3.3)
4. [그 외 반환 타입](#4)
  4.1. [void 반환 타입](#4.1)
  4.2. [void 반환 타입](#4.2)
5. [함수 오버로드](#5)
  5.1. [함수 오버로드](#5.1)
- - -

## 함수 매개변수<a id="1" href="#1">#</a>

```ts

function sing(song) {
  console.log(song);
}
```
명시적 타입 정보가 선언되지 않으면 절대 타입을 알 수 없다.
타입스크립트가 이를 any 타입으로 간주한다.


```ts

function sing(song: string) {
  console.log(song);
}
```
코드를 유효한 타입스크립트 구문으로 만들기 위해 함수 매개변수에 적절한 타입 애너테이션을 추가할 필요는 없다.
타입스크립트는 타입 오류를 알리지만 이미 시작된 자바스크립트는 계속 실행된다.


### 필수 매개변수<a id="1.1" href="#1.1">#</a>
자바스크립트는 인수의 수와 상관없이 함수를 호출할 수 있다.
하지만 타입스크립트는 함수에 선언된 모든 매개변수가 필수라고 가정한다.
함수가 잘못된 수의 인수로 호출되면 타입스크립트는 타입 오류의 형태로 이의를 제기한다.


### 선택적수 매개변수<a id="1.2" href="#1.2">#</a>
타입 애너테이션의 `:`앞에 `?`를 추가해 매개변수가 선택적이라고 표시한다.
함수 호출에 선택적 매개변수를 제공할 필요는 없다. 선택적 매개변수에는 항상 `| undefined`가 유니언 타입으로 추가되어 있다.

```ts
function announceSong(song: string, singer?: string) {
  console.log(song);

  if (singer) {
    console.log(singer);
  }
}

announceSong('green');  // ok
announceSong('green', undefined);  // ok
announceSong('green', 'siz');  // ok
```
선택적 매개변수는 항상 암묵적으로 undefined가 될 수 있다.
<br/>
선택적 매개 변수는 | undefined를 포함하는 유니언 타입 매개변수와는 다르다.
?으로 표시된 선택적 매개변수가 아닌 매개변수는 값이 명시적으로 undefined일지라도 항상 제공되어야 한다.

```ts
function announce(song: string, singer: string : undefined) { /*...*/}

announce('green');
// Error: Expected 2 arguments, but got 1.
```
**함수에서 사용되는 모든 선택적 매개변수는 마지막 매개변수여야 한다.**
필수 매개변수 전에 선택적 매개변수를 위치시키면 구문오류 발생

```ts
function announce(singer?: string, song: string) {}
// Error: A required parameter cannot follow an optional parameter.

```


### 기본 매개변수<a id="1.3" href="#1.3">#</a>
선택적 매개변수에는 기본적으로 값이 제공되기 때문에 해당 타입스크립트 타입에는 암묵적으로 함수 내부에  `| undefined`유니언 타입이 추가된다.

매개변수에 기본값이 있고 타입 애너테이션이 없는 경우, 타입스크립트는 해당 기본값을 기반으로 매개변수 타입을 유추한다.

```ts
function rateSong(song: string, rating = 0) { }

  rateSong('photograph'); // Ok
  rateSong('photograph', 5); // Ok
  rateSong('photograph', undefined); // Ok
  rateSong('photograph', 100); 
  // Error: Argument of type '100' is not assignable to parameter of type 'number | undefined'
```

### 나머지 매개변수<a id="1.4" href="#1.4">#</a>
인수 배열을 나타내기 위해 끝에 `[]`구문이 추가된다.
아래 예제는 나머지 매개변수에 대해 0개 이상의 string 타입 인수를 사용할 수 있다.
```ts
function singAllTheSong(singer: string, ...songs: string[]) {}

singAllTheSong('alice'); // ok
singAllTheSong('alice', 'bad', 'just', 'poker'); // ok

```
## 반환 타입<a id="2" href="#2">#</a>
함수가 반환할 수 있는 가능한 모든 값을 이해하면 함수가 반환하는 타입을 알 수 있다.

```ts
// 타입: (songs: string[]) => number
function sing(songs: string[]) {
  return songs.length;
}

```
함수에 다른 값을 가진 여러 개의 반환문을 포함하고 있다면, 타입스크립트는 반환 타입을 가능한 모든 반환 타입의 조함으로 유추한다.

```ts
// (song: string[], index: number) => string | undefined;
function getSongAt(songs: string[], index: number) {
  return index < songs.length ? songs[index] : undefined;
}

```

### 명시적 반환 타입<a id="2.1" href="#2.1">#</a>
변수와 마친가지로 타입 애너테이션을 사용해 함수의 반환 타입을 명시적으로 선언하지 않는 것이 좋다.
그러나 특히 함수에서 반환 타입을 명시적으로 선언하는 방식이 유용할 때가 종종 있다.
<br/>
> - 가능한 반환값이 많은 함수가 항상 동일한 타입의 값을 반환하도록 강제 한다.
> - 타입스크립트는 재귀 함수의 반환 타입을 통해 타입을 유추하는 것을 거부한다.
> - 수백 개 이상의 타입스크립트 파일이 있는 매우 큰 프로젝트에서 타입스크립트 타입 검사 속도를 높일 수 있다.

```ts
// 함수 선언
function a(): number {}

// 화살표 함수
const a = (): number => {}

```
## 함수 타입<a id="3" href="#3">#</a>

```ts
// 매개 변수는 없고 string 타입을 반환하는 함수
let nothing: () => string;
```

```ts
// string[] 매개변수와 선택적 매개변수 및 number 값을 반환하는 함수
let inputAndOutput: (song: string[], count?: number) => number;
```
함수 타입은 콜백 매개변수를 설명하는 데 자주 사용된다.

```ts
const songs = ['juice', 'shake'];

function runOnSongs(getSongAt: (index: number) => string) { }

function getSongAt(index: number) {
  return songs[index];
}

runOnSongs(getSongAt); // ok

function logSong(song: string) {
  return song;
}

runOnSong(logSong); // 
// Error: Argument of type '(song: string) => string' is not assignable to parameter of type '(index: number) => string'
```
두 함수를 서로 할당할 수 없다는 오류를 출력할 때 타입스크립트는 일반적으로 세 가지 상세한 단계를 제공한다.

> 1. 첫 번째 들여쓰기 단계는 두 함수 타입을 출력한다.
> 2. 다음 들여쓰기 단계는 일치하지 않는 부분을 지정한다.
> 3. 마지막 들여쓰기 단계는 일치하지 않는 부분에 대한 정확한 할당 가능성 오류를 출력한다.


### 함수 타입 괄호<a id="3.1" href="#3.1">#</a>

```ts
// string | undefined 유니언을 반환하는 함수
let returnStringOrUndefined: () => string | undefined;

// undefined나 string을 반환하는 함수
let maybeReturnString: (() => string) | undefined;
```


### 매개변수 타입 추론<a id="3.2" href="#3.2">#</a>
선언된 타입의 위치에 제공된 함수의 매개변수 타입을 유추할 수 있다.

```ts
let singer: (song: string) => string;

singer = function(song) {
  // song: string의 타입
  return song.toUpperCase(); // ok
}

```
함수를 매개변수로 갖는 함수에 인수로 전달된 함수는 해당 매개변수 타입도 잘 유추할 수 있다.

```ts
const songs = [...];

// song: string;
// index: number;

songs.forEach((song, index) => {...})

```
### 함수 타입 별칭<a id="3.3" href="#3.3">#</a>
```ts
type StringToNumber = (input: string) => number;

let stringToNumber: StringToNumber; 

stringToNumber = (input) => input.length; // ok
stringToNumber = (input) => input.toUpperCase(); 
// Error: type 'string' is not assignable to type 'number'
```

```ts
type NumberToString = (index: number) => string;

function useNumberToString(numberToString: NumberToString) {}

 useNumberToString((input) => `${input} Hooray`); // Ok
 useNumberToString((input) => input * 2);
 // Error: type 'number' is not assignable to type 'string'
```
타입 별칭은 특히 함수 타입에 유용하다.
타입 별칭을 이용하면 반복적으로 작성하는 매개변수와 반환 타입을 갖는 코드 공간을 많이 절약할 수 있다.


## 그 외 반환 타입<a id="4" href="#4">#</a>
void, never

### void 반환 타입<a id="4.1" href="#4.1">#</a>
어떤 값도 반환하지 않는다.
return 문이 없거나 값을 반환 하지 않는 return문을 가진 함수

```ts
function logSong(song: string|undefined): void {
  if(!song) return; // ok

  console.log(song);

  return true;
  // Error: type 'boolean' ....
}

```
자바스크립트 함수는 실젯값이 반환되지 않으면 기본으로 모두 undefined를 반환하지만 void는 undefined와 같지 않다. void는 함수의 반환 타입이 무시된다는 것을 의미하고 undefined는 반환된 리터럴 값이다. undefined를 포함하는 대신 void 타입의 값을 할당하려고 하면 타입 오류가 발생

```ts
function returnsVoid() { return; }

let lazyValue: string | undefined;

lazyValue = returnsVoid();
// Error: type 'void' is not assignable to type string|undefined

```
void 타입은 함수의 반환값이 자체적으로 반환될 수 있는 값도 아니고, 사용하기 위한 것도 아니라는 표시임을 기억해야 한다.


### never 반환 타입<a id="4.2" href="#4.2">#</a>
never반환 함수는 (의도적으로) 항상 오류를 발생시키거나 무한 루프를 실행하는 함수

함수가 절대 반환하지 않도록 의도하려면 명시적:  never 타입 에너테이션을 추가해 해당 함수를 호출한 후 모든 코드가 실행되지 않음을 나타낸다.

```ts
function fail(message: string): never {
  throw new Errror();
}

function workWithUnsafeParam(param: unknown) {
  if (typeof param !== 'string') {
    fail('...');
  }

  // 여기에서 param의 타입은 string으로 알려진다.
  param.toUpperCase(); // ok
}
```
> never는 void와 다르다. void는 아무것도 반환하지 않는 함수를 위한 것이고, never는 절대 반환하지 않는 함수를 위한 것이다.


## 함수 오버로드<a id="5" href="#5">#</a>
선택적 매개변수와 나머지 매개변수만으로 표현할 수 없는 매우 다른 매개변수들로 호출될 수 있다.
이런 함수는 오버로드 시그니처라고 불리는 타입스크립트 구문으로 설명 가능하다.

하나의 최종 구현 시그니처와 그 함수의 본문 앞에 서로 다른 버전의 함수 이름, 매개변수, 반환 타입을 여러 번 선언 한다.

오버로드된 함수 호출에 대해 구문 오류를 생성할지 여부를 결정할 떄 타입스크립트는 함수의 오버로드 시그니처만 확인한다. 구현 시그니처는 함수의 내부 로직에서만 사용한다.

```ts
function createData(timestamp: number): Date;
function createDate(month: number, day: number, year: number): Date;
function createDate(monthOrTimeStamp: number, day?: number, year?: number) {
  return ...;
}

createDate(54332423423); // ok
createDate(7, 24, 1987); // ok
createDate(4, 1);
// Error: No overload expects 2 arguments, but overloads
// do exist that expect either 1 or 3 arguments. 
```

> 함수 오버로드는 복잡하고 설명하기 어려운 함수 타입에 사용하는 최후의 수단이다. 함수를 단순하게 유지하고 가능하면 함수 오버로드를 사용하지 않는 것이 좋다


### 호출 시그니처 호환성<a id="5.1" href="#5.1">#</a>
함수의 오버로드 시그니처에 있는 반환 타입과 각 매개변수는 구현 시그니처에 있는 동일한 인덱스의 매개변수에 할당할 수 있어야 한다. 즉 구현 시그니처는 모든 오버로드 시그니처와 호환되어야 한다.

```ts
function format(date: string): string;
function format(date: string, needle: string): string;

function format(getDate: () => string): string; 
// Error: 

function format(date: string, needle?: string, haystack?: string) {
  return ....;
}

```