import { Ingredient } from '../shared/Ingredients.model';

export class Recipe{
    public name: string;
    public discription: string;
    public imagePath: string;
    public ingredients: Ingredient[];

    constructor( n: string, d: string, i: string, ing: Ingredient[]){
    this.name = n;
    this.discription = d;
    this.imagePath = i;
    this.ingredients = ing;
    }
}
