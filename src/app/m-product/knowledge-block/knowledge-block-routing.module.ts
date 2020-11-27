import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeactivateGuardService } from 'src/app/shared-services/deactivate-guard.service';
import { KnowledgeBlogPartComponent } from './knowledge-blog-part/knowledge-blog-part.component';
import { ProductLabelKnowledgeBlogComponent } from './product-label-knowledge-blog/product-label-knowledge-blog.component';


const routes: Routes = [
  {
    path: ':type/new',
    component: KnowledgeBlogPartComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: ':type/:knowledgeBlogId',
    component: KnowledgeBlogPartComponent,
    pathMatch: 'full',
    canDeactivate: [DeactivateGuardService],
    data: {
      drobtinice: null
    }
  },
  {
    path: '',
    component: ProductLabelKnowledgeBlogComponent,
    pathMatch: 'full',
    data: {
      drobtinice: null
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowledgeBlockRoutingModule { }
