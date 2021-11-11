import Package from './package.json'
import fetch from 'node-fetch'

class ExternalWeather {

    constructor(core) {
        this.core = core
    }

    async request(city) {
        let result = await fetch("https://www.prevision-meteo.ch/services/json/" + city)
        if (result.status === 200) {
            let resultJSON = await result.json()
            if (resultJSON.errors) {
                return {
                    error: true,
                    package: Package.name,
                    message: "Invalid result code '" + resultJSON.errors[0].text + "'"
                }
            } else {
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: resultJSON
                }
            }
        } else {
            this.core.logger.warning(Package.name, "Invalid result status '" + result.status + "'")
            return {
                error: true,
                package: Package.name,
                message: "Invalid status " + result.status
            }
        }
    }

    async __currentCondition(settings = {}) {
        try {
            if (settings.city) {
                let resultCache = await this.core.controller.cache.get({
                    reference: Package.name + "-currentCondition-" + settings.city
                })
                if (resultCache.error) { return resultCache }
                if (resultCache.cache) {
                    this.core.logger.verbose(Package.name, "Use cache")
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: resultCache.data
                    }
                }
                let resultRequest = await this.request(settings.city)
                if (resultRequest.error) { return resultRequest }
                let weather = resultRequest.data
                let data = {
                    temperature: weather.current_condition.tmp,
                    humidity: weather.current_condition.humidity,
                    pressure: weather.current_condition.pressure,
                    wind: {
                        speed: weather.current_condition.wnd_spd,
                        direction: weather.current_condition.wnd_dir
                    },
                    description: {
                        label: weather.current_condition.condition,
                        image: weather.current_condition.icon
                    }
                }
                await this.core.controller.cache.insert({
                    reference: Package.name + "-currentCondition-" + settings.city,
                    data: data,
                    interval: 600
                })
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: data
                }
            } else {
                this.core.logger.warning(Package.name, "City is missing")
                return {
                    error: true,
                    package: Package.name,
                    message: "City is missing"
                }
            }
        } catch (error) {
            this.core.logger.error(Package.name, error.toString())
            return {
                error: true,
                package: Package.name,
                message: "Throw exception"
            }
        }

    }

    async __cityInformation(settings = {}) {
        try {
            if (settings.city) {
                let resultCache = await this.core.controller.cache.get({
                    reference: Package.name + "-cityInformation-" + settings.city
                })
                if (resultCache.error) { return resultCache }
                if (resultCache.cache) {
                    this.core.logger.verbose(Package.name, "Use cache")
                    return {
                        error: false,
                        package: Package.name,
                        message: "",
                        data: resultCache.data
                    }
                }
                let resultRequest = await this.request(settings.city)
                if (resultRequest.error) { return resultRequest }
                let weather = resultRequest.data
                let data = {
                    name: weather.city_info.name,
                    country: weather.city_info.country,
                    latitude: weather.city_info.latitude,
                    longitude: weather.city_info.longitude,
                    sunrise: weather.city_info.sunrise,
                    sunset: weather.city_info.sunset,
                }
                await this.core.controller.cache.insert({
                    reference: Package.name + "-cityInformation-" + settings.city,
                    data: data,
                    interval: 600
                })
                return {
                    error: false,
                    package: Package.name,
                    message: "",
                    data: data
                }
            } else {
                this.core.logger.warning(Package.name, "City is missing")
                return {
                    error: true,
                    package: Package.name,
                    message: "City is missing"
                }
            }
        } catch (error) {
            this.core.logger.error(Package.name, error.toString())
            return {
                error: true,
                package: Package.name,
                message: "Throw exception"
            }
        }
    }

    async __forcastCondition(settings = {}) {
        try {
            if (settings.city) {
                if ([1, 2, 3].includes(parseInt(settings.forecast))) {
                    if([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].includes(parseInt(settings.time))) {
                        let resultCache = await this.core.controller.cache.get({
                            reference: Package.name + "-forcastCondition-" + settings.city + "-" + settings.forecast + "-" + settings.time
                        })
                        if (resultCache.error) { return resultCache }
                        if (resultCache.cache) {
                            this.core.logger.verbose(Package.name, "Use cache")
                            return {
                                error: false,
                                package: Package.name,
                                message: "",
                                data: resultCache.data
                            }
                        }
                        let resultRequest = await this.request(settings.city)
                        if (resultRequest.error) { return resultRequest }
                        let weather = resultRequest.data
                        let day = weather["fcst_day_" + (parseInt(settings.forecast) + 1)]
                        let time = day.hourly_data[settings.time + "H00"]
                        let data = {
                            temperature: time.TMP2m,
                            humidity: time.HUMIDEX,
                            pressure: time.PRMSL,
                            wind: {
                                speed: time.WINSPD10m,
                                direction: time.WINDDIRCARD10
                            },
                            description: {
                                label: time.CONDITION,
                                image: time.ICON
                            }
                        }
                        await this.core.controller.cache.insert({
                            reference: Package.name + "-forcastCondition-" + settings.city + "-" + settings.forecast + "-" + settings.time,
                            data: data,
                            interval: 600
                        })
                        return {
                            error: false,
                            package: Package.name,
                            message: "",
                            data: data
                        }
                    } else {
                        this.core.logger.warning(Package.name, "Time is missing")
                        return {
                            error: true,
                            package: Package.name,
                            message: "Time is missing"
                        }
                    }
                } else {
                    this.core.logger.warning(Package.name, "Forecast is missing")
                    return {
                        error: true,
                        package: Package.name,
                        message: "Forecast is missing"
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "City is missing")
                return {
                    error: true,
                    package: Package.name,
                    message: "City is missing"
                }
            }
        } catch (error) {
            this.core.logger.error(Package.name, error.toString())
            return {
                error: true,
                package: Package.name,
                message: "Throw exception"
            }
        }
    }

}

export default ExternalWeather