import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
// this resolver is needed bcz when we are on detailscomponent and refresh page
// it will give error bcz we are trying to fetch details from vacant
// recipe doesnt exist if we dont press fetch recipe from header
// this will fix issue
export class RecipesResolverService implements Resolve<Recipe[]>{

  constructor(private dataService: DataStorageService,
    private recipeService: RecipeService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this method will run right before our desired route where we set this
    // resolver here, details page of recipe

    const recipes = this.recipeService.getRecipes();
    if (recipes.length === 0) {
      return this.dataService.fetchRecipes(); // angular automatically subscribes resolver
    } else {
      return recipes;
    }
    // now when we go to any details page this method will run
    // and will fetch all data
  }
}
