export default {
    createConnection: (connector) => {
        return {
            connect: () => {},
            query: async (query,callback) => {
                return [{}]
            },
            state: "connected"
        }
    }
}