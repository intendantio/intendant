import * as Icons from '@mui/icons-material'

class Icon {

    static getIcon(reference, size) {
        if(Icons[reference]) {
            let SelectIcon = Icons[reference]
            return  <SelectIcon style={{scale: 4,fontSize: size ? size : null}}/>
        } else {
            let SelectIcon = Icons["Error"]
            return  <SelectIcon/>
        }
    }

    static getAll() {
        return Object.entries(Icons) 
    }

}

export default Icon