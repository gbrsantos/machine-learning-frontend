import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CsvService } from 'src/app/service/csv.service';
import { ProcessarArquivoService } from 'src/app/service/processar-arquivo.service';


@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.css']
})
export class DatasetComponent implements OnInit {

  dataModelForm: FormGroup;
  fileToUpload: File;
  colunas: string[] = [];
  disabledSubmit = false;

  constructor(private fb: FormBuilder,
    private processarArquivoService : ProcessarArquivoService,
    private csvService : CsvService) {
    this.dataModelForm = this.fb.group({
      fileInput: [null, Validators.required],
      dynamicInputs: this.fb.array([]),
      saida : ['', Validators.required],   
      dados: [''],
      ignorados: ['']  
    });
  }

  ngOnInit() {}

  handleFileInput(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.fileToUpload = event.target.files[0]; 
      this.csvService.parseCsvFile(this.fileToUpload)
        .then(colunas => {
          this.colunas = colunas;
          console.log(colunas);
          this.addDynamicInputPorColuna();
        })
        .catch(error => {
          console.error('Erro ao ler o arquivo CSV:', error);
        });
    }
  }

  transformCsvHeadersToJson(headers: string[]): Record<string, any[]> {
    const result: Record<string, any[]> = {};
  
    headers.forEach(header => {
      result[header] = [];
    });
  
    return result;
  }
  addDynamicInputPorColuna(){
    this.dynamicInputs.clear();
    this.colunas.forEach( coluna =>{
      this.dynamicInputs.push(this.fb.group({
        name: [{ value: coluna, disabled: false }],
        values: [''],
      }));
    })    
  }

  addDynamicInput(): void {
    this.dynamicInputs.push(this.fb.group({
      name: [{ value: '', disabled: true }],
      values: [''],
    }));
  }

  removeDynamicInput(index: number): void {
    this.dynamicInputs.removeAt(index);
  }

  onSubmit(): void {
    this.dataModelForm.markAllAsTouched();
    if(this.dataModelForm.valid)
      this.disabledSubmit = true;
      this.processarArquivoService.processarArquivo(this.fileToUpload,this.dataModelForm.value).subscribe({
        next: (value) =>{
          console.log(value);
          let retorno = value as any;
          alert(`Resultado:  ${retorno?.saidas}`);
          this.dynamicInputs.clear();
          this.dataModelForm.reset();
          this.disabledSubmit = false;
        },
        error: () => {
          this.disabledSubmit = false;
        }

      })
  }

  handleIgnorarCampo() {
    const valor = this.ignorados.value;
    if(valor){
      let ignorados = valor.split(',');
      ignorados.forEach((item: string) =>{
        if(this.colunas.includes(item.trim())){
          this.colunas = this.colunas.filter(coluna => coluna != item.trim())
          this.addDynamicInputPorColuna();
        }
      })
    }
  }

  get dynamicInputs(): FormArray {
    return this.dataModelForm.get('dynamicInputs') as FormArray;
  }
  
  get fileInput(): FormGroup {
    return this.dataModelForm.get('fileInput') as FormGroup;
  }
  get saida(): FormGroup {
    return this.dataModelForm.get('saida') as FormGroup;
  }
  get dados(): FormGroup {
    return this.dataModelForm.get('dados') as FormGroup;
  }

  get ignorados(): FormGroup {
    return this.dataModelForm.get('ignorados') as FormGroup;
  }
}
