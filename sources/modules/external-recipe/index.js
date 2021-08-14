import Package from './package.json'
import fetch from 'node-fetch'
import matchAll from 'match-all'

class ExternalRecipe {

    constructor(core) {
        this.core = core
        this.configuration = "https://www.marmiton.org/recettes/recherche.aspx?aqt="
    }

    /*
        Action
    */
    async __getRecipe(settings = {}) {
        try {
            if (settings.recipe) {
                let resultCache = await this.core.controller.cache.get({
                    reference: Package.name + "-" + settings.recipe
                })
                if (resultCache.error) {
                    return resultCache
                }
                if (resultCache.cache) {
                    this.core.logger.verbose(Package.name, "Use cache")
                    return {
                        error: false,
                        code: "ok",
                        message: resultCache.message,
                        data: resultCache.data,
                        source: "cache://www.marmiton.org"
                    }
                }
                let result = await fetch(this.configuration + settings.recipe)
                if (result.status === 200) {
                    let resultTEXT = await result.text()
                    let resultURL = matchAll(resultTEXT, /(<script id="__NEXT_DATA__" type="application\/json">(((.|[\r\n])*?)<\/script>))/ig)
                    let target = resultURL.toArray()[0].replace("</script>", "").replace("<script id=\"__NEXT_DATA__\" type=\"application/json\">", "")
                    let data = JSON.parse(target).props.pageProps.searchResults.hits
                    await this.core.controller.cache.insert({
                        reference: Package.name + "-" + settings.recipe,
                        data: data,
                        interval: 2592000
                    })
                    return {
                        error: false,
                        code: "ok",
                        data: data,
                        message: "",
                        source: "https://www.marmiton.org"
                    }
                } else {
                    this.core.logger.warning(Package.name, "Invalid status")
                    return {
                        error: true,
                        code: Package.name + ">getRecipe>code>invalidStatus>" + result.status,
                        message: "Invalid status " + result.status
                    }
                }
            } else {
                this.core.logger.warning(Package.name, "Recipe is missing")
                return {
                    error: true,
                    code: Package.name + ">getRecipe>recipe>missing",
                    message: "Recipe is missing"
                }
            }
        } catch (error) {
            this.core.logger.warning(Package.name, "Throw exception")
            return {
                error: true,
                code: Package.name + ">getRecipe>throwException",
                message: "Throw exception"
            }
        }
    }

}

export default ExternalRecipe