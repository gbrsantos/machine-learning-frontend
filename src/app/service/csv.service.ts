import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class CsvService {
  constructor(private papa: Papa) {}

  parseCsvFile(file: File): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.papa.parse(file, {
        header: true,
        complete: (result) => {
          const columns = result.meta.fields;
          resolve(columns);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}