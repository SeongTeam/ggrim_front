/**
 * URL이나 직접적인 string값 또는 데이터 이름을 감추기 위해서 사용
 * ex) cld content ID에서 사용
 *      DB에서 인코딩한 문자를 저장, 프런트로 보내진 인토딩 문자 디코딩해서 사용
 */

const SHIFT: string = process.env.CAESAR_SHIFT ?? '';

// TODO: 보안성 강화
// - [ ]  추후 DB에서 정의해서 변경 예정
//  -> 고장된 값은 보안에 안 좋음
// - [ ] <추가 작업>
// ! 주의: <경고할 사항>
// ? 질문: <의문점 또는 개선 방향>
// * 참고: <관련 정보나 링크>
class CaesarCipher {
    private shift: number;

    constructor() {
        this.shift = parseInt(SHIFT, 10) % 26; // 알파벳 개수(26)로 나눈 나머지로 shift 값 제한
    }

    // 카이사르 암호 인코딩 메서드
    encode(text: string): string {
        return this.transform(text, this.shift);
    }

    // 카이사르 암호 디코딩 메서드
    decode(text: string): string {
        return this.transform(text, -this.shift);
    }

    // 문자 변환 로직
    private transform(text: string, shift: number): string {
        return text
            .split('')
            .map((char) => this.shiftChar(char, shift))
            .join('');
    }

    // 단일 문자 변환
    private shiftChar(char: string, shift: number): string {
        if (char >= 'a' && char <= 'z') {
            // 소문자 변환
            return String.fromCharCode(((char.charCodeAt(0) - 97 + shift + 26) % 26) + 97);
        } else if (char >= 'A' && char <= 'Z') {
            // 대문자 변환
            return String.fromCharCode(((char.charCodeAt(0) - 65 + shift + 26) % 26) + 65);
        }
        // 알파벳이 아닌 문자는 그대로 반환
        return char;
    }
}

export default CaesarCipher;

// 사용 예시
/*
const cipher = new CaesarCipher(3); // shift를 3으로 설정
const encoded = cipher.encode('Hello, World!');
console.log('Encoded:', encoded); // "Khoor, Zruog!"
const decoded = cipher.decode(encoded);
console.log('Decoded:', decoded); // "Hello, World!"
*/
