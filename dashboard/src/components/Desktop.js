export default function Desktop(props) {
    if(props.isMobile) {
        return null
    } else {
        return props.children
    }
}