import { format } from 'winston';

export const transformFunction = info => {
    let requestInfo;

    const systemInfo = {
        level: info.level,
        message: info.message,
        service: {
            name: info.service,
            version: info.version,
        },
    };

    if (info.req) {
        requestInfo = {
            requestID: info.req.id,
            http: {
                request: {
                    method: info.req.method,
                },
            },
            url: {
                path: info.req.path,
            },
            source: {
                ip: info.req.ips?.length ? info.req.ips : info.req.ip,
            },
            params: info.reqInfo?.params,
            route: info.reqInfo?.route,
        };
    }

    return { ...systemInfo, ...requestInfo };
};

export default format(transformFunction)();
