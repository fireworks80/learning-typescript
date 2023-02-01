# 인터페이스

---

1. [타입 별칭 vs 인터페이스](#1)
2. 속성 타입
   2.1. [선택적 속성](#2.1)
   2.2. [읽기 전용 속성](#2.2)
   2.3. [함수와 메서드](#2.3)
   2.4. [호출 시그니처](#2.4)
   2.5. [인덱스 시그니처](#2.5)
   2.6. [중첩 인터페이스](#2.6)
3. [인터페이스 확장](#3)
   3.1. [재정의된 속성](#3.1)
   3.2. [다중 인터페이스 확장](#3.2)
4. [인터페이스 병합](#4)
   4.1. [이름이 충돌되는 멤버](#4.1)

---

인터페이스는 별칭으로 된 객체 타입과 여러 면에서 유사하지만 일반적으로 더 읽기 쉬운 오류 메시지,
더 빠른 컴파일러 성능, 클래스와의 더 나은 상호 운용성을 위해 선호된다.

## 1. 타입 별칭 vs 인터페이스<a id="1" href="#1">#</a>

```ts
type Poet = {
  born: number;
  name: string;
};

interface Poet {
  born: number;
  name: string;
}
```

인터페이스에 대한 타입스크립트의 할당 가능성 검사와 오류 메시지는 객체 타입에서 실행되는 것과 거의 동일하다.

- 인터페이스는 속성 증가를 위해 병합 할 수 있다.
- 인터페이스는 클래스가 선언된 구조의 타입을 확인하는 데 사용할 수 있지만 타입 별칭은 사용할 수 없다
- 인터페이스에서 타입스크립트 타입 검사기가 더 빨리 작동한다.
  인터페이스는 타입 별칭이 하는 것처럼 새로운 객체 리터럴의 동적인 복사 붙여넣기보다 내부적으로 더 쉽게 캐시할 수 있는 명명된 타입을 선언한다.
- 인터페이스는 이름 없는 객체 리터럴의 별칭이 아닌 이름 있는(명명된) 객체로 간주되므로 어려운 특이 케이스에서 나타나는 오류 메시지를 좀 더 쉽게 읽을 수 있다.

## 2. 속성 타입

### 1. 선택적 속성<a id="2.1" href="#2.1">#</a>

```ts
interface Book {
  author?: string;
  pages: number;
}

const ok: Book = {
  author: 'Hello',
  pages: 80,
};

const missing: Book = {
  pages: 80,
};
```

### 2. 읽기 전용 속성<a id="2.2" href="#2.2">#</a>

타입스크립트는 속성 이름 앞에 readonly 키워드를 추가해 타른 값으로 설정될 수 없음을 나타낸다. 이러한 readonly 속성은 평소대로 읽을 수 있지만 새로운 값으로 재할당하지 못한다.

```ts
interface Page {
  readonly text: string;
}

function read(page: Page) {
  console.log(page.text);

  page.text += '!';
  //ErrorL  Cannot assign to 'text' because it is a read-only property.
}
```

readonly 제한자는 타입 시스템에만 존재하며 인터페이스에서만 사용할 수 있다. readonly 제한자는 객체의 인터페이스를 선언하는 위치에서만 사용되고 실제 객체에는 적용되지 않는다.

readonly 인터페이스 맴버는 코드 영역에서 객체를 의도치 않게 수정하는 것을 막는 편리한 방법이다.
readonly는 단지 타입스크립트 타입 검사기를 사용해 개발 중에 그 속성이 수정되지 못하도록 보호하는 역할을 한다.

### 3. 함수와 메서드<a id="2.3" href="#2.3">#</a>

- 메서드 구문: 인터페이스 멤버를 member(): void와 같이 객체의 멤버로 호출되는 함수로 선언
- 속성 구문: 인터페이스의 멤버를 member: () => void와 같이 독립 함수와 동일하게 선언

```ts
interface HasBothFunctionTypes {
  property: () => string;
  method(): string;
}

const hasBoth: HasBothFunctionTypes = {
  property: () => '',
  method() {
    return '';
  },
};

hasBoth.property();
hasBoth.method();

// 옵셔널 가능

interface HasBothFunctionTypes {
  property?: () => string;
  method(): string;
}
```

메서드와 속성의 주요 차이점

- 메서드는 readonly로 선언할 수 없지만 속성은 가능
- 타입에서 수행되는 일부 작업은 메서드와 속성을 다르게 처리한다.

현시점에서 추천하는 스타일 가이드

- 기본 함수가 this를 참조할 수 있다는 것을 알고 있다면 메서드 함수를 사용 (가장 일반적으로 클래스의 인스턴스에서 사용)
- 반대의 경우는 속성 함수를 사용

### 4. 호출 시그니처<a id="2.4" href="#2.4">#</a>

인터페이스와 객체 타입은 호출 시그니처로 선언할 수 있다. 호출 시그니처는 값을 함수처럼 호출하는 방식에 대한 타입 시스템의 설명이다.

```ts
type FunctionAlias = (input: string) => number;

interface CallSignature {
  (input: string): number;
}

// Ok
// type: (input: string) => number
const typeFunctionAlias: FunctionAlias = (input) => input.length;

// Ok
// type: (input: string) => number
const typedCallSignature: CallSignature = (input) => input.length;
```

호출 시그니처는 사용자 정의 속성을 추가로 갖는 함수를 설명하는데 사용할 수 있다.

```ts
interface FunctionWithCount {
  count: number;
  (): void;
}

let hasCallCount: FunctionWithCount;

function keepsTrackOfCalls() {
  keepsTrackOfCalls.count += 1;
  console.log('');
}

keepsTrackOfCalls.count = 0;

hasCallCount = keepsTrackOfCalls;

function doesNotHaveCount() {
  console.log(';');
}

hasCallCount = doesNotHaveCount;
//Property 'count' is missing in type '() => void' but required in type 'FunctionWithCount'.
```

### 5. 인덱스 시그니쳐<a id="2.5" href="#2.5">#</a>

인덱스 시그니처 구문을 제공해 인터페이스의 객체가 임의의 키를 받고, 해당 키 아래의 특정 타입을 반환할 수 있음을 나타낸다. 자바스크립트 객체 속성 조회는 암묵적으로 키를 문자열로 변환하기 때문에 인터페이스의 객체는 문자열 키와 함께 가장 일반적으로 사용됩니다. 인덱스 시그니처는 일반 속성 정의와 유사하지만 키 타음에 타입이 있고 `{ [i: string]: ...}` 과 같이 배열의 대괄호를 갖는다.

```ts
interface WordCounts {
  [i: string]: number;
}

const counts: WordCounts = {};

counts.number = 1;
counts.garry = true;
// Type 'boolean' is not assignable to type 'number'.
```

인덱스 시그니처는 객체에 값을 할당할 때 편리하지만 타입 안정성을 완벽하게 보장하지는 않는다. 인덱스 시그니처는 객체가 어떤 속성에 접근하든 간에 값을 반환해야 함을 나타낸다.

```ts
interface DatesByName {
  [i: string]: Date;
}

const publishDates: DatesByName = {
  Frankenstein: new Date(),
};

publishDates.Frankenstein;

console.log(publishDates.Frankenstein.toString());

publishDates.Beloved; // 타입은 Date이지만 런타임 값은 undefined

console.log(publishDates.Beloved.toString());
// 타입 시스템에서는 오류가 나지 않지만 실제 런터임에서는 오류가 발생한다.
```

키/값 쌍을 저장하려고 하는데 키를 미리 알 수 없다면 Map을 사용하는 편이 더 안전하다.
.get 메서드는 항상 키가 존재하지 않음을 나타내기 위해 | undefined 타입을 반환한다.

#### 속성과 인덱스 시그니처 혼합

```ts
interface HistoricalNovels {
  Oroonoke: number;
  [i: string]: number;
}

const novels: HistoricalNovels = {
  Outlander: 1991,
  Oroonoke: 1688,
};
```

속성과 인덱스 시그니처를 혼합해서 사용하는 일반적인 타입 시스템 기법 중 하나는 인덱스 시그니처의 원시 속성보다 명명된 속성에 대해 더 구체적인 속성 타입 리터럴을 사용하는 것이다.

```ts
interface ChapterStarts {
  preface: 0;
  [i: string]: number;
}

const correctPreface: ChapterStarts = {
  preface: 0,
  night: 1,
  shopping: 5,
};

const wrongPreface: ChapterStarts = {
  preface: 1,
  // Type '1' is not assignable to type '0'.
};
```

#### 숫자 인덱스 시그니처

자바스크립트가 암묵적으로 객체 속성 조회 키를 문자열로 변환하지만 때로는 객체의 키로 숫자만 허용하는 것이 바람직할 수 있다. 타입스크립트 인덱스 시그니처는 키로 string 대신 number 타입을 사용할 수 있지만, 명명된 속성은 그 타입을 포괄적인 용도의 string 인덱스 시그니처의 타입으로 할당할 수 있어야 한다.

```ts
interface MoreNarrowNumbers {
  [i: number]: string;
  [i: string]: string | undefined;
}

const mixedNumbersAndStrings: MoreNarrowNumbers = {
  0: '',
  key1: '',
  key2: undefined,
};

interface MoreNarrowStrings {
  [i: number]: string | undefined;
  // 'number' index type 'string | undefined' is not assignable to 'string' index type 'string'.
  [i: string]: string;
}
```

### 6. 중첩 인터페이스<a id="2.6" href="#2.6">#</a>

```ts
interface Novel {
  author: {
    name: string;
  };
  setting: Setting;
}

interface Setting {
  place: string;
  year: number;
}

const myNovel = {
  author: {
    name: 'jane',
  },
  setting: {
    place: 'hello',
    year: 192,
  },
};
```

## 3. 인터페이스 확장<a id="3" href="#3">#</a>

타입스크립트는 인터페이스가 다른 인터페이스의 모든 멤버를 복사해서 선언할 수 있는 확장된 인터페이스를 허용한다. 확장할 인터페이스의 이름 뒤에 extends키워드를 추가해서 다른 인터페이스를 확장한 인터페이스라는 걸 표시한다.

```ts
interface Writing {
  title: string;
}

interface Novella extends Writing {
  pages: number;
}

let myNovella: Novella = {
  pages: 11,
  title: 'hhell',
};

let missingPages: Novella = {
  title: 'helo',
};
// Error: ...
```

인터페이스 확장은 프로젝트의 한 엔티티 타입이 다른 엔티티의 모든 멤버를 포함하는 상위 집합을 나타내는 실용적인 방법이다.

### 1. 재정의된 속성<a id="3.1" href="#3.1">#</a>

파생 인터페이스는 다른 타입으로 속성을 다시 선언해 기본 인터페이스의 속성을 재정의 하거나 대체할 수 있다. 타입스크립트의 타입 검사기는 재정의된 속성이 기본 속성에 할당 되어 있도록 강요한다.

속성을 재선언하는 대부분의 파생 인터페이스는 해당 속성을 유니언 타입의 더 구체적인 하위 집합으로 만들거나 속성을 기본 인터페이스의 타입에서 확장된 타입으로 만들기 위해 사용한다.

```ts
interface WithNullableName {
  name: string | null;
}

interface WithNonNullableName extends WithNullableName {
  name: string;
}

interface WithNumericName extends WithNullableName {
  name: number | string;
}
// Error
```

### 2. 다중 인터페이스 확장<a id="3.2" href="#3.2">#</a>

타입스크립트의 인터페이스는 여러 개의 다른 인터페이스를 확장해서 선언할 수 있다.
파생 인터페이스 이름에 있는 extends 키워드 뒤에 **쉼표**로 인터페이스 이름을 구분해 사용하면 된다. 파생 인터페이스는 모든 기본 인터페이스의 모든 멤버를 받는다

```ts
interface GivesNumber {
  giveNumber(): number;
}

interface GivesString {
  giveString(): string;
}

interface GivesBothAndEither extends GivesNumber, GivesString {
  giveEither(): number | string;
}

function useGivesBoth(instance: GivesBothAndEither) {
  instance.giveEither(); // number | string
  instance.giveNumber(); // number
  instance.giveString(); // string
}
```

## 4. 인터페이스 병합<a id="4" href="#4">#</a>

인터페이스의 중요한 특징 중 하나는 서로 병합하는 능력입니다. 두개의 인터페이스가 동일한 이름으로 동일한 스코프에 선언된 경우, 선언된 모든 필드를 포함하는 더 큰 인터페이스가 코드에 추가된다.

```ts
interface Merged {
  fromFirst: string;
}

interface Merged {
  fromSecond: number;
}

// 다음과 같다
interface Merged {
  fromFirst: string;
  fromSecond: number;
}
```

일반적인 타입스크립트 개발에서는 인터페이스 병합을 자주 사용하지는 않는다. 인터페이스가 여러 곳에 선언되면 코드를 이해하기 어려워지므로 가능하면 인터페이스 병합을 사용하지 않는 것이 좋다.

그러나 인터페이스 병함은 외부 패키지 또는 Window 같은 내장된 전역 인터페이스를 보강하는 데 특히 유용하다

### 4.1. 이름이 출될되는 멤버<a id="4.1" href="#4.1">#</a>

병합된 인터페이스는 타입이 다른 동일한 이름의 속성을 여러 번 선언할 수 없다. 속성이 이미 인터페이스에 선언되어 있다면 나중에 병합된 인터페이스에도 동일한 타입을 사용해야 한다.

```ts
interface MergedProperties {
  same: (input: boolean) => string;
  different: (input: string) => string;
}

interface MergedProperties {
  same: (input: boolean) => string;
  different: (input: number) => string;
  // Error.
}
```

그러나 병합된 인터페이스는 동일한 이름과 다른 시그니처를 가진 메서드는 정의할 수 있다. 이렇게 하면 메서드에 대한 함수 오버로드가 발생한다.

```ts
interface MergedMethods {
  different(input: string): string;
}

interface MergedMethods {
  different(input: number): string;
}
```
