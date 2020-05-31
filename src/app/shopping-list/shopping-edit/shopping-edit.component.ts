import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Ingredient } from 'src/app/shared/Ingredients.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editingItemIndex: number;
  editingItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService ) { }
  ngOnInit(): void {
    this.subscription = this.shoppingListService.editingStarted
    .subscribe((index: number) => {
      this.editingItemIndex = index;
      this.editMode = true;
      this.editingItem =  this.shoppingListService.getIngredient(this.editingItemIndex);
      this.slForm.setValue({
        name: this.editingItem.name,
        amount: this.editingItem.amount
      });
    });
  }
  onAddButton(form: NgForm){
    const value = form.value;
    const newAddedIngredient = new Ingredient(value.name, value.amount); // name property of html inputs
    if (this.editMode){
      this.shoppingListService.updateIngredients(this.editingItemIndex, newAddedIngredient);
    } else{
      this.shoppingListService.addIngredients(newAddedIngredient);
    }
    this.editMode = false;
    this.slForm.reset();
  }
  onClear(){
    this.slForm.reset();
    this.editMode = false;
  }
  onDelete(){
    this.shoppingListService.deleteIngredients(this.editingItemIndex);
    this.onClear();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
