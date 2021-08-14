declare module '@intendant/console-tracing' {
    class Log {
        public static verbose(object: String, message: String): Boolean;
        public static warning(object: String, message: String): Boolean;
        public static error(object: String, message: String): Boolean;
    }
    export = Log
}
