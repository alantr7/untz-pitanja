import untzClasses from "../assets/mapa.json";
const untzClassesKeys = Object.keys(untzClasses);

const code_chars = "abcdefghijklmnoprstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";

export function generateCode(classes: string[]): string {
    let code = "";
    for (const key of classes) {
        const index = untzClassesKeys.indexOf(key);
        const segment = convertToCode(index);

        console.log(index + " -> " + segment);
        code += segment;
    }

    return code;
}

function convertToCode(num: number) {
    const chars = [];
    while (num > 0) {
        const remainder = num % code_chars.length;
        chars.push(code_chars[remainder]);

        num = Math.floor(num / code_chars.length);
    }

    while (chars.length < 2)
        chars.push(code_chars[0]);

    return chars.reverse().join("");
}

function convertToNumber(code: string) {
    let num: number = 0;
    for (let i = 0; i < code.length; i++) {
        num = num * code_chars.length + code_chars.indexOf(code[i]);
    }

    return num;
}

export function validateCode(code: string) {
    const classes: string[] = [];
    for (let i = 0; i < code.length; i += 2) {
        const segment = convertToNumber(code.substring(i, i + 2));
        console.log(code.substring(i, i + 2) + " -> " + segment);

        classes.push(untzClassesKeys[segment]);
    }

    return classes;
}