import React from 'react'
import { InputAdornment, IconButton, TextField, Button, Popover, Checkbox, Fade, Paper, Typography, Modal, Slider, FormControl, Select, MenuItem, InputLabel } from '@mui/material'
import { TwitterPicker } from 'react-color'
import WeekSchedul from './WeekSchedul'
import { Delete, List } from '@mui/icons-material'
import GalleryList from './GalleryList'
import Theme from '../Theme'


class PresetWidget extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            type: this.props.type,
            reference: this.props.reference,
            widget: this.props.widget,
            loading: true
        }
    }


    async componentDidMount() {
        
    }


    render() {
        if (this.state.loading) {
            return (
                <Paper variant="outlined" style={{ padding: 10, width: '100%', height: '100%' }}>
                    <Paper elevation={2} style={{ padding: 10, paddingTop: 15, paddingBottom: 15 }}>
                    </Paper>
                    <Paper elevation={2} style={{ marginTop: 10, padding: 10, paddingTop: 40, paddingBottom: 40 }}>
                    </Paper>
                </Paper>
            )
        }
        let titles = this.state.widget.contents.filter(content => {
            return content.type == "title"
        })
        let texts = this.state.widget.contents.filter(content => {
            return content.type == "text"
        })
        return (
            <Paper variant="outlined" style={{ padding: 10, width: '100%', height: '100%' }}>
                {
                    titles.length > 0 &&
                    <Paper elevation={1} style={{ padding: 10 }}>
                        {
                            titles.map(content => {
                                return (
                                    <Typography variant='subtitle1'>
                                        {content.value}
                                    </Typography>
                                )
                            })
                        }
                    </Paper>
                }
                {
                    texts.length > 0 &&
                    <Paper elevation={1} style={{ marginTop: 10, padding: 10 }}>
                        {
                            texts.map(content => {
                                return (
                                    <Typography variant='body2'>
                                        {content.value}
                                    </Typography>
                                )
                            })
                        }
                    </Paper>
                }
            </Paper>
        )
    }

}

export default PresetWidget