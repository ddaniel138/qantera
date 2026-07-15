import {
    useEffect,
    useRef,
} from "react";

import { TELEGRAM_CONFIG } from "@/constants/socialTask";

import { ConnectTelegramBody } from "@/types/socialTask";

declare global {
    interface Window {
        onTelegramAuth?: (
            user: ConnectTelegramBody
        ) => void;
    }
}

interface Props {
    onSuccess: (
        user: ConnectTelegramBody
    ) => void;
}

export default function TelegramLoginWidget({
    onSuccess,
}: Props) {
    const containerRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        window.onTelegramAuth = (
            user: ConnectTelegramBody
        ) => {
            onSuccess(user);
        };

        containerRef.current.replaceChildren();

        const oldScript = document.getElementById(
            "telegram-login-widget"
        );

        if (oldScript) {
            oldScript.remove();
        }

        const script =
            document.createElement("script");

        script.id = "telegram-login-widget";

        script.src =
            "https://telegram.org/js/telegram-widget.js?22";

        script.async = true;

        script.setAttribute(
            "data-telegram-login",
            TELEGRAM_CONFIG.BOT_USERNAME
        );

        script.setAttribute(
            "data-size",
            "large"
        );

        script.setAttribute(
            "data-userpic",
            "false"
        );

        script.setAttribute(
            "data-request-access",
            "write"
        );

        script.setAttribute(
            "data-onauth",
            "onTelegramAuth(user)"
        );

        containerRef.current.appendChild(script);

        const container = containerRef.current;

        return () => {
            window.onTelegramAuth = undefined;
            container.replaceChildren();
        };
    }, [onSuccess]);

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
            }}
        />
    );
}
