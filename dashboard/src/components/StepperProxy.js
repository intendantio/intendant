export default function StepperProxy(props) {
    if(props.index == props.value) {
        return props.children
    } else {
        return null
    }
}