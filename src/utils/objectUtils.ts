


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


export function groupArrayWithPatch(arr: any[], count: number): any[][] {
    const result = arr.reduce<any[][]>((acc, val, i, arr) => {
      if (i % count === 0) {
        acc.push(arr.slice(i, i + count));
      }
      return acc;
    }, []);
  
    // 如果最后一组的元素数量不足 count，向结果中添加空对象，补齐 count 的长度
    const last = result.length - 1;
    if (result[last] != undefined && result[last].length < count) {
      const diff = count - result[last].length;
      for (let i = 0; i < diff; i++) {
        result[last].push({});
      }
    }
  
    return result;
  }