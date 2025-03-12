import handleError from './error/handleError';

type TShutdown = () => Promise<void>;

export const setHandleShutdown = (shutdown: TShutdown) => {
    ['unhandledRejection', 'uncaughtException'].forEach(type => {
        process.on(type as NodeJS.Signals, handleException(shutdown));
    });

    ['SIGTERM', 'SIGINT'].forEach(type => {
        process.once(type as NodeJS.Signals, handleShutdownSignals(shutdown));
    });
};

export const handleException = (shutdown: TShutdown) => {
    return async (error: Error | string) => {
        try {
            handleError(error);

            await shutdown();
            process.exit(0);
        } catch (shutdownError) {
            handleError(shutdownError);
            process.exit(1);
        }
    };
};

export const handleShutdownSignals = (callback: TShutdown) => async (signal: NodeJS.Signals) => {
    try {
        await callback();
    } finally {
        process.kill(process.pid, signal);
    }
};
