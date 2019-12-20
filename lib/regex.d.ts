export declare const importStartPattern: RegExp;
export declare const importEndPattern: RegExp;
export declare const slicePattern: RegExp;
export declare const indexStartPattern: RegExp;
export declare const indexEndPattern: RegExp;
export interface ImportParams {
    pattern: string;
    slice: [number, number] | undefined;
    titleTag: string | undefined;
}
export interface IndexParams {
    pattern: string;
    tree: boolean;
}
export declare function matchImportStart(line: string): ImportParams | undefined;
export declare function matchIndexStart(line: string): IndexParams | undefined;
