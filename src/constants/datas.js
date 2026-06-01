/** Data de hoje no formato YYYY-MM-DD (campos HTML type="date") */
export function obterDataHojeFormatoISO() {
  return new Date().toISOString().slice(0, 10)
}
