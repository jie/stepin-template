import { notification } from 'ant-design-vue';

export interface SysNotification {
    message: string;
    description: string;
    type: string;
    duration?: number;
    onClick?: () => void;
}


export const openNotification = (data: SysNotification) => {
    notification[data.type]({
        message: data.message,
        description: data.description,
        duration: data?.duration || 7,
        onClick: () => {
            if (data?.onClick) {
                data?.onClick()
            }
        }
    })
};
export const successNotification = (action:string) => {
    notification["success"]({
        message: "SUCCESS",
        description: action,
        duration: 5
    })
};