"use strict";
// unknown
/**
 * 타입을 미리 알 수 없는 어떤 값이 있을 때 any 대신 unknown을 사용
 * 타입을 검사해 정재(refine)하기 전까지 타입스크립트가 unknown타입의 값을 사용하지 못하도록 강제한다.
 * (==, ===, ||, &&, ?, !) 연산을 지원한다.
 * js의 typeof, instanceof 연산자로 정제할 수 있다.
 */
const a = 30;
const b = a === 123;
// const c = a + 10; // unknown 타입이므로 숫자와 덧셈 할 수 없다
// typeof를 통해 a의 타입이 number로 정제 되어 블록 스코프 안에서는 숫자와 덧셈으로 사용 가능
if (typeof a === 'number') {
    const d = a + 10;
}
console.log('hello');
