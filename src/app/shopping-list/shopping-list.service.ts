import { Ingredient } from '../shared/Ingredients.model';
import { Subject } from 'rxjs';
import { EventEmitter } from '@angular/core';

export class ShoppingListService{
    ingredientsChanged = new Subject<Ingredient[]>();
    editingStarted = new Subject<number>();
    private ingredients = [
        new Ingredient('Besan', 25),
        new Ingredient('potatoes', 30)
  ];
  public getIngredients(){
      return this.ingredients.slice();
  }
  public getIngredient(id: number){
    return this.ingredients[id];
}
  public addIngredients(ingredient: Ingredient){
      this.ingredients.push(ingredient);
      this.ingredientsChanged.next(this.ingredients.slice()); // passing copy of
      // ingredients in a event
  }
  public updateIngredients(index: number, newIngredient: Ingredient){
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice()); // passing copy of
    // ingredients in a event
}
  public addIngredientsArray(ingredients: Ingredient[]){
      // spread syntax es6
      this.ingredients.push(...ingredients);
      this.ingredientsChanged.next(this.ingredients.slice());
  }
  public deleteIngredients(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
