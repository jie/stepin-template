import { i18n } from "@/lang/i18n"

export const ApproveStatus = {
    '0': i18n.global.t('constant.Disapprove'),
    '1': i18n.global.t('constant.Unapprove'),
    '2': i18n.global.t('constant.Approving'),
    '3': i18n.global.t('constant.Approved')
}

export const ApproveStatusOptions = [
    { label: i18n.global.t('constant.Disapprove'), value: '0' },
    { label: i18n.global.t('constant.Unapprove'), value: '1' },
    { label: i18n.global.t('constant.Approving'), value: '2' },
    { label: i18n.global.t('constant.Approved'), value: '3' }
]