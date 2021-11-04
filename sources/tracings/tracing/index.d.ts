declare module '@intendant/tracing' {
    class Tracing {
        public static verbose(object: String, message: String): Boolean;
        public static warning(object: String, message: String): Boolean;
        public static error(object: String, message: String): Boolean;
    }
    export default Tracing
}
