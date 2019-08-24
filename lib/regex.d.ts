export declare const startPattern: RegExp;
export declare const endPattern: RegExp;
export declare const slicePattern: RegExp;
export interface ImportMatch {
    pattern: string;
    slice: [number, number] | undefined;
    titleTag: string | undefined;
}
export declare function match(line: string): ImportMatch | undefined;
