import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthServiceService } from '../auth/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
    private recipesService: RecipeService,
    private authService: AuthServiceService) { }

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    // using put is firebase requirement it will put all data at a time
    this.http.put('https://ng-backend-2020.firebaseio.com/recipes.json',
      recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  // below function used before adding behavior sub in auth service
  fetchRecipes() {
    return this.http.get<Recipe[]>
      ('https://ng-backend-2020.firebaseio.com/recipes.json')
      // below pipe code is added here bcz if we submit any recipe without ingredients
      // it can give unexpected error when it is fetched and operated
      // so here we are mapping response before subscribing and adding empty array of
      // ingredients if ingredients property is unavailable
      .pipe(
        map(recipes => {
          return recipes.map(recipe => { // this will loop through all recipes
            return {
              ...recipe, // this will spread all properties of all recipe and formating ingredients property if it is not present
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
        // tap will execute code before subscribing
        // here we moved code which we were previously kept in subscribe method below
        tap(fetchedRecipes => {
          this.recipesService.setRecipes(fetchedRecipes);
        }));
    // // subscribing here is no prob but for resolver bug we comment this
    // .subscribe(fetchedRcipes => {
    //   // console.log(fetchedRcipes);
    //   this.recipesService.setRecipes(fetchedRcipes);
    // });
  }
}

