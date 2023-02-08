# 타입 제한자

## 9.1 top 타입

top 타입은 시스템에서 가능한 모든 값을 나타내는 타입.
즉 모든 타입은 top 타입에 할당할 수 있다.

### 9.1.1 any 다시 보기

any 타입은 모든 타입의 위치에 제공될 수 있다는 점에서 top 타입처럼 작동할 수 있다.
any는 일반적으로 console.log의 매개변수와 같이 모든 타입의 데이터를 받아들이는 위치에서 사용한다.
<br/>
다만 any는 타입스크립트가 해당 값에 대한 할당 가능성 또는 멤버에 대해 타입 검사를 수행하지 않도록 명시적으로 지시한다는 문제점을 갖고 있다.

### 9.1.2 unknown

타입스크립트에서 unknown타입은 진정한 top 타입이다.
모든 객체를 unknown 타입의 위치로 전달할 수 있다는 점에서 any 타입과 유사하다
타입스크립트는 unknown 타입의 값을 훨씬 더 제한적으로 취급한다는 점이다.

- 타입스크립트는 unknown 타입 값의 속성에 직접 접근할 수 없다.
- unknown 타입은 top 타입이 아닌 타입에는 할당할 수 없다.

unknown 타입 값의 속성에 접근하려고 시도하면 타입스크립트는 타입 오류를 보고 한다.

```ts
function greet(name: unknown) {
  console.log(name.toUpperCase());
  // Error name is of type unknown
}
```

타입스크립트가 unknown 타입인 name에 접근할 수 있는 유일한 방법은 instanceof나 typeof 또는 타입 어서션을 사용하는 것처럼 값의 타입이 제한되는 경우다.

```ts
function greet(name: unknown) {
  if (typeof name === 'string') {
    console.log(name.toUpperCase());
  } else {
    console.log('well, im off');
  }
}

greet('better');
greet({});
```

unknown이 any 보다 훨씬 안전한 타입으로 사용된다.

## 9.2 타입 서술어

제한된 검사로 이 방법을 직접 사용할 때는 괜찮지만, 로직을 함수로 감싸면 타입을 좁힐 수 없다

```ts
function isNumberOrString(value: unknown) {
  return ['number', 'string'].includes(typeof value);
}

function logValueIfExists(value: number | string | null | undefined) {
  if (isNumberOrString(value)) {
    value.toString();
    // error: 'value' is possibly 'null' or 'undefined'.(1
  } else {
    console.log(value);
  }
}
```

타입스크립트에는 인수가 특정 타입인지 여부를 나타내기 위해 boolean값을 반환하는 함수를 위한 특별한 구문이 있다.
**타입 서술자(type predicate)** 사용자 정의 타입 가드 라고 부른다.
개발자는 instanceof, typeof와 유사한 자체 타입가드를 생성한다. 타입 서술어는 일반적으로 매개변수로 전달된 인수가 매개변수의
타입보다 더 구체적인 타입인지 여부를 나타내는 데 사용된다.

타입 서술어의 반환 타입은 매개변수의 **이름, is 키워드** 특정 타입으로 선언할 수 있다.

```ts
function typePredicate(input: WideType): input is NarrowType;
```

```ts
function isNumberOrString(value: unknown): value is number | string {
  return ['number', 'string'].includes(typeof value);
}

function logValueIfExists(value: number | string | null | undefined) {
  if (isNumberOrString(value)) {
    value.toString();
  } else {
    console.log(value);
  }
}
```

타입 서술어는 단순히 boolean 값을 반환하는 것이 아니라 인수가 더 구체적인 타입임을 나타내는 것이라고 생각할 수 있다.
<br/>
타입 서술어는 이미 한 인터페이스의 인스턴스로 알려진 객체가 더 구체적인 인터페이스의 인스턴스인지 여부를 검사하는데 자주 사용된다.

```ts
interface Comedian {
  funny: boolean;
}

interface StandupComedian extends Comedian {
  routine: string;
}

function isStandupComedian(value: Comedian): value is StandupComedian {
  return 'routine' in value;
}

function workWithComedian(value: Comedian) {
  if (isStandupComedian(value)) {
    console.log(value.routine);
  }

  console.log(value.routine);
  // Error: 'routine' does not exist on type 'Comedian'
}
```

```ts
function isLongString(input: string | undefined): input is string {
  return !!(input && input.length >= 7);
}

function workWithText(text: string | undefined) {
  if (isLongString(text)) {
    console.log(text.length);
  } else {
    console.log(text?.length);
    // Error: 'length' does not exist on type 'never'
    // text를 undefined 타입으로 좁힌다.
  }
}
```

하지만 타입 서술어는 속성이나 값의 타입을 확인하는 것 이상을 수행해 잘못 사용하기 쉬우므로 가능하면 피하는 것이 좋다.
대부분은 간단한 타입 서술어만으로도 충분하다.

## 9.3 타입 연산자

기존 타입의 속성 일부를 반환해서 두 타입을 결합하는 새로운 타입을 생성해야 할 때도 있다.

### 9.3.1 keyof

```ts
interface Ratings {
  audience: number;
  critics: number;
}

function getRating(ratings: Ratings, key: string): number {
  return ratings[key];
  // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Ratings'.
  // No index signature with a parameter of type 'string' was found on type 'Ratings'.
  // 타입 string은 Ratings 인터페이스에서 속성으로 허용되지 않는 값을 허용하고, Ratings는 string 키를 허용하는 인덱스 시그니처를 선언하지 않는다.
}

const ratings: Ratings = { audience: 66, critics: 44 };

getRating(ratings, 'audience');

getRating(ratings, 'not valid');
// 허용되지만 사용하면 안 됨
```

```ts
interface Ratings {
  audience: number;
  critics: number;
}

// 리터럴 유니언 타입으로 타입을 제한해준다
function getRating(ratings: Ratings, key: 'audience' | 'critics'): number {
  return ratings[key];
}

const ratings: Ratings = { audience: 66, critics: 44 };

getRating(ratings, 'audience');

getRating(ratings, 'not valid');
// Error
```

타입스크립트에서는 기존에 존재하는 타입을 사용하고, 해당 타입에 허용되는 모든 키의 조합을 반환하는 keyof 연산자를 제공한다.
타입 애너테이션처럼 타입을 사용하는 모든 곳에서 타입 이름 앞에 keyof 연산자를 배치한다.

```ts
interface Ratings {
  audience: number;
  critics: number;
}

// keyof 연산자를 쓴다
function getRating(ratings: Ratings, key: keyof Ratings): number {
  return ratings[key];
}

const ratings: Ratings = { audience: 66, critics: 44 };

getRating(ratings, 'audience');

getRating(ratings, 'not valid');
```

keyof는 존재하는 타입의 키를 바탕으로 유니언 타입을 생성하는 훌륭한 기능이다.

### 9.3.2 typeof

값의 타입을 수동으로 작성하는 것이 짜증날 정도로 복잡한 경우에 사용하면 매우 유용하다

```ts
const original = {
  medium: 'movie',
  title: 'mean girls',
};

let adaptation: typeof original;

if (Math.random() > 0.5) {
  adaptation = { ...original, medium: 'play' };
} else {
  adaptation = { ...original, medium: 3 };
  // Error 'number' is not assignable to type 'string
}
```

typeof 타입 연산자는 시각적으로 주어진 값이 어떤 타입인지를 반환할 때 사용하는 런타임 typeof 연산자처럼 보이지만 이 둘은 차이가 있다.

- 자바스크립트 typeof: 타입에 대한 문자열 이름을 반환하는 런타임 연산자
- 타입스크립트 typeof: 타입스크립트에서만 사용할 수 있으며 컴파일된 자바스크립트 코드에서는 나타나지 않는다.

#### keyof typeof

typeof는 값의 타입을 검색하고, keyof는 타입에 허용된 키를 검색한다.
두 키워드를 함께 연결해 값의 타입에 허용된 키를 간결하게 검색할 수 있다.

```ts
const ratings = {
  imdb: 8.4,
  metacritic: 83,
};

function logRating(key: keyof typeof ratings) {
  console.log(ratings[key]);
}

logRating('imdb');

logRating('invalid');
// Argument of type '"invalid"' is not assignable to parameter of type '"imdb" | "metacritic"'.
```

keyof와 typeof를 결합해서 사용하면 명시적 인터페이스 타입이 없는 객체에 허용된 키를 나타내는 타입에 대한 코드를 작성하고 업데이트하는 수고를 줄일 수 있다.

## 9.4 타입 어서션(타입 케스트)

타입스크립트는 코드가 강력하게 타입화될 떄 가장 잘 작동한다.
타입 스크립트의 타입 검사기가 복잡한 코드를 이해할 수 있도록 top타입과 타입 가드 같은 기능을 제공한다.

예를 들어 JSON.parse는 의도적으로 top 타입인 any를 반환한다.
JSON.parse에 주어진 특정 문자열값이 특정한 값 타입을 반환해야 한다는 것을 타입 시스템에 안전하게 알릴 수 었는 방법이 없다.

반환 타입에 대해 한 번만 사용되는 제네릭 타입을 추가하는 것은 제네릭의 황금률로 알려진 모범 사례를 위반하는 것이다.

타입 시스템은 어서션을 따르고 값을 해당 타입으로 처리한다.

```ts
const rawData = '["grace", "frankie"]';

// any
let parse = JSON.parse(rawData);

// string[]
let parse1 = JSON.parse(rawData) as string[];

// [string, string]
let parse2 = JSON.parse(rawData) as [string, string];

//["grace", "frankie"]
let parse3 = JSON.parse(rawData) as ['grace', 'frankie'];
```

타입스크립트 모범 사례는 가능한 한 타입 어서션을 사용하지 않는 것이다.

### 9.4.1 포착된 오류 타입 어서션

오류를 처리할 때 타입 어서션이 유용할 수 있다.
catch 블록에서 포착된 오류가 어떤 타입인지 아는 것은 일반적으로 불가능 하다.

게다가 자바스크립트 모범 사례는 항상 Error클래스의 인스턴스를 발생시키지만 일부 프로젝트에서는 문자열 리터럴 또는 다른 의외의 값을 발생 시킨다.

```ts
try {
} catch (error) {
  // Error 클래스의 인스턴스라고 가정하고 error의 message 속성에 접근한다.
  console.warn('on ho', (error as Error).message);
}
```

발생된 오류가 예상된 오류 타입인지를 확인하기 위해 instanceof 검사와 같은 타입 내로잉을 사용하는 것이 더 안전하다.

```ts
try {
} catch (error) {
  // Error 클래스의 인스턴스라고 가정하고 error의 message 속성에 접근한다.
  console.warn('on ho', error instanceof Error ? error.message : error);
}
```

### 9.4.2 non-null 어서션

null과 undefined를 제외한 값의 전체 타입을 작성하는 대신 `!`를 사용하면 된다.즉 non-null 어서션은 타입이 null 또는 undefined가 아니라고 간주한다.

```ts
let maybeDate = Math.random() > 0.5 ? undefined : new Date();

// Date
let assertionDate = maybeDate as Date;

// Date
let notNullDate = maybeDate!;
```

non-null 어서션은 값을 반환하거나 존재하지 않는 경우 undefined를 반환하는 Map.get과 같은 api에서 특히 유용하다.

```ts
const seasonCounts = new Map([
  ['I Love Lucy', 6],
  ['The Gold Girl', 7],
]);

const maybeValue = seasonCounts.get('I Love Lucy');

// number | undefined
// 'maybeValue' is possibly 'undefined'.
console.log(maybeValue.toUpperCase());

// number
const knownValue = seasonCounts.get('I Love Lucy')!;

console.log(knownValue.toUpperCase());
```

### 9.4.3 타입 어서션 주의 사항

any 타입과 마찬가지로 타입 어서션은 타입스크립트의 타입 시스템에 필요한 하나의 도피 수단이다.
따라서 any 타입을 사용할 때처럼 꼭 필요한 경우가 아니라면 가능한 한 사용하지 말아야 한다.
값의 타입에 대해 더 쉽게 어서션하는 것보다 코드를 나타내는 더 정확한 타입을 갖는 것이 좋다.

```ts
const seasonCounts = new Map([
  ['I Love Lucy', 6],
  ['The Gold Girl', 7],
]);

const maybeValue = seasonCounts.get('Broad City')!;

console.log(maybeValue.toUpperCase());

// 타입오류는 아니지만 런타임 오류 발생
// Runtime typeError
```

**어서션 vs. 선언**
변수 타입을 선언하기 위해 타입 애너테이션을 사용하는 것과 초깃값으로 변수 타입을 변경하기 위해 타입 어서션을 사용하는 것 사이에는 차이가 있다.

- 변수 타입 애너테이션과 초깃값 모두 있을떄: 타입스크립트의 타입 검사기는 변수의 타입 애너테이션에 대한 변수의 초깃값에 대해 할당 가능성 검사를 수행
- 타입 어서션: 타입 검사 중 일부를 건너뛰도록 명시적으로 지시한다.

```ts
interface Entertainer {
  acts: string[];
  name: string;
}

// Property 'acts' is missing in type '{ name: string; }' but required in type 'Entertainer'.
const declared: Entertainer = {
  name: 'mon',
};

// 허용 되지만 런타임 에러
const asserted = {
  name: 'hello',
} as Entertainer;
```

타입 애너테이션을 사용하거나 타입스크립트가 초깃값에서 변수의 타입을 유추하도록 하는 것이 매우 바람직 하다.

**어서션 할당 가능성**
일부 값의 타입이 약간 잘못된 상황에서 필요한 작은 도피 수단일 뿐이다.
타입 중 하나가 다른 타입에 할당 가능한 경우에만 두 타입 간의 타입 어서션을 허용한다.
완전히 서로 관련이 없는 두 타입 사이에 타입 어서션이 있는 경우에는 타입스크립트가 타입 오류를 감지하고 알려준다.

```ts
let myValue = 'stella' as number;

// Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other.
// If this was intentional, convert the expression to 'unknown' first.
```

하나의 타입에서 값을 완전히 관련 없는 타입으로 전환해야 하는 경우 이중 타입 어서션을 사용한다.
먼저 any나 unknown 타입으로 전환 후 그 결과를 관련 없는 타입으로 전환한다.
`as unknown as ...` 이중 타입 어서션은 위험하고 거의 항상 코드의 타입이 잘못되었다는 징후를 나타낸다.

## 9.5 const 어서션

가변적인 배열 타입을 읽기 전용 튜플 타입으로 변경하는 as const

as const는 수신하는 모든 타입에 다음 세가지 규칙을 적용한다.

- 배열은 가변 배열이 아니라 읽기 전용 튜플로 취급
- 리터럴은 일반적인 원시 타입과 동등하지 않고 리터럴로 취급
- 객체의 속성은 읽기 전용으로 간주

```ts
// (number | string)[]
let unionArray = [0, ''];

// readonly [0, '']
let constArray = [0, ''] as const;
```

### 9.5.1 리터럴에서 원시 타입으로

타입 시스템이 리터럴 값을 일반적인 원시 타입으로 확장하기보다 특정 리터럴로 이해하는 것이 유용할 수 있다.

```ts
# 원시 타입 대신 특정 리터럴을 반환

 // () => string
const getName = () => 'hello';

// () => 'hello'
const getName2 = () => 'hello' as const;
```

값의 특정 피드가 더 구체적인 리터럴 값을 갖도록 하는 것도 유용하다.

```ts
interface Joke {
  quote: string;
  style: 'style' | 'one-line';
}

function tellJoke(joke: Joke) {
  if (joke.style === 'one-line') {
    console.log(joke.quote);
  } else {
    console.log(joke.quote.split('\n'));
  }
}

const narrowJoke = {
  quote: 'If you stay alive for no other reason do it for spite',
  style: 'one-line' as const,
};

tellJoke(narrowJoke);

const wideObject = {
  quote: 'Time files when you are anxious',
  style: 'one-line',
};
// {quote: string, style: string}
tellJoke(wideObject);
// Argument of type '{ quote: string; style: string; }' is not assignable to parameter of type 'Joke'.
// Types of property 'style' are incompatible.
// Type 'string' is not assignable to type '"style" | "one-line"'.
```

### 9.5.2 읽기 전용 객체

객체 리터럴은 let 변수의 초깃값이 확장되는 것과 동일한 방식으로 속성 타입을 확장한다.
문자열은 string, 배열은 튜플이 아닌 array타입으로...
이러한 값의 일부 또는 전체를 나중에 특정 리터럴 타입이 필요한 위치에서 사용해야 할 때 잘 맞지 않을 수 있다.

`as const`로 어서션 하면 유추된 타입이 가능한 한 구체적으로 전환된다.

- 모든 멤버 속성은 readonly가 된다
- 리터럴은 일반적인 원시 타입 대신 고유한 리터럴 타입으로 간주된다.
- 배열은 읽기 전용 튜플이 된다.

```ts
function describePreference(preference: 'maybe' | 'no' | 'yes') {
  switch (preference) {
    case 'maybe':
      return 'i Suppose';
    case 'no':
      return 'no thanks';
    case 'yes':
      return 'yes';
  }
}

const preferencesMutable = {
  movie: 'maybe',
  standup: 'yes',
};

// Argument of type 'string' is not assignable to parameter of type '"maybe" | "no" | "yes"'.
describePreference(preferencesMutable.movie);

preferencesMutable.movie = 'no';

const preferenceReadonly = {
  movie: 'maybe',
  standup: 'yes',
} as const;

describePreference(preferenceReadonly.movie);

preferenceReadonly.movie = 'no';
// Error
```
