import siteConfig from "@/config";

const production = true; // process.env.NODE_ENV === 'production';

const API_HOST = production? `https://api.sinaionline.com.br` : `http://localhost:4001`
export const API_URL = `${API_HOST}/api/v1/agencies/${siteConfig.code}`

export const API_TOKEN = process.env.API_TOKEN || ''
