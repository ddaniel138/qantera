import {
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";

import TelegramLoginWidget from "./TelegramLoginWidget";

import { ConnectTelegramBody } from "@/types/socialTask";

interface Props {
    open: boolean;
    onClose: () => void;

    onSuccess: (
        telegram: ConnectTelegramBody
    ) => void;
}

export default function TelegramConnectDialog({
    open,
    onClose,
    onSuccess,
}: Props) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>
                Connect Telegram
            </DialogTitle>

            <DialogContent>
                <TelegramLoginWidget
                    onSuccess={(telegram) => {
                        onSuccess(telegram);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
}