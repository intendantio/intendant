declare module ExternalRecipe {
    
    interface Settings {
        recipe: String
    }

    interface Result {
        error: Boolean,
        code: String,
        message: String,
        data?: Object
    }

    class ExternalRecipe {
        constructor(core: Object);
        public __recipe(settings: Settings): Promise<Result>;
    }

}

export = ExternalRecipe