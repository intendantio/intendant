import React from 'react'
import { Link } from "react-router-dom"
import { Add, ShoppingCart} from '@mui/icons-material'
import { Typography, Paper, Grid, Card, MenuItem, Select, TableHead, InputLabel, TablePagination, IconButton, Box, CardMedia, CardContent, CardActions, TextField, FormControl, Skeleton } from '@mui/material'
import Desktop from '../../../components/Desktop'
import md5 from 'md5'
import Loading from '../../../components/Loading'


class Smartobject extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            loading: true,
            filter: "",
            product: "",
            products: [],
            search: "",
            resultProducts: [],
            productsType: [],
            productType: "",
            manufacturers: [],
            manufacturer: ""
        }
        props.setTitle("Smartobject")
        props.setActionType("return")
    }

    async componentDidMount() {
        let result = await fetch("https://market.intendant.io/products.json")
        let resultJSON = await result.json()
        if (result.error) {
            this.props.setMessage(result.package + " : " + result.message)
        } else {
            let productsType = []
            let manufacturers = []
            resultJSON.forEach(product => {
                if (productsType.includes(product.package.product) == false) {
                    productsType.push(product.package.product)
                }
            })
            resultJSON.forEach(product => {
                if (manufacturers.includes(product.package.manufacturer) == false) {
                    manufacturers.push(product.package.manufacturer)
                }
            })
            this.setState({
                loading: false,
                products: resultJSON,
                resultProducts: resultJSON,
                productsType: productsType,
                manufacturers: manufacturers
            })
        }
    }

    updateSearch() {
        if (this.state.filter.length > 0 || this.state.manufacturer.length > 0 || this.state.productType.length > 0) {
            let arrProducts = []
            this.state.products.forEach(product => {
                if (
                    this.state.filter.length == 0 ||
                    product.name.toLowerCase().includes(this.state.filter.toLowerCase()) ||
                    product.package.manufacturer.toLowerCase().includes(this.state.filter.toLowerCase())
                ) {
                    if (this.state.productType == product.package.product || this.state.productType.length == 0) {
                        if (this.state.manufacturer == product.package.manufacturer || this.state.manufacturer.length == 0) {
                            arrProducts.push(product)
                        }
                    }
                }
            })
            this.setState({ resultProducts: arrProducts })
        } else {
            this.setState({ resultProducts: this.state.products })
        }
    }

    render() {
        return (
            <>
                <Desktop isMobile={this.props.isMobile}>
                    <Paper variant="outlined" style={{ padding: 12, justifyContent: 'left' }}>
                        <Typography variant='h6' fontWeight='bold' >Smartobject</Typography>
                        <Typography variant='subtitle2' color="text.secondary"  >Automate your home</Typography>
                    </Paper>
                </Desktop>
                <Loading loading={this.state.loading}>
                    <Grid container spacing={1} style={{marginTop: 0}}>
                        <Grid item xs={12} md={12} lg={12} >
                            <Card variant={'outlined'} style={{ padding: 15 }}  >
                                <Grid container spacing={1}>
                                    <Grid item xs={12} md={4} lg={4} >
                                        <TextField variant='outlined' fullWidth placeholder="Name" onChange={(event) => { this.setState({ filter: event.target.value }, () => this.updateSearch()) }} />
                                    </Grid>
                                    <Grid item xs={12} md={3} lg={3} >
                                        <FormControl fullWidth>
                                            <InputLabel id="manufacturer">Manufacturer</InputLabel>
                                            <Select labelId="manufacturer" label="manufacturer" value={this.state.manufacturer} onChange={(event) => { this.setState({ manufacturer: event.target.value }, () => this.updateSearch()) }} >
                                                <MenuItem value="">None</MenuItem>
                                                {
                                                    this.state.manufacturers.map((manufacturer, index) => {
                                                        return <MenuItem key={index} value={manufacturer}>{manufacturer}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={3} lg={3} >
                                        <FormControl fullWidth>
                                            <InputLabel id="product-type">Type</InputLabel>
                                            <Select labelId="product-type" label="Type" value={this.state.productType} onChange={(event) => { this.setState({ productType: event.target.value }, () => this.updateSearch()) }} >
                                                <MenuItem value="">None</MenuItem>
                                                {

                                                    this.state.productsType.map((productType, index) => {
                                                        return <MenuItem key={index} value={productType}>{String.capitalizeFirstLetter(productType)}</MenuItem>
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        {
                            this.state.resultProducts.map((product, index) => {
                                return (
                                    <Grid key={index} item xs={6} md={3} lg={2} >
                                        <Card variant={'outlined'}  >
                                            <CardMedia
                                                style={{ background: 'white', objectFit: 'contain', height: 175 }}
                                                component="img"
                                                image={product.thumb.image}
                                            />

                                            <CardContent style={{ paddingBottom: 2 }} >
                                                <Typography variant="body1" component="div" >{product.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {String.capitalizeFirstLetter(product.package.manufacturer) + " - " + String.capitalizeFirstLetter(product.package.product)}
                                                </Typography>
                                            </CardContent>
                                            <CardActions style={{ justifyContent: 'end' }} >
                                                <a target="_blank" href={product.shop.url}>
                                                    <IconButton style={{ borderRadius: 3 }} >
                                                        <ShoppingCart fontSize='small' />
                                                    </IconButton>
                                                </a>
                                                <Link to={"/smartobject/new/" + md5(product.package.name)}>
                                                    <IconButton style={{ borderRadius: 3 }} >
                                                        <Add fontSize='small' />
                                                    </IconButton>
                                                </Link>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                </Loading>
            </>
        )
    }
}

export default Smartobject