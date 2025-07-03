export interface CreateUserDTO {
	// email: string;

	password: string;

	username: string;

	// oauth_provider?: string;

	// oauth_provider_id?: string;
}

export interface ReplacePassWordDTO {
	password: string;
}

export interface ReplaceUsernameDTO {
	username: string;
}
