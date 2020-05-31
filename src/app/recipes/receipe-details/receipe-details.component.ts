import { Component, OnInit} from '@angular/core';
import { Recipe } from '../recipe.model';
import { Ingredient } from 'src/app/shared/Ingredients.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-receipe-details',
  templateUrl: './receipe-details.component.html',
  styleUrls: ['./receipe-details.component.css']
})
export class ReceipeDetailsComponent implements OnInit {
  // value populated from recipes.html by property binding
  recipe: Recipe;
  id: number;
  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        // tslint:disable-next-line: no-string-literal
        this.id = + params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    );
  }
  onShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }
  onEditRecipe(){
    this.router.navigate(['edit'], { relativeTo: this.route});
  }
  onDelete() {
    // console.log(this.id);
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);

  }
}
