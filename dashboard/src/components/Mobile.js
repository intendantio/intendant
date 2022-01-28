export default function Mobile(props) {
    if(props.isMobile) {
        return props.children
    } else {
        return null
    }
}