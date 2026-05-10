type EnvironmentConfig = {
    baseUrl: string;
};

const defaultBaseUrl = 'https://4f.com.pl/';

export const environmentConfig: EnvironmentConfig = {
    baseUrl: process.env.BASE_URL ?? defaultBaseUrl,
};

export function buildAppUrl(path: string): string {
    return new URL(path, environmentConfig.baseUrl).toString();
}
