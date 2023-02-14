# 10 제네릭

호출하는 방식에 따라 다양한 타입으로 작동하도록 의도할 수 있다.

```ts
// input은 any타입
function identity(input) {
  return input;
}

identity('abc');
identity(123);
identity({ quote: 'abc' });
```

input이 모든 입력을 허용한다면 제네릭을 사용해 타입간의 관계를 알아낸다.

타입스크립트에서 함수와 같은 구조체는 제네릭 타입 매개변수를 원하는 수만큼 선언할 수 있다.
타입 매개변수는 T 나 U 같은 단일 문자 또는 Key, Value 같은 파스칼 케이스를 이용한다.

## 10.1 제네릭 함수

```ts
function identity<T>(input: T) {
  return input;
}
// type: 'abc'
identity('abc');

// type: 123
identity(123);

// type: {quote: string}
identity({ quote: 'abc' });

// ============= 위와 동일

const identity = <T>(input: T) => input;
```

## 10.1.1 명시적 제네릭 호출 타입

제네릭 함수를 호출할 때 대부분의 타입스크립트는 함수가 호출되는 방식에 따라 타입 인수를 유추한다.
하지만 클래스 멤버와 변수 타입과 마찬가지로 때로는 타입 인수를 해석하기 위해 타입스크립트에 알려줘야 하는 함수 호출 정보가 충분치 않을수도 있다.
이런 현상은 타입 인수를 알 수 없는 제네릭 구문이 다른 제네릭 구문에 제공된 경우 주로 발생 한다.

```ts
function logWrapper<Input>(callback: (input: Input) => void) {
  return (input: Input) => {
    console.log('Input:', input);
    callback(input);
  };
}

// (input: string) => void
logWrapper((input: string) => {
  console.log(input.length);
});

// 'input' is of type 'unknown'.
logWrapper((input) => {
  console.log(input.length);
});
```

기본값이 unknown으로 설정되는 것을 피하기 위해 타입스크립트에 해당 타입 인수가 무엇인지 명시적으로 알려주는 **명시적 제네릭 타입 인수**를 사용해 함수를 호출할 수 있다.

```ts
logWrapper<string>((input) => {
  console.log(input.length);
});

// Error
logWrapper<string>((input: boolean) => {
  console.log(input.length);
});
```

변수에 대한 명시적 타입 애너테이션과 마찬가지로 명시적 타입 인수는 항상 제네릭 함수에 지정할 수 있지만 때로는 푤요하지 않다.

```ts
// 둘 중 하나는 지워도 된다
logWrapper<string>((input: string) => {
  console.log(input.length);
});
```

### 10.1.2 다중 함수 타입 매개변수

```ts
function makeTuple<First, Second>(first: First, second: Second) {
  return [first, second] as const;
}

// readonly [boolean, string]
let tuple = makeTuple(true, 'abc');
```

함수가 여러 개의 타입 매개변수를 선언하면 해당 함수에 대한 호출은 명시적으로 제네릭 타입을 모두 선언하지 않거나 모두 선언해야 한다.
타입 스크립트는 아직 제네릭 호출 중 일부 타입만을 유추하지는 못한다.

```ts
function makeTuple<First, Second>(first: First, second: Second) {
  return { first, second };
}

makeTuple('abc', 123);

makeTuple<string, number>('abc', 123);
makeTuple<'abc', 123>('abc', 123);

// Expected 2 type arguments, but got 1.
makeTuple<string>('abc', 123);
```

> 제네릭 구조체에서 두 개보다 많은 타입 매개변수를 사용하지 마라.
> 런타임 함수 매개변수처럼 많이 사용할수록 코드를 읽고 이해하는 것이 점점 어려워진다.

## 10.2 제네릭 인터페이스

인터페이스도 제네릭으로 선언할 수 있다.

```ts
interface Box<T> {
  inside: T;
}

let stringyBox: Box<string> = {
  inside: 'abc',
};

let numberBox: Box<number> = {
  inside: 134,
};
```

타입스크립트에서 내장 Array 메서드는 제네릭 인터페이스로 정의된다.
Array는 타입 매개변수 T를 사용해서 배열 안에 저장된 데이터의 타입을 나타낸다.

### 10.2.1 유추된 제네릭 인터페이스 타입

제네릭 인터페이스의 타입 인수는 유추될 수 있다.

```ts
interface LinkedNode<Value> {
  next?: LinkedNode<Value>;
  value: Value;
}

function getLast<Value>(node: LinkedNode<Value>): Value {
  return node.next ? getLast(node.next) : node.value;
}

// Date
getLast({
  value: new Date('09-13-1999'),
});

// string
getLast({
  next: {
    value: 'banana',
  },
  value: 'apple',
});

// Type 'boolean' is not assignable to type 'number'.
getLast({
  next: {
    value: 123,
  },
  value: false,
});
```

인터페이스가 타입 매개변수를 선언하는 경우, 해당 인터페이스를 탐조하는 모든 타입 애너테이션은 이에 상응하는 타입 인수를 제공해야 한다.

```ts
interface CrateLike<T> {
  contents: T;
}

let missingGeneric: CrateLike = {
  // Error
  inside: '??',
};
```

## 10.3 제네릭 클래스

```ts
class Secret<Key, Value> {
  key: Key;
  value: Value;

  constructor(key: Key, value: Value) {
    this.key = key;
    this.value = value;
  }

  getValue(key: Key): Value | undefined {
    return this.key === key ? this.value : undefined;
  }
}
```

### 10.3.1 명시적 제네릭 클래스 타입

함수 생선자에 전달된 매개변수의 타입으로부터 타입 인수를 유추할 수 있다면 타입스크립트는 유추된 타입을 사용한다.
하지만 생성자에 전달된 인수에서 클래스 타입 인수를 유추할 수 없는 경우에는 타입 인수의 기본값은 unknown이 된다.

```ts
class CurriedCallback<Input> {
  #callback: (input: Input) => void;

  constructor(callback: (input: Input) => void) {
    this.#callback = (input: Input) => {
      console.log('input', input);
      callback(input);
    };
  }

  call(input: Input) {
    this.#callback(input);
  }
}

new CurriedCallback((input: string) => {
  console.log(input.length);
});

new CurriedCallback((input) => {
  // unknown
  console.log(input.length);
});
```

클래스 인스턴스는 다른 제네릭 함수 호출과 동일한 방식으로 명시적 타입 인수를 제공해서 기본값 unknown이 되는 것을 피할 수 있다.

```ts
new CurriedCallback<string>((input) => {
  console.log(input.length);
});

// Error
new CurriedCallback<string>((input: boolean) => {
  console.log(input.length);
});
```

### 10.3.2 제네릭 클래스 확장

```ts
class Quote<T> {
  lines: T;

  constructor(lines: T) {
    this.lines = lines;
  }
}

class SpokenQuote extends Quote<string[]> {
  speak() {
    console.log(this.lines.join('\n'));
  }
}

// type: string
new Quote('hello Mr. Simson').lines;

// number[]
new Quote([1, 2, 3, 4]).lines;

// string[]
new SpokenQuote(['Greed is so ...', 'It destroy']).lines;

// Error
// Argument of type 'number' is not assignable to parameter of type 'string'
new SpokenQuote([1, 2, 3, 4]).lines;

// ========================

class Attribute<Value> extends Quote<Value> {
  speaker: string;

  constructor(value: Value, speaker: string) {
    super(value);
    this.speaker = speaker;
  }
}

new Attribute('the road', 'liky');
```

### 10.3.3 제네릭 인터페이스 구현

기본 인터페이스의 모든 타입 매개변수는 클래스에 선언되어야 한다.

```ts
interface ActiongCredit<Role> {
  role: Role;
}

class MoviePart implements ActiongCredit<string> {
  role: string;
  speaking: boolean;

  constructor(role: string, speaking: boolean) {
    this.role = role;
    this.speaking = speaking;
  }
}

const part = new MoviePart('Mirand', true);

part.role; // string

class IncorrectExtends implements ActiongCredit<string> {
  // Error
  role: boolean;
}
```

### 10.3.4 메서드 제네릭

클래스 메서드는 클래스 인스턴스와 별개로 자체 제네릭 타입을 선언할 수 있다.

```ts
class CreatePairFactory<Key> {
  key: Key;

  constructor(key: Key) {
    this.key = key;
  }

  createPair<Value>(value: Value) {
    return { key: this.key, value };
  }
}

const factory = new CreatePairFactory('role');

// {key: string, value: number}
const numberPair = factory.createPair(10);

// {key: string, value: string}
const stringPair = factory.createPair('sophia');
```

### 10.3.5 정적 클래스 제네릭

클래스의 정적 멤버는 인스턴스 멤버와 구별되고 클래스의 특정 인스턴스와 연결되어 있지 않다.
클래스의 정적 멤버는 클래스 인스턴스에 접근할 수 없거나 타입 정보를 지정할 수 없다.
따라서 정적 클래스 메서드는 자체 타입 매개변수를 선언할 수 있지만 클래스에 선언된 어떤 타입 매개변수에도 접근할 수 없다.

```ts
class BothLogger<OnInstance> {
  instanceLog(value: OnInstance) {
    console.log(value);
    return value;
  }

  static staticLog<OnStatic>(value: OnStatic) {
    // Error: Static members can't reference class type arguments.
    let fromInstance: OnInstance;

    console.log(value);
    return value;
  }
}

const logger = new BothLogger<number[]>();

logger.instanceLog([1, 2, 3]); // number[]

BothLogger.staticLog([false, true]); // boolean[]

BothLogger.staticLog<string>('you can');
```

## 10.4 제네릭 타입 별칭

```ts
type Nullish<T> = T | null | undefined;
```

제네릭 타입 별칭은 일반적으로 제네릭 함수의 타입을 설명하는 함수와 함께 사용된다.

```ts
type CraetesValue<Input, Output> = (input: Input) => Output;

let creator: CraetesValue<string, number>;

creator = (text) => text.length;

creator = (text) => text.toUpperCase();
// Error: Type 'string' is not assignable to type 'number'
```

### 10.4.1 제네릭 판별된 유니언

자바스크립트 패턴과 타입스크립트의 타입 내로잉을 아름답게 결합하게 할 수 있다.
필자가 좋아하는 용도는
데이터의 성공적인 결과 또는 오류로 인한 실패를 나타내는 제네릭 결과 타입을 만들기 위해 타입 인수를 추가하는 것

```ts
type Result<Data> = FailureResult | SuccessfullResult<Data>;

interface FailureResult {
  error: Error;
  succeeded: false;
}

interface SuccessfullResult<Data> {
  data: Data;
  succeeded: true;
}

function handleResult(result: Result<string>) {
  if (result.succeeded) {
    console.log(result.data);
  } else {
    console.error(result.error);
  }

  // Property 'data' does not exist on type 'Result<string>'.
  // Property 'data' does not exist on type 'FailureResult'.
  result.data;
}
```

## 10.5 제네릭 제한자

### 10.5.1 제네릭 기본값

타입 매개변수 선언 뒤에 `=`와 기본 타입을 배치해 타입 인수를 명시적으로 제공할 수 있다.
기본값은 타입 인수가 명시적으로 선언되지 않고 유추할 수 없는 모든 후속 타입에 사용된다.

```ts
interface Quote<T = string> {
  value: T;
}

let explicit: Quote<number> = {
  value: 123,
};

let implicit: Quote = { value: 'be yourself' };

// Type 'number' is not assignable to type 'string'.
let mismatch: Quote = { value: 123 };
```

타입 매개변수는 동일한 선언 안의 앞선 타입 매개변수를 기본값으로 가질 수 있다.
각 타입 매개변수는 선언에 대한 새로운 타입을 도입하므로 해당 선언 이후의 타입 매개변수에 대한 기본값으로 이를 사용할 수 있다.

```ts
interface KeyValuePair<Key, Value = Key> {
  key: Key;
  value: Value;
}

let allExplicit: KeyValuePair<string, number> = {
  key: 'rating',
  value: 10,
};

let oneDefaulting: KeyValuePair<string> = {
  key: 'rating',
  value: 'ten',
};

// Key는 기본값이 없기 때문에 유추 가능하거나 제공되어야 한다
let firstMissing: KeyValuePair = {
  key: 'rating',
  value: 10,
};
```

모든 기본 타입 매개변수는 기본 함수 매개변수처럼 선언 목록의 제일 마지막에 와야 한다.
기본값이 없는 제네릭 타입은 기본값이 있는 제네릭 타입 뒤에 오면 안 된다.

```ts
function inTheEnd<First, Second, Third = number, Fource = string>() {}

// Error
function inTheMiddle<First, Second = boolean, Third = number, Fourth>() {}
```

## 10.6 제한된 제네릭 타입

기본적으로 제네릭 타입에는 클래스, 인터페이스, 원싯값, 유니언, 별칭 등 모든 타입을 제공할 수 있다.
그러나 일부 함수는 제한된 타입에서만 작동해야 한다.
<br>
타입스크립트는 타입 매개변수가 타입을 확장해야 한다고 선언할 수 있으며 **별칭 타입에만 허용되는 작업이다**
타입 매개변수를 제한하는 구문은 매개변수 이름 뒤에 `extends`키워드를 배치하고 그 뒤에 이를 제한할 타입을 배치한다.

```ts
interface WithLength {
  length: number;
}

function logWithLength<T extends WithLength>(input: T) {
  console.log(input.length);
  return input;
}

logWithLength('No one can');
logWithLength([false, true]);
logWithLength({ length: 123 });

// Date에는 length 멤버가 없으므로 오류
logWithLength(new Date());
```

### 10.6.1 keyof와 제한된 타입 매개변수

extends와 keyof를 함께 사용하면 타입 매개변수를 이전 타입 매개변수의 키로 제한할 수 있다.
또한 제네릭 타입의 키를 지정하는 유일한 방법이기도 하다.

```ts
function get<T, Key extends keyof T>(container: T, key: Key) {
  return container[key];
}

const roles = {
  favorite: 'fargo',
  others: ['almost', 'burn', 'nomad'],
};

// string
const favorite = get(roles, 'favorite');
const others = get(roles, 'others');

// Argument of type '"extras"' is not assignable to parameter of type '"favorite" | "others"'.
const missing = get(roles, 'extras');
```

```ts
function get<T>(container: T, key: keyof T) {
  return container[key];
}

const roles = {
  favorite: 'fargo',
  others: ['almost', 'burn', 'nomad'],
};

// string | string[]
const favorite = get(roles, 'favorite');
const others = get(roles, 'others');
```

제네릭 함수를 작성할 때 매개변수의 타입이 이전 매개변수 타입에 따라 달라지는 경우를 알아야 한다.
이런 경우 올바를 매개변수 타입을 위해 제한된 타입 매개변수를 자주 사용하게 된다.

## 10.7 Promise

### 10.7.1 Promise 생성

```ts
class PromiseLike<Value> {
  constructor(executor: (resolve: (value: Value) => void, reject: (reason: unknown) => void) => void) {
    //...
  }
}
```

결과적으로 값을 resolve하려는 Promise를 만들려면 Promise의 타입인수를 명시적으로 선언해야 한다.
타입스크립트는 명시적 제네릭 타입 인수가 없다면 기본적으로 매개변수 타입을 unknown으로 가정한다.
Promise 생성자에 타입 인수를 명시적으로 제공하면 타입스크립트가 결과로서 생기는 Promise 인스턴스의 resolve된 타입을 이해할 수 있다.

```ts
// Promise<unknown>
const resolvesUnknown = new Promise((resolve) => {
  setTimeout(() => resolve('done'), 1000);
});

// Promise<string>
const resolvesString = new Promise<string>((resolve) => {
  setTimeout(() => resolve('done'), 1000);
});
```

Promise의 제네릭 .then 메서드는 반환되는 Promise의 resolve된 값을 나타내는 새로운 타입 매개변수를 받는다.

```ts
// Promise<string>
const textEventually = new Promise<string>((resolve) => {
  setTimeout(() => resolve('done'), 1000);
});

// 타입 Promise<number>
const lengthEventually = textEventually.then((text) => text.length);
```

### 10.7.2 async함수

자바스크립트에서 async 키워드를 사용해 선언한 모든 함수는 Promise를 반환한다.
자바스크립트에서 async 함수에 따라서 반환된 값이 Thenable이 아닌 경우 Promise.resolve가 호출 된 것처럼 Promise로 래핑된다.

```ts
// (text: string) => Promise<number>
async function lengthAfter(text: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return text.length;
}

// (text: string) => Promise<number>
async function lengthImmediately(text: string) {
  return text.length;
}
```

Promise를 명시적으로 언급하지 않더라도 async 함수에서 수동으로 선언된 반환 타입은 항싱 Promise타입이 된다.

## 10.8 제네릭 올바르게 사용하기

타입스크립트의 모범 사례는 필요할 때만 제네릭을 사용하고 제네릭을 사용할 때는 무엇을 위해 사용하는지 명확히 해야 한다.

> 타입스크립트로 작성하는 대부분의 코드에서 혼동을 일으킬 정도록 제네릭을 많이 사용해서는 안된다.
> 그러나 유틸리티 라이브러리에 대한 타입, 특히 범용 모듈은 경우에 따라 제네릭을 많이 사용할 수도 있다.
> 제네릭을 이해하면 이러한 유틸리티 타입을 효과적으로 사용할 수 있다.

### 10.8.1 제네릭 황금률

함수에 타입 매개변수가 필요한지 여부를 판단할 수 있는 간단하고 빠른 방법은 타입 매개변수가 최소 두 번 이상 사용되었는지
확인하는 것이다.
제네릭은 타입 간의 관계를 설명하므로 제네릭 타입 매개변수가 한 곳에만 나타나면 여러 타입 간의 관계를 정의할 수 없다.
따라서 각 함수 타입 매개변수는 매개변수에 사용되어야 하고, 그다음 적어도 하나의 다른 매개변수 또는 함수의 반환 타입에서도 사용되어야 한다.
