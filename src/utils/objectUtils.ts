


export const copyObject = (data: any) => {
    return JSON.parse(JSON.stringify(data))
}


export function groupArray (arr: any[], count: number): any[][] {
    return arr.reduce<any[][]>((acc, val, i) => {
        if (i % count === 0) {
            acc.push(arr.slice(i, i + count));
        }
        return acc;
    }, []);
}
