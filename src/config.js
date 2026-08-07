export const BCB_SERIES = {
  selic: 432,        
  cdi: 12,           
  ipca: 433,         
  tr: 226,           
  poupanca: 195,      
}

export const BCB_BASE_URL = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs'

export const IR_TABLE = [
  { maxMonths: 6, rate: 0.225 },
  { maxMonths: 12, rate: 0.20 },
  { maxMonths: 24, rate: 0.175 },
  { maxMonths: Infinity, rate: 0.15 },
]