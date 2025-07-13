import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Book } from './pages/book/book';
import { Category } from './pages/category/category';
import { Customer } from './pages/customer/customer';
import { Promotion } from './pages/promotion/promotion';
import { AddBook } from './pages/book/add-book/add-book';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'book',
    component: Book,
    children: [
      { path: 'add-book', component: AddBook }
    ]},
  { path: 'category', component: Category },
  { path: 'customer', component: Customer },
  { path: 'promotion', component: Promotion }
];
