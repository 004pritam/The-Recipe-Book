import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/Ingredients.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
    recipesChanged = new Subject <Recipe[]>();
    // private recipes = [
    //     new Recipe('vadapav',
    //     'Maharashtrian Food',
    //     'https://www.merisaheli.com/wp-content/uploads/2018/03/vada-pav.jpg',
    //     [
    //         new Ingredient('potato', 3 ),
    //         new Ingredient('turmaric', 10 ),
    //     ]),
    //     new Recipe('Samosa',
    //     'Maharashtrian Food',
    //     'https://upload.wikimedia.org/wikipedia/commons/c/cb/Samosachutney.jpg',
    //     [
    //         new Ingredient('maida', 10),
    //         new Ingredient('salt', 20)
    //     ])
    // ];
    // after adding backend
    private recipes: Recipe[] = [];

    constructor(private shoppinglistService: ShoppingListService){}
    public setRecipes(newRecipes: Recipe[]) {
        this.recipes = newRecipes;
        this.recipesChanged.next(this.recipes.slice());
    }
    public getRecipes() {
        return this.recipes.slice();
    }
    public getRecipe(index: number) {
        return this.recipes[index];
    }
    public addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.shoppinglistService.addIngredientsArray(ingredients);
    }
    public addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        // bcz this.recipes wont get updated when new recipe is added
        // it happen bcz in getRecipes() we are returning new copy of recipes by
        // slice()
        this.recipesChanged.next(this.recipes.slice());
    }
    public updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
         // bcz this.recipes wont get updated when new recipe is added
        // it happen bcz in getRecipes() we are returning new copy of recipes by
        // slice()
        this.recipesChanged.next(this.recipes.slice());
    }
    public deleteRecipe(index: number) {
        this.recipes.splice(index, 1); // **
        this.recipesChanged.next(this.recipes.slice());
        // console.log(this.recipes.slice());
    }
}

