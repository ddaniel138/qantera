const EVENT_NAME = "faucet-history-updated";

export function emitFaucetHistoryUpdated() {
    window.dispatchEvent(
        new Event(EVENT_NAME)
    );
}

export function subscribeFaucetHistory(
    callback: () => void
) {
    window.addEventListener(
        EVENT_NAME,
        callback
    );

    return () => {
        window.removeEventListener(
            EVENT_NAME,
            callback
        );
    };
}