import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FuncionarioService } from '../../../services/funcionario.service';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';
import { ModalService } from '../../../services/modal.service';
import { ProgressService } from '../../../services/progress.service';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { ErrorModalComponent } from '../../common/modal/error-modal/error-modal.component';
import { Solicitacao } from '../../../models';
import { AlertModalComponent } from '../../common/modal/alert-modal/alert-modal.component';

@Component({
  selector: 'app-efetuar-orcamento',
  standalone: true,
  imports: [
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    FormsModule,
    RouterModule,
    BreadcrumbComponent,
  ],
  providers: [provideNgxMask()],

  templateUrl: './efetuar-orcamento.component.html',
  styleUrl: './efetuar-orcamento.component.scss',
})
export class EfetuarOrcamentoComponent implements OnInit {
  id: number | null = null;
  total: number = 0.0;
  valorOrcamento: number = 0.0;
  data: any;
  valor: string = '';
  solicitacao:Solicitacao = new Solicitacao();
  paths = [
    { label: 'Início', path: '/inicio/funcionarios' },
    { label: 'Todas as solicitações', path: '/solicitacoes/listar' },
    { label: 'Efetuar orçamento', path: '' },
  ];

  items = [{ name: '', price: 0.0 }];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private solicitacaoService: SolicitacaoService,
    private modalService: ModalService,
    private progressBarService :ProgressService,
    private funcionarioService: FuncionarioService
  ) {}

  ngOnInit(): void {
    let aux = this.route.snapshot.paramMap.get('idSolicitacao');
    if(aux) {
      const id = parseInt(aux);
      this.buscarSolicitacao(id)
    }
      //this.getOrcamento(this.id);
  }

  buscarSolicitacao (idSolicitacaoFromRoute:number) {
    this.progressBarService.show();
    this.solicitacaoService.findById(idSolicitacaoFromRoute).subscribe({
      next: (response) => {
        this.progressBarService.hide();
        this.solicitacao = response;
      }, error: (response) => {
        this.progressBarService.hide();
        let message = 'Ocorreu um erro ao processar a requisi&ccedil;&atilde;o.';
        
        if(response.error?.message)
          message = response.error?.message;
        
        this.modalService.open(ErrorModalComponent, {
          title: "Erro ao buscar solicitação",
          body: `<p>${message}</p>`,
          onClose: () => {
            this.router.navigate(['/inicio/funcionarios']);
          },
        });
      }
    });
  }

  getOrcamento(id: number) {
    this.data = this.funcionarioService.getOrcamento(id);
  }

  updateTotal() {
    this.total = 0.0;
    this.items.forEach((item) => {
      this.total += item.price;
    });
  }

  addItem(): void {
    this.items.push({ name: '', price: 0.0 });
  }

  removeItem(i: number): void {
    this.items.splice(i, 1);
    this.updateTotal();
  }

  sendBudget() {

    const data:Solicitacao = {
      id:  this.solicitacao.id,
      orcamento: {
        valorOrcamento: this.valorOrcamento
      },
    };
    this.progressBarService.show();
    this.solicitacaoService.efeturarOrcamento(data).subscribe({
      next: (response) => {
        this.progressBarService.hide();
        this.modalService.open(AlertModalComponent, {
          title:"Sucesso",
          body:"Orçamento efetuado com sucesso",
          onClose: () => {
            this.router.navigate(['/inicio/funcionarios']);
          },
        }); 
      }, error: (response) => {
        this.progressBarService.hide();
        let message = 'Ocorreu um erro ao processar a requisi&ccedil;&atilde;o.';
        
        if(response.error?.message)
            message = response.error?.message;
        
        this.modalService.open(ErrorModalComponent, {
          title: "Erro ao efetuar orçamento",
          body: `<p>${message}</p>`,
        });
      }
    });
  }
}
