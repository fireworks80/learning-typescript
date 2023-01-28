# 객체

1. [객체 타입](#1)
  1.[객체 타입 선언](#1.1)
  2.[별칭 객체 타입](#1.2) 
2. [구조적 타이핑](#2)
  1.[사용검사](#2.1)
  2.[초과 속성 검사](#2.2)
  3.[중첩된 객체 타입](#2.3)
  4.[선택적 속성](#2.4) 
3. [객체 타입 유니언](#3)
  1.[유추된 객체 타입 유니언](#3.1)
  2.[명시된 객체 타입 유니언](#3.2)
  3.[객체 타입 내로잉](#3.3)
  4.[판별괸 유니언](#3.4)
4. [교차 타입](#4)
  1.[교차 타입의 유험성](#4.1)
5. [마치며](#5)

---

> 객체 리터럴은 각자의 타입이 있는
>
> 키와 값의 집합니다.

<em>복잡한 객체 형태를 설명하는 방법과 타입스크립트가 객체의 할당 가능성을 확인하는 방법에 대해 배운다.</em>

## 1 객체 타입<a id="1" href="1">#</a>

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

## 2 구조적 타이핑 <a id="2" href="#2">#</a>

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

### 2.3 중첩된 객체 타입<a id="2.3" href="2.3">#</a>

```ts
type Poem = {
  author: {
    firstName: string;
    lastName: string;
  };
  name: string;
};

//Ok
const poemMatch: Poem = {
  author: {
    firstName: 'Sylvia',
    lastName: 'Plath',
  },
  name: 'Lady Lazarus',
};

const poemMismatch: Poem = {
  author: {
    name: 'Sylvia plath',
    // Error Type `{name: string}` is not assignable
    // to type '{firstName: string; lastName: string;}'
    // ...
  },
  name: 'Tulips',
};
```

Poem 타입을 작성할 때 author 속성의 형태를 자체 별칭 객체 타입으로 추출하는 방법도 있다.
\*\*중첩된 타입을 자체 타입 별칭으로 추출하면 타입스크립트의 타입 오류 메시지에 더 많은 정보를 담을 수 있다.

```ts
type Author = {
  firstName: string;
  lastName: string;
};

type Poem = {
  author: Author;
  name: string;
};

const poemMismatch: Poem = {
  author: {
    name: 'Sylvia plath',
    // Error Type `{name: string}` is not assignable
    // to type 'Author'
    // ...
  },
  name: 'Tulips',
};
```

> - 이처럼 중첩된 객체 타입을 고유한 타입 이름으로 바꿔서 사용하면 코드와 오류 메시지가 더 읽기 쉬워진다

### 2.4 선택적 속성<a id="2.4" href="2.4">#</a>

타입 속성 에너테이션에서 `:` 앞에 `?`를 추가하면 선택적 속성임을 나타낼 수 있다.

```ts
type Book = {
  author?: string;
  pages: number;
};

// Ok
const ok: Book = {
  author: 'Rita Dove',
  pages: 80,
};

const missing: Book = {
  // Error: Property 'pages' is missing in type
  // `{pages: number}` but required in type 'Book'
  author: 'Rita dove',
};
```

선택적 속성과 undefined를 포함한 유니언 타입의 속성 사이에는 차이가 있다.
`?`를 사용해 선택적으로 선언된 속성은 존재하지 않아도 된다.
필수로 선언된 속성과 `| undefined` 는 그 값이 undefined일지라도 반드시 존재해야 한다.

```ts
type Writers = {
  author: string | undefined;
  editor?: string;
};

// Ok
const hasRequired: Writers = {
  author: undefined,
};

const missingRequired: Writers = {};
// Error: Property 'author' is missing in type '{}' but required in tpye 'Writers'
```

## 3 객체 타입 유니언<a id="3" href="3">#</a>

### 3.1 유추된 객체 타입 유니언<a id="3.1" href="3.1">#</a>

유니언 타입은 가능한 각 객체 타입을 구성하고 있는 요소를 모두 가질 수 있다.
객체 타입에 정의된 각각의 가능한 속성은 비록 초깃값이 없는 선택적(?) 타입이지만 각 객체 타입의 구성 요소로 주어진다.

```ts
const poem = Math.random() > 0.5 ? { name: 'The Double Image', pages: 7 } : { name: 'Her Kind', rhymes: true };

// 타입:
/*
  {
    name: string;
    pages: number;
    rhymes?: undefined;
  }
  |
  {
    name: string;
    pages?: undefined;
    rhymes: boolean;
  }
  */
poem.name; // string;
poem.pages; // number | undefined
poem.rhymes; // boolean | undefined
```

### 3.2 명시된 객체 타입 유니언<a id="3.2" href="3.2">#</a>

객체 타입의 조합을 명시하면 객체 타입을 더 명확히 정의할 수 있다.
특히 값의 타입이 객체 타입으로 구성된 유니언이라면 타입스크립트의 타입 시스템은 이런 모든 유니언 타입에 존재하는 속성에 대한 접근만 허용한다.

```ts
type PoemWithPages = {
  name: string;
  pages: number;
};

type PoemWithRhymes = {
  name: string;
  rhymes: boolean;
};

type Poem = PoemWithPages | PoemWithRhymes;

const poem: Poem = const poem = Math.random() > 0.5 ? { name: 'The Double Image', pages: 7 } : { name: 'Her Kind', rhymes: true };

poem.name; //Ok

poem.pages;
// Error: Property 'pages' does not exist on type 'Poem'
// Error: Property 'pages' does not exist on type 'PoemWithRhymes'

poem.rhymes;
// Error: Property 'rhymes' does not exist on type 'Poem'
// Error: Property 'rhymes' does not exist on type 'PoemWithPages'

```

값이 여러 타입 중 하나일 경우, 모든 타입에 존재하지 않는 속성이 객체에 존재할 거라 보장할 수 없다.

### 3.3 객체 타입 내로잉<a id="3.3" href="3.3">#</a>

타입 검사기가 유니언 타입 값에 특정 속성이 포함된 경우에만 코드 영억을 실행할 수 있음을 알게 되면, 값이 타입을 해당 속성이 포함된 경우로만 좁힐 수 있다.
즉 코드에서 객체의 형태를 확인하고 타입 내로잉이 객체에 적용된다.

```ts
// 명시적으로 입력된 poem 예제

if ('pages' in poem) {
  poem.pages; // ok
} else {
  poem.rhymes; //ok
}
```

타입스크립트는 `if (poem.pages)`와 같은 형식으로 참 여부를 확인하는 것을 허용하지 않는다. <br/>
존재하지 않는 객체 속성에 접근하려고 시도하면 타입 가드처럼 작동하는 방식으로 사용되더라도 타입 오류로 간주된다.

### 3.4 판별된 유니언<a id="3.4" href="3.4">#</a>

객체의 속성이 객체의 형태를 나타내도록 하는 것이다.
타입 내로잉 없이는 값에 존재하는 속성을 보장할 수 없다.

```ts
type PoemWithPages = {
  name: string;
  pages: number;
  type: 'pages';
};

type PoemWithRhymes = {
  name: string;
  rhymes: boolean;
  type: 'rhymes';
};

type Poem = PoemWithPages | PemWithThymes;

const poem: Poem = Math.random() > 0.5
            ? {name: 'The Double', pages: 7, type: 'Page'}
            : {name: 'Her', rhymes: true, type: 'rhymes'}
if (poem.type === 'pages') {
  console.log`'It's got page: ${poem.pages}`); // ok
} else {
  console.log(`It rhymes: ${poem.rhymes}`);
}

poem.type; // 타입 : 'pages' | 'rhymes'
poem.pages;
// Error: Property 'pages' does not exist on type 'Poem'
// Property 'pages' does not exist on type 'PoemWithRhymes'
```

판별된 유니언은 우아한 자바스크립트 패턴과 타입스크립트의 타입 내로일을 아름답게 결합한다.
[10장]()`제네릭`에서 제네릭 데이터 운영을 위해 판별된 유니언을 사용하는 방법을 알아본다.

### 4 교차 타입(&)<a id="4" href="4">#</a>

교차 타입은 일반적으로 여러 기존 객체 타입을 별칭 객체 타입으로 결합해 새로운 타입을 생성한다.

```ts
type Artwork = {
  genre: string;
  name: string;
};

type Writing = {
  pages: number;
  name: string;
};

type WrittenArt = Artwork & Writing;

/*
// 다음과 같음
{
  genre: string;
  name: string;
  pages: number;
}

*/
```

교차타입은 유니언 타입과 결합할 수 있고, 이는 하나의 타입으로 판별된 유니언 타입을 설명하는 데 유용하다.

```ts
type ShortPoem = { author: string } & ({ kigo: string; type: 'haiku' } | { meter: number; type: 'villanelle' });

// ok
const morningGlory: ShortPoem = {
  author: 'Fuku',
  kigo: 'Morning',
  type: 'haiku',
};

const oneArt: ShortPoem = {
  author: 'Elizabeth',
  type: 'villane',
};

//Type '{ author: string; type: "villanelle"; }' is not assignable to type 'ShortPoem'.
//Type '{ author: string; type: "villanelle"; }' is not assignable to type '{ author: string; } & { meter: number; type: "villanelle"; }'.
//Property 'meter' is missing in type '{ author: string; type: "villanelle"; }' but required in type '{ meter: number; type: "villanelle"; }'.
```

### 4.1 교차 타입의 위험성<a id="4.1" href="4.1">#</a>

개발자나 타입스크립트 컴파일러를 혼동시키는 방식으로 사용하기 쉽다. 교차 타입을 사용할 때는 가능한 한 코드를 간결하게 유지해야 한다.

**긴 할당 가능성 오류**
유니언 타입과 결합하는 것처럼 복잡한 교차 타입을 만들면 할당 가능성 오류 메시지는 일기 어려워 진다.
이전 코드 스니펫의 ShortPoem의 경우 타입스크립트가 해당 이름을 출력하도록 타입을 일련의 별칭으로 된 객체 타입으로 분할하면 읽기 훨씬 쉬워진다.

```ts
type ShortPoemBase = {author: string};
type Haiku = ShortPoemBase & {kigo: string; type: 'haiku';}
type Villanelle = ShortPoemBase & {meter: number; type: 'Villanelle';}
type ShortPoem = Haiku | Villanelle;

...

```

**never**
두개의 원시 타입을 함께 시도하면 never 키워드로 표시되는 never 타입이 된다.

```ts
type NotPossible = number & string; // 타입: never
```

never 키워드와 never타입은 프로그래밍 언어에서 bottom 타입 또는 empty 타입을 뜻한다.
bottom 타입은 가질수도 참조 할 수도 없는 타입이므로 bottom 타입에 그 어떤 타입도 제공할 수 없다.
<br/>
대부분의 타입스크립트 프로젝트는 never타입을 거의 사용하지 않지만 코드에서 불가능한 상태를 나타내기 위해 가끔 등장한다.
하지만 대부분 교차 타입을 잘못 사용해 발생한 실수일 가능성이 높다.[15장 타입 운영]()에서 자세히

### 5 마치며<a id="5" href="5">#</a>

- 객체 타입 리터럴의 타입을 해석하는 방법
- 중첩과 선택적 속성을 포함한 객체 리터럴 타입 소개
- 객체 리터럴 타입의 유니언 타입 선언, 추론 및 타입 내로잉
- 판별된 유니언 타입과 판별값
- 교차 타입으로 객체 타입을 결합하는 방법
