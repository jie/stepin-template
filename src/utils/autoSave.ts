
import { message, Modal } from "ant-design-vue";
import { i18n } from "@/lang/i18n";
import { ReportFillStore } from "@/store/report_fill"


const store = ReportFillStore()

export const getFillSession = () => {
  let fillSession = localStorage.getItem("fill_session")
  if (fillSession) {
    return JSON.parse(fillSession)
  } else {
    return null
  }
}

export const autoSaveAPI = async (targetKey: string, dataValue: any) => {
  let fillSession = getFillSession()
  if (!fillSession) {
    message.error(i18n.global.t('base.PleaseLoginFirst'))
    return
  }
  try {
    let values = { [targetKey]: dataValue }
    // if(targetItemKey) {
    //   values = { [targetItemKey]: dataValue }
    // }
    await store.apiFillSingle({
      id: store.report.id,
      values: values,
      email: fillSession.email,
      password: fillSession.password
    })

  } catch (e) {
    console.error(e)
    message.error(i18n.global.t('base.LoginFailByFillToken'))
    return
  }
}