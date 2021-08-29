import React from 'react'
import { Icon } from '@ui-kitten/components'
import * as EvaIcon  from 'react-native-eva-icons/icons'


export default function _Icon(props)  {
    if(EvaIcon.findIconByName(props.name)) {
        return <Icon {...props} name={props.name} />
    } else {
        return <Icon {...props} name='alert-triangle-outline' />
    }
}