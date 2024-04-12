
/**
 * 初始化目标值为 undefined 的属性
 * @param target 目标对象
 * @param dft 默认值对象
 */
export function initUndefined<T extends Record<string, any>, K extends keyof T>(target: T, dft: Required<Pick<T, K>>) {
  (Object.keys(dft) as K[]).forEach((key) => (target[key] = target[key] ?? dft[key]));
}


export const openNewUrl = (router: any, params: object) => {
  let url = router.resolve(params)
  console.log(`/${url.href}`)
  if(url.href.startsWith('/report_system')) {
    window.open(`${url.href}`, '_blank')
  } else {
    window.open(`/report_system${url.href}`, '_blank')
  }
}