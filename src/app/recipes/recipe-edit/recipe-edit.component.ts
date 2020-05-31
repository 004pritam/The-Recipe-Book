import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Ingredient } from 'src/app/shared/Ingredients.model';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  constructor(private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
          console.log(this.editMode);
        }
      );
  }

  private initForm() {
    let recipeName = '';
    let recipeImagepath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagepath = recipe.imagePath;
      recipeDescription = recipe.discription;
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagepath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }
  getControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }
  onAddIngredient() {
    (this.recipeForm.get('ingredients') as FormArray).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteIngredients(index: number) {
    (this.recipeForm.get('ingredients') as FormArray).removeAt(index);
    // (this.recipeForm.get('ingredients') as FormArray).clear();
    // The clear() method automatically loops through all registered
    // FormControls (or FormGroups) in the FormArray and removes them.
    // It's like manually creating a loop and calling removeAt() for every item.
  }
  onSubmit() {
    // console.log(this.recipeForm);
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']
    );

    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, newRecipe);
      // *** here we need not to pass newRecipe object instead we can directly pass
      // recipeForm.value. it is possible bcz we have kept same name of formcontrols
      // and recipe.model properties
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(newRecipe);
    }
    this.onCancel();
  }
  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
