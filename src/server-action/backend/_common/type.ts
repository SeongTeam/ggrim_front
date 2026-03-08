import { components, Pagination } from "../../../generated/dto-types";

type DataType = components["schemas"][keyof components["schemas"]];

export type PaginationResponse<T = DataType> = Omit<Pagination, "data"> & {
	data: T[];
};
