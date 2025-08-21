import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Book } from './pages/book/book';
import { Category } from './pages/category/category';
import { Customer } from './pages/customer/customer';
import { Promotion } from './pages/promotion/promotion';
import { AddBook } from './pages/book/add-book/add-book';
import { User } from './pages/user/user';
import { LoginSignup } from './pages/login-signup/login-signup';
import {DashboardLayout} from './pages/dashboard-layout/dashboard-layout';
import {UpdateBook} from './pages/book/update-book/update-book';
import {AddPromotion} from './pages/promotion/add-promotion/add-promotion';
import {UpdatePromotion} from './pages/promotion/update-promotion/update-promotion';
import {OrderComponent} from './pages/order/order.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginSignup },
  {
    path: '',
    component: DashboardLayout,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user', component: User },
      {
        path: 'book',
        component: Book,
        children: [
          // { path: 'add-book', component: AddBook }
        ]
      },
      { path: 'add-book', component: AddBook },
      { path: 'update-book', component: UpdateBook },
      { path: 'category', component: Category },
      { path: 'customer', component: Customer },
      { path: 'order', component: OrderComponent },
      { path: 'promotion', component: Promotion },
      { path: 'add-promotion', component: AddPromotion },
      { path: 'update-promotion', component: UpdatePromotion }
    ]
  }
];
