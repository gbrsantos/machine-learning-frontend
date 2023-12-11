import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Dataset } from '../model/Dataset';

@Injectable({
  providedIn: 'root'
})
export class ProcessarArquivoService {
  readonly url ="http://localhost:5000";

  constructor(private client: HttpClient) { 
   
  }

  processarArquivo(file: File,form: Dataset){
    console.log(form);
    
    const formData: FormData = new FormData();

    formData.append('file', file, file.name);
    formData.append('inputs', JSON.stringify(form.dynamicInputs));
    formData.append('saida', JSON.stringify(form.saida))
    
    return this.client.post(this.url + '/processar-arquivo', formData);
  } 
}
