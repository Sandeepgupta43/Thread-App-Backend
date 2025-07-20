import UserService, { CreateUserPayload } from "../../services/user";

const queries = {
    getUserToken: async (
        _: any,
        payload: { email: string; password: string }
    ) => {
        const token = await UserService.getUserToken({
            email: payload.email,
            password: payload.password,
        });

        return token;
    },

    getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
        if (context && context.user) {
            const payload = await context.user;

            const user = await UserService.getUserById(payload.id);

            return user;
        }
        throw new Error("Unauthorized: Token is missing or invalid");
    },
};
const mutations = {
    createUser: async (_: any, payload: CreateUserPayload) => {
        const response = await UserService.createUser(payload);
        return "User Created";
    },
};

export const resolvers = { queries, mutations };
