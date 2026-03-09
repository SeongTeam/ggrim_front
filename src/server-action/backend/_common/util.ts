"server-only";
import createClient from "openapi-fetch";
import { paths } from "../../../generated/dto-types";
import { serverLogger } from "../../../util/serverLogger";

serverLogger.info(`BACKEND_URL=${process.env.BACKEND_URL} `);
export function getServerUrl(): string {
	const url = process.env.BACKEND_URL;
	if (url === undefined) {
		serverLogger.error(` 'process.env.BACKEND_URL' not read`);
		return "";
	}
	return url;
}

export const client = createClient<paths>({ baseUrl: getServerUrl() });
