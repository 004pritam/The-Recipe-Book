import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/Ingredients.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  igChangeSub: Subscription;
  constructor(private shoppingListService: ShoppingListService ) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();
    this.igChangeSub = this.shoppingListService.ingredientsChanged // event from service subscribed here
    .subscribe(
      (ing: Ingredient[]) => {
        this.ingredients = ing;
      }
    );
  }

  ngOnDestroy(){
    this.igChangeSub.unsubscribe();
  }

  onEditItem(id: number){
    this.shoppingListService.editingStarted.next(id);
  }

}
