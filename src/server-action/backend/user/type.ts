export type UserRole = "admin" | "user";

export type UserState = "active" | "inactive" | "banned";
export interface User {
	id: string;
	email: string;

	role: UserRole;

	username: string;

	active: UserState;

	last_login_date: Date;
}

export interface ShortUser {
	id: string;
	username: string;
	role: UserRole;
	active: UserState;
}
