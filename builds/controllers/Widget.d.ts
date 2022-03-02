import Controller from './Controller';
import Result from '../utils/Result'

declare class Widget extends Controller {

    public extract(str: String): Object

    public getOne(idWidget: Number): Promise<Result>
    public getSource(actions: Array<Object>): Promise<Result>
    public getAll(): Promise<Result>
    
    public insert(reference: String, icon: String, contents: Array<Object>, sources:  Array<Object>): Promise<Result>
    public update(reference: String, contents:  Array<Object>): Promise<Result>
    
    public insertSource(idWidget: Number, reference: String, source: Object, action: Object, pArguments: Array<Object>): Promise<Result>
    public insertContent(idWidget: Number, idType: Number, content: String): Promise<Result>
    
    public delete(idWidget: Number): Promise<Result>
    public deleteSource(idWidget: Number, idSource: Number): Promise<Result>
    public deleteContent(idWidget: Number, idContent: Number): Promise<Result>

    public getConfiguration(): Promise<Result>
    
}

export default Widget



