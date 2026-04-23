export class Pagination<T> {

  GetPageRecords(items: T[], pageNumber: number, pageSize: number): T[]{
    return items.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }
}