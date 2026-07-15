import { TASK_API } from "@/constants/tasks";

export function useConnectX() {
    const connect = () => {
        window.location.href = `${TASK_API.BASE_URL}${TASK_API.LOGIN_X}`;
    };

    return {
        connect,
    };
}