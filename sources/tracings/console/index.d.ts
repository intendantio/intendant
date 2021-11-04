import Tracing from '@intendant/tracing'

declare module '@intendant/console-tracing' {
    class Console extends Tracing {
        public static verbose(object: String, message: String): Boolean;
        public static warning(object: String, message: String): Boolean;
        public static error(object: String, message: String): Boolean;
    }
    export default Console
}
